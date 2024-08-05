// /server/controllers/userController.js
const ProjectModel = require("../models/ProjectModel");
const UserModel = require("../models/User.js");
const { validationResult } = require("express-validator");

async function addNewProject(req, res) {
	const result = validationResult(req);
	if (!result.isEmpty()) {
		return res.status(400).json({ errors: result.array() });
	}
	try {
		const projectImages = [];
		if (req.body.defaultImage === true) {
			projectImages.push("c30a776aab0475029e8c3cc1dde3583e");
		} else {
			const files = req.files;
			for (let file in files) {
				const filePath = files[file].filename;
				projectImages.push(filePath);
			}
		}

		const newProject = {
			owner: req.user._id,
			title: req.body.title,
			description: req.body.description,
			images: projectImages,
		};
		console.log("New project", newProject);
		const newlyCreatedProject = await ProjectModel.create(newProject);
		res.status(200).json({
			msg: "Success",
			data: { path: projectImages[0], id: newlyCreatedProject._id },
		});
	} catch (error) {
		console.error("Error creating project:", error);
		return res.status(500).json({ error: "Error creating project" });
	}
}

async function getUserProjects(req, res) {
	const result = validationResult(req);
	if (!result.isEmpty()) {
		return res.status(400).json({ errors: result.array() });
	}
	try {
		const id = req.user._id;
		const projects = await ProjectModel.find({ owner: id });
		res.status(200).json({
			msg: "Success",
			data: projects,
		});
	} catch (error) {
		console.error("Error fetching user projects:", error);
		return res.status(500).json({ error: "Error fetching user projects" });
	}
}

async function getProject(req, res) {
	const result = validationResult(req);
	if (!result.isEmpty()) {
		return res.status(400).json({ errors: result.array() });
	}
	try {
		const id = req.params.id;
		const project = await ProjectModel.findById(id);
		res.status(200).json({
			msg: "Success",
			data: project,
		});
	} catch (error) {
		console.error("Error fetching project:", error);
		return res.status(500).json({ error: "Error fetching project" });
	}
}

async function updateProject(req, res) {
	const result = validationResult(req);
	if (!result.isEmpty()) {
		return res.status(400).json({ errors: result.array() });
	}
	try {
		const projectId = req.params.id;
		const eventData = req.body;
		const user = req.user;
		const dbUserData = await UserModel.findById({ _id: user._id }).select(
			"userType"
		);
		let isAdmin = false;
		if (["Admin", "Super Admin"].includes(dbUserData.userType)) {
			isAdmin = true;
		}
		const project = await ProjectModel.findById({ _id: projectId }).select(
			"owner"
		);
		if (user._id !== project.owner && !isAdmin) {
			return res.status(404).json({ error: "Unauthorized access." });
		}
		await ProjectModel.updateOne({ _id: projectId }, eventData);
		res.status(200).json({
			msg: "Success",
		});
	} catch (error) {
		console.error("Error fetching project:", error);
		return res.status(500).json({ error: "Error fetching project" });
	}
}

async function isProjectOwner(req, res) {
	const result = validationResult(req);
	if (!result.isEmpty()) {
		return res.status(400).json({ errors: result.array() });
	}
	try {
		const projectId = req.params.id;
		const user = req.user;
		const project = await ProjectModel.findById({ _id: projectId }).select(
			"owner"
		);
		if (user._id === project.owner) {
			res.status(200).json({
				msg: "Success",
				data: true,
			});
		} else {
			res.status(200).json({
				msg: "Failure",
				data: false,
			});
		}
	} catch (error) {
		console.error("Error fetching project:", error);
		return res.status(500).json({ error: "Error fetching project" });
	}
}

module.exports = {
	addNewProject,
	getUserProjects,
	getProject,
	updateProject,
	isProjectOwner,
};
