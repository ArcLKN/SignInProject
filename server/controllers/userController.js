// /server/controllers/userController.js
const UserModel = require("../models/User");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

async function getUsers(req, res) {
	try {
		const userData = await UserModel.find().select("-password");
		res.status(200).json({ msg: userData, error: "Success" });
	} catch (error) {
		console.error("Error fetching users:", error);
		res.status(500).json({ error: "Server error" });
	}
}

async function getUser(req, res) {
	try {
		const userData = await UserModel.findOne({ _id: req.params.id }).select(
			"-password"
		);
		res.status(200).json({ msg: userData, error: "Success" });
	} catch (error) {
		console.error("Error fetching users:", error);
		res.status(500).json({ error: "Server error" });
	}
}

async function addUser(req, res) {
	const result = validationResult(req);
	if (result.isEmpty()) {
		try {
			const id = req.user._id;
			let eventData = req.body;
			eventData["verifiedUser"] = true;
			console.log("Got a new user:", eventData);
			await UserModel.create(eventData);
			res.status(200).json({
				msg: "Success",
			});
		} catch (error) {
			console.error("Error fetching users:", error);
			res.status(400).json({ error: "Error fetching users" });
		}
		return;
	}
	res.status(500).send({ errors: result.array() });
}

async function deleteOneUser(req, res) {
	const result = validationResult(req.params.id);
	if (result.isEmpty()) {
		try {
			const eventData = req.params.id;
			await UserModel.deleteOne({ _id: req.params.id });
			console.log("Sucessufully deleted user:", req.params.id);
			return res.status(200).json({
				msg: eventData,
				error: "Success",
			});
		} catch (error) {
			console.error("Error fetching users:", error);
			return res.status(400).json({ error: "Error fetching users" });
		}
	}
	res.status(500).json({ errors: result.array() });
}

async function deleteManyUsers(req, res) {
	const result = validationResult(req.body);
	if (!result.isEmpty) {
		res.status(500).json({ errors: result.array() });
	}
	try {
		let userIds = req.body;
		const currentUserId = req.user._id;

		userIds = userIds.filter((id) => id !== currentUserId.toString());

		const deleteResult = await UserModel.deleteMany({
			_id: { $in: userIds },
		});
		console.log("Sucessufully deleted users:", userIds);
		return res.status(200).json({
			msg: userIds,
			error: "Success",
		});
	} catch (error) {
		console.error("Error fetching users:", error);
		return res.status(400).json({ error: "Error fetching users" });
	}
}

async function updateUser(req, res) {
	const result = validationResult(req);
	if (!result.isEmpty()) {
		return res.status(400).json({ errors: result.array() });
	}

	try {
		const eventData = { ...req.body };
		const userId = req.params.id;
		const id = req.user._id;

		const user = await UserModel.findOne({ _id: id }).select("userType");
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		const userType = user.userType;
		const isAdmin = ["Admin", "Super Admin"].includes(userType);

		delete eventData.firstName;
		delete eventData.lastName;
		delete eventData.password;
		delete eventData._id;
		delete eventData.email;
		delete eventData.createdAt;
		delete eventData.updatedAt;
		delete eventData.__v;

		if (!isAdmin) {
			delete eventData.userType;
		}

		if (isAdmin || userId == id) {
			await UserModel.updateOne({ _id: userId }, eventData);
			console.log("Successfully updated user:", userId);
			return res.status(200).json({
				msg: eventData,
				userId: userId,
				error: "Success",
			});
		} else {
			return res.status(403).json({ error: "Not enough permissions" });
		}
	} catch (error) {
		console.error("Error updating user:", error);
		return res.status(500).json({ error: "Error updating user" });
	}
}

async function updateUserData(req, res) {
	const result = validationResult(req);
	if (!result.isEmpty()) {
		return res.status(400).json({ errors: result.array() });
	}
	try {
		const userId = req.params.id;
		const dataToUpdate = req.params.key;
		const id = req.user._id;

		if (userId !== id)
			return res.status(403).json({ error: "Not enough permissions" });

		const eventData = { ...req.body };

		if (dataToUpdate === "password") {
			if (eventData.newPassword !== eventData.confirmNewPassword) {
				return res
					.status(400)
					.json({ error: "Passwords don't match." });
			}
			const user = await UserModel.findOne({
				_id: userId,
			}).select("password");
			if (!user) {
				return res.status(400).json({ error: "Invalid user id" });
			}
			const isMatch = await bcrypt.compare(
				eventData.oldPassword,
				user.password
			);
			if (!isMatch) {
				return res.status(400).json({ error: "Invalid credentials" });
			}
			user.password = await bcrypt.hash(eventData.newPassword, 10);
			await user.save();
		}

		return res.status(200).json({
			userId: userId,
			error: "Success",
		});
	} catch (error) {
		console.error("Error updating user:", error);
		return res.status(500).json({ error: "Error updating user" });
	}
}

module.exports = {
	getUsers,
	getUser,
	addUser,
	deleteOneUser,
	updateUser,
	deleteManyUsers,
	updateUserData,
};
