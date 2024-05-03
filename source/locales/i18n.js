import { I18n } from "i18n";

/** i18n internationalization library instance */
const i18n = new I18n({
	locales: ["en", "es"],
	directory: "./translations",
	defaultLocale: "en",
});

export default i18n;
