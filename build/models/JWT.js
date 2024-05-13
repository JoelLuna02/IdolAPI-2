"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = require("mongoose");
const JWT_User_Schema = new _mongoose.Schema({
  firstname: {
    type: String,
    require: true,
    trim: true
  },
  lastname: {
    type: String,
    require: true,
    trim: true
  },
  phone: {
    type: Number,
    require: true,
    trim: true
  },
  email: {
    type: String,
    require: true,
    trim: true
  },
  username: {
    type: String,
    require: true,
    trim: true
  },
  password: {
    type: String,
    require: true,
    trim: true
  },
  isAdmin: {
    type: String,
    require: true,
    trim: true
  }
}, {
  timestamps: false
});
const JWT_Auth = _mongoose.models.JWT_Auth || (0, _mongoose.model)("JWT_Auth", JWT_User_Schema);
var _default = exports.default = JWT_Auth;
//# sourceMappingURL=JWT.js.map