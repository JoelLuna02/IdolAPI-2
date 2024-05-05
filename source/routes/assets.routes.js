import { Router } from "express";
import multer from "multer";
import File from "../models/Asset";
import connectDB from "../database";

const assets_routes = Router();
const store = multer.memoryStorage();
const upload = multer({ storage: store });

assets_routes.get("/", async (req, res) => {
	await connectDB();
	const files = await File.find().select("_id original mimetype updatedAt size");
	return res.status(200).json(files);
});

assets_routes.get("/:file", async (req, res) => {
	const filename = req.params.file;
	try {
		await connectDB();
		const file = await File.findOne({ original: filename });
		if (!file) return res.status(404).json({ message: "File not found!" });
		res.set({ "Content-Length": file.size, "Content-Type": file.mimetype });
		return res.end(file.bytes);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "An error occurred in the query." });
	}
});

assets_routes.delete("/:file", async (req, res) => {
	const filename = req.params.file;
	try {
		await connectDB();
		const file = await File.findOneAndDelete({ original: filename });
		if (!file) return res.status(404).json({ message: "File not found!" });
		return res.status(204).json({});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "An error occurred in the query." });
	}
});

assets_routes.post("/upload", upload.single("file"), async (req, res) => {
	if (!req.file) return res.status(400).json({ error: "You must specify the file to upload" });
	const new_file = req.file;
	await connectDB();
	const file = new File({
		original: new_file.originalname, // Original Name
		mimetype: new_file.mimetype, // Mimetype
		size: new_file.size, // File size
		bytes: new_file.buffer, // file bytes
	});
	await file.save();
	return res.status(200).json({ message: "Successfully file stored" });
});

export default assets_routes;
