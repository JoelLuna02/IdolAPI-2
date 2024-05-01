import connectDB from "../database";
import { magentaBright, redBright } from "colorette";
import Hashtag from "../models/Hashtag";
import VTuber from "../models/VTuber";

export const hashtag_resolver = {
	Query: {
		async hashtag() {
			try {
				await connectDB();
				const data = await Hashtag.find();
				let success = `[${magentaBright("GRAPHQL")}] Successful query!`;
				console.log(success);
				return data;
			} catch (error) {
				let data = `[${redBright("ERROR")}]\t ${error}`;
				console.log(data);
			}
		},
		async getHashtag(_, { ID }) {
			try {
				await connectDB();
				const vtuber = await Hashtag.findById(ID);
				if (!vtuber) throw new Error("Hashtag not found!");
				let success = `[${magentaBright("GRAPHQL")}] Successful query!`;
				console.log(success);
				return vtuber;
			} catch (error) {
				let data = `[${redBright("ERROR")}]\t  ${error}`;
				console.log(data);
			}
		},
	},
	Mutation: {
		async addHashtag(_, { general, stream, fanart, memes }) {
			await connectDB();
			const new_hashtag = new Hashtag({ general, stream, fanart, memes });
			const hashtag = await new_hashtag.save();
			return hashtag;
		},
		async assignHashtagToVtuber(_, { HTID, VTID }) {
			try {
				await connectDB();
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
			} catch (error) {
				let data = `[${redBright("ERROR")}]\t  ${error}`;
				console.log(data);
			}
		},
		async deleteHashtag(_, { ID }) {
			try {
				await connectDB();
				const deleted = (await Hashtag.deleteOne({ _id: ID })).deletedCount;
				return deleted;
			} catch (error) {
				let data = `[${redBright("ERROR")}]\t  ${error}`;
				console.log(data);
			}
		},
	},
};
