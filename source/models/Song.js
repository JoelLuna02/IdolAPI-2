import mongoose, { model, models, Schema } from "mongoose";

const SongSchema = new Schema(
	{
		name: { type: String, unique: true, require: true, trim: true },
		album: { type: String, require: true, trim: true },
		releasedate: { type: String, require: true, trim: true },
		compositor: { type: String, require: true, trim: true },
		mixing: { type: String, trim: true },
		lyrics: { type: String, trim: true },
		vtuber: { type: mongoose.Schema.Types.ObjectId, ref: "VTuber" },
	},
	{
		timestamps: false,
	},
);

const Song = models.Song || model("Song", SongSchema);

export default Song;
