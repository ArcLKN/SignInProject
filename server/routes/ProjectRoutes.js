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
	updateProject,
	isProjectOwner,
	deleteProject,
} = require("../controllers/projectController");

router.post(
	"/projects",
	authenticateToken,
	upload.array("files"),
	addNewProject
);
router.get("/projects", authenticateToken, getUserProjects);
router.get("/projects/:id", authenticateToken, getProject);
router.get("/project/check-owner/:id", authenticateToken, isProjectOwner);
router.put("/projects/:id", authenticateToken, updateProject);
router.delete("/projects/:id", authenticateToken, deleteProject);

module.exports = router;
