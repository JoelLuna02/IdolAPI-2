import { isValidObjectId } from "mongoose";
import connectDB from "../database";
import VTuber from "../models/VTuber";
import { magentaBright, redBright } from "colorette";
import Hashtag from "../models/Hashtag";
import { GraphQLError } from "graphql";

export const vtuber_resolver = {
	Query: {
		async vtuber() {
			try {
				await connectDB();
				const data = await VTuber.find().populate("hashtag").populate("socialNetworks");
				let success = `[${magentaBright("GRAPHQL")}] Successful query!`;
				console.log(success);
				return data;
			} catch (error) {
				let data = `[${redBright("ERROR")}]\t ${error}`;
				console.log(data);
			}
		},
		async getVtuber(_, { ID }) {
			try {
				await connectDB();
				if (!isValidObjectId(ID)) throw new GraphQLError("Invalid VTuber ID");
				const vtuber = await VTuber.findById(ID).populate("hashtag");
				if (!vtuber) throw new Error("VTuber not found!");
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
			if (!isValidObjectId(ID)) throw new GraphQLError("Invalid VTuber ID");
			await Hashtag.findOneAndDelete({ vtuber: ID });
			const deleted = (await VTuber.deleteOne({ _id: ID })).deletedCount;
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
			if (!isValidObjectId(ID)) throw new GraphQLError("Invalid VTuber ID");
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
			return updated;
		},
	},
};
