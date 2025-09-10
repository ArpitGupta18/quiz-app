const { Pool } = require("pg");
const { DATABASE_URL } = require("./env");

const pool = new Pool({ connectionString: DATABASE_URL });

pool.on("error", (err) => {
	console.error("PG Pool Error:", err);
	process.exit(1);
});

module.exports = {
	query: (text, params) => pool.query(text, params), // helper so anywhere in the app we can run db.query('....query....')
	pool,
};
