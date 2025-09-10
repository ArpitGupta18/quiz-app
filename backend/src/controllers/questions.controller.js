const db = require("../config/db");

const addQuestion = async (req, res, next) => {
	try {
		const {
			question_text,
			option_a,
			option_b,
			option_c,
			option_d,
			correct_option,
		} = req.body || {};

		if (
			!question_text ||
			!option_a ||
			!option_b ||
			!option_c ||
			!option_d ||
			!correct_option
		) {
			return res.status(400).json({ error: "All fields are required" });
		}

		const result = await db.query(
			`INSERT INTO public.questions (question_text, option_a, option_b, option_c, option_d, correct_option)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id, question_text, option_a, option_b, option_c, option_d, correct_option`,
			[
				question_text,
				option_a,
				option_b,
				option_c,
				option_d,
				correct_option,
			]
		);

		res.status(201).json(result.rows[0]);
	} catch (err) {
		next(err);
	}
};

const getQuestions = async (req, res, next) => {
	try {
		const result = await db.query(
			`SELECT id, question_text, option_a, option_b, option_c, option_d FROM public.questions ORDER BY created_at ASC`
		);

		res.status(200).json(result.rows);
	} catch (err) {
		next(err);
	}
};

module.exports = { addQuestion, getQuestions };
