import { Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import format from "pg-format";
import { client } from "../database/database";

import {
  iProjectRequest,
  iTechRequest,
  iUpdateProject,
  ProjResult,
  TechResult,
} from "../interface/ProjectInterface";

const createProjects = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const projectData: iProjectRequest = req.body;

  let queryString: string = format(
    `
    INSERT INTO
        projects(%I)
    VALUES
        (%L)
    RETURNING *;
  `,
    Object.keys(projectData),
    Object.values(projectData)
  );

  const queryResult: ProjResult = await client.query(queryString);

  return res.status(201).json(queryResult.rows[0]);
};

const createTechnologies = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const techId: number = +req.params.id;
  const techData: iTechRequest = req.body;

  let queryString: string = `
      SELECT
          *
      FROM
          technologies
      WHERE
          name = $1;
  `;

  let queryConfig: QueryConfig = {
    text: queryString,
    values: [techData.name],
  };

  const queryResultParts = await client.query(queryConfig);

  if (queryResultParts.rowCount === 0) {
    return res.status(404).json({
      message: "Technology not supported.",
      options: [
        "JavaScript",
        "Python",
        "React",
        "Express.js",
        "HTML",
        "CSS",
        "Django",
        "PostgreSQL",
        "MongoDB",
      ],
    });
  }

  queryString = `
      INSERT INTO
          projects_technologies ("projectId", "techId","addedin")
      VALUES
          ($1, $2,$3)
      RETURNING *;
  `;

  queryConfig = {
    text: queryString,
    values: [techId, queryResultParts.rows[0].id, new Date()],
  };

  const queryResult: TechResult = await client.query(queryConfig);

  return res.status(201).json(queryResult.rows[0]);
};

const getDeveloperProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = +req.params.id;

  const queryString: string = `
    SELECT
        *
    FROM 
        projects pr;
    `;

  const queryResult: QueryResult = await client.query(queryString);

  const projectFilter = queryResult.rows.filter((el) => +el.developerId === id);

  console.log(projectFilter);

  const devFilter = queryResult.rows.find((el) => +el.id === id);

  if (!devFilter) {
    return res.status(404).json({ message: "Developer not found" });
  }

  return res.status(200).json(projectFilter);
};

const getAllProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const queryString: string = `
   SELECT
        pr."id" AS "projectId",
        pr."name" AS "projectName",
        pr."description" AS "projectDescription",
        pr."estimatedTime" AS "projectEstimatedTime",
        pr."repository" AS "projectRespository",
        pr."startDate" AS "projectStartDate",
        pr."endDate" AS "projectEndDate",
        pr."developerId" AS "projectDeveloperId",
        pt."techId" AS "technologyId",
        te."name" AS "technologyName"
   FROM 
      projects pr
    JOIN
    projects_technologies pt ON pr.id = pt."projectId"
    JOIN
      technologies te ON pt."techId" = te."id" 
    ;
    `;

  const queryResult: QueryResult = await client.query(queryString);

  return res.status(200).json(queryResult.rows);
};

const getProjectPerId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = +req.params.id;

  const queryString: string = `
  SELECT
       pr."id" AS "projectId",
       pr."name" AS "projectName",
       pr."description" AS "projectDescription",
       pr."estimatedTime" AS "projectEstimatedTime",
       pr."repository" AS "projectRespository",
       pr."startDate" AS "projectStartDate",
       pr."endDate" AS "projectEndDate",
       pr."developerId" AS "projectDeveloperId",
       pt."techId" AS "technologyId",
       te."name" AS "technologyName"
  FROM 
     projects pr
   JOIN
   projects_technologies pt ON pr.id = pt."projectId"
   JOIN
     technologies te ON pt."techId" = te."id" 
   ;`;

  const queryResult: QueryResult = await client.query(queryString);

  const projectFilter = queryResult.rows.filter((el) => +el.projectId === id);

  const devFilter = queryResult.rows.find(
    (el) => +el.projectDeveloperId === id
  );

  if (!devFilter) {
    return res.status(404).json({ message: "Project not found!" });
  }

  return res.status(200).json(projectFilter[0]);
};

const DeleteProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = +req.params.id;

  const queryString: string = `
  DELETE FROM projects
  USING developers
  WHERE projects."developerId" = $1;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: ProjResult = await client.query(queryConfig);

  if (!queryResult.rowCount) {
    return res.status(404).json({ message: "Developer not found" });
  }

  return res.status(204).send();
};

const deleteTech = async (req: Request, res: Response): Promise<Response> => {
  const id = +req.params.id;
  const name = req.params.name;

  const techData = req.body;

  const queryString: string = `
  SELECT
      *
  FROM
    technologies;
  `;

  const queryResult: QueryResult = await client.query(queryString);

  const filter = queryResult.rows.find((el) => el.name === name);

  if (filter) {
    const queryString: string = `
    DELETE FROM projects_technologies
    USING technologies
    WHERE projects_technologies."techId" = $1;
      `;

    const queryConfig: QueryConfig = {
      text: queryString,
      values: [id],
    };

    const queryResult: TechResult = await client.query(queryConfig);

    if (!queryResult.rowCount) {
      return res.status(404).json({ message: "Projects not found." });
    }

    return res.status(204).send();
  }

  if (filter != name) {
    return res
      .status(404)
      .json({ message: `Technology '${name}' not found on this project` });
  }

  return res.status(404).json({ message: "Tech not Found!" });
};

const updatePrj = async (req: Request, res: Response): Promise<Response> => {
  const id: number = +req.params.id;

  const data: iUpdateProject = req.body;

  const queryStr: string = format(
    `
    UPDATE
        projects
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

export {
  createProjects,
  getProjectPerId,
  getAllProject,
  DeleteProject,
  updatePrj,
  getDeveloperProject,
  createTechnologies,
  deleteTech,
};
