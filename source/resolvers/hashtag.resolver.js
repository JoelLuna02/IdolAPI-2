import connectDB from "../database";
import { isValidObjectId } from "mongoose";
import Hashtag from "../models/Hashtag";
import VTuber from "../models/VTuber";

export const hashtag_resolver = {
	Query: {
		async hashtag() {
			await connectDB();
			const data = await Hashtag.find();
			return data;
		},
		async getHashtag(_, { ID }) {
			await connectDB();
			if (!isValidObjectId(ID)) throw new Error("Invalid Hashtag ID");
			const vtuber = await Hashtag.findById(ID);
			if (!vtuber) throw new Error("Hashtag not found!");
			return vtuber;
		},
	},
	Mutation: {
		async addHashtag(_, { general, stream, fanart, memes }) {
			await connectDB();
			if (process.env.NODE_ENV === "production") {
				throw new Error("Mutation actions are only available in development mode");
			}
			const new_hashtag = new Hashtag({ general, stream, fanart, memes });
			const hashtag = await new_hashtag.save();
			return hashtag;
		},
		async assignHashtagToVtuber(_, { HTID, VTID }) {
			await connectDB();
			if (process.env.NODE_ENV === "production") {
				throw new Error("Mutation actions are only available in development mode");
			}
			if (!isValidObjectId(HTID) || !isValidObjectId(VTID)) {
				throw new Error("Invalid VTuber or Hashtag ID");
			}
			const vtuber = await VTuber.findById(VTID);
			const hashtag = await Hashtag.findById(HTID);
			if (!vtuber || !hashtag) {
				throw new Error("VTuber or Hashtag not found");
			}
			vtuber.hashtag = hashtag._id;
			hashtag.vtuber = vtuber._id;
			await vtuber.save();
			await hashtag.save();
			return vtuber;
		},
		async deleteHashtag(_, { ID }) {
			await connectDB();
			if (process.env.NODE_ENV === "production") {
				throw new Error("Mutation actions are only available in development mode");
			}
			if (!isValidObjectId(ID)) throw new Error("Invalid Hashtag ID");
			const deleted = (await Hashtag.deleteOne({ _id: ID })).deletedCount;
			return deleted;
		},
	},
};
