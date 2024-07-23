// server/routes/authRoutes.js
const express = require("express");
const { check } = require("express-validator");
const {
	signUp,
	checkLogin,
	helloWorld,
	generateRandomId,
	isUserAdmin,
	getUserName,
} = require("../controllers/authController.js");
const authenticateToken = require("../middlewares/auth");
const router = express.Router();

router.post(
	"/sign-up",
	[
		check("email").isEmail().withMessage("Please provide a valid email"),
		check("password")
			.isLength({ min: 4 })
			.withMessage("Password must be at least 4 characters long"),
		check("firstName")
			.not()
			.isEmpty()
			.withMessage("First name is required"),
		check("lastName").not().isEmpty().withMessage("Last name is required"),
	],
	signUp
);

router.post(
	"/check-login",
	[
		check("email").isEmail().withMessage("Please provide a valid email"),
		check("password").not().isEmpty().withMessage("Password is required"),
	],
	checkLogin
);

router.get("/hello-world", helloWorld);

router.post("/generate-random-id", generateRandomId);

router.get("/isAdmin/:token", authenticateToken, isUserAdmin);

router.get("/getUserName/:token", authenticateToken, getUserName);

module.exports = router;
