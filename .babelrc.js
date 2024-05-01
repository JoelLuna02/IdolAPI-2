module.exports = {
	presets: [
		[
			"@babel/env",
			{
				targets: {
					node: "current",
				},
			},
		],
	],
	sourceMaps: true,
	plugins: ["@babel/transform-runtime"],
};
