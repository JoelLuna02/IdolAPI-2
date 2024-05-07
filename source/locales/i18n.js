import { I18n } from "i18n";

/** i18n internationalization library instance */
const i18n = new I18n({
	locales: ["en", "es"],
	directory: "./translations",
	defaultLocale: "en",
	fallbacks: {
		// All Languages
		"*": "en",
		// Spanish Codenames
		"es-US": "es",
		"es-AR": "es",
		"es-ES": "es",
		"es-MX": "es",
		"es-CO": "es",
		"es-CL": "es",
		// English Codenames
		"en-US": "en",
		"en-GB": "en",
		"en-AU": "en",
		"en-CA": "en",
	},
});

export default i18n;
