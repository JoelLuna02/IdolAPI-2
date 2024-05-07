import { isValidObjectId } from "mongoose";
import connectDB from "../database";
import VTuber from "../models/VTuber";
import Hashtag from "../models/Hashtag";

export const vtuber_resolver = {
	Query: {
		async vtuber() {
			await connectDB();
			const data = await VTuber.find().populate("hashtag").populate("socialNetworks");
			return data;
		},
		getVtuber: async (_, { ID }) => {
			await connectDB();
			if (!isValidObjectId(ID)) {
				throw new Error("Invalid VTuber ID");
			}
			const vtuber = await VTuber.findById(ID).populate("hashtag").populate("socialNetworks");
			if (!vtuber) {
				throw new Error("VTuber Not Found");
			}
			return vtuber;
		},
	},
	Mutation: {
		async addVtuber(
			_,
			{
				fullname,
				fanname,
				quote,
				branch,
				unit,
				emoji,
				nicknames,
				youtube,
				status,
				avatar,
				gender,
				likes,
				dislikes,
				age,
				birthday,
				zodiac,
				height,
			},
		) {
			await connectDB();
			if (process.env.NODE_ENV === "production") {
				throw new Error("Mutation actions are only available in development mode");
			}
			const new_vtuber = new VTuber({
				fullname,
				fanname,
				quote,
				nicknames,
				branch,
				unit,
				emoji,
				youtube,
				status,
				avatar,
				gender,
				likes,
				dislikes,
				age,
				birthday,
				zodiac,
				height,
			});
			const vtuber = await new_vtuber.save();
			return vtuber;
		},
		async deleteVtuber(_, { ID }) {
			await connectDB();
			if (process.env.NODE_ENV === "production") {
				throw new Error("Mutation actions are only available in development mode");
			}
			if (!isValidObjectId(ID)) throw new Error("Invalid VTuber ID");
			await Hashtag.findOneAndDelete({ vtuber: ID });
			const deleted = (await VTuber.deleteOne({ _id: ID })).deletedCount;
			if (!deleted) throw new Error("VTuber Not Found");
			return deleted;
		},
		async editVtuber(
			_,
			{
				ID,
				fullname,
				fanname,
				quote,
				nicknames,
				branch,
				unit,
				emoji,
				youtube,
				status,
				avatar,
				gender,
				likes,
				dislikes,
				age,
				birthday,
				zodiac,
				height,
			},
		) {
			await connectDB();
			if (process.env.NODE_ENV === "production") {
				throw new Error("Mutation actions are only available in development mode");
			}
			if (!isValidObjectId(ID)) throw new Error("Invalid VTuber ID");
			const updated = (
				await VTuber.updateOne(
					{ _id: ID },
					{
						fullname,
						fanname,
						quote,
						nicknames,
						branch,
						unit,
						emoji,
						youtube,
						gender,
						avatar,
						likes,
						dislikes,
						status,
						age,
						birthday,
						zodiac,
						height,
					},
				)
			).modifiedCount;
			if (!updated) throw new Error("VTuber Not Found");
			return updated;
		},
	},
};
