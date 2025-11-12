import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { logger } from "hono/logger";
import { csrf } from "hono/csrf";
import { cors } from "hono/cors";
import { db } from "./db/drizzle";
import { users } from "./db/schema";
import { tasksRoute } from "./routes/tasks";
import { authRoute } from "./routes/auth";
import { usersRoute } from "./routes/users";
import { upgradeWebSocket, websocket } from "hono/bun";

const app = new Hono();
export const clients = new Map<string, any>();

app.use(
  cors({
    origin: "*", // Change in production to your frontend URL
    allowMethods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
    maxAge: 600,
    credentials: true,
  }),
);
app.use(csrf());
app.use(logger());
app.use(prettyJSON());

app.get("/", (c) => c.text("Hello Hono!"));
app.get("/users", async (c) => {
  try {
    const usersFetched = await db.select().from(users);
    return c.json(usersFetched);
  } catch (err) {
    console.error("Failed to fetch users:", err);
    return c.json({ error: "Failed to fetch users" }, 500);
  }
});

app.get(
  "/ws",
  upgradeWebSocket((c) => {
    return {
      onOpen(_event, ws) {
        console.log(`User  connected`);
      },
      onMessage(event, ws) {
        console.log(`Message from :`, event.data);
      },
      onClose() {
        console.log(`User  disconnected`);
      },
    };
  }),
);

app.route("/project/:projectId/tasks", tasksRoute);

app.route("/auth", authRoute);

app.route("/users", usersRoute);

app.onError((err, c) => {
  console.error("Unhandled error:", err);
  return c.json({ error: "Internal Server Error" }, 500);
});

export default {
  fetch: app.fetch,
  websocket,
};
