"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saltRounds = void 0;
const express_1 = __importDefault(require("express"));
const user_router_1 = require("./routers/user-router");
// import { routerPost } from './router/post-router';
const cors_1 = __importDefault(require("cors"));
const cronJobs_1 = require("./utils/cronJobs");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = 3450;
exports.saltRounds = 10;
const allowedOrigin = ['https://bodymaster-frontend.vercel.app/'];
const options = {
    origin: allowedOrigin,
    allowedHeaders: ['*'],
};
app.use(express_1.default.json());
app.use((0, cors_1.default)(options));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
(0, cronJobs_1.CronJob)();
app.use('/member', user_router_1.routerUser);
// app.use('/post', routerPost);
app.listen(PORT, () => {
    console.log(`Server is running at port`, PORT);
});
