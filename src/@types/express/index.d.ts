import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      validateEntries: Array;
      validateDevEntries: Array;
      validateUpdate: Array;
      validateTech: Array;
      validateInfoBody: Array;
    }
  }
}
