import { model, models, Schema } from "mongoose";

const FileSchema = new Schema(
	{
		original: { type: String, unique: true, required: true, trim: true },
		mimetype: { type: String, required: true, trim: true },
		size: { type: Number, required: true, trim: true },
		bytes: { type: Buffer, required: true, trim: true },
	},
	{
		timestamps: true,
	},
);

const File = model("File", FileSchema) || models.File;

export default File;
