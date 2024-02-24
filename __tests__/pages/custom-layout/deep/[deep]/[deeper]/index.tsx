import React from "react";

export default ({
  req: { params },
}: {
  req: { params: { [index: string]: string } };
}) => (
  <>
    {params.deep} {params.deeper}
  </>
);
