import handlebars from "handlebars";
import util from "util";
import fs from "fs";

export const consoleDeepObject = <T>(obj: {}) =>
  console.log(
    util.inspect(obj, { showHidden: false, depth: null, colors: true })
  );

export const compileFile = (filePath: string) =>
  handlebars.compile(fs.readFileSync(filePath, "utf8"));
