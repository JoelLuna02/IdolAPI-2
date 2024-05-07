import connectDB from "../database";
import SocialNetWork from "../models/SocialNetwork";
import VTuber from "../models/VTuber";
import { isValidObjectId } from "mongoose";

export const social_resolver = {
	Query: {
		async socials() {
			await connectDB();
			const data = await SocialNetWork.find();
			return data;
		},
		async getSocial(_, { ID }) {
			await connectDB();
			if (!isValidObjectId(ID)) throw new Error("Invalid Social Network ID");
			const data = await SocialNetWork.findById(ID);
			if (!data) throw new Error("Social network not found!");
			return data;
		},
	},
	Mutation: {
		async addSocialNetwork(_, { application, accounturl }) {
			await connectDB();
			if (process.env.NODE_ENV === "production") {
				throw new Error("Mutation actions are only available in development mode");
			}
			const new_social = new SocialNetWork({ application, accounturl });
			const data = await new_social.save();
			return data;
		},
		async assignSocialNetworkToVtuber(_, { SNID, VTID }) {
			await connectDB();
			if (process.env.NODE_ENV === "production") {
				throw new Error("Mutation actions are only available in development mode");
			}
			if (!isValidObjectId(SNID) || !isValidObjectId(VTID)) {
				throw new Error("Invalid Social Network or VTuber ID");
			}
			const vtuber = await VTuber.findById(VTID);
			const social = await SocialNetWork.findById(SNID);
			if (!vtuber || !social) {
				throw new Error("VTuber or Social Network not found");
			}
			vtuber.socialNetworks.push(social._id);
			social.vtuber = vtuber._id;
			await vtuber.save();
			await social.save();
			return vtuber;
		},
		async deleteSocialNetwork(_, { ID }) {
			await connectDB();
			if (process.env.NODE_ENV === "production") {
				throw new Error("Mutation actions are only available in development mode");
			}
			if (!isValidObjectId(ID)) throw new Error("Invalid Social Network ID");
			const deleted = (await SocialNetWork.deleteOne({ _id: ID })).deletedCount;
			if (!deleted) throw new Error("Social network not found!");
			return deleted;
		},
	},
};
