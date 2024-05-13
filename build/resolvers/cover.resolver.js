"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cover_resolver = void 0;
var _mongoose = require("mongoose");
var _database = _interopRequireDefault(require("../database"));
var _Cover = _interopRequireDefault(require("../models/Cover"));
var _Original = _interopRequireDefault(require("../models/Original"));
var _VTuber = _interopRequireDefault(require("../models/VTuber"));
const cover_resolver = exports.cover_resolver = {
  Query: {
    covers: async () => {
      await (0, _database.default)();
      const data = await _Cover.default.find().populate("original", "-_id artist album release genre");
      return data;
    },
    getCover: async (_, {
      ID
    }) => {
      await (0, _database.default)();
      if (!(0, _mongoose.isValidObjectId)(ID)) throw new Error("Invalid Cover ID");
      const data = await _Cover.default.findById(ID).populate("original", "-_id artist album release genre");
      if (!data) throw new Error("Cover not found");
      return data;
    }
  },
  Mutation: {
    addCover: async (_, {
      name,
      musicVideo,
      illustration,
      mix
    }) => {
      await (0, _database.default)();
      if (process.env.NODE_ENV === "production") {
        throw new Error("Mutation actions are only available in development mode");
      }
      const add_cover = new _Cover.default({
        name,
        musicVideo,
        illustration,
        mix
      });
      const data = await add_cover.save();
      return data;
    },
    addOriginal: async (_, {
      artist,
      album,
      release,
      genre
    }) => {
      await (0, _database.default)();
      if (process.env.NODE_ENV === "production") {
        throw new Error("Mutation actions are only available in development mode");
      }
      const add_original_data = new _Original.default({
        artist,
        album,
        release,
        genre
      });
      const data = await add_original_data.save();
      return data;
    },
    deleteCover: async (_, {
      ID
    }) => {
      await (0, _database.default)();
      if (process.env.NODE_ENV === "production") {
        throw new Error("Mutation actions are only available in development mode");
      }
      if (!(0, _mongoose.isValidObjectId)(ID)) throw new Error("Invalid Hashtag ID");
      await _Original.default.deleteOne({
        cover: ID
      });
      const deleted = (await _Cover.default.deleteOne({
        _id: ID
      })).deletedCount;
      if (!deleted) throw new Error("Cover not found");
      return deleted;
    },
    assignCoverToVTuber: async (_, {
      VTID,
      CVID
    }) => {
      await (0, _database.default)();
      if (process.env.NODE_ENV === "production") {
        throw new Error("Mutation actions are only available in development mode");
      }
      if (!(0, _mongoose.isValidObjectId)(VTID) || !(0, _mongoose.isValidObjectId)(CVID)) {
        throw new Error("Invalid VTuber or Cover ID");
      }
      const vtuber = await _VTuber.default.findById(VTID);
      const cover = await _Cover.default.findById(CVID);
      if (!vtuber || !cover) {
        throw new Error("VTuber or Cover not found");
      }
      vtuber.covers.push(cover._id);
      cover.vtuber = vtuber._id;
      await vtuber.save();
      await cover.save();
      return vtuber;
    },
    assignOriginalDataToCover: async (_, {
      CVID,
      ORID
    }) => {
      await (0, _database.default)();
      if (process.env.NODE_ENV === "production") {
        throw new Error("Mutation actions are only available in development mode");
      }
      if (!(0, _mongoose.isValidObjectId)(ORID) || !(0, _mongoose.isValidObjectId)(CVID)) {
        throw new Error("Invalid Original data instance or Cover ID");
      }
      const original = await _Original.default.findById(ORID);
      const cover = await _Cover.default.findById(CVID);
      if (!original || !cover) throw new Error("Original data instance or Cover not found");
      original.cover = cover._id;
      cover.original = original._id;
      await original.save();
      await cover.save();
      return cover;
    }
  }
};
//# sourceMappingURL=cover.resolver.js.map