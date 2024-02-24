import React from "react";
import supertest from "supertest";
import express, { Request } from "express";
import { getRouter } from "nextify-middleware";
import path from "path";
import DefaultLayout from "../default/layout";
import CustomLayout from "./pages/custom-layout/layout";
import ReactDOM from "react-dom/server";

const routerPath = path.join(__dirname, "pages");
const app = express();
const router = getRouter(routerPath);
app.use(router);

describe("Check router", () => {
  it(`use default template`, async () => {
    const request = supertest(app);
    const response = await request.get("/?foo=hi");
    const Component = require("./pages/index").default;
    expect(response.status).toBe(200);
    expect(response.type).toBe("text/html");
    expect(response.text).toBe(
      ReactDOM.renderToStaticMarkup(
        <DefaultLayout>
          <Component req={{ query: { foo: "hi" } }} />
        </DefaultLayout>
      )
    );
  });

  it(`use custom page on top level`, async () => {
    const request = supertest(app);
    const response = await request.get("/custom-template");
    const Component = require("./pages/custom-template").default;
    expect(response.status).toBe(200);
    expect(response.type).toBe("text/html");
    expect(response.text).toBe(
      ReactDOM.renderToStaticMarkup(
        <DefaultLayout>
          <Component />
        </DefaultLayout>
      )
    );
  });

  it(`use custom layout`, async () => {
    const request = supertest(app);
    const response = await request.get("/custom-layout");
    const Component = require("./pages/custom-layout/index").default;
    expect(response.status).toBe(200);
    expect(response.type).toBe("text/html");
    expect(response.text).toBe(
      ReactDOM.renderToStaticMarkup(
        <CustomLayout>
          <Component />
        </CustomLayout>
      )
    );
  });

  it(`use slug`, async () => {
    const request = supertest(app);
    const response = await request.get("/slug/check-slug");
    const Component = require("./pages/slug/[slug]").default;
    expect(response.status).toBe(200);
    expect(response.type).toBe("text/html");
    expect(response.text).toBe(
      ReactDOM.renderToStaticMarkup(
        <DefaultLayout>
          <Component req={{ params: { slug: "check-slug" } }} />
        </DefaultLayout>
      )
    );
  });

  it(`deep custom layout nesting with slugs`, async () => {
    const request = supertest(app);
    const response = await request.get("/custom-layout/deep/deep/deeper");
    const Component =
      require("./pages/custom-layout/deep/[deep]/[deeper]").default;
    expect(response.status).toBe(200);
    expect(response.type).toBe("text/html");
    expect(response.text).toBe(
      ReactDOM.renderToStaticMarkup(
        <CustomLayout>
          <Component req={{ params: { deep: "deep", deeper: "deeper" } }} />
        </CustomLayout>
      )
    );
  });
});
