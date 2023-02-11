import { QueryResult } from "pg";

interface iProjectRequest {
  name: string;
  description: string;
  estimatedTime: string;
  repository: string;
  startDate: Date;
  endDate: Date;
}

interface iUpdateProject {
  endDate: Date;
  estimatedTime: string;
}

type updateRequire = "endDate" | "estimatedTime";

interface iProject extends iProjectRequest {
  id: number;
}

type ProjResult = QueryResult<iProject>;

interface iTechRequest {
  name: string;
}

interface iTech {
  id: number;
  projectId: number;
  techId: number;
}

type TechResult = QueryResult<iTech>;
type projectRequire =
  | "name"
  | "description"
  | "estimatedTime"
  | "repository"
  | "startDate";

export {
  iProjectRequest,
  iProject,
  ProjResult,
  iUpdateProject,
  updateRequire,
  iTech,
  iTechRequest,
  TechResult,
  projectRequire,
};
