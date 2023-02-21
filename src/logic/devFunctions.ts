import { Request, Response } from "express";
import {
  devQueryResult,
  iDeveloper,
  iDeveloperRequest,
  iDevInfoRequest,
  infoResult,
} from "../interface/interface";
import { client } from "../database/database";
import { QueryConfig, QueryResult } from "pg";
import format from "pg-format";

const createDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const devData: iDeveloperRequest = req.validateDevEntries;

  const queryString: string = format(
    `
  INSERT INTO
      developers(%I)
  VALUES
      (%L)
  RETURNING *;
`,
    Object.keys(devData),
    Object.values(devData)
  );

  const queryResult: devQueryResult = await client.query(queryString);

  return res.status(201).json(queryResult.rows[0]);
};

const createDevInfos = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const devId: number = +req.params.id;
  const infoData: iDevInfoRequest = req.validateInfoBody;

  let queryString: string = format(
    `
  INSERT INTO
        developer_infos(%I)
  VALUES
        (%L)
  RETURNING *;
  `,
    Object.keys(infoData),
    Object.values(infoData)
  );

  let queryResult: infoResult = await client.query(queryString);

  queryString = `
  UPDATE
      developers
  SET
    "developerInfoId" = $1
  WHERE
    id = $2
  RETURNING *;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [queryResult.rows[0].id, devId],
  };

  queryResult = await client.query(queryConfig);

  return res.status(201).json(queryResult.rows[0]);
};

const getAllDevs = async (req: Request, res: Response): Promise<Response> => {
  const query: string = `
  SELECT
      de."id" AS "developerID",
      de."name" AS "developerName",
      de."developerInfoId" AS "developerInfoId",
      de."email" AS "developerEmail",
      di."developerSince" AS "developerInfoDeveloperSince",
      di."preferredOS" AS "developerInfoPreferredOS"
  FROM
    developers de
  LEFT JOIN
    developer_infos di ON de."developerInfoId" = di."id";
  `;

  const queryResult: QueryResult = await client.query(query);

  return res.status(200).json(queryResult.rows);
};

const getDevsPerId = async (req: Request, res: Response): Promise<Response> => {
  const id = req.params.id;
  const query: string = `
  SELECT
      *
  FROM
    developers;
  `;

  const queryResult: QueryResult = await client.query(query);

  const devFilter = queryResult.rows.find((el) => +el.id === +id);

  if (!devFilter) {
    return res.status(404).json({ message: "Developer not found!" });
  }

  return res.status(200).json(devFilter);
};

const updateDev = async (req: Request, res: Response): Promise<Response> => {
  const id: number = +req.params.id;

  const data: iDeveloperRequest = req.validateDevEntries;

  if (Object.values(data).length === 0) {
    return res.status(400).json({ message: "Body is empty" });
  }

  const queryStr: string = format(
    `
  UPDATE
      developers
  SET(%I) = ROW(%L)
  WHERE
    id = $1 
  RETURNING *;
  `,
    Object.keys(data),
    Object.values(data)
  );
  const queryConfig: QueryConfig = {
    text: queryStr,
    values: [id],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  return res.status(200).json(queryResult.rows[0]);
};

const updateInfo = async (req: Request, res: Response): Promise<Response> => {
  const id: number = +req.params.id;

  const data: iDevInfoRequest = req.validateInfoBody;

  const queryStr: string = format(
    `
  UPDATE
      developer_infos
  SET(%I) = ROW(%L)
  WHERE
    id = $1 
  RETURNING *;
  `,
    Object.keys(data),
    Object.values(data)
  );
  const queryConfig: QueryConfig = {
    text: queryStr,
    values: [id],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  const devFilter = queryResult.rows.find((el) => +el.id === id);

  if (!devFilter) {
    return res.status(404).json({ message: "Developer not found!" });
  }

  return res.status(200).json(devFilter);
};

const DeleteDevs = async (req: Request, res: Response): Promise<Response> => {
  const id: number = +req.params.id;

  const queryString: string = `
DELETE FROM
	  developer_infos 
WHERE
	id = $1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: devQueryResult = await client.query(queryConfig);

  if (!queryResult.rowCount) {
    return res.status(404).json({ message: "Developer not found" });
  }

  return res.status(204).send();
};

export {
  createDeveloper,
  getAllDevs,
  getDevsPerId,
  createDevInfos,
  updateDev,
  updateInfo,
  DeleteDevs,
};
