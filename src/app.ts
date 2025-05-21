import express from 'express';
import { routerUser } from './routers/user-router';
// import { routerPost } from './router/post-router';
import cors from 'cors';
import { CronJob } from './utils/cronJobs';
import path from 'path';

const app = express();
const PORT = 3450;
export const saltRounds = 10;
const allowedOrigin = ['http://localhost:5173'];
const options: cors.CorsOptions = {
  origin: allowedOrigin,
  allowedHeaders: ['*'],
};
app.use(express.json());
app.use(cors(options));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

CronJob();

app.use('/member', routerUser);
// app.use('/post', routerPost);

app.listen(PORT, () => {
  console.log(`Server is running at port`, PORT);
});
