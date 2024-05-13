"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _database = _interopRequireDefault(require("../database"));
var _SocialNetwork = _interopRequireDefault(require("../models/SocialNetwork"));
var _mongoose = require("mongoose");
const social_routes = (0, _express.Router)();
social_routes.get("/", async (req, res) => {
  await (0, _database.default)();
  const social_networks = await _SocialNetwork.default.find().select("-__v").populate("vtuber", "-_id fullname branch unit");
  return res.status(200).json(social_networks);
});
social_routes.get("/:snid", async (req, res) => {
  const snid = req.params.snid;
  try {
    await (0, _database.default)();
    if (!(0, _mongoose.isObjectIdOrHexString)(snid)) {
      return res.status(400).json({
        message: "Invalid Social Network ID"
      });
    }
    const social_network = await _SocialNetwork.default.findById(snid).select("-__v -_id").populate("vtuber", "-_id fullname branch unit");
    if (!social_network) return res.status(404).json({
      message: "Social Network not found"
    });
    return res.status(200).json(social_network);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred in the query."
    });
  }
});
var _default = exports.default = social_routes;
//# sourceMappingURL=social.routes.js.map