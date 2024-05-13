"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _i18n = require("i18n");
/** i18n internationalization library instance */
const i18n = new _i18n.I18n({
  locales: ["en", "es"],
  directory: "./translations",
  defaultLocale: "en",
  fallbacks: {
    // All Languages
    "*": "en",
    // Spanish Codenames
    "es-US": "es",
    "es-AR": "es",
    "es-ES": "es",
    "es-MX": "es",
    "es-CO": "es",
    "es-CL": "es",
    // English Codenames
    "en-US": "en",
    "en-GB": "en",
    "en-AU": "en",
    "en-CA": "en"
  }
});
var _default = exports.default = i18n;
//# sourceMappingURL=i18n.js.map