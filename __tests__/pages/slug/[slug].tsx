import { Request } from "express";
import React from "react";

export default ({ req }: { req: Request }) => {
  return <>{req.params.slug}</>;
};
