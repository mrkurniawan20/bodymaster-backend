import { Router } from 'express';
import {
  addMember,
  CronJob,
  deleteMember,
  editMember,
  extendMember,
  getAllMember,
  getAllNotifications,
  getAllPayment,
  getCountMemberActive,
  getExpiredMember,
  getLogVisit,
  getMember,
  getTodayVisit,
  getVisitLog,
  loginMember,
  recordVisit,
} from '../controllers/user-controller';

import { authUser } from '../middlewares/auth-middleware';
import { uploadProfilePicture, uploads } from '../middlewares/multer-middleware';
import { upload } from '../utils/multer-cloudinary';

export const routerUser = Router();
export const routerDaily = Router();

routerUser.post('/addmember', authUser, upload.none(), addMember);
routerUser.post('/loginMember', upload.none(), loginMember);
routerUser.get('/getMember/:id', getMember);
routerUser.get('/getAllMember', authUser, getAllMember);
routerUser.patch('/editMember/:id', authUser, upload.single('image'), editMember);
routerUser.post('/visit/:id', recordVisit);
routerUser.get('/getTodayVisit', authUser, getTodayVisit);
routerUser.get('/getActiveCount', authUser, getCountMemberActive);
routerUser.get('/getVisitLog', authUser, getLogVisit);
routerUser.post('/getpayment', authUser, getAllPayment);
routerUser.post('/extendMember', authUser, upload.none(), extendMember);
routerUser.get('/getnotif', getAllNotifications);
routerUser.delete('/deleteMember', authUser, deleteMember);
routerUser.get('/getExpiredMember', authUser, getExpiredMember);
routerUser.post('/visitlog', authUser, getVisitLog);
routerDaily.get('/triggerCron', CronJob);
