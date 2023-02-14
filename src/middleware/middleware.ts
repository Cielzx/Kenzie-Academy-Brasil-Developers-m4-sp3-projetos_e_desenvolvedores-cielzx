import {
  devInfoRequire,
  devQueryResult,
  devRequired,
  iDeveloperRequest,
  InfoRequire,
} from "../interface/interface";
import { NextFunction, Request, Response } from "express";
import { client } from "../database/database";
import { QueryConfig, QueryResult } from "pg";
import { projectRequire, updateRequire } from "../interface/ProjectInterface";

const validateDevInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const infoKeys = Object.keys(req.body);
  const osInfos = req.body;

  const requiredInfoKeys: Array<devInfoRequire> = [
    "developerSince",
    "preferredOS",
  ];

  const requiredOs: Array<InfoRequire> = ["Windows", "MacOs", "Linux"];

  const validateOs = requiredOs.every((el) => osInfos["preferredOS"] === el);

  console.log(validateOs);

  // if (osInfos.preferredOS != requiredOs) {
  //   return res.status(400).json({
  //     message: "At least one of those keys must be send.",
  //     keys: requiredOs,
  //   });
  // }

  const validateInfoKey = requiredInfoKeys.every((el: string) =>
    infoKeys.includes(el)
  );

  if (!validateInfoKey) {
    return res.status(400).json({
      message: "At least one of those keys must be send.",
      keys: ["developerSince", "preferredOS"],
    });
  }

  next();
};

const validateUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id: number = +req.params.id;

  const UpdateKeys = Object.keys(req.body);

  const requiredUpdateKeys: Array<updateRequire> = ["estimatedTime", "endDate"];

  const validateUpdateKey = requiredUpdateKeys.every((el: string) =>
    UpdateKeys.includes(el)
  );

  if (!validateUpdateKey) {
    return res.status(400).json({
      message: "At least one of those keys must be send.",
      keys: requiredUpdateKeys,
    });
  }

  const queryString: string = `
  SELECT 
      *
  FROM
    projects;
  `;

  const queryResult: QueryResult = await client.query(queryString);

  const devFind = queryResult.rows.find((el) => +el.id === id);

  if (!devFind) {
    return res.status(404).json({
      message: "Project not found.",
    });
  }

  next();
};

const projectValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const projectId = +req.params.id;

  const queryString: string = `
  SELECT 
      *
  FROM
    projects;
  `;

  const queryResult: QueryResult = await client.query(queryString);
  const projectFind = queryResult.rows.find((el) => +el.id === projectId);

  if (!projectFind) {
    return res.status(404).json({
      message: "You must put a project ID or Project Doesn't exists",
    });
  }

  next();
};

const validateDev = async (req: Request, res: Response, next: NextFunction) => {
  const Keys = Object.keys(req.body);
  const query: string = `
  SELECT
       *
  FROM
    developers;
  `;

  const queryResult: devQueryResult = await client.query(query);

  const filterInfos = queryResult.rows.find(
    (el) => el.email === req.body.email
  );

  if (filterInfos) {
    return res.status(409).json({ message: "Email already exists!" });
  }
  const requiredKeys: Array<devRequired> = ["name", "email"];

  const validateKey = requiredKeys.every((el: string) => Keys.includes(el));

  if (req.method === "PATCH") {
    if (!validateKey) {
      return res.status(400).json({
        message: "At least one of those keys must be send.",
        keys: ["name", "email"],
      });
    }
  }

  if (!validateKey) {
    return res
      .status(400)
      .json({ message: `Required keys are: ${requiredKeys}` });
  }

  next();
};

const ProjectKeys = async (req: Request, res: Response, next: NextFunction) => {
  const Keys = Object.keys(req.body);

  const requiredKeys: Array<projectRequire> = [
    "name",
    "description",
    "estimatedTime",
    "repository",
    "startDate",
  ];

  const validateKey = requiredKeys.every((el: string) => Keys.includes(el));

  if (!validateKey) {
    return res.status(400).json({
      message: `Valide Keys Are: ${requiredKeys}`,
    });
  }

  const query: string = `
  SELECT
      *
  FROM
    developers;
  `;

  const queryResults: QueryResult = await client.query(query);

  const devfinder = queryResults.rows.find(
    (el) => +el.id === +req.body.developerId
  );

  if (!devfinder) {
    return res.status(404).json({
      message: "Developer not found",
    });
  }

  next();
};

const ensureDevExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const devId: number = parseInt(req.params.id);

  if (req.method === "PATCH") {
    const queryString: string = `
    SELECT
        COUNT(*)
    FROM
        developer_infos
    WHERE
        id = $1
    `;
    const queryConfig: QueryConfig = {
      text: queryString,
      values: [devId],
    };

    const queryResult = await client.query(queryConfig);

    if (+queryResult.rows[0].count > 0) {
      return next();
    }
  }

  const queryString: string = `
  SELECT
      COUNT(*)
  FROM
      developers
  WHERE
      id = $1
  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [devId],
  };

  const queryResult = await client.query(queryConfig);

  if (+queryResult.rows[0].count > 0) {
    return next();
  }

  return res.status(404).json({ message: "Developer not found." });
};

export {
  validateDevInfo,
  validateDev,
  ensureDevExist,
  validateUpdate,
  ProjectKeys,
  projectValidation,
};
