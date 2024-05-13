"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _multer = _interopRequireDefault(require("multer"));
var _Asset = _interopRequireDefault(require("../models/Asset"));
var _database = _interopRequireDefault(require("../database"));
const assets_routes = (0, _express.Router)();
const store = _multer.default.memoryStorage();
const upload = (0, _multer.default)({
  storage: store
});
assets_routes.get("/", async (req, res) => {
  await (0, _database.default)();
  const files = await _Asset.default.find().select("_id original mimetype updatedAt size");
  return res.status(200).json(files);
});
assets_routes.get("/:file", async (req, res) => {
  const filename = req.params.file;
  try {
    await (0, _database.default)();
    const file = await _Asset.default.findOne({
      original: filename
    });
    if (!file) return res.status(404).json({
      message: "File not found!"
    });
    res.set({
      "Content-Length": file.size,
      "Content-Type": file.mimetype
    });
    return res.end(file.bytes);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred in the query."
    });
  }
});
assets_routes.delete("/:file", async (req, res) => {
  const filename = req.params.file;
  try {
    await (0, _database.default)();
    const file = await _Asset.default.findOneAndDelete({
      original: filename
    });
    if (!file) return res.status(404).json({
      message: "File not found!"
    });
    return res.status(204).json({});
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred in the query."
    });
  }
});
assets_routes.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({
    error: "You must specify the file to upload"
  });
  const new_file = req.file;
  await (0, _database.default)();
  const file = new _Asset.default({
    original: new_file.originalname,
    // Original Name
    mimetype: new_file.mimetype,
    // Mimetype
    size: new_file.size,
    // File size
    bytes: new_file.buffer // file bytes
  });
  await file.save();
  return res.status(200).json({
    message: "Successfully file stored"
  });
});
var _default = exports.default = assets_routes;
//# sourceMappingURL=assets.routes.js.map