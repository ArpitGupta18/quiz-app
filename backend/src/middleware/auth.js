const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");

function requireAuth(req, res, next) {
	const authHeader = req.headers.authorization || "";

	if (!authHeader.startsWith("Bearer ")) {
		return res.status(401).json({ error: "Missing token" });
	}

	const token = authHeader.split(" ")[1];

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		req.user = decoded;
		next();
	} catch (err) {
		return res.status(401).json({ error: "Invalid or expired token" });
	}
}

module.exports = { requireAuth };
