import { prisma } from '../prisma/client';
import cron from 'node-cron';

export function CronJob() {
  cron.schedule('0 0 * * *', async () => {
    const now = new Date();
    try {
      prisma.$transaction(async (tx) => {
        const memberExpired = await tx.member.updateMany({
          where: { expireDate: { lte: now }, status: { not: 'INACTIVE' } },
          data: { status: 'INACTIVE' },
        });
        if (memberExpired.count > 0) {
          const addNotif = await tx.notifications.create({
            data: {
              content: `${memberExpired.count} members expired, click to see all expired member`,
            },
          });
        }
        // console.log(`${memberExpired.count} members diactivated`);
      });
    } catch (error: any) {
      console.log(error.message);
    }
  });
  console.log(`CronJob initialized completely`);
}
