"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = _interopRequireWildcard(require("mongoose"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const SongSchema = new _mongoose.Schema({
  name: {
    type: String,
    unique: true,
    require: true,
    trim: true
  },
  album: {
    type: String,
    require: true,
    trim: true
  },
  releasedate: {
    type: String,
    require: true,
    trim: true
  },
  compositor: {
    type: String,
    require: true,
    trim: true
  },
  mixing: {
    type: String,
    trim: true
  },
  lyrics: {
    type: String,
    trim: true
  },
  vtuber: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "VTuber"
  }
}, {
  timestamps: false
});
const Song = _mongoose.models.Song || (0, _mongoose.model)("Song", SongSchema);
var _default = exports.default = Song;
//# sourceMappingURL=Song.js.map