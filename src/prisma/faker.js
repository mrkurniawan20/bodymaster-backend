"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { PrismaClient } = require('@prisma/client');
const faker_1 = require("@faker-js/faker");
const date_fns_1 = require("date-fns");
const prisma = new PrismaClient();
const categories = ['WANITA', 'REGULAR', 'PELAJAR']; // adjust based on your actual enum or foreign key
function seedMembers() {
    return __awaiter(this, void 0, void 0, function* () {
        const now = new Date();
        const expireDate = (0, date_fns_1.addMonths)(now, 1);
        for (let i = 12; i < 1000; i++) {
            // const joinDate = faker.date.past(1); // within last year
            // expireDate.setMonth(expireDate.getMonth() + faker.datatype.number({ min: 1, max: 12 }));
            yield prisma.member.create({
                data: {
                    id: i,
                    name: faker_1.faker.person.fullName(),
                    password: faker_1.faker.internet.password(),
                    phone: faker_1.faker.phone.number(),
                    category: categories[Math.floor(Math.random() * categories.length)],
                    expireDate,
                },
            });
        }
        console.log('✅ Seeded 1000 members');
    });
}
seedMembers()
    .catch((e) => {
    console.error(e);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
