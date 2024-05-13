"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hashtag_resolver = void 0;
var _database = _interopRequireDefault(require("../database"));
var _mongoose = require("mongoose");
var _Hashtag = _interopRequireDefault(require("../models/Hashtag"));
var _VTuber = _interopRequireDefault(require("../models/VTuber"));
const hashtag_resolver = exports.hashtag_resolver = {
  Query: {
    async hashtag() {
      await (0, _database.default)();
      const data = await _Hashtag.default.find();
      return data;
    },
    async getHashtag(_, {
      ID
    }) {
      await (0, _database.default)();
      if (!(0, _mongoose.isValidObjectId)(ID)) throw new Error("Invalid Hashtag ID");
      const vtuber = await _Hashtag.default.findById(ID);
      if (!vtuber) throw new Error("Hashtag not found!");
      return vtuber;
    }
  },
  Mutation: {
    async addHashtag(_, {
      general,
      stream,
      fanart,
      memes
    }) {
      await (0, _database.default)();
      if (process.env.NODE_ENV === "production") {
        throw new Error("Mutation actions are only available in development mode");
      }
      const new_hashtag = new _Hashtag.default({
        general,
        stream,
        fanart,
        memes
      });
      const hashtag = await new_hashtag.save();
      return hashtag;
    },
    async assignHashtagToVtuber(_, {
      HTID,
      VTID
    }) {
      await (0, _database.default)();
      if (process.env.NODE_ENV === "production") {
        throw new Error("Mutation actions are only available in development mode");
      }
      if (!(0, _mongoose.isValidObjectId)(HTID) || !(0, _mongoose.isValidObjectId)(VTID)) {
        throw new Error("Invalid VTuber or Hashtag ID");
      }
      const vtuber = await _VTuber.default.findById(VTID);
      const hashtag = await _Hashtag.default.findById(HTID);
      if (!vtuber || !hashtag) {
        throw new Error("VTuber or Hashtag not found");
      }
      vtuber.hashtag = hashtag._id;
      hashtag.vtuber = vtuber._id;
      await vtuber.save();
      await hashtag.save();
      return vtuber;
    },
    async deleteHashtag(_, {
      ID
    }) {
      await (0, _database.default)();
      if (process.env.NODE_ENV === "production") {
        throw new Error("Mutation actions are only available in development mode");
      }
      if (!(0, _mongoose.isValidObjectId)(ID)) throw new Error("Invalid Hashtag ID");
      const deleted = (await _Hashtag.default.deleteOne({
        _id: ID
      })).deletedCount;
      return deleted;
    }
  }
};
//# sourceMappingURL=hashtag.resolver.js.map