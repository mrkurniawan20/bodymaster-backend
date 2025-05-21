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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMember = addMember;
exports.loginMember = loginMember;
exports.getAllMember = getAllMember;
exports.getMember = getMember;
exports.editMember = editMember;
exports.extendMember = extendMember;
exports.recordVisit = recordVisit;
exports.getLogVisit = getLogVisit;
exports.getTodayVisit = getTodayVisit;
exports.getAllPayment = getAllPayment;
exports.getAllNotifications = getAllNotifications;
exports.deleteMember = deleteMember;
const client_1 = require("../prisma/client");
const app_1 = require("../app");
const date_fns_1 = require("date-fns");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userService_1 = require("../services/userService");
function addMember(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, id, password, phone, category, method } = req.body;
            let pics = '';
            let amount = 0;
            if (category === 'REGULAR') {
                pics = '/uploads/profile-picture/man.png';
                amount = 210000;
            }
            else if (category === 'WANITA') {
                pics = '/uploads/profile-picture/woman.png';
                amount = 190000;
            }
            else {
                pics = '/uploads/profile-picture/child.jpg';
                amount = 185000;
            }
            const numberId = Number(id);
            const hashed = yield bcrypt_1.default.hash(password, app_1.saltRounds);
            const joinDate = new Date();
            const expireDate = (0, date_fns_1.addMonths)(joinDate, 1);
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
            const addWithPayment = yield client_1.prisma.$transaction([
                client_1.prisma.member.create({
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
                client_1.prisma.payment.create({
                    data: {
                        amount,
                        method,
                        name: 'Member Baru',
                        memberId: numberId,
                    },
                }),
            ]);
            res.status(201).json({ addWithPayment });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
}
function loginMember(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id, password } = req.body;
            const loggedInMember = yield (0, userService_1.login)(id, password);
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
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    });
}
function getAllMember(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const members = yield client_1.prisma.member.findMany({
                omit: {
                    joinDate: true,
                    updatedAt: true,
                    password: true,
                    role: true,
                },
                orderBy: { expireDate: 'desc' },
            });
            res.status(200).json(members);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
}
function getMember(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = Number(req.params.id);
            const member = yield client_1.prisma.member.findUnique({
                where: { id },
                omit: {
                    password: true,
                    updatedAt: true,
                    joinDate: true,
                },
            });
            res.status(200).json(member);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
}
function editMember(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const id = Number(req.params.id);
            const image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path.replace(/\\/g, '/');
            const { password, phone, name } = req.body;
            const dataToUpdate = {};
            if (name)
                dataToUpdate.name = name;
            if (phone)
                dataToUpdate.phone = phone;
            if (password) {
                const hashed = yield bcrypt_1.default.hash(password, app_1.saltRounds);
                dataToUpdate.password = hashed;
            }
            if (image)
                dataToUpdate.image = image;
            const edit = yield client_1.prisma.member.update({
                where: { id },
                data: dataToUpdate,
            });
            res.status(201).json({ message: 'Member edit successfully', edit });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
}
function extendMember(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id, method } = req.body;
            const numberId = Number(id);
            const user = yield client_1.prisma.member.findUnique({
                where: {
                    id: numberId,
                },
            });
            if (!user) {
                res.status(400).json({ message: 'User does not exist' });
                return;
            }
            const monthExtend = (0, date_fns_1.addMonths)(user === null || user === void 0 ? void 0 : user.expireDate, 1);
            // const extend = await prisma.member.update({
            //   where: { id: user.id },
            //   data: {
            //     expireDate: monthExtend,
            //   },
            // });
            let amount = 0;
            if (user.category == 'PELAJAR') {
                amount = 185000;
            }
            else if (user.category == 'WANITA') {
                amount = 190000;
            }
            else {
                amount = 210000;
            }
            const extendWithPayment = yield client_1.prisma.$transaction([
                client_1.prisma.member.update({
                    where: { id: user.id },
                    data: {
                        expireDate: monthExtend,
                        status: 'ACTIVE',
                    },
                }),
                client_1.prisma.payment.create({
                    data: {
                        amount,
                        method,
                        name: 'Perpanjang Member',
                        memberId: user.id,
                    },
                }),
            ]);
            res.status(200).json(extendWithPayment);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
}
function recordVisit(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = Number(req.params.id);
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);
            const todayEnd = new Date();
            todayEnd.setHours(23, 59, 59, 999);
            const alreadyVisit = yield client_1.prisma.visit.findFirst({
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
            }
            else {
                const visit = yield client_1.prisma.visit.create({
                    data: {
                        memberId: id,
                    },
                });
                res.status(201).json(visit);
            }
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
}
function getLogVisit(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const visits = yield client_1.prisma.visit.findMany({
                include: {
                    member: true,
                },
                orderBy: {
                    visitedAt: 'desc',
                },
            });
            res.status(201).json(visits);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
}
function getTodayVisit(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);
            const todayEnd = new Date();
            todayEnd.setHours(23, 59, 59, 999);
            const allVisit = yield client_1.prisma.visit.findMany({
                where: {
                    visitedAt: {
                        gte: todayStart,
                        lte: todayEnd,
                    },
                },
            });
            res.status(200).json(allVisit);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
}
function getAllPayment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const payment = yield client_1.prisma.payment.findMany({
                include: { member: true },
            });
            res.status(200).json(payment);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
}
function getAllNotifications(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const notif = yield client_1.prisma.notifications.findMany({});
            res.status(200).json(notif);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
}
function deleteMember(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const deletionize = yield client_1.prisma.member.deleteMany({
                where: { id: { gte: 12 } },
            });
            res.status(200).json(deletionize);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
}
