import path from "path";
import fs from "fs";
import { getCodeForBundle } from "./default/getCodeForBundle";
import * as esbuild from "esbuild";
import { Router } from "express";

const DEFAULT_LAYOUT_PATH = path.resolve(__dirname, "./default/layout");
const CODE_FILE = `
import React from "react";
import { Handler, Request, Router } from "express";
import { renderToStaticMarkup } from "react-dom/server";

interface Entity {
  default: (props: { req: Request }) => JSX.Element;
  get?: Handler;
  post?: Handler;
  put?: Handler;
  delete?: Handler;
}

function evalCrud(
  cb: (...args: Parameters<Handler>) => Promise<void | string | JSX.Element>
) {
  const handler: Handler = async (req, res, next) => {
    const result = cb(req, res, next)
    if (!result) {
        return;
    }
    if ("then" in result) {
      return result.then(handleResult, next);
    }
    handleResult(result);
    
    function handleResult (result: undefined | string | JSX.Element) {
        if (React.isValidElement(result)) {
          return res.send(renderToStaticMarkup(result))
        }
        return res.json(result);
    }
  };
  return handler;
}

export const router = Router();
`;
const NEXTIFY_DIR_NAME = ".nextify";
export async function getRouter(pagesPath: string) {
  const rootPath = process.cwd();
  const nextifyPath = path.join(rootPath, NEXTIFY_DIR_NAME);
  const outfilePath = path.join(nextifyPath, "/router.js");
  try {
    await esbuild.build({
      stdin: {
        contents: getFile(pagesPath),
        loader: "tsx",
        resolveDir: "/",
      },
      bundle: true,
      packages: "external",
      platform: "node",
      target: "node16",
      format: "cjs",
      external: ["express", "react-dom/server", "react"],
      outfile: outfilePath,
    });
    const module = require(outfilePath);
    return module.router as Router;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
export function getFile(rootPath: string) {
  const importMap: Record<string, string> = {
    DefaultLayout: DEFAULT_LAYOUT_PATH,
  };
  let codeFile = CODE_FILE;
  readDirectory(rootPath, DEFAULT_LAYOUT_PATH);
  return (
    Object.entries(importMap)
      .map(([variableName, filePath]) =>
        path.basename(filePath, ".tsx") === "layout"
          ? `import ${variableName} from '${filePath}';`
          : `import * as ${variableName} from '${filePath}';`
      )
      .join("\n") +
    "\n" +
    codeFile +
    "\n"
  );

  function readDirectory(dirPath: string, layoutPath?: string) {
    const files = fs.readdirSync(dirPath);
    const directories: string[] = [];
    const pages: string[] = [];

    for (const file of files) {
      const absolutePath = path.join(dirPath, file);
      if (file === "layout.tsx") {
        layoutPath = absolutePath;
        importMap[
          getVariableNameFromPath(absolutePath.replace(rootPath, "")) + "Layout"
        ] = layoutPath;
        continue;
      }

      if (!fs.statSync(absolutePath).isDirectory()) {
        if (![".ts", ".tsx"].includes(path.extname(absolutePath))) {
          continue;
        }
        pages.push(absolutePath);
      } else {
        directories.push(absolutePath);
      }
    }

    for (const pagePath of pages) {
      const routePath =
        pagePath
          .replace(rootPath, "")
          .replace(/(\/[^\/]+)(\.tsx)/g, "$1")
          .replace(/\/(index)/, "")
          .replace(/\[(\w+)\]/g, ":$1")
          .replace(/\/$/, "") || "/";
      const variableName = getVariableNameFromPath(routePath) + "Entity";
      importMap[variableName] = pagePath;
      codeFile +=
        "\n" +
        getCodeForBundle({
          entityVariableName: variableName,
          routePath,
          layoutVariableName: Object.keys(importMap).find(
            (key) => importMap[key] === layoutPath
          )!,
        });
    }

    for (const dirPath of directories) {
      readDirectory(dirPath, layoutPath);
    }
  }
}
function getVariableNameFromPath(file: string) {
  const withoutExt = removeExt(file);
  const variableName =
    file?.length && file !== path.sep
      ? (withoutExt || file).replace(/([-:/]+)(\w)/g, (...args) =>
          args[2].toUpperCase()
        )
      : "Index";
  return variableName;
}
function removeExt(p: string) {
  return p.split(".").slice(0, -1).join(".");
}
