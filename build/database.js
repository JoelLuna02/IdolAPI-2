"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var _dotenv = require("dotenv");
(0, _dotenv.config)({
  path: ".env.local",
  override: true
});
const dburl = process.env.MONGODB_URI;
const db_name = process.env.MONGODB_NAME;
const options = process.env.MONGODB_OPTIONS;
async function connectDB() {
  if (dburl === undefined) {
    throw new Error("No mongodb database url specified");
  } else if (db_name === undefined) {
    throw new Error("No database name specified");
  }
  await _mongoose.default.connect(`${dburl}/${db_name}${options}`).catch(err => {
    throw err;
  });
}
var _default = exports.default = connectDB;
//# sourceMappingURL=database.js.map