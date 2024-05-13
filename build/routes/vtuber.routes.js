"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _database = _interopRequireDefault(require("../database"));
var _VTuber = _interopRequireDefault(require("../models/VTuber"));
var _mongoose = require("mongoose");
var _Cover = _interopRequireDefault(require("../models/Cover"));
const vtuber_routes = (0, _express.Router)();
vtuber_routes.get("/", async (req, res) => {
  await (0, _database.default)();
  const vtubers = await _VTuber.default.find().select("fullname fanname quote nicknames branch unit emoji avatar youtube status gender likes dislikes age birthday zodiac height").populate("hashtag", "-_id general stream fanart memes").populate("socialNetworks", "_id application accounturl").populate("songs", "_id name album releasedate compositor mixing lyrics").populate({
    path: "covers",
    model: _Cover.default,
    select: "_id name musicVideo illustration mix",
    populate: {
      path: "original",
      select: "-_id artist album release genre"
    }
  });
  return res.status(200).json(vtubers);
});
vtuber_routes.get("/:vtid", async (req, res) => {
  const vtid = req.params.vtid;
  try {
    await (0, _database.default)();
    if (!(0, _mongoose.isObjectIdOrHexString)(vtid)) {
      return res.status(400).json({
        message: "Invalid VTuber ID"
      });
    }
    const vtuber = await _VTuber.default.findById(vtid).select("-_id fullname fanname quote nicknames branch unit emoji avatar youtube status gender likes dislikes age birthday zodiac height").populate("hashtag", "-_id general stream fanart memes").populate("socialNetworks", "_id application accounturl").populate("songs", "_id name album releasedate compositor mixing lyrics").populate({
      path: "covers",
      model: _Cover.default,
      select: "_id name musicVideo illustration mix",
      populate: {
        path: "original",
        select: "-_id artist album release genre"
      }
    });
    if (!vtuber) return res.status(404).json({
      message: "VTuber not found"
    });
    return res.status(200).json(vtuber);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred in the query."
    });
  }
});
var _default = exports.default = vtuber_routes;
//# sourceMappingURL=vtuber.routes.js.map