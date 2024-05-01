import mongoose, { Schema, model, models } from "mongoose";

const VTuberSchema = new Schema(
	{
		fullname: { type: String, require: true, trim: true },
		fanname: { type: String, require: true, trim: true },
		branch: { type: String, default: "EN", trim: true },
		unit: { type: String, require: true, trim: true },
		hashtag: { type: mongoose.Schema.Types.ObjectId, ref: "Hashtag" },
		likes: { type: [String], trim: true },
		dislikes: { type: [String], trim: true },
		socialNetworks: [{ type: mongoose.Schema.Types.ObjectId, ref: "SocialNetwork" }],
	},
	{
		timestamps: true,
	},
);

const VTuber = model("VTuber", VTuberSchema) || models.VTuber;

export default VTuber;
