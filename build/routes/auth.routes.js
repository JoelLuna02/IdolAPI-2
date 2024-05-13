"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.verify_token = verify_token;
var _express = require("express");
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _dotenv = require("dotenv");
var _bodyParser = require("body-parser");
var _bcryptjs = _interopRequireDefault(require("bcryptjs"));
var _JWT = _interopRequireDefault(require("../models/JWT"));
var _database = _interopRequireDefault(require("../database"));
/* eslint-disable no-unused-vars */

const auth_router = (0, _express.Router)();
(0, _dotenv.config)({
  path: ".env.local",
  override: true
});
const secret = process.env.SECRET_KEY;

/** ## JWT Token
 * This function is responsible for verifying the JWT authorization token and administration privileges.
 * @param {import("express").Request} req - Request
 * @param {import("express").Response} res - Response
 * @param {import("express").NextFunction} next - Next Function
 * @returns {Promise<void>}
 */
function verify_token(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    _jsonwebtoken.default.verify(token, secret, (err, decoded) => {
      if (err) return res.status(401).json(err);
      req.user = decoded;
      const isAdmin = req.user.isAdmin || false;
      if (!isAdmin) {
        return res.status(403).json({
          message: "Forbidden: You need administrative privileges to access this resource"
        });
      }
      next();
    });
  } catch (error) {
    return res.status(401).json({
      Unauthorized: "Token not provided"
    });
  }
}
auth_router.use((0, _bodyParser.json)());
auth_router.post("/signup", async (req, res) => {
  const form = req.body;
  try {
    await (0, _database.default)();
    var salt = _bcryptjs.default.genSaltSync(12);
    const passwd = _bcryptjs.default.hashSync(form.password, salt);
    const new_user = new _JWT.default({
      firstname: form.firstname,
      lastname: form.lastname,
      phone: parseInt(form.phone),
      email: form.email,
      username: form.username,
      password: passwd,
      isAdmin: form.isAdmin || false
    });
    const data = await new_user.save();
    return res.status(201).json({
      new_user: data,
      message: "Successfully created user!"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred in the query."
    });
  }
});
auth_router.post("/login", async (req, res) => {
  const form = req.body;
  try {
    await (0, _database.default)();
    const user = await _JWT.default.findOne({
      username: form.username
    }).select("_id username password email isAdmin");
    if (!user) return res.status(401).json({
      unauthorized: "The username does not exist!"
    });
    const password = _bcryptjs.default.compareSync(form.password, user.password);
    if (!user || !password) {
      res.status(401).json({
        unauthorized: "Incorrect password. please try again."
      });
    }
    const token = _jsonwebtoken.default.sign({
      id: user._id,
      username: user.username,
      isAdmin: user.isAdmin
    }, secret, {
      expiresIn: "1h"
    });
    return res.status(200).json({
      user,
      access_token: token
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred in the query."
    });
  }
});
var _default = exports.default = auth_router;
//# sourceMappingURL=auth.routes.js.map