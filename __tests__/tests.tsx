import React from "react";
import supertest from "supertest";
import express, { Request, Router } from "express";
import { getRouter } from "nextify-middleware";
import path from "path";
import DefaultLayout from "../default/layout";
import { CustomLayoutComponent as CustomLayout } from "./components/CustomLayoutComponent";
import ReactDOM from "react-dom/server";
import { PlainComponent } from "./components/PlainComponent";

const routerPath = path.join(__dirname, "pages");
const app = express();
app.use(express.json());

test(`use default template`, async () => {
  const router = await getRouter(routerPath);
  app.use(router);
  const request = supertest(app);
  const response = await request.get("/?foo=hello");
  const Component = require("./pages/index").default;
  expect(response.status).toBe(200);
  expect(response.type).toBe("text/html");
  expect(response.text).toBe(
    ReactDOM.renderToStaticMarkup(
      <DefaultLayout>
        <Component req={{ query: { foo: "hello" } }} />
      </DefaultLayout>
    )
  );
});

test(`use custom page on top level`, async () => {
  const router = await getRouter(routerPath);
  app.use(router);
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

test(`use custom layout`, async () => {
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

test(`use slug`, async () => {
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

test(`deep custom layout nesting with slugs`, async () => {
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

test(`use async page`, async () => {
  const request = supertest(app);
  const response = await request.get("/async/crud");
  expect(response.status).toBe(200);
  expect(response.type).toBe("text/html");
  expect(response.text).toBe(
    ReactDOM.renderToStaticMarkup(
      <DefaultLayout>
        <PlainComponent>it's page</PlainComponent>
      </DefaultLayout>
    )
  );
});

test(`use sync post method with jsx`, async () => {
  const request = supertest(app);
  const body = { message: "Hello, world!" };
  const response = await request.post("/").send(body);
  expect(response.status).toBe(200);
  expect(response.type).toBe("text/html");
  expect(response.text).toBe(
    ReactDOM.renderToStaticMarkup(
      <PlainComponent>{body.message}</PlainComponent>
    )
  );
});

test(`use async post with jsx`, async () => {
  const request = supertest(app);
  const body = {};
  const response = await request.post("/async/crud").send(body);

  expect(response.status).toBe(200);
  expect(response.type).toBe("text/html");
  expect(response.text).toBe(
    ReactDOM.renderToStaticMarkup(<PlainComponent>it's post</PlainComponent>)
  );
});

test(`use async put with jsx`, async () => {
  const request = supertest(app);
  const body = {};
  const response = await request.put("/async/crud").send(body);

  expect(response.status).toBe(200);
  expect(response.type).toBe("text/html");
  expect(response.type).toBe("text/html");
  expect(response.text).toBe(
    ReactDOM.renderToStaticMarkup(<PlainComponent>it's put</PlainComponent>)
  );
});

test(`use async delete with jsx`, async () => {
  const request = supertest(app);
  const response = await request.delete("/async/crud");
  expect(response.status).toBe(200);
  expect(response.type).toBe("text/html");
  expect(response.text).toBe(
    ReactDOM.renderToStaticMarkup(<PlainComponent>it's delete</PlainComponent>)
  );
});
