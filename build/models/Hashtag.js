"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = _interopRequireWildcard(require("mongoose"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const HashtagSchema = new _mongoose.Schema({
  general: {
    type: String,
    require: true,
    trim: true
  },
  stream: {
    type: String,
    trim: true
  },
  fanart: {
    type: String,
    trim: true
  },
  memes: {
    type: String,
    trim: true
  },
  vtuber: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "VTuber"
  }
}, {
  timestamps: true
});
const Hashtag = (0, _mongoose.model)("Hashtag", HashtagSchema) || _mongoose.models.Hashtag;
var _default = exports.default = Hashtag;
//# sourceMappingURL=Hashtag.js.map