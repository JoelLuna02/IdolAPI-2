"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = _interopRequireWildcard(require("mongoose"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const VTuberSchema = new _mongoose.Schema({
  fullname: {
    type: String,
    require: true,
    trim: true,
    unique: true
  },
  fanname: {
    type: String,
    require: true,
    trim: true,
    unique: true
  },
  quote: {
    type: String,
    trim: true
  },
  nicknames: {
    type: [String],
    trim: true
  },
  branch: {
    type: String,
    default: "EN",
    trim: true
  },
  unit: {
    type: String,
    require: true,
    trim: true
  },
  hashtag: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "Hashtag"
  },
  emoji: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    unique: true,
    trim: true
  },
  covers: [{
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "Cover"
  }],
  status: {
    type: String,
    enum: ["ACTIVE", "GRADUATED", "HIATUS", "UNKNOWN"],
    default: "ACTIVE"
  },
  youtube: {
    type: String,
    trim: true,
    unique: true
  },
  gender: {
    type: String,
    trim: true,
    default: "Female"
  },
  likes: {
    type: [String],
    trim: true
  },
  dislikes: {
    type: [String],
    trim: true
  },
  age: {
    type: Number,
    trim: true,
    required: true
  },
  birthday: {
    type: String,
    trim: true
  },
  zodiac: {
    type: String,
    trim: true
  },
  height: {
    type: Number,
    trim: true,
    default: 1.65
  },
  socialNetworks: [{
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "SocialNetwork"
  }],
  songs: [{
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "Song"
  }]
}, {
  timestamps: true
});
const VTuber = (0, _mongoose.model)("VTuber", VTuberSchema) || _mongoose.models.VTuber;
var _default = exports.default = VTuber;
//# sourceMappingURL=VTuber.js.map