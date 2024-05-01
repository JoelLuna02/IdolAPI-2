import globals from "globals";
import pluginJs from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
	{ languageOptions: { globals: { ...globals.browser, ...globals.node } } },
	{ ignores: ["build/**/*", "node_modules/**/*"] },
	{
		rules: {
			indent: ["warn", "tab"],
			"linebreak-style": ["error", "unix"],
			quotes: ["error", "double"],
			"prettier/prettier": ["warn"],
			"no-unused-vars": "warn",
			semi: "error",
		},
	},
	pluginJs.configs.recommended,
	eslintPluginPrettierRecommended,
];
