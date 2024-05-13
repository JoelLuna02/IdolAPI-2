"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _Cover = _interopRequireDefault(require("../models/Cover"));
var _database = _interopRequireDefault(require("../database"));
var _mongoose = require("mongoose");
const cover_routes = (0, _express.Router)();
cover_routes.get("/", async (req, res) => {
  await (0, _database.default)();
  const covers = await _Cover.default.find().populate("original", "-_id artist album release genre").populate("vtuber", "fanname branch unit");
  return res.status(200).json(covers);
});
cover_routes.get("/:cover_id", async (req, res) => {
  const id = req.params.cover_id;
  try {
    await (0, _database.default)();
    if (!(0, _mongoose.isValidObjectId)(id)) {
      return res.status(400).json({
        message: "Invalid Cover ID"
      });
    }
    const covers = await _Cover.default.findById(id).populate("original", "-_id artist album release genre").populate("vtuber", "fanname branch unit");
    if (!covers) {
      return res.status(404).json({
        message: "Cover not Found"
      });
    }
    return res.status(200).json(covers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred in the query."
    });
  }
});
var _default = exports.default = cover_routes;
//# sourceMappingURL=cover.routes.js.map