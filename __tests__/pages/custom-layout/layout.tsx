import { Request } from "express";
import React from "react";

export default function CustomLayout({
  children,
}: {
  req?: Request;
  children: JSX.Element[] | JSX.Element;
}) {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <title>Custom Layout</title>
      </head>
      <body>Custom Layout: {children}</body>
    </html>
  );
}
