// /server/routes/UserRoutes.js
const express = require("express");
const authenticateToken = require("../middlewares/auth");
const {
	getUsers,
	addUser,
	deleteOneUser,
} = require("../controllers/userController.js");
const router = express.Router();

router.get("/users", authenticateToken, getUsers);
//router.get("/users/:id", authenticateToken, getUser);
router.post("/users", authenticateToken, addUser);
//router.put("/users/:id", authenticateToken, updateUser);
router.delete("/users/:id", authenticateToken, deleteOneUser);

module.exports = router;
