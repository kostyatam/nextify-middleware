import React from "react";
import { Request, Response } from "express";

interface Props {
  req: Request;
  bar: string;
}

export const getAsyncProps = async (req: Request) => {
  return await Promise.resolve({ bar: "world" });
};

export default function defaultComponent({ req, bar }: Props) {
  return (
    <span>
      {req.query.foo as string} {bar}
    </span>
  );
}

export const post = (req: Request, res: Response) => {
  const { message } = req.body;
  res.json({ message });
};
