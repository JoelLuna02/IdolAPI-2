import { isValidObjectId } from "mongoose";

import connectDB from "../database";
import Cover from "../models/Cover";
import Original from "../models/Original";
import VTuber from "../models/VTuber";

export const cover_resolver = {
	Query: {
		covers: async () => {
			await connectDB();
			const data = await Cover.find().populate("original", "-_id artist album release genre");
			return data;
		},
		getCover: async (_, { ID }) => {
			await connectDB();
			if (!isValidObjectId(ID)) throw new Error("Invalid Cover ID");
			const data = await Cover.findById(ID).populate("original", "-_id artist album release genre");
			if (!data) throw new Error("Cover not found");
			return data;
		},
	},
	Mutation: {
		addCover: async (_, { name, musicVideo, illustration, mix }) => {
			await connectDB();
			if (process.env.NODE_ENV === "production") {
				throw new Error("Mutation actions are only available in development mode");
			}
			const add_cover = new Cover({ name, musicVideo, illustration, mix });
			const data = await add_cover.save();
			return data;
		},
		addOriginal: async (_, { artist, album, release, genre }) => {
			await connectDB();
			if (process.env.NODE_ENV === "production") {
				throw new Error("Mutation actions are only available in development mode");
			}
			const add_original_data = new Original({ artist, album, release, genre });
			const data = await add_original_data.save();
			return data;
		},
		deleteCover: async (_, { ID }) => {
			await connectDB();
			if (process.env.NODE_ENV === "production") {
				throw new Error("Mutation actions are only available in development mode");
			}
			if (!isValidObjectId(ID)) throw new Error("Invalid Hashtag ID");
			await Original.deleteOne({ cover: ID });
			const deleted = (await Cover.deleteOne({ _id: ID })).deletedCount;
			if (!deleted) throw new Error("Cover not found");
			return deleted;
		},
		assignCoverToVTuber: async (_, { VTID, CVID }) => {
			await connectDB();
			if (process.env.NODE_ENV === "production") {
				throw new Error("Mutation actions are only available in development mode");
			}
			if (!isValidObjectId(VTID) || !isValidObjectId(CVID)) {
				throw new Error("Invalid VTuber or Cover ID");
			}
			const vtuber = await VTuber.findById(VTID);
			const cover = await Cover.findById(CVID);
			if (!vtuber || !cover) {
				throw new Error("VTuber or Cover not found");
			}
			vtuber.covers.push(cover._id);
			cover.vtuber = vtuber._id;
			await vtuber.save();
			await cover.save();
			return vtuber;
		},
		assignOriginalDataToCover: async (_, { CVID, ORID }) => {
			await connectDB();
			if (process.env.NODE_ENV === "production") {
				throw new Error("Mutation actions are only available in development mode");
			}
			if (!isValidObjectId(ORID) || !isValidObjectId(CVID)) {
				throw new Error("Invalid Original data instance or Cover ID");
			}
			const original = await Original.findById(ORID);
			const cover = await Cover.findById(CVID);
			if (!original || !cover) throw new Error("Original data instance or Cover not found");
			original.cover = cover._id;
			cover.original = original._id;
			await original.save();
			await cover.save();
			return cover;
		},
	},
};
