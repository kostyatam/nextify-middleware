"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function defaultHandler(req) {
    const isHtmxRequest = req.get("HX-Request") === "true";
    return {
        isHtmxRequest,
        url: req.url,
        params: req.params,
    };
}
exports.default = defaultHandler;
//# sourceMappingURL=handler.js.map