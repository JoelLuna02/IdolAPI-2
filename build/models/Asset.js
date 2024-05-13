"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = require("mongoose");
const FileSchema = new _mongoose.Schema({
  original: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  mimetype: {
    type: String,
    required: true,
    trim: true
  },
  size: {
    type: Number,
    required: true,
    trim: true
  },
  bytes: {
    type: Buffer,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});
const File = (0, _mongoose.model)("File", FileSchema) || _mongoose.models.File;
var _default = exports.default = File;
//# sourceMappingURL=Asset.js.map