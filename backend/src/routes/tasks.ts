import { Hono } from "hono";
import { db } from "../db/drizzle";
import { tasks } from "../db/schema";
import { eq } from "drizzle-orm";

export const tasksRoute = new Hono();

tasksRoute.get("/", async (c) => {
  const projectId = c.req.param("projectId");
  const allTasks = await db
    .select()
    .from(tasks)
    .where(eq(tasks.boardId, Number(projectId)));
  return c.json(allTasks);
});

tasksRoute.post("/", async (c) => {
  const projectId = c.req.param("projectId");
  const data = await c.req.json();
  const task = await db
    .insert(tasks)
    .values({ ...data, boardId: Number(projectId) })
    .returning();
  return c.json(task);
});
