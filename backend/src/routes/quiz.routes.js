const router = require("express").Router();
const { submitAnswer, getMyScore } = require("../controllers/quiz.controller");
const { requireAuth } = require("../middleware/auth");
const { requireRole } = require("../middleware/requireRole");

router.post("/answer", requireAuth, requireRole("USER"), submitAnswer);
router.get("/score", requireAuth, requireRole("USER"), getMyScore);

module.exports = router;
