"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
function getRouteHandler(Component, Layout, getAsyncProps) {
    return (req, res) => __awaiter(this, void 0, void 0, function* () {
        const isHtmxRequest = (req === null || req === void 0 ? void 0 : req.get("HX-Request")) === "true";
        const asyncProps = getAsyncProps ? yield getAsyncProps(req) : {};
        const props = Object.assign({ req }, asyncProps);
        if (isHtmxRequest) {
            res.send(server_1.default.renderToStaticMarkup((0, jsx_runtime_1.jsx)(Component, Object.assign({}, props))));
        }
        else {
            res.send(server_1.default.renderToStaticMarkup((0, jsx_runtime_1.jsx)(Layout, Object.assign({}, props, { children: (0, jsx_runtime_1.jsx)(Component, Object.assign({}, props)) }))));
        }
    });
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
            const routePath = pagePath
                .replace(rootPath, "")
                .replace(/(\/[^\/]+)(\.tsx)/g, "$1")
                .replace(/\/(index)/, "")
                .replace(/\[(\w+)\]/g, ":$1")
                .replace(/\/$/, "") || "/";
            const { default: component, getAsyncProps, post, get, put, delete: del, } = require(pagePath);
            if (component) {
                const handler = getRouteHandler(component, layout, getAsyncProps);
                router.get(routePath, handler);
            }
            if (post) {
                router.post(routePath, post);
            }
            if (get && !component) {
                router.get(routePath, get);
            }
            if (put) {
                router.put(routePath, put);
            }
            if (del) {
                router.delete(routePath, del);
            }
        }
        for (const dirPath of directories) {
            readDirectory(dirPath, layout);
        }
    }
};
exports.getRouter = getRouter;
//# sourceMappingURL=index.js.map