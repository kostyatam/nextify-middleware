import React from "react";
import { RequestHandler, Router, Request } from "express";
import path from "path";
import fs from "fs";
import ReactDOM from "react-dom/server";
import DefaultLayout from "./default/layout";

interface RouteComponentProps {
  req: Request;
}

interface RouteLayoutProps extends RouteComponentProps {
  children: JSX.Element[] | JSX.Element;
}

type RouteComponent = (props: RouteComponentProps) => JSX.Element;
type RouteLayout = (props: RouteLayoutProps) => JSX.Element;

function getRouteHandler(
  Component: RouteComponent,
  Layout: RouteLayout,
  getAsyncProps?: (req: Request) => Promise<Record<string, unknown>> | undefined
): RequestHandler {
  return async (req, res) => {
    const isHtmxRequest = req?.get("HX-Request") === "true";
    const asyncProps = getAsyncProps ? await getAsyncProps(req) : {};
    const props = { req, ...asyncProps };
    if (isHtmxRequest) {
      res.send(ReactDOM.renderToStaticMarkup(<Component {...props} />));
    } else {
      res.send(
        ReactDOM.renderToStaticMarkup(
          <Layout {...props}>
            <Component {...props} />
          </Layout>
        )
      );
    }
  };
}

export const getRouter = (rootPath: string) => {
  const router = Router();
  readDirectory(rootPath, DefaultLayout);

  return router;

  function readDirectory(dirPath: string, layout?: RouteLayout) {
    const files = fs.readdirSync(dirPath);
    const directories: string[] = [];
    const pages: string[] = [];

    for (const file of files) {
      const absolutePath = path.join(dirPath, file);
      if (file === "layout.tsx") {
        layout = require(absolutePath).default;
        continue;
      }

      if (!fs.statSync(absolutePath).isDirectory()) {
        pages.push(absolutePath);
      } else {
        directories.push(absolutePath);
      }
    }

    for (const pagePath of pages) {
      const component = require(pagePath).default;
      const getAsyncProps = require(pagePath).getAsyncProps;
      const handler = getRouteHandler(component, layout, getAsyncProps);
      const routePath =
        pagePath
          .replace(rootPath, "")
          .replace(/(\/[^\/]+)(\.tsx)/g, "$1")
          .replace(/\/(index)/, "")
          .replace(/\[(\w+)\]/g, ":$1")
          .replace(/\/$/, "") || "/";
      router.get(routePath, handler);
    }

    for (const dirPath of directories) {
      readDirectory(dirPath, layout);
    }
  }
};
