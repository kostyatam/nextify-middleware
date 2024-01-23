"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileFile = exports.consoleDeepObject = void 0;
const handlebars_1 = __importDefault(require("handlebars"));
const util_1 = __importDefault(require("util"));
const fs_1 = __importDefault(require("fs"));
const consoleDeepObject = (obj) => console.log(util_1.default.inspect(obj, { showHidden: false, depth: null, colors: true }));
exports.consoleDeepObject = consoleDeepObject;
const compileFile = (filePath) => handlebars_1.default.compile(fs_1.default.readFileSync(filePath, "utf8"));
exports.compileFile = compileFile;
//# sourceMappingURL=utils.js.map