import { Request } from "express";
import React from "react";

export default function DefaultLayout({
  req,
  children,
}: {
  req?: Request;
  children: React.ReactNode;
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
