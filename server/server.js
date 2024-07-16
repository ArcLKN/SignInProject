const config = require("./config")();
process.env.PORT = config.port;

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const uri =
	"mongodb+srv://raphaelg0:r7S9oB9z6nndHNoB@cluster0.objvoj1.mongodb.net/backoffice?retryWrites=true&w=majority";
const clientOptions = {
	serverApi: { version: "1", strict: true, deprecationErrors: true },
};
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const PORT = process.env.PORT;

const userRoutes = require("./routes/UserRoutes.js");
const authRoutes = require("./routes/AuthRoutes.js");
const manageUsersRoutes = require("./routes/ManageUserRoutes.js");
const emailRoutes = require("./routes/MailRoutes.js");

app.use("/api", userRoutes);
app.use("/api", authRoutes);
app.use("/api", manageUsersRoutes);
app.use("/api", emailRoutes);

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
