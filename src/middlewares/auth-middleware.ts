import { NextFunction, Request, Response } from 'express';
import { UserPayload, verifyToken } from '../utils/jwt';

export interface Auth extends Request {
  user?: UserPayload;
}

export async function authUser(req: Auth, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(400).json({ message: 'Unauthorized!' });
      return;
    }
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
