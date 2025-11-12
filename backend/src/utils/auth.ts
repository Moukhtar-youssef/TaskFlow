import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

const ACCESS_SECRET = process.env.ACCESS_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_SECRET!;

export const hashPassword = (password: string) => bcrypt.hash(password, 10);
export const comparePassword = (password: string, hash: string) =>
  bcrypt.compare(password, hash);

export const signAccessToken = (userId: number) =>
  jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: "15m" });

export const signRefreshToken = (userId: number) =>
  jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: "7d" });

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, ACCESS_SECRET) as { userId: number };
  } catch {
    return null;
  }
};
export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, REFRESH_SECRET) as { userId: number };
  } catch {
    return null;
  }
};
