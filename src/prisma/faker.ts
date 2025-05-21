const { PrismaClient } = require('@prisma/client');
import { faker } from '@faker-js/faker';
import { addMonths } from 'date-fns';

const prisma = new PrismaClient();

const categories = ['WANITA', 'REGULAR', 'PELAJAR']; // adjust based on your actual enum or foreign key

async function seedMembers() {
  const now = new Date();
  const expireDate = addMonths(now, 1);
  for (let i = 12; i < 1000; i++) {
    // const joinDate = faker.date.past(1); // within last year

    // expireDate.setMonth(expireDate.getMonth() + faker.datatype.number({ min: 1, max: 12 }));

    await prisma.member.create({
      data: {
        id: i,
        name: faker.person.fullName(),
        password: faker.internet.password(),
        phone: faker.phone.number(),
        category: categories[Math.floor(Math.random() * categories.length)],
        expireDate,
      },
    });
  }

  console.log('✅ Seeded 1000 members');
}

seedMembers()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
