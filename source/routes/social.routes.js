import { Router } from "express";
import connectDB from "../database";
import SocialNetWork from "../models/SocialNetwork";
import { isObjectIdOrHexString } from "mongoose";

const social_routes = Router();

social_routes.get("/", async (req, res) => {
	await connectDB();
	const social_networks = await SocialNetWork.find()
		.select("-__v")
		.populate("vtuber", "-_id fullname branch unit");
	return res.status(200).json(social_networks);
});

social_routes.get("/:snid", async (req, res) => {
	const snid = req.params.snid;
	try {
		await connectDB();
		if (!isObjectIdOrHexString(snid)) {
			return res.status(400).json({ message: "Invalid Social Network ID" });
		}
		const social_network = await SocialNetWork.findById(snid)
			.select("-__v -_id")
			.populate("vtuber", "-_id fullname branch unit");
		if (!social_network) return res.status(404).json({ message: "Social Network not found" });
		return res.status(200).json(social_network);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "An error occurred in the query." });
	}
});

export default social_routes;
