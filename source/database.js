import mongoose from "mongoose";
import { config } from "dotenv";

config({ path: ".env.local", override: true });
const dburl = process.env.MONGODB_URI;
const db_name = process.env.MONGODB_NAME;
const options = process.env.MONGODB_OPTIONS || "";

/**
 * ## Database connection
 * ---
 * This function allows you to connect to a MongoDB database to perform all types of queries.
 * A host with username and password must be specified, and the name of the database to operate.
 *
 * You must specify, within a .env.local file, the following variables:
 * ```bash
 * MONGODB_URI="<your mongodb host>"
 * MONGODB_NAME="<your mongodb database>"
 * MONGODB_OPTIONS="?<your mongodb option parameters>"
 * ```
 * @async
 * @returns {Promise<void>}
 */
async function connectDB() {
	if (dburl === undefined || dburl.length === 0) {
		throw new Error("No mongodb database url specified");
	} else if (db_name === undefined || db_name.length === 0) {
		throw new Error("No database name specified");
	}
	await mongoose.connect(`${dburl}/${db_name}${options}`).catch((err) => {
		throw err;
	});
}

export default connectDB;
