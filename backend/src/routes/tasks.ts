import { Hono } from "hono";
import { db } from "../db/drizzle";
import { tasks } from "../db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middleware/requireAuth";

export const tasksRoute = new Hono();

tasksRoute.get("/", requireAuth, async (c) => {
  const projectId = c.req.param("projectId");
  const allTasks = await db
    .select()
    .from(tasks)
    .where(eq(tasks.boardId, Number(projectId)));
  return c.json(allTasks);
});

tasksRoute.post("/", requireAuth, async (c) => {
  const projectId = c.req.param("projectId");
  const data = await c.req.json();
  const task = await db
    .insert(tasks)
    .values({ ...data, boardId: Number(projectId) })
    .returning();
  return c.json(task);
});

tasksRoute.get("/:taskId", requireAuth, async (c) => {
  const projectId = c.req.param("projectId");
  const taskId = c.req.param("taskId");
});

tasksRoute.put("/:taskId", requireAuth, async (c) => {
  const projectId = c.req.param("projectId");
  const taskId = c.req.param("taskId");
});

tasksRoute.delete("/:taskId", requireAuth, async (c) => {
  const projectId = c.req.param("projectId");
  const taskId = c.req.param("taskId");
});
tasksRoute.patch("/:taskId/move", requireAuth, async (c) => {
  const projectId = c.req.param("projectId");
  const taskId = c.req.param("taskId");
});
