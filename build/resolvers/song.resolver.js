"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.song_resolver = void 0;
var _mongoose = require("mongoose");
var _database = _interopRequireDefault(require("../database"));
var _VTuber = _interopRequireDefault(require("../models/VTuber"));
var _Song = _interopRequireDefault(require("../models/Song"));
const song_resolver = exports.song_resolver = {
  Query: {
    async songs() {
      await (0, _database.default)();
      const songs = await _Song.default.find();
      return songs;
    },
    async getSong(_, {
      ID
    }) {
      await (0, _database.default)();
      if (!(0, _mongoose.isValidObjectId)(ID)) throw new Error("Invalid Song ID");
      const song = await _Song.default.findById(ID);
      if (!song) throw new Error("Song not found!");
      return song;
    }
  },
  Mutation: {
    async addSong(_, {
      name,
      album,
      releasedate,
      compositor,
      mixing,
      lyrics
    }) {
      await (0, _database.default)();
      if (process.env.NODE_ENV === "production") {
        throw new Error("Mutation actions are only available in development mode");
      }
      const new_song = new _Song.default({
        name,
        album,
        releasedate,
        compositor,
        mixing,
        lyrics
      });
      const song = await new_song.save();
      return song;
    },
    async deleteSong(_, {
      ID
    }) {
      await (0, _database.default)();
      if (process.env.NODE_ENV === "production") {
        throw new Error("Mutation actions are only available in development mode");
      }
      if (!(0, _mongoose.isValidObjectId)(ID)) throw new Error("Invalid Song ID");
      const song = (await _Song.default.deleteOne({
        _id: ID
      })).deletedCount;
      return song;
    },
    async assignSongToVtuber(_, {
      SNGID,
      VTID
    }) {
      if (process.env.NODE_ENV === "production") {
        throw new Error("Mutation actions are only available in development mode");
      }
      await (0, _database.default)();
      if (!(0, _mongoose.isValidObjectId)(VTID) || !(0, _mongoose.isValidObjectId)(SNGID)) {
        throw new Error("Invalid VTuber or Song ID");
      }
      const vtuber = await _VTuber.default.findById(VTID);
      const song = await _Song.default.findById(SNGID);
      if (!vtuber || !song) {
        throw new Error("VTuber or Song not found");
      }
      vtuber.songs.push(song._id);
      song.vtuber = vtuber._id;
      await vtuber.save();
      await song.save();
      return vtuber;
    }
  }
};
//# sourceMappingURL=song.resolver.js.map