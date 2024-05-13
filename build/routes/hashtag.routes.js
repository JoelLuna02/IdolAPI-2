"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _mongoose = require("mongoose");
var _Hashtag = _interopRequireDefault(require("../models/Hashtag"));
var _database = _interopRequireDefault(require("../database"));
const hashtag_routes = (0, _express.Router)();
hashtag_routes.get("/", async (req, res) => {
  await (0, _database.default)();
  const hashtags = await _Hashtag.default.find().select("-__v -vtuber");
  return res.status(200).json(hashtags);
});
hashtag_routes.get("/:htid", async (req, res) => {
  const htid = req.params.htid;
  try {
    await (0, _database.default)();
    if (!(0, _mongoose.isObjectIdOrHexString)(htid)) {
      return res.status(400).json({
        message: "Invalid Hashtag ID"
      });
    }
    const vtuber = await _Hashtag.default.findById(htid).select("-_id -__v").populate("vtuber", "-_id fullname fanname branch unit");
    if (!vtuber) return res.status(404).json({
      message: "Hashtag not found"
    });
    return res.status(200).json(vtuber);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred in the query."
    });
  }
});
var _default = exports.default = hashtag_routes;
//# sourceMappingURL=hashtag.routes.js.map