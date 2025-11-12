import { getCookie } from "hono/cookie";
import { verifyAccessToken } from "../utils/auth";

export const requireAuth = async (c: any, next: any) => {
  const token = getCookie(c, "accessToken");

  if (!token) return c.json({ error: "Unauthorized" }, 401);
  const payload = verifyAccessToken(token);
  if (!payload) return c.json({ error: "Unauthorized" }, 401);

  c.req.userId = payload.userId;
  await next();
};
