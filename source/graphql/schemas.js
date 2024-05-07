import fs from "fs";
import { vtuber_resolver } from "../resolvers/vtuber.resolver";
import { hashtag_resolver } from "../resolvers/hashtag.resolver";
import { social_resolver } from "../resolvers/social.resolver";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { song_resolver } from "../resolvers/song.resolver";

const typeDefs = fs.readFileSync("./schemas.gql", "utf-8");
const schema = makeExecutableSchema({
	typeDefs,
	resolvers: [vtuber_resolver, hashtag_resolver, social_resolver, song_resolver],
});

export default schema;
