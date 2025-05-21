// import { PrismaClient } from '@prisma/client';
// import { subDays, addDays } from 'date-fns';

// const prisma = new PrismaClient();

// async function main() {
//   await prisma.member.deleteMany(); // Clean slate

//   await prisma.member.createMany({
//     data: [
//       {
//         name: 'John Doe',
//         phone: '081234567890',
//         joinDate: subDays(new Date(), 30),
//         expireDate: subDays(new Date(), 1), // expired yesterday
//         status: 'INACTIVE',
//       },
//       {
//         name: 'Jane Smith',
//         phone: '082345678901',
//         joinDate: subDays(new Date(), 10),
//         expireDate: new Date(), // expires today
//         status: 'ACTIVE',
//       },
//       {
//         name: 'Rafli Kurniawan',
//         phone: '083456789012',
//         joinDate: subDays(new Date(), 5),
//         expireDate: addDays(new Date(), 7), // expires next week
//         status: 'ACTIVE',
//       },
//       {
//         name: 'Ali Akbar',
//         phone: '084567890123',
//         joinDate: subDays(new Date(), 60),
//         expireDate: subDays(new Date(), 2), // expired 2 days ago
//         status: 'INACTIVE',
//       },
//     ],
//   });

//   console.log('✅ Seed data inserted!');
// }

// main()
//   .catch((e) => {
//     console.error('❌ Seed error:', e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
