import { Request, Response } from 'express';
import { prisma } from '../prisma/client';
import bcrypt from 'bcrypt';
import { signToken } from '../utils/jwt';

export async function login(id: string, password: string) {
  const userId = Number(id);
  const user = await prisma.member.findUnique({
    where: { id: userId },
    omit: {
      joinDate: true,
      phone: true,
      updatedAt: true,
    },
  });
  if (!user) {
    throw new Error('Member tidak ditemukan');
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Password salah!');
  }
  const token = signToken({ id: userId, role: user.role });
  return { token, user };
}
