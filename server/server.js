const config = require("./config")();
process.env.PORT = config.port;

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const uri =
	"mongodb+srv://raphaelg0:r7S9oB9z6nndHNoB@cluster0.objvoj1.mongodb.net/backoffice?retryWrites=true&w=majority";
const clientOptions = {
	serverApi: { version: "1", strict: true, deprecationErrors: true },
};
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
const PORT = process.env.PORT;

app.use("/images", express.static(path.join(__dirname, "public/images")));

const userRoutes = require("./routes/UserRoutes.js");
const authRoutes = require("./routes/AuthRoutes.js");
const manageUsersRoutes = require("./routes/ManageUserRoutes.js");
const emailRoutes = require("./routes/MailRoutes.js");
const projectRoutes = require("./routes/ProjectRoutes.js");

app.use("/api", userRoutes);
app.use("/api", authRoutes);
app.use("/api", manageUsersRoutes);
app.use("/api", emailRoutes);
app.use("/api", projectRoutes);

async function run() {
	try {
		// Create a Mongoose client with a MongoClientOptions object to set the Stable API version
		await mongoose.connect(uri, clientOptions);
		await mongoose.connection.db.admin().command({ ping: 1 });
		console.log(
			"Pinged your deployment. You successfully connected to MongoDB!"
		);
	} finally {
	}
}

app.listen(PORT, () => {
	console.log(`Server is on port: ${PORT}`);
});

run().catch((err) => console.log(err));

process.on("SIGINT", async () => {
	await mongoose.disconnect();
	console.log("Disconnected from MongoDB");
	process.exit(0);
});
