import { Request } from "express";

export default ({ req }: { req: Request }) => {
  return <>{req.params.slug}</>;
};
