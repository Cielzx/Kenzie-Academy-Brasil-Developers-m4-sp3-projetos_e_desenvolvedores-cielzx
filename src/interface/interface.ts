import { QueryResult } from "pg";

interface iDeveloperRequest {
  name: string;
  email: string;
}

interface iDeveloper extends iDeveloperRequest {
  id: number;
}

type devQueryResult = QueryResult<iDeveloper>;

type devRequired = "name" | "email";

interface iDevInfoRequest {
  developerSince: Date;
  preferredOS: "Windows" | "Linux" | "MacOs";
}

interface iDevInfo extends iDevInfoRequest {
  id: number;
}

type devInfoRequire = "developerSince" | "preferredOS";
type InfoRequire = "Windows" | "Linux" | "MacOs";

type infoResult = QueryResult<iDevInfo>;

export {
  iDeveloperRequest,
  iDeveloper,
  devQueryResult,
  devRequired,
  iDevInfo,
  iDevInfoRequest,
  infoResult,
  devInfoRequire,
  InfoRequire,
};
