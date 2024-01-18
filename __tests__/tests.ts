import supertest from "supertest";
import handlebars from "handlebars";
import { readFileSync } from "fs";
import express from "express";
import { getRouter } from "nextify-middleware";
import path from "path";

const routerPath = path.join(__dirname, "pages");
const app = express();
app.use(getRouter(routerPath));
const request = supertest(app);

const defaultPage = readFileSync(
  path.resolve(routerPath, "../../default/view.hbs"),
  "utf8"
);

const defaultLayout = handlebars.compile(
  readFileSync(path.resolve(routerPath, "../../default/layout.hbs"), "utf8")
);

const customLayout = handlebars.compile(
  readFileSync(path.resolve(routerPath, "custom-layout/layout.hbs"), "utf8")
);

require("handlebars-helpers")({
  handlebars: handlebars,
});

describe("Check router", () => {
  it(`use default template`, async () => {
    const response = await request.get("/");
    expect(response.status).toBe(200);
    expect(response.type).toBe("text/html");
    expect(response.text).toBe(defaultLayout({ body: defaultPage }));
  });

  it(`use custom template`, async () => {
    const response = await request.get("/custom-template");
    const page = readFileSync(
      path.resolve(routerPath, "custom-template.hbs"),
      "utf8"
    );
    expect(response.status).toBe(200);
    expect(response.type).toBe("text/html");
    expect(response.text).toBe(defaultLayout({ body: page }));
  });

  it(`use custom layout`, async () => {
    const response = await request.get("/custom-layout");
    const page = readFileSync(
      path.resolve(routerPath, "custom-layout/index.hbs"),
      "utf8"
    );

    expect(response.status).toBe(200);
    expect(response.type).toBe("text/html");
    expect(response.text).toBe(customLayout({ body: page }));
  });

  it(`use custom layout, handler and template`, async () => {
    const response = await request.get("/custom-layout/handler-and-template");
    const page = readFileSync(
      path.resolve(routerPath, "custom-layout/handler-and-template/index.hbs"),
      "utf8"
    );

    expect(response.status).toBe(200);
    expect(response.type).toBe("text/html");
    expect(response.text).toBe(
      customLayout({
        body: handlebars.compile(page)({
          message: "Hello, World!",
        }),
      })
    );
  });

  it(`use slug`, async () => {
    const response = await request.get("/slug/random-slug");
    const page = readFileSync(
      path.resolve(routerPath, "slug/[slug].hbs"),
      "utf8"
    );

    expect(response.status).toBe(200);
    expect(response.type).toBe("text/html");
    expect(response.text).toBe(
      defaultLayout({
        body: handlebars.compile(page)({
          params: { slug: "random-slug" },
        }),
      })
    );
  });

  it(`deep layout nesting`, async () => {
    const response = await request.get("/custom-layout/deep/deep/deep");
    const page = readFileSync(
      path.resolve(routerPath, "custom-layout/deep/deep/deep/index.hbs"),
      "utf8"
    );

    expect(response.status).toBe(200);
    expect(response.type).toBe("text/html");
    expect(response.text).toBe(
      customLayout({
        body: handlebars.compile(page)({
          message: "Hello, World!",
        }),
      })
    );
  });

  it(`handlebars helpers work`, async () => {
    const year = new Date().getFullYear().toString();
    const response = await request.get("/helpers/" + year);

    expect(response.text.trim()).toBe(
      defaultLayout({
        body: year,
      })
    );
  });
});
