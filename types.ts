export interface Route extends RouteLayout {
  templatePath: string;
  handlerPath: string;
  routePath: string;
}

export interface RouteLayout {
  layout?: string;
  layoutHandlerPath?: string;
}

export type DirTree = {
  [name: string]: Route | DirTree;
} & RouteLayout;

export const isRoute = (value: any): value is Route => {
  return value && typeof value === "object" && "handlerPath" in value;
};

export const isDir = (value: any): value is DirTree => {
  return value && typeof value === "object" && !("handlerPath" in value);
};
