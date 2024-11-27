import { Handler } from "express";

export const getCodeForBundle = ({
  entityVariableName,
  routePath,
  layoutVariableName,
}: {
  entityVariableName: string;
  routePath: string;
  layoutVariableName: string;
}) => {
  const componentVariableName = entityVariableName.replace("Entity", "Page");
  return `
(function <T extends Entity>(module: T)  {
  const {
    default: ${componentVariableName},
    post,
    get,
    put,
    del,
  } = module;

  if (${componentVariableName}) {
    router.get("${routePath}", async (req, res, next) => {
    try {
      const isHtmxRequest = req?.get("HX-Request") === "true";
      const isSameLayout = req.cookies['current-layout'] === "${layoutVariableName}";
      const props = { req };
      const component = await ${componentVariableName}(props);
      req.cookies['current-layout'] = "${layoutVariableName}";
      if (isHtmxRequest && isSameLayout) {
        res.send(renderToStaticMarkup(component));
      } else {
        const page = await ${layoutVariableName}({...props, children: component});
        res.send(
          renderToStaticMarkup(
            page
          )
        );
      }
    } catch (e) {
     next(e)
    }
  });
}

if (post) {
  router.post("${routePath}", evalCrud(post));
}

if (get && !${componentVariableName}) {
  router.get("${routePath}", evalCrud(get));
}

if (put) {
  router.put("${routePath}", evalCrud(put));
}

if (del) {
  router.delete("${routePath}", evalCrud(del));
}
})(${entityVariableName});`;
};
