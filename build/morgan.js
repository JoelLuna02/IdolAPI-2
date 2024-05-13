"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.myCustomformat = void 0;
var _colorette = require("colorette");
var _http = _interopRequireDefault(require("http"));
/**
 * @param {import("morgan").TokenIndexer} tokens
 * @param {import("http").IncomingMessage} req
 * @param {import("http").ServerResponse} res
 */
const myCustomformat = (tokens, req, res) => {
  const status = tokens.status(req, res);
  const statusdesc = _http.default.STATUS_CODES[status] || "Unknown";
  const colorizedStatus = parseInt(status) >= 500 ? `\x1b[31m${status} ${statusdesc}\x1b[0m` : parseInt(status) >= 400 ? `\x1b[33m${status} ${statusdesc}\x1b[0m` : parseInt(status) >= 300 ? `\x1b[36m${status} ${statusdesc}\x1b[0m` : `\x1b[32m${status} ${statusdesc}\x1b[0m`;
  return [`[${(0, _colorette.green)("INFO")}]\t `, (0, _colorette.whiteBright)(`"${tokens.method(req, res)} ${tokens.url(req, res)}"`), "-", (0, _colorette.bold)(colorizedStatus), tokens.res(req, res, "content-length"), "-", `${(0, _colorette.yellowBright)(tokens["response-time"](req, res))}`, "ms"].join(" ");
};
exports.myCustomformat = myCustomformat;
//# sourceMappingURL=morgan.js.map