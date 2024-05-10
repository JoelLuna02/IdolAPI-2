import mongoose, { Schema, model, models } from "mongoose";

const OriginalSchema = new Schema({
	artist: { type: String, trim: true },
	album: { type: String, trim: true },
	release: { type: String, trim: true },
	genre: [{ type: String, trim: true }],
	cover: { type: mongoose.Schema.Types.ObjectId, ref: "Cover" },
});

const Original = model("Original", OriginalSchema) || models.Original;

export default Original;
