import { Router } from "express";
import connectDB from "../database";
import VTuber from "../models/VTuber";
import { isObjectIdOrHexString } from "mongoose";

const vtuber_routes = Router();

vtuber_routes.get("/", async (req, res) => {
	await connectDB();
	const vtubers = await VTuber.find()
		.select(
			"fullname fanname quote branch unit emoji youtube status gender likes dislikes age birthday zodiac height",
		)
		.populate("hashtag", "-_id general stream fanart memes")
		.populate("socialNetworks", "_id application accounturl");
	return res.status(200).json(vtubers);
});

vtuber_routes.get("/:vtid", async (req, res) => {
	const vtid = req.params.vtid;
	try {
		await connectDB();
		if (!isObjectIdOrHexString(vtid)) {
			return res.status(400).json({ message: "Invalid VTuber ID" });
		}
		const vtuber = await VTuber.findById(vtid)
			.select(
				"-_id fullname fanname quote branch unit emoji youtube status gender likes dislikes age birthday zodiac height",
			)
			.populate("hashtag", "-_id general stream fanart memes");
		if (!vtuber) return res.status(404).json({ message: "VTuber not found" });
		return res.status(200).json(vtuber);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "An error occurred in the query." });
	}
});

export default vtuber_routes;
