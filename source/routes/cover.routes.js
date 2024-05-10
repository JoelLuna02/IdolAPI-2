import { Router } from "express";

import Cover from "../models/Cover";
import connectDB from "../database";
import { isValidObjectId } from "mongoose";

const cover_routes = Router();

cover_routes.get("/", async (req, res) => {
	await connectDB();
	const covers = await Cover.find()
		.populate("original", "-_id artist album release genre")
		.populate("vtuber", "fanname branch unit");
	return res.status(200).json(covers);
});

cover_routes.get("/:cover_id", async (req, res) => {
	const id = req.params.cover_id;
	try {
		await connectDB();
		if (!isValidObjectId(id)) {
			return res.status(400).json({ message: "Invalid Cover ID" });
		}
		const covers = await Cover.findById(id)
			.populate("original", "-_id artist album release genre")
			.populate("vtuber", "fanname branch unit");
		if (!covers) {
			return res.status(404).json({ message: "Cover not Found" });
		}
		return res.status(200).json(covers);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "An error occurred in the query." });
	}
});

export default cover_routes;
