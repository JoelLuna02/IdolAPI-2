"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _fs = _interopRequireDefault(require("fs"));
var _vtuber = require("../resolvers/vtuber.resolver");
var _hashtag = require("../resolvers/hashtag.resolver");
var _social = require("../resolvers/social.resolver");
var _schema = require("@graphql-tools/schema");
var _song = require("../resolvers/song.resolver");
var _cover = require("../resolvers/cover.resolver");
const typeDefs = _fs.default.readFileSync("./schemas.gql", "utf-8");
const schema = (0, _schema.makeExecutableSchema)({
  typeDefs,
  resolvers: [_vtuber.vtuber_resolver, _hashtag.hashtag_resolver, _social.social_resolver, _song.song_resolver, _cover.cover_resolver]
});
var _default = exports.default = schema;
//# sourceMappingURL=schemas.js.map