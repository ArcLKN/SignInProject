// /server/controllers/userController.js
const ProjectModel = require("../models/ProjectModel");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const path = require("path");

async function addNewProject(req, res) {
	const result = validationResult(req);
	if (!result.isEmpty()) {
		return res.status(400).json({ errors: result.array() });
	}
	try {
		const projectImages = [];
		const files = req.files;
		for (let file in files) {
			const filePath = files[file].filename;
			projectImages.push(filePath);
		}
		const newProject = {
			owner: req.user._id,
			title: req.body.title,
			description: req.body.description,
			images: projectImages,
		};
		console.log("New project", newProject);
		await ProjectModel.create(newProject);
		res.status(200).json({
			msg: "Success",
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

module.exports = {
	addNewProject,
	getUserProjects,
	getProject,
};
