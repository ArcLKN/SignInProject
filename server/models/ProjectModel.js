const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
	owner: { type: String, required: true },
	title: { type: String, required: true },
	description: { type: String, required: true },
	images: Object,
});

const ProjectModel = mongoose.model("projects", projectSchema);

module.exports = ProjectModel;
