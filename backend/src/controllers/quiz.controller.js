const db = require("../config/db");

const submitAnswer = async (req, res, next) => {
	try {
		const { question_id, selected_option } = req.body || {};

		if (!question_id || !selected_option) {
			return res.status(400).json({
				error: "question_id and selected_option are required",
			});
		}

		const qResponse = await db.query(
			"SELECT correct_option FROM questions WHERE id = $1",
			[question_id]
		);

		if (!qResponse.rowCount) {
			return res.status(404).json({ error: "Question not found" });
		}

		const correctOption = qResponse.rows[0].correct_option;
		const isCorrect = correctOption === selected_option;

		const result = await db.query(
			`
            INSERT INTO answers (user_id, question_id, selected_option, is_correct)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (user_id, question_id)
            DO UPDATE SET
                selected_option = EXCLUDED.selected_option,
                is_correct = EXCLUDED.is_correct,
                answered_at = NOW()
            RETURNING *
        `,
			[req.user.id, question_id, selected_option, isCorrect]
		);

		res.json({
			question_id,
			selected_option,
			is_correct: isCorrect,
			answered_at: result.rows[0].answered_at,
		});
	} catch (error) {
		next(error);
	}
};

const getMyScore = async (req, res, next) => {
	try {
		const result = await db.query(
			`SELECT 
                COUNT(*) AS total,
                COUNT(*) FILTER (WHERE is_correct) AS correct,
                COUNT(*) FILTER (WHERE NOT is_correct) AS wrong
            FROM answers
            WHERE user_id = $1`,
			[req.user.id]
		);

		const row = result.rows[0];

		res.json({
			user_id: req.user.id,
			total: parseInt(row.total),
			correct: parseInt(row.correct),
			wrong: parseInt(row.wrong),
		});
	} catch (error) {
		next(error);
	}
};

module.exports = { submitAnswer, getMyScore };
