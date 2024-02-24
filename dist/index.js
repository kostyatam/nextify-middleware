"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRouter = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const server_1 = __importDefault(require("react-dom/server"));
const layout_1 = __importDefault(require("./default/layout"));
function getRouteHandler(Component, Layout) {
    return (req, res) => {
        const isHtmxRequest = (req === null || req === void 0 ? void 0 : req.get("HX-Request")) === "true";
        if (isHtmxRequest) {
            res.send(server_1.default.renderToStaticMarkup((0, jsx_runtime_1.jsx)(Component, { req: req })));
        }
        else {
            res.send(server_1.default.renderToStaticMarkup((0, jsx_runtime_1.jsx)(Layout, { req: req, children: (0, jsx_runtime_1.jsx)(Component, { req: req }) })));
        }
    };
}
const getRouter = (rootPath) => {
    const router = (0, express_1.Router)();
    readDirectory(rootPath, layout_1.default);
    return router;
    function readDirectory(dirPath, layout) {
        const files = fs_1.default.readdirSync(dirPath);
        const directories = [];
        const pages = [];
        for (const file of files) {
            const absolutePath = path_1.default.join(dirPath, file);
            if (file === "layout.tsx") {
                layout = require(absolutePath).default;
                continue;
            }
            if (!fs_1.default.statSync(absolutePath).isDirectory()) {
                pages.push(absolutePath);
            }
            else {
                directories.push(absolutePath);
            }
        }
        for (const pagePath of pages) {
            const component = require(pagePath).default;
            const handler = getRouteHandler(component, layout);
            const routePath = pagePath
                .replace(rootPath, "")
                .replace(/(\/[^\/]+)(\.tsx)/g, "$1")
                .replace(/\/(index)/, "")
                .replace(/\[(\w+)\]/g, ":$1")
                .replace(/\/$/, "") || "/";
            router.get(routePath, handler);
            console.log(`Route: ${routePath}, Layout: ${layout === null || layout === void 0 ? void 0 : layout.name}`);
        }
        for (const dirPath of directories) {
            readDirectory(dirPath, layout);
        }
    }
};
exports.getRouter = getRouter;
//# sourceMappingURL=index.js.map