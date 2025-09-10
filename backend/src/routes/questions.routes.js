const router = require("express").Router();
const {
	addQuestion,
	getQuestions,
	editQuestion,
	deleteQuestion,
} = require("../controllers/questions.controller");
const { requireAuth } = require("../middleware/auth");
const { requireRole } = require("../middleware/requireRole");

router.get("/", getQuestions);
router.post("/", requireAuth, requireRole("ADMIN"), addQuestion);
router.put("/:id", requireAuth, requireRole("ADMIN"), editQuestion);
router.delete("/:id", requireAuth, requireRole("ADMIN"), deleteQuestion);

module.exports = router;
