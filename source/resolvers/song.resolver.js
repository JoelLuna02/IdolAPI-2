import { isValidObjectId } from "mongoose";
import connectDB from "../database";
import VTuber from "../models/VTuber";
import Song from "../models/Song";

export const song_resolver = {
	Query: {
		async songs() {
			await connectDB();
			const songs = await Song.find();
			return songs;
		},
		async getSong(_, { ID }) {
			await connectDB();
			if (!isValidObjectId(ID)) throw new Error("Invalid Song ID");
			const song = await Song.findById(ID);
			if (!song) throw new Error("Song not found!");
			return song;
		},
	},
	Mutation: {
		async addSong(_, { name, album, releasedate, compositor, mixing, lyrics }) {
			await connectDB();
			if (process.env.NODE_ENV === "production") {
				throw new Error("Mutation actions are only available in development mode");
			}
			const new_song = new Song({ name, album, releasedate, compositor, mixing, lyrics });
			const song = await new_song.save();
			return song;
		},
		async deleteSong(_, { ID }) {
			await connectDB();
			if (process.env.NODE_ENV === "production") {
				throw new Error("Mutation actions are only available in development mode");
			}
			if (!isValidObjectId(ID)) throw new Error("Invalid Song ID");
			const song = (await Song.deleteOne({ _id: ID })).deletedCount;
			return song;
		},
		async assignSongToVtuber(_, { SNGID, VTID }) {
			if (process.env.NODE_ENV === "production") {
				throw new Error("Mutation actions are only available in development mode");
			}
			await connectDB();
			if (!isValidObjectId(VTID) || !isValidObjectId(SNGID)) {
				throw new Error("Invalid VTuber or Song ID");
			}
			const vtuber = await VTuber.findById(VTID);
			const song = await Song.findById(SNGID);
			if (!vtuber || !song) {
				throw new Error("VTuber or Song not found");
			}
			vtuber.songs.push(song._id);
			song.vtuber = vtuber._id;
			await vtuber.save();
			await song.save();
			return vtuber;
		},
	},
};
