import { Hono } from "hono";
import { requireAuth } from "../middleware/requireAuth";

export const usersRoute = new Hono();

usersRoute.get("/", requireAuth);
usersRoute.get("/me", requireAuth);
usersRoute.put("/me", requireAuth);
usersRoute.put("/me/password", requireAuth);
