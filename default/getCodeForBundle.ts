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
    router.get("${routePath}", async (req, res) => {
      const isHtmxRequest = req?.get("HX-Request") === "true";
      const props = { req };
      const component = await ${componentVariableName}(props);
      if (isHtmxRequest) {
        res.send(renderToStaticMarkup(<${componentVariableName} {...props} />));
      } else {
        res.send(
          renderToStaticMarkup(
            <${layoutVariableName} {...props}>
              {component}
            </${layoutVariableName}>
          )
        );
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
