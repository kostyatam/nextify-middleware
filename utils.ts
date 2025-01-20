import util from "util";

export const consoleDeepObject = <T>(obj: {}) =>
  console.log(
    util.inspect(obj, { showHidden: false, depth: null, colors: true })
  );
