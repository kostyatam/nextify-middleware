export default ({ req }: { req: { params: { [index: string]: string } } }) => {
  return req.params.slug;
};
