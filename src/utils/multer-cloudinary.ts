import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'bodymaster',
      public_id: Date.now().toString(),
      allowedFormat: ['jpg', 'jpeg', 'png'],
    };
  },
});

export const upload = multer({ storage });
