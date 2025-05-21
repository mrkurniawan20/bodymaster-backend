import { Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { saltRounds } from '../app';
import { addMonths } from 'date-fns';
import bcrypt from 'bcrypt';
import { signToken } from '../utils/jwt';
import { login } from '../services/userService';

export async function addMember(req: Request, res: Response) {
  try {
    const { name, id, password, phone, category, method } = req.body;
    let pics = '';
    let amount = 0;
    if (category === 'REGULAR') {
      pics = '/uploads/profile-picture/man.png';
      amount = 210000;
    } else if (category === 'WANITA') {
      pics = '/uploads/profile-picture/woman.png';
      amount = 190000;
    } else {
      pics = '/uploads/profile-picture/child.jpg';
      amount = 185000;
    }
    const numberId = Number(id);
    const hashed = await bcrypt.hash(password, saltRounds);
    const joinDate = new Date();
    const expireDate = addMonths(joinDate, 1);
    // const add = await prisma.member.create({
    //   data: {
    //     name,
    //     image: pics,
    //     id: numberId,
    //     password: hashed,
    //     phone,
    //     expireDate,
    //     category,
    //   },
    // });
    const addWithPayment = await prisma.$transaction([
      prisma.member.create({
        data: {
          name,
          image: pics,
          id: numberId,
          password: hashed,
          phone,
          expireDate,
          category,
        },
      }),
      prisma.payment.create({
        data: {
          amount,
          method,
          name: 'Member Baru',
          memberId: numberId,
        },
      }),
    ]);
    res.status(201).json({ addWithPayment });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function loginMember(req: Request, res: Response) {
  try {
    const { id, password } = req.body;
    const loggedInMember = await login(id, password);
    res.status(200).json({ message: 'Login successfully', loggedInMember });
    // const user = await prisma.member.findUnique({
    //   where: { id: memberId },
    // });
    // if (!user) {
    //   res.status(404).json({ message: 'Member tidak ada' });
    //   return;
    // }
    // const isValid = await bcrypt.compare(password, user?.password);
    // if (!isValid) {
    //   res.status(400).json({ message: 'Password salah' });
    //   return;
    // }
    // const token = signToken({id : user.id, expireDate: user.expireDate})
    // res.status(200).json({ message: 'Login successfully', user });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function getAllMember(req: Request, res: Response) {
  try {
    const members = await prisma.member.findMany({
      omit: {
        joinDate: true,
        updatedAt: true,
        password: true,
        role: true,
      },
      orderBy: { expireDate: 'desc' },
    });
    res.status(200).json(members);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
export async function getMember(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const member = await prisma.member.findUnique({
      where: { id },
      omit: {
        password: true,
        updatedAt: true,
        joinDate: true,
      },
    });
    res.status(200).json(member);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function editMember(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const image = req.file?.path.replace(/\\/g, '/');
    const { password, phone, name } = req.body;
    const dataToUpdate: Record<string, any> = {};
    if (name) dataToUpdate.name = name;
    if (phone) dataToUpdate.phone = phone;
    if (password) {
      const hashed = await bcrypt.hash(password, saltRounds);
      dataToUpdate.password = hashed;
    }
    if (image) dataToUpdate.image = image;
    const edit = await prisma.member.update({
      where: { id },
      data: dataToUpdate,
    });
    res.status(201).json({ message: 'Member edit successfully', edit });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function extendMember(req: Request, res: Response) {
  try {
    const { id, method } = req.body;
    const numberId = Number(id);
    const user = await prisma.member.findUnique({
      where: {
        id: numberId,
      },
    });
    if (!user) {
      res.status(400).json({ message: 'User does not exist' });
      return;
    }
    const monthExtend = addMonths(user?.expireDate, 1);
    // const extend = await prisma.member.update({
    //   where: { id: user.id },
    //   data: {
    //     expireDate: monthExtend,
    //   },
    // });
    let amount = 0;
    if (user.category == 'PELAJAR') {
      amount = 185000;
    } else if (user.category == 'WANITA') {
      amount = 190000;
    } else {
      amount = 210000;
    }
    const extendWithPayment = await prisma.$transaction([
      prisma.member.update({
        where: { id: user.id },
        data: {
          expireDate: monthExtend,
          status: 'ACTIVE',
        },
      }),
      prisma.payment.create({
        data: {
          amount,
          method,
          name: 'Perpanjang Member',
          memberId: user.id,
        },
      }),
    ]);
    res.status(200).json(extendWithPayment);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function recordVisit(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    const alreadyVisit = await prisma.visit.findFirst({
      where: {
        memberId: id,
        visitedAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });
    if (alreadyVisit) {
      res.status(200).json({ alreadyVisit });
    } else {
      const visit = await prisma.visit.create({
        data: {
          memberId: id,
        },
      });
      res.status(201).json(visit);
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getLogVisit(req: Request, res: Response) {
  try {
    const visits = await prisma.visit.findMany({
      include: {
        member: true,
      },
      orderBy: {
        visitedAt: 'desc',
      },
    });
    res.status(201).json(visits);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getTodayVisit(req: Request, res: Response) {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    const allVisit = await prisma.visit.findMany({
      where: {
        visitedAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });
    res.status(200).json(allVisit);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAllPayment(req: Request, res: Response) {
  try {
    const payment = await prisma.payment.findMany({
      include: { member: true },
    });
    res.status(200).json(payment);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAllNotifications(req: Request, res: Response) {
  try {
    const notif = await prisma.notifications.findMany({});
    res.status(200).json(notif);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteMember(req: Request, res: Response) {
  try {
    const deletionize = await prisma.member.deleteMany({
      where: { id: { gte: 12 } },
    });
    res.status(200).json(deletionize);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
