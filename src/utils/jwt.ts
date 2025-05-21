import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export interface UserPayload {
  id: number;
  role: string;
}

export function signToken(payload: UserPayload) {
  return jwt.sign(payload, JWT_SECRET!, { expiresIn: '12h' });
}
export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET!) as UserPayload;
}
