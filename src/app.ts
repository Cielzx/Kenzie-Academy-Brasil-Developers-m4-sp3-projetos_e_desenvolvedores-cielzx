import express, { Application } from "express";
import { startDatabase } from "../src/database/database";
import {
  createDeveloper,
  createDevInfos,
  DeleteDevs,
  getAllDevs,
  getDevsPerId,
  updateDev,
  updateInfo,
} from "./logic/devFunctions";

import {
  createProjects,
  createTechnologies,
  DeleteProject,
  deleteTech,
  getAllProject,
  getDeveloperProject,
  getProjectPerId,
  updatePrj,
} from "./logic/projectFunctions";

import {
  ensureDevExist,
  ProjectKeys,
  projectValidation,
  validateDev,
  validateDevInfo,
  validateUpdate,
} from "../src/middleware/middleware";

const app: Application = express();
app.use(express.json());

app.post("/developers", validateDev, createDeveloper);

app.post("/projects", ProjectKeys, createProjects);

app.post("/projects/:id/technologies", projectValidation, createTechnologies);

app.post(
  "/developers/:id/infos",
  ensureDevExist,
  validateDevInfo,
  createDevInfos
);

app.get("/developers", getAllDevs);

app.get("/developers/:id", getDevsPerId);

app.get("/projects/:id", getProjectPerId);

app.get("/developers/:id/projects", getDeveloperProject);

app.get("/projects", getAllProject);

app.patch("/developers/:id", updateDev);

app.patch("/projects/:id", validateUpdate, updatePrj);

app.patch("/developers/:id/infos", ensureDevExist, validateDevInfo, updateInfo);

app.delete("/developers/:id", DeleteDevs);

app.delete("/projects/:id", DeleteProject);

app.delete("/projects/:id/technologies/:name", deleteTech);

app.listen(3000, async () => {
  console.log("Server started!");
  await startDatabase();
});
