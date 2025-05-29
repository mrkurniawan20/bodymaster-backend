import { Prisma } from '@prisma/client';
import { prisma } from '../prisma/client';
import { Request, Response } from 'express';

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
