/* eslint-disable no-unused-vars */
import express from "express";
import { createHandler } from "graphql-http/lib/use/express";
import { ruruHTML } from "ruru/server";
import morgan from "morgan";
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
import cover_routes from "./routes/cover.routes";
import connectDB from "./database";
import VTuber from "./models/VTuber";
import auth_router from "./routes/auth.routes";
import { generateIndex, shuffleArray } from "./utils";

const app = express();

/** The server port */
const port = process.env.PORT || 3000;

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
	app.set("view engine", "ejs");
	app.set("views", "./views");

	AllowCORS(app, ["http://localhost:3000", "https://idolapi.koyeb.app"]);

	app.all("/api/graphql", createHandler({ schema })); // Implement GraphQL handler

	app.use("/api/hashtag", hashtag_routes);
	app.use("/api/social", social_routes);
	app.use("/api/vtuber", vtuber_routes);
	app.use("/api/assets", assets_routes);
	app.use("/api/cover", cover_routes);
	app.use("/api/auth", auth_router);

	app.get("/gql", (_req, res) => {
		res.type("html");
		res.end(
			ruruHTML({
				endpoint: "/api/graphql",
			}),
		);
	});

	app.get("/", async (req, res) => {
		await connectDB();
		const vtubers = await VTuber.find()
			.populate("hashtag", "-_id general stream fanart memes")
			.sort({ unit: 1 })
			.exec();
		let length = vtubers.length;
		let random;
		if (length >= 8) {
			random = shuffleArray(vtubers, 8);
		} else {
			random = shuffleArray(vtubers, length);
		}
		return res.render("index", {
			title: res.__("mainTitle"),
			navbar: res.__("navbar"),
			footer: res.__("footer"),
			warning: res.__("warn"),
			zodiac: res.__("zodiac"),
			gender: res.__("gender"),
			years: res.__("years"),
			lang: req.getLocale(),
			vtubers: JSON.parse(JSON.stringify(vtubers)),
			random: JSON.parse(JSON.stringify(random)),
		});
	});

	app.get("/docs", (req, res) => {
		const navbar = res.__("navbar");
		const footer = res.__("footer");
		const markd = fs.readFileSync("./views/markdown/documentation.mdx", "utf-8");
		const { markdown, index } = generateIndex(markd);
		const html = marked(markdown);
		return res.render("docs", {
			title: res.__("docsTitle"),
			docs: html,
			lang: req.getLocale(),
			headers: index,
			trans: res.__("docs"),
			navbar,
			footer,
		});
	});

	app.get("/about", (req, res) => {
		const navbar = res.__("navbar");
		const footer = res.__("footer");
		const lang = req.getLocale();
		const markdown = fs.readFileSync(`./views/markdown/${lang}/about-${lang}.mdx`, "utf-8");
		const html = marked(markdown);
		return res.render("about", {
			title: res.__("aboutTitle"),
			docs: html,
			data: res.__("about"),
			lang,
			navbar,
			footer,
		});
	});
	app.get("/support", (req, res) => {
		const navbar = res.__("navbar");
		const footer = res.__("footer");
		const lang = req.getLocale();
		const markdown = fs.readFileSync(`./views/markdown/${lang}/support-${lang}.mdx`, "utf-8");
		const html = marked(markdown);
		return res.render("support", {
			title: res.__("supportTitle"),
			docs: html,
			data: res.__("support"),
			lang,
			navbar,
			footer,
		});
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
