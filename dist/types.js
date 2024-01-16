"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDir = exports.isRoute = void 0;
const isRoute = (value) => {
    return value && typeof value === "object" && "handlerPath" in value;
};
exports.isRoute = isRoute;
const isDir = (value) => {
    return value && typeof value === "object" && !("handlerPath" in value);
};
exports.isDir = isDir;
//# sourceMappingURL=types.js.map