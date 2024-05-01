import mongoose, { Schema, model, models } from "mongoose";

const HashtagSchema = new Schema(
	{
		general: { type: String, require: true, trim: true },
		stream: { type: String, trim: true },
		fanart: { type: String, trim: true },
		memes: { type: String, trim: true },
		vtuber: { type: mongoose.Schema.Types.ObjectId, ref: "VTuber" },
	},
	{
		timestamps: true,
	},
);

const Hashtag = model("Hashtag", HashtagSchema) || models.Hashtag;

export default Hashtag;
