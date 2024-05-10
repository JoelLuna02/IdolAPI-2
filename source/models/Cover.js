import mongoose, { Schema, model, models } from "mongoose";

const CoverSchema = new Schema(
	{
		name: { type: String, trim: true },
		musicVideo: { type: String, trim: true },
		illustration: { type: String, trim: true },
		original: { type: mongoose.Schema.Types.ObjectId, ref: "Original" },
		vtuber: { type: mongoose.Schema.Types.ObjectId, ref: "VTuber" },
		mix: { type: String, trim: true },
	},
	{ timestamps: true },
);

const Cover = model("Cover", CoverSchema) || models.Cover;

export default Cover;
