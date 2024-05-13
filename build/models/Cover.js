"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = _interopRequireWildcard(require("mongoose"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const CoverSchema = new _mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  musicVideo: {
    type: String,
    trim: true
  },
  illustration: {
    type: String,
    trim: true
  },
  original: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "Original"
  },
  vtuber: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "VTuber"
  },
  mix: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});
const Cover = (0, _mongoose.model)("Cover", CoverSchema) || _mongoose.models.Cover;
var _default = exports.default = Cover;
//# sourceMappingURL=Cover.js.map