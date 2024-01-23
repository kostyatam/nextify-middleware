"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRouter = void 0;
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const types_1 = require("./types");
const handler_1 = __importDefault(require("./default/handler"));
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
const utils_1 = require("./utils");
require("handlebars-helpers")({
    handlebars: handlebars_1.default,
});
const defaultLayout = (0, utils_1.compileFile)(path_1.default.join(__dirname, "default/layout.hbs"));
const defaultView = (0, utils_1.compileFile)(path_1.default.join(__dirname, "default/view.hbs"));
function getRouteHandler(route) {
    const view = route.templatePath
        ? (0, utils_1.compileFile)(route.templatePath)
        : defaultView;
    const layout = route.layout ? (0, utils_1.compileFile)(route.layout) : defaultLayout;
    return (req, res) => {
        const defaultData = (0, handler_1.default)(req);
        const handlerData = route.handlerPath
            ? require(route.handlerPath).default(req)
            : {};
        const layoutData = route.layoutHandlerPath
            ? require(route.layoutHandlerPath).default(req)
            : {};
        const data = Object.assign(Object.assign(Object.assign({}, defaultData), layoutData), handlerData);
        const body = view(data);
        if (defaultData.isHtmxRequest) {
            res.send(body);
        }
        else {
            res.send(layout(Object.assign(Object.assign({}, data), { body })));
        }
    };
}
const getRouter = (rootPath) => {
    const files = {};
    const router = (0, express_1.Router)();
    readDirectory(rootPath, files);
    buildRouter(files);
    return router;
    function buildRouter(dirTree) {
        const files = Object.keys(dirTree);
        for (const key of files) {
            if (key === "layout" || key === "layoutHandlerPath") {
                continue;
            }
            const value = dirTree[key];
            value.layout = value.layout || dirTree.layout;
            value.layoutHandlerPath =
                value.layoutHandlerPath || dirTree.layoutHandlerPath;
            if ((0, types_1.isRoute)(value)) {
                router.get(value.routePath, getRouteHandler(value));
            }
            else {
                buildRouter(value);
            }
        }
    }
    function readDirectory(currentPath, files) {
        var _a, _b;
        const entries = fs_1.default.readdirSync(currentPath);
        for (const entry of entries) {
            const entryPath = path_1.default.join(currentPath, entry);
            const relativePath = entryPath.replace(rootPath, "");
            const stat = fs_1.default.statSync(entryPath);
            if (stat.isDirectory()) {
                const dirName = path_1.default.basename(relativePath);
                files[dirName] = files[dirName] || {};
                readDirectory(entryPath, files[dirName]);
                continue;
            }
            const { dir, name, ext, base } = path_1.default.parse(relativePath);
            const routePath = path_1.default.join("/", dir.replace(/\[(\w+)\]/g, ":$1"), name !== "index" ? name.replace(/^\[(\w+)\]$/, ":$1") : "");
            if (base === "layout.hbs") {
                files.layout = entryPath;
                continue;
            }
            if (base === "layout.ts") {
                files.layoutHandlerPath = entryPath;
                continue;
            }
            files[name] = {
                templatePath: ext === ".hbs" ? entryPath : ((_a = files[name]) === null || _a === void 0 ? void 0 : _a.templatePath) || "",
                handlerPath: ext === ".ts" ? entryPath : ((_b = files[name]) === null || _b === void 0 ? void 0 : _b.handlerPath) || "",
                routePath,
            };
        }
    }
};
exports.getRouter = getRouter;
//# sourceMappingURL=index.js.map