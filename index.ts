import { RequestHandler, Router, Request } from "express";
import path from "path";
import { DirTree, Route, isRoute } from "./types";
import defaultHandler from "./default/handler";
import fs, { Dir, read } from "fs";
import handlebars from "handlebars";

require("handlebars-helpers")({
  handlebars: handlebars,
});

type DefaultHandlerData = ReturnType<typeof defaultHandler>;

type Handler = (
  request: Request
) => { [index: string]: string } & DefaultHandlerData;

const compileFile = (filePath: string) =>
  handlebars.compile(fs.readFileSync(filePath, "utf8"));

const defaultLayout = compileFile(path.join(__dirname, "default/layout.hbs"));

const defaultView = compileFile(path.join(__dirname, "default/view.hbs"));

function getRouteHandler(route: Route): RequestHandler {
  const view = route.templatePath
    ? compileFile(route.templatePath)
    : defaultView;
  const layout = route.layout ? compileFile(route.layout) : defaultLayout;
  return (req, res) => {
    const defaultData = defaultHandler(req);
    const handlerData = route.handlerPath
      ? (require(route.handlerPath).default as Handler)(req)
      : {};
    const data = { ...defaultData, ...handlerData };
    const body = view(data);
    if (defaultData.isHtmxRequest) {
      res.send(body);
    } else {
      res.send(layout({ body }));
    }
  };
}

export const getRouter = (rootPath: string) => {
  const files: DirTree = {};
  const router = Router();

  readDirectory(rootPath, files);
  buildRouter(files);

  return router;

  function buildRouter(dirTree: DirTree) {
    const files = Object.keys(dirTree);
    for (const key of files) {
      if (key === "layout") {
        continue;
      }

      const value = dirTree[key];
      value.layout = value.layout || dirTree.layout;
      if (isRoute(value)) {
        router.get(value.routePath, getRouteHandler(value));
      } else {
        buildRouter(value);
      }
    }
  }

  function readDirectory(currentPath: string, files: DirTree) {
    const entries = fs.readdirSync(currentPath);

    for (const entry of entries) {
      const entryPath = path.join(currentPath, entry);
      const relativePath = entryPath.replace(rootPath, "");
      const stat = fs.statSync(entryPath);
      if (stat.isDirectory()) {
        const dirName = path.basename(relativePath);
        files[dirName] = files[dirName] || {};
        readDirectory(entryPath, files[dirName] as DirTree);
        continue;
      }

      const { dir, name, ext, base } = path.parse(relativePath);
      const routePath = path.join(
        "/",
        dir.replace(/^\[(.+)\]$/, ":$1"),
        name !== "index" ? name.replace(/^\[(.+)\]$/, ":$1") : ""
      );

      if (base === "layout.hbs") {
        files.layout = entryPath;
        continue;
      }

      files[name] = {
        templatePath:
          ext === ".hbs" ? entryPath : files[name]?.templatePath || "",
        handlerPath: ext === ".ts" ? entryPath : files[name]?.handlerPath || "",
        routePath,
      } as Route;
    }
  }
};

// Use the files array as needed
