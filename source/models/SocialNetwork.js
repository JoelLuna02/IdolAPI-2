import mongoose, { Schema, model, models } from "mongoose";

const SocialNetworkSchema = new Schema(
	{
		application: { type: String, default: "Twitter (X)", trim: true },
		accounturl: { type: String, require: true, unique: true },
		vtuber: { type: mongoose.Schema.Types.ObjectId, ref: "VTuber" },
	},
	{
		timestamps: true,
	},
);

const SocialNetWork = model("SocialNetwork", SocialNetworkSchema) || models.SocialNetWork;

export default SocialNetWork;
