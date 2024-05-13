"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.vtuber_resolver = void 0;
var _mongoose = require("mongoose");
var _database = _interopRequireDefault(require("../database"));
var _VTuber = _interopRequireDefault(require("../models/VTuber"));
var _Hashtag = _interopRequireDefault(require("../models/Hashtag"));
var _Cover = _interopRequireDefault(require("../models/Cover"));
const vtuber_resolver = exports.vtuber_resolver = {
  Query: {
    async vtuber() {
      await (0, _database.default)();
      const data = await _VTuber.default.find().populate("hashtag").populate("socialNetworks").populate("songs").populate({
        path: "covers",
        model: _Cover.default,
        select: "_id name musicVideo illustration mix",
        populate: {
          path: "original",
          select: "-_id artist album release genre"
        }
      });
      return data;
    },
    getVtuber: async (_, {
      ID
    }) => {
      await (0, _database.default)();
      if (!(0, _mongoose.isValidObjectId)(ID)) {
        throw new Error("Invalid VTuber ID");
      }
      const vtuber = await _VTuber.default.findById(ID).populate("hashtag").populate("socialNetworks").populate("songs").populate({
        path: "covers",
        model: _Cover.default,
        select: "_id name musicVideo illustration mix",
        populate: {
          path: "original",
          select: "-_id artist album release genre"
        }
      });
      if (!vtuber) {
        throw new Error("VTuber Not Found");
      }
      return vtuber;
    }
  },
  Mutation: {
    async addVtuber(_, {
      fullname,
      fanname,
      quote,
      branch,
      unit,
      emoji,
      nicknames,
      youtube,
      status,
      avatar,
      gender,
      likes,
      dislikes,
      age,
      birthday,
      zodiac,
      height
    }) {
      await (0, _database.default)();
      if (process.env.NODE_ENV === "production") {
        throw new Error("Mutation actions are only available in development mode");
      }
      const new_vtuber = new _VTuber.default({
        fullname,
        fanname,
        quote,
        nicknames,
        branch,
        unit,
        emoji,
        youtube,
        status,
        avatar,
        gender,
        likes,
        dislikes,
        age,
        birthday,
        zodiac,
        height
      });
      const vtuber = await new_vtuber.save();
      return vtuber;
    },
    async deleteVtuber(_, {
      ID
    }) {
      await (0, _database.default)();
      if (process.env.NODE_ENV === "production") {
        throw new Error("Mutation actions are only available in development mode");
      }
      if (!(0, _mongoose.isValidObjectId)(ID)) throw new Error("Invalid VTuber ID");
      await _Hashtag.default.findOneAndDelete({
        vtuber: ID
      });
      const deleted = (await _VTuber.default.deleteOne({
        _id: ID
      })).deletedCount;
      if (!deleted) throw new Error("VTuber Not Found");
      return deleted;
    },
    async editVtuber(_, {
      ID,
      fullname,
      fanname,
      quote,
      nicknames,
      branch,
      unit,
      emoji,
      youtube,
      status,
      avatar,
      gender,
      likes,
      dislikes,
      age,
      birthday,
      zodiac,
      height
    }) {
      await (0, _database.default)();
      if (process.env.NODE_ENV === "production") {
        throw new Error("Mutation actions are only available in development mode");
      }
      if (!(0, _mongoose.isValidObjectId)(ID)) throw new Error("Invalid VTuber ID");
      const updated = (await _VTuber.default.updateOne({
        _id: ID
      }, {
        fullname,
        fanname,
        quote,
        nicknames,
        branch,
        unit,
        emoji,
        youtube,
        gender,
        avatar,
        likes,
        dislikes,
        status,
        age,
        birthday,
        zodiac,
        height
      })).modifiedCount;
      if (!updated) throw new Error("VTuber Not Found");
      return updated;
    }
  }
};
//# sourceMappingURL=vtuber.resolver.js.map