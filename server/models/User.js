const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	createdAt: String,
	email: String,
	firstName: String,
	lastName: String,
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
	password: String,
});

const UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;
