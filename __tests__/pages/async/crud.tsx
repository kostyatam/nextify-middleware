import React from "react";
import { PlainComponent } from "../../components/PlainComponent";

export default async () => {
  const result = await Promise.resolve("it's page");
  return <PlainComponent>{result}</PlainComponent>;
};

export const post = async (req: Request) => {
  const result = await Promise.resolve("it's post");
  return <PlainComponent>{result}</PlainComponent>;
};
export const put = async (req: Request) => {
  const result = await Promise.resolve("it's put");
  return <PlainComponent>{result}</PlainComponent>;
};

export const del = async (req: Request) => {
  const result = await Promise.resolve("it's delete");
  return <PlainComponent>{result}</PlainComponent>;
};
