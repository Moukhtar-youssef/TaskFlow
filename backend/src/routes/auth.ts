import { Hono } from "hono";
import { getSignedCookie, setCookie, setSignedCookie } from "hono/cookie";
import {
  comparePassword,
  hashPassword,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/auth";
import { db } from "../db/drizzle";
import { refreshTokens, users } from "../db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middleware/requireAuth";

export const authRoute = new Hono();
const COOKIE_SECRET = process.env.COOKIE_SECRET!;

authRoute.post("/signup", async (c) => {
  try {
    const { name, email, password } = await c.req.json();

    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .get();
    if (existing) return c.json({ error: "Email already exists" }, 400);

    const hashed = await hashPassword(password);

    const user = await db
      .insert(users)
      .values({ name, email, password: hashed })
      .returning()
      .get();

    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);

    await db.insert(refreshTokens).values({
      token: refreshToken,
      userId: user.id,
      expired: false,
      expiresAt: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
    });

    setCookie(c, "accessToken", accessToken, {
      path: "/",
      httpOnly: true,
      secure: true,
      maxAge: 900,
    });
    await setSignedCookie(c, "refreshToken", refreshToken, COOKIE_SECRET, {
      path: "/",
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60,
    });

    return c.json({
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Signup error:", err);
    return c.json({ error: "Signup failed" }, 500);
  }
});

authRoute.post("/login", async (c) => {
  try {
    const { email, password } = await c.req.json();

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .get();
    if (!user) return c.json({ error: "Invalid credentials" }, 401);

    const valid = await comparePassword(password, user.password);
    if (!valid) return c.json({ error: "Invalid credentials" }, 401);

    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);

    await db.insert(refreshTokens).values({
      token: refreshToken,
      userId: user.id,
      expired: false,
      expiresAt: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
    });

    setCookie(c, "accessToken", accessToken, {
      path: "/",
      httpOnly: true,
      secure: true,
      maxAge: 900,
    });
    await setSignedCookie(c, "refreshToken", refreshToken, COOKIE_SECRET, {
      path: "/",
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60,
    });

    return c.json({
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    return c.json({ error: "Login failed" }, 500);
  }
});

authRoute.post("/logout", requireAuth, async (c) => {
  try {
    const refreshToken = await getSignedCookie(
      c,
      "refreshToken",
      COOKIE_SECRET,
    );

    if (refreshToken) {
      await db
        .update(refreshTokens)
        .set({ expired: true })
        .where(eq(refreshTokens.token, refreshToken));
    }

    setCookie(c, "accessToken", "", {
      path: "/",
      httpOnly: true,
      secure: true,
      maxAge: 0,
    });

    await setSignedCookie(c, "refreshToken", "", COOKIE_SECRET, {
      path: "/",
      httpOnly: true,
      secure: true,
      maxAge: 0,
    });

    return c.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return c.json({ error: "Logout failed" }, 500);
  }
});

authRoute.post("/refresh", async (c) => {
  try {
    const oldToken = await getSignedCookie(c, "refreshToken", COOKIE_SECRET);
    if (!oldToken) return c.json({ error: "Unauthorized" }, 401);

    const tokenEntry = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.token, oldToken))
      .get();
    if (!tokenEntry || tokenEntry.expired)
      return c.json({ error: "Unauthorized" }, 401);

    const payload = verifyRefreshToken(oldToken);
    if (!payload) return c.json({ error: "Unauthorized" }, 401);

    await db
      .update(refreshTokens)
      .set({ expired: true })
      .where(eq(refreshTokens.token, oldToken));

    const accessToken = signAccessToken(payload.userId);
    const refreshToken = signRefreshToken(payload.userId);

    await db.insert(refreshTokens).values({
      token: refreshToken,
      userId: payload.userId,
      expired: false,
      expiresAt: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
    });

    setCookie(c, "accessToken", accessToken, {
      path: "/",
      httpOnly: true,
      secure: true,
      maxAge: 900,
    });
    await setSignedCookie(c, "refreshToken", refreshToken, COOKIE_SECRET, {
      path: "/",
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60,
    });

    return c.json({ message: "Tokens refreshed" });
  } catch (err) {
    console.error("Refresh error:", err);
    return c.json({ error: "Refresh failed" }, 500);
  }
});

authRoute.post("/logoutAll");
