import { Request } from "express";
import React from "react";

export default function defaultLayout({
  req,
  children,
}: {
  req?: Request;
  children: JSX.Element[] | JSX.Element;
}) {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <title>Default layout</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
