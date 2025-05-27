// // prisma/seed.ts
// import { PrismaClient, Method } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {
//   const today = new Date(); // Gets the current date and time (e.g., May 27, 2025)

//   // Specific dates for the new payments
//   const may25 = new Date('2025-05-25T00:00:00.000Z'); // May 25, 2025, at midnight UTC
//   const may15 = new Date('2025-05-15T00:00:00.000Z'); // May 15, 2025, at midnight UTC

//   // Fetch some existing member IDs to link payments to
//   const members = await prisma.member.findMany({
//     select: { id: true },
//     take: 10, // Example: get 10 members to distribute payments among them
//   });

//   if (members.length === 0) {
//     console.warn('No members found. Please ensure you have members in your database before seeding payments.');
//     return;
//   }

//   const paymentsData = [];
//   const paymentMethods: Method[] = [Method.QR, Method.CASH];
//   const sampleNames = ['Membership Fee', 'Locker Rental', 'Personal Training', 'Towel Service', 'Protein Shake', 'Yoga Class', 'Massage Session'];

//   // --- Seed for today (May 27, 2025) - 40 data ---
//   for (let i = 0; i < 40; i++) {
//     const randomMember = members[Math.floor(Math.random() * members.length)];
//     const randomAmount = Math.floor(Math.random() * (500000 - 50000 + 1)) + 50000; // Random amount between 50,000 and 500,000
//     const randomMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
//     const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];

//     paymentsData.push({
//       memberId: randomMember.id,
//       amount: randomAmount,
//       name: randomName,
//       method: randomMethod,
//       paymentAt: today,
//     });
//   }
//   console.log('Preparing 40 payments for today...');

//   // --- Seed for May 25, 2025 - 5 data ---
//   for (let i = 0; i < 5; i++) {
//     const randomMember = members[Math.floor(Math.random() * members.length)];
//     const randomAmount = Math.floor(Math.random() * (400000 - 30000 + 1)) + 30000; // Slightly different range for variety
//     const randomMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
//     const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];

//     paymentsData.push({
//       memberId: randomMember.id,
//       amount: randomAmount,
//       name: randomName,
//       method: randomMethod,
//       paymentAt: may25,
//     });
//   }
//   console.log('Preparing 5 payments for May 25, 2025...');

//   // --- Seed for May 15, 2025 - 5 data ---
//   for (let i = 0; i < 5; i++) {
//     const randomMember = members[Math.floor(Math.random() * members.length)];
//     const randomAmount = Math.floor(Math.random() * (300000 - 20000 + 1)) + 20000; // Another range for variety
//     const randomMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
//     const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];

//     paymentsData.push({
//       memberId: randomMember.id,
//       amount: randomAmount,
//       name: randomName,
//       method: randomMethod,
//       paymentAt: may15,
//     });
//   }
//   console.log('Preparing 5 payments for May 15, 2025...');

//   console.log('Seeding all payments...');
//   await prisma.payment.createMany({
//     data: paymentsData,
//     skipDuplicates: true, // Optional: skip if a duplicate (memberId, paymentAt) already exists
//   });
//   console.log('Total 50 payments seeded successfully.');
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
