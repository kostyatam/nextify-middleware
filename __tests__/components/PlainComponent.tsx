import React, { ReactNode } from "react";

export const PlainComponent = ({
  message,
  children,
}: {
  message?: string;
  children?: ReactNode;
}) => {
  return <div>{message || children}</div>;
};
