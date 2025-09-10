const router = require("express").Router();
const {
	addQuestion,
	getQuestions,
} = require("../controllers/questions.controller");
const { requireAuth } = require("../middleware/auth");
const { requireRole } = require("../middleware/requireRole");

router.get("/", requireAuth, getQuestions);
router.post("/", requireAuth, requireRole("ADMIN"), addQuestion);

module.exports = router;
