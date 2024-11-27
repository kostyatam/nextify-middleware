import DefaultLayout from "/Users/konstantinkostin/work/nextify-middleware/default/layout";
import * as CustomTemplateEntity from "/Users/konstantinkostin/work/nextify-middleware/__tests__/pages/custom-template";
import * as IndexEntity from "/Users/konstantinkostin/work/nextify-middleware/__tests__/pages/index";
import CustomLayoutLayoutLayout from "/Users/konstantinkostin/work/nextify-middleware/__tests__/pages/custom-layout/layout";
import * as CustomLayoutEntity from "/Users/konstantinkostin/work/nextify-middleware/__tests__/pages/custom-layout/index";
import * as CustomLayoutDeepDeepDeeperEntity from "/Users/konstantinkostin/work/nextify-middleware/__tests__/pages/custom-layout/deep/[deep]/[deeper]/index";
import * as SlugSlugEntity from "/Users/konstantinkostin/work/nextify-middleware/__tests__/pages/slug/[slug]";

import { Handler, Request, Router } from "express";
import { renderToStaticMarkup } from "react-dom/server";

interface Entity {
  default: (props: { req: Request }) => JSX.Element;
  get?: Handler;
  post?: Handler;
  put?: Handler;
  delete?: Handler;
}

export const router = Router();

(function <T extends Entity>(module: T) {
  const { default: CustomTemplatePage, post, get, put, delete: del } = module;

  if (CustomTemplatePage) {
    router.get("/custom-template", async (req, res) => {
      const isHtmxRequest = req?.get("HX-Request") === "true";
      const props = { req };
      if (isHtmxRequest) {
        res.send(renderToStaticMarkup(<CustomTemplatePage {...props} />));
      } else {
        res.send(
          renderToStaticMarkup(
            <DefaultLayout {...props}>
              <CustomTemplatePage {...props} />
            </DefaultLayout>
          )
        );
      }
    });
  }

  if (post) {
    router.post("/custom-template", post);
  }

  if (get && !CustomTemplatePage) {
    router.get("/custom-template", get);
  }

  if (put) {
    router.put("/custom-template", put);
  }

  if (del) {
    router.delete("/custom-template", del);
  }
})(CustomTemplateEntity);

(function <T extends Entity>(module: T) {
  const { default: IndexPage, post, get, put, delete: del } = module;

  if (IndexPage) {
    router.get("/", async (req, res) => {
      const isHtmxRequest = req?.get("HX-Request") === "true";
      const props = { req };
      if (isHtmxRequest) {
        res.send(renderToStaticMarkup(<IndexPage {...props} />));
      } else {
        res.send(
          renderToStaticMarkup(
            <DefaultLayout {...props}>
              <IndexPage {...props} />
            </DefaultLayout>
          )
        );
      }
    });
  }

  if (post) {
    router.post("/", post);
  }

  if (get && !IndexPage) {
    router.get("/", get);
  }

  if (put) {
    router.put("/", put);
  }

  if (del) {
    router.delete("/", del);
  }
})(IndexEntity);

(function <T extends Entity>(module: T) {
  const { default: CustomLayoutPage, post, get, put, delete: del } = module;

  if (CustomLayoutPage) {
    router.get("/custom-layout", async (req, res) => {
      const isHtmxRequest = req?.get("HX-Request") === "true";
      const props = { req };
      if (isHtmxRequest) {
        res.send(renderToStaticMarkup(<CustomLayoutPage {...props} />));
      } else {
        res.send(
          renderToStaticMarkup(
            <CustomLayoutLayoutLayout {...props}>
              <CustomLayoutPage {...props} />
            </CustomLayoutLayoutLayout>
          )
        );
      }
    });
  }

  if (post) {
    router.post("/custom-layout", post);
  }

  if (get && !CustomLayoutPage) {
    router.get("/custom-layout", get);
  }

  if (put) {
    router.put("/custom-layout", put);
  }

  if (del) {
    router.delete("/custom-layout", del);
  }
})(CustomLayoutEntity);

(function <T extends Entity>(module: T) {
  const {
    default: CustomLayoutDeepDeepDeeperPage,
    post,
    get,
    put,
    delete: del,
  } = module;

  if (CustomLayoutDeepDeepDeeperPage) {
    router.get("/custom-layout/deep/:deep/:deeper", async (req, res) => {
      const isHtmxRequest = req?.get("HX-Request") === "true";
      const props = { req };
      if (isHtmxRequest) {
        res.send(
          renderToStaticMarkup(<CustomLayoutDeepDeepDeeperPage {...props} />)
        );
      } else {
        res.send(
          renderToStaticMarkup(
            <CustomLayoutLayoutLayout {...props}>
              <CustomLayoutDeepDeepDeeperPage {...props} />
            </CustomLayoutLayoutLayout>
          )
        );
      }
    });
  }

  if (post) {
    router.post("/custom-layout/deep/:deep/:deeper", post);
  }

  if (get && !CustomLayoutDeepDeepDeeperPage) {
    router.get("/custom-layout/deep/:deep/:deeper", get);
  }

  if (put) {
    router.put("/custom-layout/deep/:deep/:deeper", put);
  }

  if (del) {
    router.delete("/custom-layout/deep/:deep/:deeper", del);
  }
})(CustomLayoutDeepDeepDeeperEntity);

(function <T extends Entity>(module: T) {
  const { default: SlugSlugPage, post, get, put, delete: del } = module;

  if (SlugSlugPage) {
    router.get("/slug/:slug", async (req, res) => {
      const isHtmxRequest = req?.get("HX-Request") === "true";
      const props = { req };
      if (isHtmxRequest) {
        res.send(renderToStaticMarkup(<SlugSlugPage {...props} />));
      } else {
        res.send(
          renderToStaticMarkup(
            <DefaultLayout {...props}>
              <SlugSlugPage {...props} />
            </DefaultLayout>
          )
        );
      }
    });
  }

  if (post) {
    router.post("/slug/:slug", post);
  }

  if (get && !SlugSlugPage) {
    router.get("/slug/:slug", get);
  }

  if (put) {
    router.put("/slug/:slug", put);
  }

  if (del) {
    router.delete("/slug/:slug", del);
  }
})(SlugSlugEntity);
