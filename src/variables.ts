export const SITE_URL = "https://anime-sama.fr/";
export const CATALOGUE_URL = `${SITE_URL}catalogue/`;
export const REGEX_URL = (mediaBaseLink: string) => { return new RegExp("^https:\/\/anime-sama\.fr\/catalogue\/" + mediaBaseLink + ".*\/(vf|vostfr)?"); };
export const PORT = process.env.PORT ?? 3000;
