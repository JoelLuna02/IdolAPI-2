import cors from "cors";

/**
 * This feature allows CORS policies to be applied to certain web domains.
 * @param {import("express").Express} app Express application instance
 * @param {string[]} origins List of allowed websites
 * @returns {Promise<void>}
 */
export function AllowCORS(app, origins) {
	app.use(
		cors({
			origin: function (origin, callback) {
				if (!origin) return callback(null, true);
				if (origins.indexOf(origin) === -1) {
					let msg = `Access to the Origin: ${origin}, is not permitted on this site.`;
					return callback(new Error(msg), false);
				}
				return callback(null, true);
			},
		}),
	);
}
