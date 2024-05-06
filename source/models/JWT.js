import { Schema, model, models } from "mongoose";

const JWT_User_Schema = new Schema(
	{
		firstname: { type: String, require: true, trim: true },
		lastname: { type: String, require: true, trim: true },
		phone: { type: Number, require: true, trim: true },
		email: { type: String, require: true, trim: true },
		username: { type: String, require: true, trim: true },
		password: { type: String, require: true, trim: true },
		isAdmin: { type: String, require: true, trim: true },
	},
	{
		timestamps: false,
	},
);

const JWT_Auth = models.JWT_Auth || model("JWT_Auth", JWT_User_Schema);

export default JWT_Auth;
