import { Handler, Request } from "express";

declare global {
  export interface Entity {
    default: (props: { req: Request }) => JSX.Element;
    get?: Handler;
    post?: Handler;
    put?: Handler;
    delete?: Handler;
  }
}
