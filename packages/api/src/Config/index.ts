import "reflect-metadata";
require("dotenv");

const isDev = process.env.NODE_ENV === "development";

export const Config = {
	getOrigin() {
		if(isDev) {
			return "http://localhost:8080";
		} else {
			return "https://pcpartbuilder.net";
		}
	}
}

export default Config;