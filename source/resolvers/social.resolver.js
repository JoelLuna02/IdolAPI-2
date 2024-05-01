import connectDB from "../database";
import { magentaBright, redBright } from "colorette";
import SocialNetWork from "../models/SocialNetwork";
import VTuber from "../models/VTuber";
import { isValidObjectId } from "mongoose";

export const social_resolver = {
	Query: {
		async socials() {
			try {
				await connectDB();
				const data = await SocialNetWork.find();
				let success = `[${magentaBright("GRAPHQL")}] Successful query!`;
				console.log(success);
				return data;
			} catch (error) {
				let data = `[${redBright("ERROR")}]\t ${error}`;
				console.log(data);
			}
		},
		async getSocial(_, { ID }) {
			try {
				await connectDB();
				if (!isValidObjectId(ID)) throw new Error("Invalid Social Network ID");
				const data = await SocialNetWork.findById(ID);
				if (!data) throw new Error("Social network not found!");
				let success = `[${magentaBright("GRAPHQL")}] Successful query!`;
				console.log(success);
				return data;
			} catch (error) {
				let data = `[${redBright("ERROR")}]\t ${error}`;
				console.log(data);
			}
		},
	},
	Mutation: {
		async addSocialNetwork(_, { application, accounturl }) {
			await connectDB();
			const new_social = new SocialNetWork({ application, accounturl });
			const data = await new_social.save();
			return data;
		},
		async assignSocialNetworkToVtuber(_, { SNID, VTID }) {
			try {
				await connectDB();
				const vtuber = await VTuber.findById(VTID);
				const social = await SocialNetWork.findById(SNID);
				if (!isValidObjectId(SNID) || !isValidObjectId(VTID)) {
					throw new Error("Invalid Social Network or VTuber ID");
				}
				if (!vtuber || !social) {
					throw new Error("VTuber or Social Network not found");
				}
				vtuber.socialNetworks.push(social._id);
				social.vtuber = vtuber._id;
				await vtuber.save();
				await social.save();
				return vtuber;
			} catch (error) {
				let data = `[${redBright("ERROR")}]\t  ${error}`;
				console.log(data);
			}
		},
		async deleteSocialNetwork(_, { ID }) {
			try {
				await connectDB();
				const deleted = (await SocialNetWork.deleteOne({ _id: ID })).deletedCount;
				return deleted;
			} catch (error) {
				let data = `[${redBright("ERROR")}]\t  ${error}`;
				console.log(data);
			}
		},
	},
};
