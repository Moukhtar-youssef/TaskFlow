import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  createdAt: integer("created_at").default(Math.floor(Date.now() / 1000)),
});

export const boards = sqliteTable("boards", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  ownerId: integer("owner_id").references(() => users.id),
  createdAt: integer("created_at").default(Math.floor(Date.now() / 1000)),
});

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  completed: integer({ mode: "boolean" }).default(false),
  boardId: integer("board_id").references(() => boards.id),
  createdAt: integer("created_at").default(Math.floor(Date.now() / 1000)),
});

export const refreshTokens = sqliteTable("refresh_tokens", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  token: text("token").notNull(),
  userId: integer("user_id").references(() => users.id),
  expiresAt: integer("expires_at").notNull(),
  expired: integer({ mode: "boolean" }).default(false),
});
