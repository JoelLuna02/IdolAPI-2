import mongoose, { Schema, model, models } from "mongoose";

const VTuberSchema = new Schema(
	{
		fullname: { type: String, require: true, trim: true, unique: true },
		fanname: { type: String, require: true, trim: true },
		quote: { type: String, trim: true },
		branch: { type: String, default: "EN", trim: true },
		unit: { type: String, require: true, trim: true },
		hashtag: { type: mongoose.Schema.Types.ObjectId, ref: "Hashtag" },
		emoji: { type: String, trim: true },
		youtube: { type: String, trim: true, unique: true },
		gender: { type: String, trim: true, default: "Female" },
		likes: { type: [String], trim: true },
		dislikes: { type: [String], trim: true },
		age: { type: Number, trim: true, required: true },
		birthday: { type: String, trim: true },
		zodiac: { type: String, trim: true },
		height: { type: String, trim: true },
		socialNetworks: [{ type: mongoose.Schema.Types.ObjectId, ref: "SocialNetwork" }],
	},
	{
		timestamps: true,
	},
);

const VTuber = model("VTuber", VTuberSchema) || models.VTuber;

export default VTuber;
