import supertest from "supertest";
import handlebars from "handlebars";
import express from "express";
import { getRouter } from "nextify-middleware";
import path from "path";
import { compileFile } from "../utils";

const routerPath = path.join(__dirname, "pages");
const app = express();
app.use(getRouter(routerPath));
const request = supertest(app);

const defaultPage = compileFile(
  path.resolve(routerPath, "../../default/view.hbs")
);

const defaultLayout = compileFile(
  path.resolve(routerPath, "../../default/layout.hbs")
);

const customLayout = compileFile(
  path.resolve(routerPath, "custom-layout/layout.hbs")
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
    const page = compileFile(path.resolve(routerPath, "custom-template.hbs"));
    expect(response.status).toBe(200);
    expect(response.type).toBe("text/html");
    expect(response.text).toBe(defaultLayout({ body: page }));
  });

  it(`use custom layout`, async () => {
    const pageTitle = "Custom Layout";
    const response = await request.get("/custom-layout");
    const page = compileFile(
      path.resolve(routerPath, "custom-layout/index.hbs")
    );

    expect(response.status).toBe(200);
    expect(response.type).toBe("text/html");
    expect(response.text).toBe(customLayout({ pageTitle, body: page }));
  });

  it(`use custom layout, handler and template`, async () => {
    const pageTitle = "Custom Layout";
    const response = await request.get("/custom-layout/handler-and-template");
    const page = compileFile(
      path.resolve(routerPath, "custom-layout/handler-and-template/index.hbs")
    );

    expect(response.status).toBe(200);
    expect(response.type).toBe("text/html");
    expect(response.text).toBe(
      customLayout({
        pageTitle,
        body: page({
          message: "Hello, World!",
        }),
      })
    );
  });

  it(`use slug`, async () => {
    const response = await request.get("/slug/random-slug");
    const page = compileFile(path.resolve(routerPath, "slug/[slug].hbs"));

    expect(response.status).toBe(200);
    expect(response.type).toBe("text/html");
    expect(response.text).toBe(
      defaultLayout({
        body: page({
          params: { slug: "random-slug" },
        }),
      })
    );
  });

  it(`deep layout nesting with slugs`, async () => {
    const pageTitle = "Custom Layout";
    const response = await request.get("/custom-layout/deep/deep/deeper");
    const page = compileFile(
      path.resolve(routerPath, "custom-layout/deep/[deep]/[deeper]/index.hbs")
    );

    expect(response.status).toBe(200);
    expect(response.type).toBe("text/html");
    expect(response.text).toBe(
      customLayout({
        pageTitle,
        body: page({
          params: { deep: "deep", deeper: "deeper" },
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

  it(`check htmx request`, async () => {
    const year = new Date().getFullYear().toString();
    const response = await supertest(app)
      .get("/helpers/" + year)
      .set("HX-Request", "true");

    expect(response.text.trim()).toBe(year);
  });
});
