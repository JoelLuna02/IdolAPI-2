"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AllowCORS = AllowCORS;
var _cors = _interopRequireDefault(require("cors"));
/**
 * This feature allows CORS policies to be applied to certain web domains.
 * @param {import("express").Express} app Express application instance
 * @param {string[]} origins List of allowed websites
 * @returns {Promise<void>}
 */
function AllowCORS(app, origins) {
  app.use((0, _cors.default)({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (origins.indexOf(origin) === -1) {
        let msg = `Access to the Origin: ${origin}, is not permitted on this site.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    }
  }));
}
//# sourceMappingURL=origins.js.map