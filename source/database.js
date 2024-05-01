import mongoose from "mongoose";
import { config } from "dotenv";

config({ path: ".env.local", override: true });
const dburl = process.env.MONGODB_URI;
const db_name = process.env.MONGODB_NAME;

async function connectDB() {
	if (!dburl) {
		throw new Error("No mongodb database url specified");
	} else if (!db_name) {
		throw new Error("No database name specified");
	}
	await mongoose.connect(`${dburl}/${db_name}`).catch((err) => {
		throw err;
	});
}

export default connectDB;
