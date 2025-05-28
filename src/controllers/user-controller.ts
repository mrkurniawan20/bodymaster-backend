import { Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { saltRounds } from '../app';
import { addDays, addHours, addMonths } from 'date-fns';
import bcrypt from 'bcrypt';
import { login } from '../services/userService';
import { Prisma } from '@prisma/client';

export async function addMember(req: Request, res: Response) {
  try {
    const { name, id, password, phone, category, method } = req.body;
    let pics = '';
    let amount = 0;
    if (category === 'REGULAR') {
      pics = 'https://res.cloudinary.com/dkadm58qz/image/upload/v1747918047/bodymaster/1747918047510.png';
      amount = 210000;
    } else if (category === 'WANITA') {
      pics = 'https://res.cloudinary.com/dkadm58qz/image/upload/v1748104774/woman_v4qfer.png';
      amount = 190000;
    } else {
      pics = 'https://res.cloudinary.com/dkadm58qz/image/upload/v1748104773/child_nbek44.jpg';
      amount = 185000;
    }
    const numberId = Number(id);
    const hashed = await bcrypt.hash(password, saltRounds);
    const joinDate = new Date();
    const expireDate = addMonths(joinDate, 1);
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
    res.status(201).json(addWithPayment);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function loginMember(req: Request, res: Response) {
  try {
    const { id, password } = req.body;
    const loggedInMember = await login(id, password);
    res.status(200).json({ message: 'Login successfully', loggedInMember });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function getAllMember(req: Request, res: Response) {
  try {
    const { page = 1, limit = 10, status = 'all', name } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const filters: any = {};
    if (status == 'active') filters.status = 'ACTIVE';
    if (status == 'inactive') filters.status = 'INACTIVE';
    if (name) filters.name = { contains: name as string, mode: 'insensitive' };
    const [members, countMembers] = await Promise.all([
      prisma.member.findMany({
        where: filters,
        omit: {
          joinDate: true,
          updatedAt: true,
          password: true,
          role: true,
        },
        take: Number(limit),
        skip: Number(offset),
        orderBy: { expireDate: 'desc' },
      }),
      prisma.member.count({
        where: filters,
      }),
    ]);
    const totalPage = Math.ceil(countMembers / Number(limit));
    res.status(200).json({ members, totalPage });
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

export async function getCountMemberActive(req: Request, res: Response) {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  try {
    const activeMember = await prisma.member.count({
      where: {
        status: 'ACTIVE',
      },
    });
    const todayVisitMember = await prisma.visit.count({
      where: {
        visitedAt: {
          lte: todayEnd,
          gte: todayStart,
        },
      },
    });
    res.status(200).json({ activeMember, todayVisitMember });
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

// export async function getAllPayment(req: Request, res: Response) {
//   try {
//     const payment = await prisma.payment.findMany({
//       include: { member: true },
//     });
//     res.status(200).json(payment);
//   } catch (error: any) {
//     res.status(400).json({ error: error.message });
//   }
// }

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

export async function getExpiredMember(req: Request, res: Response) {
  const now = new Date().setHours(23, 59, 59, 999);
  const yesterday = addDays(now, -1);
  try {
    const expired = await prisma.member.findMany({
      where: {
        expireDate: {
          lte: addHours(now, -41),
          gte: addHours(yesterday, -41),
        },
      },
    });
    res.status(200).json(expired);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getVisitLog(req: Request, res: Response) {
  const { page = 1, limit = 10 } = req.query;
  let { selectedDate } = req.body;
  const offset = (Number(page) - 1) * Number(limit);
  const startDate = new Date(selectedDate).setHours(0, 0, 0, 0);
  const endDate = new Date(selectedDate).setHours(23, 59, 59, 999);
  try {
    const [members, countMembers] = await Promise.all([
      prisma.visit.findMany({
        where: {
          visitedAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
        orderBy: {
          visitedAt: 'desc',
        },
        take: Number(limit),
        skip: Number(offset),
        include: {
          member: {
            select: {
              name: true,
            },
          },
        },
      }),
      prisma.visit.count({
        where: {
          visitedAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
      }),
    ]);
    const totalPages = Math.ceil(countMembers / Number(limit));
    res.status(200).json({ members, totalPages });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAllPayment(req: Request, res: Response) {
  const { page = 1, limit = 10 } = req.query;
  const { selectedDate } = req.body;
  const offset = (Number(page) - 1) * Number(limit);
  const startDate = new Date(selectedDate).setHours(0, 0, 0, 0);
  const endDate = new Date(selectedDate).setHours(23, 59, 59, 999);
  const startMonth = new Date(selectedDate);
  startMonth.setDate(1);
  startMonth.setHours(0, 0, 0, 0);
  const endMonth = new Date(selectedDate);
  endMonth.setMonth(endMonth.getMonth() + 1);
  endMonth.setDate(0);
  endMonth.setHours(23, 59, 59, 999);
  try {
    const [members, countMembes, dailySum, monthlySum] = await Promise.all([
      prisma.payment.findMany({
        where: {
          paymentAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
        orderBy: {
          paymentAt: 'desc',
        },
        take: Number(limit),
        skip: Number(offset),
        include: {
          member: {
            select: {
              name: true,
            },
          },
        },
      }),
      prisma.payment.count({
        where: {
          paymentAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
      }),
      prisma.payment.aggregate({
        where: {
          paymentAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: {
          paymentAt: {
            gte: new Date(startMonth),
            lte: new Date(endMonth),
          },
        },
        _sum: { amount: true },
      }),
    ]);
    const totalPages = Math.ceil(countMembes / Number(limit));
    res.status(200).json({ members, totalPages, dailySum, monthlySum });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function CronJob(req: Request, res: Response) {
  const now = new Date();
  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const memberExpired = await tx.member.updateMany({
        where: { expireDate: { lte: now }, status: { equals: 'ACTIVE' } },
        data: { status: 'INACTIVE' },
      });
      if (memberExpired.count > 0) {
        const addNotif = await tx.notifications.create({
          data: {
            content: `${memberExpired.count} members expired, click to see all expired member`,
          },
        });
      }
    });
    res.status(200).json({ message: `CronJob run successfully` });
  } catch (error: any) {
    console.log(error.message);
    res.status(400).json({ message: `CronJob failed` });
  }
}
