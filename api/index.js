import "dotenv/config";
import app from "../src/app.js";

export { app };
export default function handler(req, res) {
	return app(req, res);
}
