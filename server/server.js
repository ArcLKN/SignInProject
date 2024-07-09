const express = require("express");
const cors = require("cors");
const { query, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const uri =
  "mongodb+srv://raphaelg0:r7S9oB9z6nndHNoB@cluster0.objvoj1.mongodb.net/backoffice?retryWrites=true&w=majority";
const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};
const app = express();
app.use(cors());
app.use(express.json());
const PORT = 3001;

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
});

const userModel = mongoose.model("users", userSchema);

app.get("/api/get-users", async (req, res) => {
  await mongoose.connect(uri, clientOptions);
  const userData = await userModel.find();
  console.log(userData);
  res.send({ msg: userData });
  await mongoose.disconnect();
});

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
    await mongoose.disconnect();
  }
}

app.post("/api/add-user", (req, res) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    const eventData = req.body;
    console.log("Got a new user:", eventData);
    res.json({ message: "Sent the user!" });
    return;
  }
  res.send({ errors: result.array() });
});

app.get("/hello-world", (req, res) => {
  console.log("Hello World");
  res.json({ message: "Hello World!" });
});

app.listen(PORT, () => {
  console.log(`Server is on port: ${PORT}`);
});

run().catch((err) => console.log(err));

mongoose
  .connect(uri, clientOptions)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Déconnexion de MongoDB à la fermeture de l'application
process.on("SIGINT", async () => {
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
  process.exit(0);
});
