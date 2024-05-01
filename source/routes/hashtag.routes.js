import { Router } from "express";
import { isObjectIdOrHexString } from "mongoose";
import Hashtag from "../models/Hashtag";
import connectDB from "../database";

const hashtag_routes = Router();

hashtag_routes.get("/", async (req, res) => {
	await connectDB();
	const hashtags = await Hashtag.find().select("-__v -vtuber");
	return res.status(200).json(hashtags);
});

hashtag_routes.get("/:htid", async (req, res) => {
	const htid = req.params.htid;
	try {
		await connectDB();
		if (!isObjectIdOrHexString(htid)) {
			return res.status(400).json({ message: "Invalid Hashtag ID" });
		}
		const vtuber = await Hashtag.findById(htid)
			.select("-_id -__v")
			.populate("vtuber", "-_id fullname fanname branch unit");
		if (!vtuber) return res.status(404).json({ message: "Hashtag not found" });
		return res.status(200).json(vtuber);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "An error occurred in the query." });
	}
});

export default hashtag_routes;
