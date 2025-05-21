"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploads = exports.uploadProfilePicture = void 0;
const multer_1 = __importDefault(require("multer"));
const whitelisted = ['image/png', 'image/jpeg', 'image/jpg'];
const pictureStorage = multer_1.default.diskStorage({
    // destination: function (req, file, cb) {
    //   cb(null, '/src/uploads/profile-picture');
    // },
    destination: 'uploads/profile-picture',
    filename(req, file, callback) {
        const randomNumber = Math.round(Math.random() * 1000) + 1000;
        callback(null, `${randomNumber} - ${file.originalname}`);
    },
});
// const avatarStorage = multer.diskStorage({
//   destination: '/src/uploads/avatar',
//   filename(req, file, callback) {
//     const randomNumber = Math.round(Math.random() * 1000) + 1000;
//     callback(null, `${new Date(Date.now())} - ${randomNumber} - ${file.originalname}`);
//   },
// });
// const headerStorage = multer.diskStorage({
//   destination: '/src/uploads/header',
//   filename(req, file, callback) {
//     const randomNumber = Math.round(Math.random() * 1000) + 1000;
//     callback(null, `${new Date(Date.now())} - ${randomNumber} - ${file.originalname}`);
//   },
// });
exports.uploadProfilePicture = (0, multer_1.default)({
    storage: pictureStorage,
    // limits: {fileSize:  2 * 1024 *1024}
    fileFilter: (req, file, cb) => {
        if (!whitelisted.includes(file.mimetype)) {
            return cb(new Error(`File not supported`));
        }
        else {
            cb(null, true);
        }
    },
});
// const uploadAvatar = multer({
//   storage: avatarStorage,
//   limits: { fileSize: 2 * 1024 * 1024 },
//   fileFilter: (req, file, cb) => {
//     if (!whitelisted.includes(file.mimetype)) {
//       return cb(new Error('File not supported, only support .png, .jpg, .jpeg'));
//     } else {
//       cb(null, true);
//     }
//   },
// });
// const imageUpload = uploadAvatar.single('image');
// export const handleImageUpload = (req: Request, res: Response, next: NextFunction) => {
//   imageUpload(req, res, (error: any) => {
//     if (error) {
//       req.resume();
//       res.status(400).json({ error: error.message });
//     }
//     next();
//   });
// };
// const storage = multer.diskStorage({
//   destination: 'src/uploads',
//   filename: (req, file, cb) => {
//     const randomNumber = Math.round(Math.random() * 1000) + 1000;
//     cb(null, `${Date.now()}-${randomNumber}-${file.originalname}`);
//   },
// });
exports.uploads = (0, multer_1.default)({
    storage: pictureStorage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!whitelisted.includes(file.mimetype)) {
            return cb(new Error('File not supported, only support .png, .jpeg. .jpg'));
        }
        else {
            cb(null, true);
        }
    },
});
