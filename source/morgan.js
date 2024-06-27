import { yellowBright, bold, green, blackBright } from "colorette";
import http from "http";

/**
 * @param {import("morgan").TokenIndexer} tokens
 * @param {import("http").IncomingMessage} req
 * @param {import("http").ServerResponse} res
 */
export const myCustomformat = (tokens, req, res) => {
	const status = tokens.status(req, res);
	const statusdesc = http.STATUS_CODES[status] || "Unknown";
	const colorizedStatus =
		parseInt(status) >= 500
			? `\x1b[31m${status} ${statusdesc}\x1b[0m`
			: parseInt(status) >= 400
				? `\x1b[33m${status} ${statusdesc}\x1b[0m`
				: parseInt(status) >= 300
					? `\x1b[36m${status} ${statusdesc}\x1b[0m`
					: `\x1b[32m${status} ${statusdesc}\x1b[0m`;
	return [
		`[${green("INFO")}]\t `,
		blackBright(`"${tokens.method(req, res)} ${tokens.url(req, res)}"`),
		"-",
		bold(colorizedStatus),
		tokens.res(req, res, "content-length"),
		"-",
		`${yellowBright(tokens["response-time"](req, res))}`,
		"ms",
	].join(" ");
};
