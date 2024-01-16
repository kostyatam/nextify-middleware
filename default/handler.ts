import { Request } from "express";

export default function defaultHandler(req: Request) {
  const isHtmxRequest = req.headers["HX-Request"] === "true";
  return {
    isHtmxRequest,
    url: req.url,
    params: req.params,
  };
}
