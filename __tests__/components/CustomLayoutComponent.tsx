import React from "react";

export const CustomLayoutComponent = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <html>
    <head>
      <meta charSet="UTF-8" />
      <title>Custom Layout</title>
    </head>
    <body>Custom Layout: {children}</body>
  </html>
);
