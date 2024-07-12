const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	createdAt: String,
	email: { type: String, required: true, unique: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	userType: String,
	projectsCollaboratorsCount: Number,
	projectsCount: Number,
	ideaProjectsCount: Number,
	reservationsCount: Number,
	socialPicture: String,
	subscriptionsCount: Number,
	signUpMethod: String,
	stripeCustomedId: String,
	unseenSystemNotificationsCount: Number,
	updatedAt: String,
	userProfileSurveyPassed: Boolean,
	welcomePopupShown: Boolean,
	wizardSurveyPassed: Boolean,
	password: { type: String, required: true },
	validatedUser: Boolean,
});

const UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;
