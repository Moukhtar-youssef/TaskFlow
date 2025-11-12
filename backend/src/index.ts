import { Hono } from "hono";
import { logger } from "hono/logger";
import { db } from "./db/drizzle";
import { users } from "./db/schema";
import { tasksRoute } from "./routes/tasks";
import { prettyJSON } from "hono/pretty-json";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";

const app = new Hono();

const user: typeof users.$inferInsert = {
  email: "john@example.com",
  password: "try",
};

app.use(
  cors({
    origin: "*",
    allowMethods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
    maxAge: 600,
    credentials: true,
  }),
);
app.use(csrf());
app.use(logger());
app.use(prettyJSON());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});
app.get("/cuser", async (c) => {
  await db.insert(users).values(user);
  return c.text("user added");
});
app.get("/user", async (c) => {
  const usersfetched = await db.select().from(users);
  return c.json(usersfetched);
});

app.route("/project/:projectId/tasks", tasksRoute);

export default app;
