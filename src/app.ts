import express from 'express';
import { routerDaily, routerUser } from './routers/user-router';
import cors from 'cors';

export const saltRounds = 10;
const app = express();
const PORT = 3450;
const allowedOrigin = ['https://bodymaster-frontend.vercel.app', 'http://localhost:5173'];
const options: cors.CorsOptions = {
  origin: allowedOrigin,
  allowedHeaders: ['*'],
};
app.use(express.json());
app.use(cors(options));

app.use('/member', routerUser);
app.use('/daily', routerDaily);

app.listen(PORT, () => {
  console.log(`Server is running at port`, PORT);
});

export default app;
