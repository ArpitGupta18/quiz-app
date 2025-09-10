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

		// console.log(result);
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

const editQuestion = async (req, res, next) => {
	try {
		const { id } = req.params;
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
			`UPDATE public.questions
			 SET question_text = $1, option_a = $2, option_b = $3, option_c = $4, option_d = $5, correct_option = $6
			 WHERE id = $7
			 RETURNING id, question_text, option_a, option_b, option_c, option_d, correct_option`,
			[
				question_text,
				option_a,
				option_b,
				option_c,
				option_d,
				correct_option,
				id,
			]
		);

		if (!result.rowCount) {
			return res.status(404).json({ error: "Question not found" });
		}

		res.json(result.rows[0]);
	} catch (err) {
		next(err);
	}
};

const deleteQuestion = async (req, res, next) => {
	try {
		const { id } = req.params;

		const result = await db.query(
			`DELETE FROM public.questions WHERE id = $1 RETURNING id`,
			[id]
		);

		if (!result.rowCount) {
			return res.status(404).json({ error: "Question not found" });
		}

		console.log(result);
		res.json({
			message: "Question deleted successfully",
			id: result.rows[0].id,
		});
	} catch (err) {
		next(err);
	}
};

module.exports = { addQuestion, getQuestions, editQuestion, deleteQuestion };
