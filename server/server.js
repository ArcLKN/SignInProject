const config = require("./config")();
process.env.PORT = config.port;

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { check, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const uri =
	"mongodb+srv://raphaelg0:r7S9oB9z6nndHNoB@cluster0.objvoj1.mongodb.net/backoffice?retryWrites=true&w=majority";
const clientOptions = {
	serverApi: { version: "1", strict: true, deprecationErrors: true },
};
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT;

const userRoutes = require("./routes/UserRoutes.js");

app.use("/api", userRoutes);

async function run() {
	try {
		// Create a Mongoose client with a MongoClientOptions object to set the Stable API version
		await mongoose.connect(uri, clientOptions);
		await mongoose.connection.db.admin().command({ ping: 1 });
		console.log(
			"Pinged your deployment. You successfully connected to MongoDB!"
		);
	} finally {
		// Ensures that the client will close when you finish/error
	}
}

app.post(
	"/api/sign-up",
	[
		// Validation rules
		check("email").isEmail().withMessage("Please provide a valid email"),
		check("password")
			.isLength({ min: 4 })
			.withMessage("Password must be at least 4 characters long"),
		check("firstName")
			.not()
			.isEmpty()
			.withMessage("First name is required"),
		check("lastName").not().isEmpty().withMessage("Last name is required"),
	],
	async (req, res) => {
		const result = validationResult(req);
		if (result.isEmpty()) {
			console.log(req.body);
			const eventData = req.body;
			const userData = await userModel.exists({ email: eventData.email });
			if (userData) {
				return res.send({ msg: null });
			}
			eventData.password = await bcrypt.hash(eventData.password, 10);
			await userModel.create(eventData);
			const accessToken = jwt.sign(
				eventData,
				process.env.SECRET_AUTH_TOKEN,
				{
					expiresIn: "1h",
				}
			);
			res.send({ msg: { eventData, token: accessToken } });
			return;
		}
		res.send({ errors: result.array() });
	}
);

app.post(
	"/api/check-login",
	[
		check("email").isEmail().withMessage("Please provide a valid email"),
		check("password").not().isEmpty().withMessage("Password is required"),
	],
	async (req, res) => {
		const result = validationResult(req);
		if (!result.isEmpty()) {
			return res.status(400).json({ errors: result.array() });
		}
		const loginEmail = req.body.email;
		const loginPassword = req.body.password;
		try {
			const user = await userModel.findOne({ email: loginEmail });
			if (!user) {
				return res.status(400).json({ msg: "Invalid credentials" });
			}
			const isMatch = await bcrypt.compare(loginPassword, user.password);
			if (!isMatch) {
				return res.status(400).json({ msg: "Invalid credentials" });
			}
			const userPayload = Buffer.from(
				JSON.stringify(user),
				"utf8"
			).toString("hex");
			const accessToken = jwt.sign(
				userPayload,
				process.env.SECRET_AUTH_TOKEN,
				null,
				{
					expiresIn: "1h",
				}
			);
			return res.send({ msg: "Sign-in successful", token: accessToken });
		} catch (error) {
			console.error(error);
			res.status(500).json({ msg: "Server error" });
		}
	}
);

app.get("/hello-world", (req, res) => {
	console.log("Hello World");
	res.json({ message: "Hello World!" });
});

app.post("/api/generate-random-id", async (req, res) => {
	res.send({ msg: crypto.randomBytes(24 / 2).toString("hex") });
});

function authenticateToken(req, res, next) {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (token == null) return res.sendStatus(401);

	jwt.verify(token, process.env.SECRET_AUTH_TOKEN, (err, user) => {
		if (err) return res.sendStatus(403);
		req.user = user;
		next();
	});
}

app.listen(PORT, () => {
	console.log(`Server is on port: ${PORT}`);
});

run().catch((err) => console.log(err));

// Déconnexion de MongoDB à la fermeture de l'application
process.on("SIGINT", async () => {
	await mongoose.disconnect();
	console.log("Disconnected from MongoDB");
	process.exit(0);
});
