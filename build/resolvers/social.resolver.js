"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.social_resolver = void 0;
var _database = _interopRequireDefault(require("../database"));
var _SocialNetwork = _interopRequireDefault(require("../models/SocialNetwork"));
var _VTuber = _interopRequireDefault(require("../models/VTuber"));
var _mongoose = require("mongoose");
const social_resolver = exports.social_resolver = {
  Query: {
    async socials() {
      await (0, _database.default)();
      const data = await _SocialNetwork.default.find();
      return data;
    },
    async getSocial(_, {
      ID
    }) {
      await (0, _database.default)();
      if (!(0, _mongoose.isValidObjectId)(ID)) throw new Error("Invalid Social Network ID");
      const data = await _SocialNetwork.default.findById(ID);
      if (!data) throw new Error("Social network not found!");
      return data;
    }
  },
  Mutation: {
    async addSocialNetwork(_, {
      application,
      accounturl
    }) {
      await (0, _database.default)();
      if (process.env.NODE_ENV === "production") {
        throw new Error("Mutation actions are only available in development mode");
      }
      const new_social = new _SocialNetwork.default({
        application,
        accounturl
      });
      const data = await new_social.save();
      return data;
    },
    async assignSocialNetworkToVtuber(_, {
      SNID,
      VTID
    }) {
      await (0, _database.default)();
      if (process.env.NODE_ENV === "production") {
        throw new Error("Mutation actions are only available in development mode");
      }
      if (!(0, _mongoose.isValidObjectId)(SNID) || !(0, _mongoose.isValidObjectId)(VTID)) {
        throw new Error("Invalid Social Network or VTuber ID");
      }
      const vtuber = await _VTuber.default.findById(VTID);
      const social = await _SocialNetwork.default.findById(SNID);
      if (!vtuber || !social) {
        throw new Error("VTuber or Social Network not found");
      }
      vtuber.socialNetworks.push(social._id);
      social.vtuber = vtuber._id;
      await vtuber.save();
      await social.save();
      return vtuber;
    },
    async deleteSocialNetwork(_, {
      ID
    }) {
      await (0, _database.default)();
      if (process.env.NODE_ENV === "production") {
        throw new Error("Mutation actions are only available in development mode");
      }
      if (!(0, _mongoose.isValidObjectId)(ID)) throw new Error("Invalid Social Network ID");
      const deleted = (await _SocialNetwork.default.deleteOne({
        _id: ID
      })).deletedCount;
      if (!deleted) throw new Error("Social network not found!");
      return deleted;
    }
  }
};
//# sourceMappingURL=social.resolver.js.map