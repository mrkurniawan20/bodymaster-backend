import multer from 'multer';

const whitelisted = ['image/png', 'image/jpeg', 'image/jpg'];

const pictureStorage = multer.diskStorage({
  destination: 'uploads/profile-picture',
  filename(req, file, callback) {
    const randomNumber = Math.round(Math.random() * 1000) + 1000;
    callback(null, `${randomNumber} - ${file.originalname}`);
  },
});

export const uploads = multer({
  storage: pictureStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!whitelisted.includes(file.mimetype)) {
      return cb(new Error('File not supported, only support .png, .jpeg. .jpg'));
    } else {
      cb(null, true);
    }
  },
});
