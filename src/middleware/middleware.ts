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
import {
  projectRequire,
  techRequire,
  updateProjectRequire,
  updateRequire,
} from "../interface/ProjectInterface";

const validateDevInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const osInfos = req.body;

  const UpdateKeys: Array<string> = Object.keys(req.body);

  const requiredOs: Array<InfoRequire> = ["Windows", "MacOs", "Linux"];

  const validateOs = requiredOs.find((el, i) => osInfos["preferredOS"] === el);

  if (!validateOs) {
    return res.status(400).json({ message: `Valids are ${requiredOs}` });
  }

  const requiredUpdateKeys: Array<devInfoRequire> = [
    "developerSince",
    "preferredOS",
  ];

  const validateUpdateKey = requiredUpdateKeys.filter((el: string) =>
    UpdateKeys.includes(el)
  );
  const validateEntriesKeys = validateUpdateKey.map((key: any) => {
    return [key, req.body[key]];
  });

  const validateInfoBody = Object.fromEntries(validateEntriesKeys);

  req.validateInfoBody = validateInfoBody;

  next();
};

const validateDevInfoBody = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const infoKeys = Object.keys(req.body);

  const requiredInfoKeys: Array<devInfoRequire> = [
    "developerSince",
    "preferredOS",
  ];
  const validateInfoKey = requiredInfoKeys.every((el: string) =>
    infoKeys.includes(el)
  );

  if (!validateInfoKey) {
    return res
      .status(400)
      .json({ message: `Valid Keys are ${requiredInfoKeys}` });
  }

  next();
};

const validateUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id: number = +req.params.id;

  const UpdateKeys: Array<string> = Object.keys(req.body);

  if (Object.values(UpdateKeys[0]).length === 0) {
    return res.status(400);
  }

  const reqKeys = Object.keys(req.body);

  const requiredUpdateKeys: Array<updateProjectRequire> = [
    "name",
    "description",
    "estimatedTime",
    "repository",
    "startDate",
    "endDate",
    "developerId",
  ];

  const validateUpdateKey = requiredUpdateKeys.filter((el: string) =>
    UpdateKeys.includes(el)
  );

  const validateAllKeys = requiredUpdateKeys.every((key: any) =>
    reqKeys.includes(key)
  );

  // if (!validateAllKeys) {
  //   return res
  //     .status(400)
  //     .json({ message: `Required keys are: ${requiredUpdateKeys}` });
  // }

  const validateEntriesKeys = validateUpdateKey.map((key: any) => {
    return [key, req.body[key]];
  });

  const validateUpdate = Object.fromEntries(validateEntriesKeys);

  req.validateUpdate = validateUpdate;

  const queryString: string = `
  SELECT 
      *
  FROM
    projects;
  `;

  const queryResult: QueryResult = await client.query(queryString);

  const projectFind = queryResult.rows.find((el) => el.id === +id);

  if (!projectFind) {
    return res.status(404).json({
      message: "Project not found.",
    });
  }

  // let devFind = validateUpdate.find(
  //   (el: any) =>
  //     el.developerId === +req.body.developerId || el.developerId === undefined
  // );

  // console.log(devFind);

  // queryResult.rows.forEach((el, index) => {
  //   if (
  //     req.body["developerId"] != el.developerId &&
  //     req.body["deveoperId"] != undefined
  //   ) {
  //     return res.status(404).json({
  //       message: "Dev not found.",
  //     });
  //   }
  // });

  next();
};

const projectValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const projectId = +req.params.id;

  const keys: Array<string> = Object.keys(req.body);

  const requiredKey: Array<techRequire> = ["name"];

  const validateKey = keys.filter((el: any) => requiredKey.includes(el));

  const validateEntriesKeys = validateKey.map((key: any) => {
    return [key, req.body[key]];
  });

  const validateTech = Object.fromEntries(validateEntriesKeys);

  req.validateTech = validateTech;

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

const validateDevBody = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const Keys: Array<string> = Object.keys(req.body);
  const requiredKeys: Array<devRequired> = ["name", "email"];

  const validateKey = Keys.filter((el: any) => requiredKeys.includes(el));

  const validateEntriesKeys = validateKey.map((key: any) => {
    return [key, req.body[key]];
  });

  const validateDevEntries = Object.fromEntries(validateEntriesKeys);

  req.validateDevEntries = validateDevEntries;

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

  next();
};

const validateDev = async (req: Request, res: Response, next: NextFunction) => {
  const Keys: Array<string> = Object.keys(req.body);

  const reqKeys = Object.keys(req.body);

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

  const validateKey = Keys.filter((el: any) => requiredKeys.includes(el));

  const validateAllKeys = requiredKeys.every((key: any) =>
    reqKeys.includes(key)
  );

  const validateEntriesKeys = validateKey.map((key: any) => {
    return [key, req.body[key]];
  });

  const validateDevEntries = Object.fromEntries(validateEntriesKeys);

  req.validateDevEntries = validateDevEntries;

  if (!validateAllKeys) {
    return res
      .status(400)
      .json({ message: `Required keys are: ${requiredKeys}` });
  }

  if (req.method === "PATCH") {
    // if (!validateKey) {
    //   return res.status(400).json({
    //     message: "At least one of those keys must be send.",
    //     keys: ["name", "email"],
    //   });
    // }
  }

  next();
};

const ProjectKeys = async (req: Request, res: Response, next: NextFunction) => {
  const Keys: Array<string> = Object.keys(req.body);

  const reqKeys = Object.keys(req.body);

  const requiredKeys: Array<projectRequire> = [
    "name",
    "description",
    "estimatedTime",
    "repository",
    "startDate",
    "developerId",
  ];

  const validateKey = Keys.filter((keys: any) => {
    return requiredKeys.includes(keys);
  });

  const validateAllKeys = requiredKeys.every((key: any) =>
    reqKeys.includes(key)
  );

  if (!validateAllKeys) {
    return res
      .status(400)
      .json({ message: `Required keys are: ${requiredKeys}` });
  }

  const validateEntriesKeys = validateKey.map((key: any) => {
    return [key, req.body[key]];
  });

  const validateEntries = Object.fromEntries(validateEntriesKeys);

  req.validateEntries = validateEntries;

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
  validateDevInfoBody,
  validateDevBody,
};
