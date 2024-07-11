const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const {
	getUsers,
	addUser,
	deleteOneUser,
} = require("../controllers/userController");
const router = express.Router();

router.get("/get-users", authenticateToken, getUsers);
router.post("/add-user", authenticateToken, addUser);
router.post("/delete-one-user", authenticateToken, deleteOneUser);
