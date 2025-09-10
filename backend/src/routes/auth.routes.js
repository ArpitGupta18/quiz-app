const router = require("express").Router();
const {
	register,
	login,
	currentUser,
} = require("../controllers/auth.controller");
const { requireAuth } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, currentUser);

module.exports = router;
