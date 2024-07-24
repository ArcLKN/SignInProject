// /server/routes/UserRoutes.js
const express = require("express");
const { check } = require("express-validator");
const authenticateToken = require("../middlewares/auth");
const {
	getUsers,
	getUser,
	addUser,
	deleteOneUser,
	updateUser,
	deleteManyUsers,
	updateUserData,
	updateUserFromId,
	getUserSpecificData,
} = require("../controllers/userController.js");
//const checkUserOwnership = require("../middlewares/checkUserOwnership.js");
const checkUserType = require("../middlewares/checkUserType.js");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "public/images/" });

router.get("/users", authenticateToken, getUsers);
router.get("/users/:id", authenticateToken, getUser);
router.get("/user/:key", authenticateToken, getUserSpecificData);

router.post(
	"/users",
	authenticateToken,
	//checkUserOwnership,
	checkUserType(["Admin", "Super Admin"]),
	addUser
);
router.put("/users/:id", authenticateToken, updateUserFromId);
router.put("/users/:id/:key", authenticateToken, updateUserData);
router.put("/user", authenticateToken, upload.single("file"), updateUser);

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
router.delete(
	"/users",
	authenticateToken,
	checkUserType(["Admin", "Super Admin"]),
	deleteManyUsers
);
module.exports = router;
