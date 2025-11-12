import { Hono } from "hono";

export const projectsRoute = new Hono();

projectsRoute.get("/");
projectsRoute.post("/")
projectsRoute.
