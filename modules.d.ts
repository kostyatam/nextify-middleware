import { Handler, Request } from "express";
import { ReactNode } from "react";

declare global {
  export interface Entity {
    default: () => ReactNode | Promise<ReactNode>;
    get?: Handler;
    post?: Handler;
    put?: Handler;
    delete?: Handler;
  }
}
