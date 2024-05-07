/* eslint-disable no-unused-vars */
import express from "express";
import { createHandler } from "graphql-http/lib/use/express";
import { ruruHTML } from "ruru/server";
import morgan from "morgan";
import { create } from "express-handlebars";
import { marked } from "marked";
import fs from "fs";

import schema from "./graphql/schemas";
import { AllowCORS } from "./origins";
import { myCustomformat } from "./morgan";
import i18n from "./locales/i18n";
import vtuber_routes from "./routes/vtuber.routes";
import hashtag_routes from "./routes/hashtag.routes";
import social_routes from "./routes/social.routes";
import assets_routes from "./routes/assets.routes";
import connectDB from "./database";
import VTuber from "./models/VTuber";
import auth_router from "./routes/auth.routes";

const app = express();
const hbs = create({
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
		},
	},
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
			index.push({ level, title, id });
			lines[i] = `${line} <a id="${id}"></a>`;
		}
	});
	return { index, markdown: lines.join("\n") };
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
	app.use(i18n.init);
	app.use(morgan(myCustomformat));
	app.use(express.static("./public"));
	app.engine("handlebars", hbs.engine);
	app.set("view engine", "handlebars");
	app.set("views", "./views");

	AllowCORS(app, ["http://localhost:5173", "http://localhost:3000"]);

	app.all("/api/graphql", createHandler({ schema })); // Implement GraphQL handler

	app.use("/api/hashtag", hashtag_routes);
	app.use("/api/social", social_routes);
	app.use("/api/vtuber", vtuber_routes);
	app.use("/api/assets", assets_routes);
	app.use("/api/auth", auth_router);

	app.get("/gql", (_req, res) => {
		res.type("html");
		res.end(
			ruruHTML({
				endpoint: "/api/graphql",
			}),
		);
	});

	app.get("/api/change-language", (req, res) => {
		const { lang } = req.query;
		if (lang) {
			res.cookie("lang", lang, { maxAge: 900000, httpOnly: true });
		}
		res.redirect(req.headers.referer || "/");
	});

	app.get("/", async (req, res) => {
		const navbar = res.__("navbar");
		const footer = res.__("footer");
		const warning = res.__("warn");
		await connectDB();
		const vtubers = await VTuber.find();
		const random = shuffleArray(vtubers, 6);
		return res.render("index", {
			title: res.__("mainTitle"),
			navbar,
			footer,
			warning,
			lang: req.getLocale(),
			vtubers: JSON.parse(JSON.stringify(vtubers)),
			random: JSON.parse(JSON.stringify(random)),
		});
	});

	app.get("/docs", (_req, res) => {
		const navbar = res.__("navbar");
		const footer = res.__("footer");
		const markd = fs.readFileSync("./views/markdown/documentation.mdx", "utf-8");
		const { markdown, index } = generateIndex(markd);
		const html = marked(markdown);
		return res.render("docs", {
			title: res.__("docsTitle"),
			docs: html,
			headers: index,
			navbar,
			footer,
		});
	});

	app.get("/about", (req, res) => {
		const navbar = res.__("navbar");
		const footer = res.__("footer");
		const markdown = fs.readFileSync("./views/markdown/about.mdx", "utf-8");
		const html = marked(markdown);
		return res.render("about", {
			title: res.__("aboutTitle"),
			docs: html,
			navbar,
			footer,
		});
	});
	app.get("/support", (_req, res) => {
		const navbar = res.__("navbar");
		const footer = res.__("footer");
		const markdown = fs.readFileSync("./views/markdown/support.mdx", "utf-8");
		const html = marked(markdown);
		return res.render("support", { title: res.__("supportTitle"), docs: html, navbar, footer });
	});

	app.use((req, res, next) => {
		const navbar = res.__("navbar");
		const footer = res.__("footer");
		const not_found = res.__("notFound");
		return res
			.status(404)
			.render("notfound", { title: res.__("notFoundTitle"), navbar, footer, not_found });
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

export default app;
