// /server/routes/UserRoutes.js
const express = require("express");
const { check } = require("express-validator");
const authenticateToken = require("../middlewares/auth");
const {
	getUsers,
	getUser,
	addUser,
	deleteOneUser,
} = require("../controllers/userController.js");
const checkUserOwnership = require("../middlewares/checkUserOwnership.js");
const checkUserType = require("../middlewares/checkUserType.js");
const router = express.Router();

router.get("/users", authenticateToken, getUsers);
router.get("/user/:id", authenticateToken, getUser);

//router.get("/users/:id", authenticateToken, getUser);
router.post(
	"/users",
	authenticateToken,
	//checkUserOwnership,
	checkUserType(["Admin", "Super Admin"]),
	addUser
);
//router.put("/users/:id", authenticateToken, updateUser);

router.delete(
	"/users/:id",
	[
		check("id")
			.notEmpty()
			.withMessage("User Id is required")
			.isMongoId()
			.withMessage("MongoId is required"),
	],
	authenticateToken,
	checkUserType(["Admin", "Super Admin"]),
	deleteOneUser
);
module.exports = router;
