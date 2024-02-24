"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
function defaultLayout({ req, children, }) {
    return ((0, jsx_runtime_1.jsxs)("html", { children: [(0, jsx_runtime_1.jsxs)("head", { children: [(0, jsx_runtime_1.jsx)("meta", { charSet: "UTF-8" }), (0, jsx_runtime_1.jsx)("title", { children: "Default layout" })] }), (0, jsx_runtime_1.jsx)("body", { children: children })] }));
}
exports.default = defaultLayout;
//# sourceMappingURL=layout.js.map