// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {
//   const today = new Date('2025-05-27T00:00:00.000Z'); // Set to the beginning of May 27, 2025 (UTC)

//   // Fetch some existing member IDs to link visits to
//   // Adjust the number of members you fetch based on how many unique members you want to simulate visits for
//   const members = await prisma.member.findMany({
//     select: { id: true },
//     take: 10, // Example: get 10 members to distribute visits among them
//   });

//   if (members.length === 0) {
//     console.warn('No members found. Please ensure you have members in your database before seeding visits.');
//     return;
//   }

//   const visitsData = [];
//   for (let i = 0; i < 40; i++) {
//     const randomMember = members[Math.floor(Math.random() * members.length)];
//     visitsData.push({
//       memberId: randomMember.id,
//       visitedAt: today,
//     });
//   }

//   console.log('Seeding 40 visits for May 27, 2025...');
//   await prisma.visit.createMany({
//     data: visitsData,
//     skipDuplicates: true, // Optional: skip if a duplicate (memberId, visitedAt) already exists
//   });
//   console.log('40 visits seeded successfully.');
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
