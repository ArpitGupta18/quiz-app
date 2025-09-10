const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");

const register = async (req, res, next) => {
	try {
		const { email, name, password } = req.body || {};

		if (!email || !name || !password) {
			return res
				.status(400)
				.json({ error: "Email, name, and password are required" });
		}

		const exists = await db.query("SELECT id FROM users WHERE email = $1", [
			email,
		]);

		if (exists.rowCount) {
			return res.status(409).json({ error: "Email already in use" });
		}

		const hash = await bcrypt.hash(password, 10);

		const result = await db.query(
			`INSERT INTO public.users (email, name, password_hash)
             VALUES ($1, $2, $3)
             RETURNING id, email, name, role, created_at`,
			[email, name, hash]
		);

		res.status(201).json(result.rows[0]);
	} catch (err) {
		next(err);
	}
};

const login = async (req, res, next) => {
	try {
		const { email, password } = req.body || {};
		if (!email || !password) {
			return res
				.status(400)
				.json({ error: "Email and password are required" });
		}

		const userRes = await db.query(
			"SELECT id, email, name, role, password_hash FROM users WHERE email = $1",
			[email]
		);

		if (!userRes.rowCount) {
			return res.status(401).json({ error: "Invalid email or password" });
		}

		console.log("Here 1");
		const user = userRes.rows[0];
		console.log(user);
		console.log(`Comparing ${password} with hash ${user.password_hash}`);

		const ok = await bcrypt.compare(password, user.password_hash);
		console.log(ok);
		if (!ok) {
			return res.status(401).json({ error: "Invalid email or password" });
		}

		const token = jwt.sign(
			{
				id: user.id,
				email: user.email,
				role: user.role,
			},
			JWT_SECRET,
			{ expiresIn: "15m" }
		);

		res.json({
			accessToken: token,
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				role: user.role,
			},
		});
	} catch (err) {
		next(err);
	}
};

const currentUser = (req, res) => {
	res.json({ user: req.user });
};

module.exports = { register, login, currentUser };
