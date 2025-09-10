const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const db = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const questionsRoutes = require("./routes/questions.routes");
const quizRoutes = require("./routes/quiz.routes");

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.get("/health", (req, res) => res.json({ ok: true }));

app.get("/db-test", async (req, res, next) => {
	try {
		const result = await db.query("SELECT NOW() as now");
		res.json({ db_connected: true, time: result.rows[0].now });
	} catch (error) {
		next(error);
	}
});

app.use("/api/auth", authRoutes);
app.use("/api/questions", questionsRoutes);
app.use("/api/quiz", quizRoutes);

module.exports = { app };
