const express = require("express");
const { check } = require("express-validator");
const authenticateToken = require("../middlewares/auth");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "public/images/" });
const {
	addNewProject,
	getUserProjects,
	getProject,
} = require("../controllers/projectController");

router.put(
	"/projects",
	authenticateToken,
	upload.array("files"),
	addNewProject
);
router.get("/projects", authenticateToken, getUserProjects);
router.get("/projects/:id", authenticateToken, getProject);

module.exports = router;
