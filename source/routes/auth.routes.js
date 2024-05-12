/* eslint-disable no-unused-vars */
import { Router } from "express";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { json } from "body-parser";
import bcrypt from "bcryptjs";

import JWT_Auth from "../models/JWT";
import connectDB from "../database";

const auth_router = Router();

config({ path: ".env.local", override: true });
const secret = process.env.SECRET_KEY;

/** ## JWT Token
 * This function is responsible for verifying the JWT authorization token and administration privileges.
 * @param {import("express").Request} req - Request
 * @param {import("express").Response} res - Response
 * @param {import("express").NextFunction} next - Next Function
 * @returns {Promise<void>}
 */
export function verify_token(req, res, next) {
	try {
		const token = req.headers.authorization.split(" ")[1];
		jwt.verify(token, secret, (err, decoded) => {
			if (err) return res.status(401).json(err);
			req.user = decoded;
			const isAdmin = req.user.isAdmin || false;
			if (!isAdmin) {
				return res.status(403).json({
					message: "Forbidden: You need administrative privileges to access this resource",
				});
			}
			next();
		});
	} catch (error) {
		return res.status(401).json({ Unauthorized: "Token not provided" });
	}
}

auth_router.use(json());

auth_router.post("/signup", async (req, res) => {
	const form = req.body;
	try {
		await connectDB();
		var salt = bcrypt.genSaltSync(12);
		const passwd = bcrypt.hashSync(form.password, salt);
		const new_user = new JWT_Auth({
			firstname: form.firstname,
			lastname: form.lastname,
			phone: parseInt(form.phone),
			email: form.email,
			username: form.username,
			password: passwd,
			isAdmin: form.isAdmin || false,
		});
		const data = await new_user.save();
		return res.status(201).json({ new_user: data, message: "Successfully created user!" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "An error occurred in the query." });
	}
});

auth_router.post("/login", async (req, res) => {
	const form = req.body;
	try {
		await connectDB();
		const user = await JWT_Auth.findOne({ username: form.username }).select(
			"_id username password email isAdmin",
		);
		if (!user) return res.status(401).json({ unauthorized: "The username does not exist!" });
		const password = bcrypt.compareSync(form.password, user.password);
		if (!user || !password) {
			res.status(401).json({ unauthorized: "Incorrect password. please try again." });
		}
		const token = jwt.sign(
			{ id: user._id, username: user.username, isAdmin: user.isAdmin },
			secret,
			{ expiresIn: "1h" },
		);
		return res.status(200).json({ user, access_token: token });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "An error occurred in the query." });
	}
});

export default auth_router;
