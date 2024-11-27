import React from "react";
import { Handler, Request, Response } from "express";
import { PlainComponent } from "../components/PlainComponent";

interface Props {
  req: Request;
}

export default function defaultComponent({ req }: Props) {
  return <span>{req.query.foo as string}</span>;
}

export const post = (req: Request, res: Response) => {
  const { message } = req.body;
  return <PlainComponent message={message} />;
};
