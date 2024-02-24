import React from "react";
import { Request } from "express";

type Props = { req: Request & { query: { [index: string]: string } } };
export default function defaultComponent({ req }: Props) {
  return <span>{req.query.foo}</span>;
}
