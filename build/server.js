"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _express2 = require("graphql-http/lib/use/express");
var _server = require("ruru/server");
var _morgan = _interopRequireDefault(require("morgan"));
var _expressHandlebars = require("express-handlebars");
var _marked = require("marked");
var _fs = _interopRequireDefault(require("fs"));
var _schemas = _interopRequireDefault(require("./graphql/schemas"));
var _origins = require("./origins");
var _morgan2 = require("./morgan");
var _i18n = _interopRequireDefault(require("./locales/i18n"));
var _vtuber = _interopRequireDefault(require("./routes/vtuber.routes"));
var _hashtag = _interopRequireDefault(require("./routes/hashtag.routes"));
var _social = _interopRequireDefault(require("./routes/social.routes"));
var _assets = _interopRequireDefault(require("./routes/assets.routes"));
var _cover = _interopRequireDefault(require("./routes/cover.routes"));
var _database = _interopRequireDefault(require("./database"));
var _VTuber = _interopRequireDefault(require("./models/VTuber"));
var _auth = _interopRequireDefault(require("./routes/auth.routes"));
/* eslint-disable no-unused-vars */

const app = (0, _express.default)();
const hbs = (0, _expressHandlebars.create)({
  helpers: {
    equals: function (one, two) {
      return one === two;
    },
    notEquals: function (one, two) {
      return one !== two;
    },
    greaterThan: function (one, two) {
      return one > two;
    },
    lessThan: function (one, two) {
      return one < two;
    }
  }
});

/** @type {Number} The server port */
const port = 3000;

/** @param {string} markdown */
function generateIndex(markdown) {
  const lines = markdown.split("\n");
  const index = [];
  lines.forEach((line, i) => {
    if (line.startsWith("#")) {
      const level = line.match(/^#+/)[0].length;
      const title = line.replace(/^#+/, "").trim();
      const id = title.replace(/\s+/g, "-").toLowerCase();
      index.push({
        level,
        title,
        id
      });
      lines[i] = `${line} <a id="${id}"></a>`;
    }
  });
  return {
    index,
    markdown: lines.join("\n")
  };
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @param {any[]} array
 * @param {number} numb
 * @returns {any[]}
 */
function shuffleArray(array, numb) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = getRandomInt(0, i);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.slice(0, numb);
}

/** ## Server initializer
 * This function is responsible for running the Express.js server. You can configure routes, and middlewares,
 * whether to create a CRUD system, track the routes you visit, configure request bodies, etc.
 * ---
 * This function will display an error message if the server fails to run, or mongoose initialization fails.
 * @returns {Promise<void>} */
async function init_server() {
  app.use(_i18n.default.init);
  app.use((0, _morgan.default)(_morgan2.myCustomformat));
  app.use(_express.default.static("./public"));
  app.engine("handlebars", hbs.engine);
  app.set("view engine", "handlebars");
  app.set("views", "./views");
  (0, _origins.AllowCORS)(app, ["http://localhost:5173", "http://localhost:3000"]);
  app.all("/api/graphql", (0, _express2.createHandler)({
    schema: _schemas.default
  })); // Implement GraphQL handler

  app.use("/api/hashtag", _hashtag.default);
  app.use("/api/social", _social.default);
  app.use("/api/vtuber", _vtuber.default);
  app.use("/api/assets", _assets.default);
  app.use("/api/cover", _cover.default);
  app.use("/api/auth", _auth.default);
  app.get("/gql", (_req, res) => {
    res.type("html");
    res.end((0, _server.ruruHTML)({
      endpoint: "/api/graphql"
    }));
  });
  app.get("/", async (req, res) => {
    const navbar = res.__("navbar");
    const footer = res.__("footer");
    const warning = res.__("warn");
    await (0, _database.default)();
    const vtubers = await _VTuber.default.find().sort({
      unit: 1
    }).exec();
    let length = vtubers.length;
    let random;
    if (length >= 6) {
      random = shuffleArray(vtubers, 6);
    } else {
      random = shuffleArray(vtubers, length);
    }
    return res.render("index", {
      title: res.__("mainTitle"),
      navbar,
      footer,
      warning,
      lang: req.getLocale(),
      vtubers: JSON.parse(JSON.stringify(vtubers)),
      random: JSON.parse(JSON.stringify(random))
    });
  });
  app.get("/docs", (req, res) => {
    const navbar = res.__("navbar");
    const footer = res.__("footer");
    const markd = _fs.default.readFileSync("./views/markdown/documentation.mdx", "utf-8");
    const {
      markdown,
      index
    } = generateIndex(markd);
    const html = (0, _marked.marked)(markdown);
    return res.render("docs", {
      title: res.__("docsTitle"),
      docs: html,
      lang: req.getLocale(),
      headers: index,
      trans: res.__("docs"),
      navbar,
      footer
    });
  });
  app.get("/about", (req, res) => {
    const navbar = res.__("navbar");
    const footer = res.__("footer");
    const lang = req.getLocale();
    const markdown = _fs.default.readFileSync(`./views/markdown/${lang}/about-${lang}.mdx`, "utf-8");
    const html = (0, _marked.marked)(markdown);
    return res.render("about", {
      title: res.__("aboutTitle"),
      docs: html,
      data: res.__("about"),
      lang,
      navbar,
      footer
    });
  });
  app.get("/support", (req, res) => {
    const navbar = res.__("navbar");
    const footer = res.__("footer");
    const lang = req.getLocale();
    const markdown = _fs.default.readFileSync(`./views/markdown/${lang}/support-${lang}.mdx`, "utf-8");
    const html = (0, _marked.marked)(markdown);
    return res.render("support", {
      title: res.__("supportTitle"),
      docs: html,
      data: res.__("support"),
      lang,
      navbar,
      footer
    });
  });
  app.use((req, res, next) => {
    const navbar = res.__("navbar");
    const footer = res.__("footer");
    const not_found = res.__("notFound");
    return res.status(404).render("notfound", {
      title: res.__("notFoundTitle"),
      navbar,
      footer,
      not_found
    });
  });
  app.listen(port, () => {
    console.log(`\n Server listening on http://localhost:${port}\n`);
  });
}
init_server();
process.on("SIGINT", () => {
  console.log(" Server terminated!");
  process.exit(0);
});
var _default = exports.default = app;
//# sourceMappingURL=server.js.map