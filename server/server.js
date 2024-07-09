require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { check, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

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

app.get("/api/get-users", authenticateToken, async (req, res) => {
  const userData = await userModel.find();
  console.log(userData);
  res.send({ msg: userData });
});

app.post("/api/add-user", async (req, res) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    const eventData = req.body;
    console.log("Got a new user:", eventData);
    await userModel.create(eventData);
    return;
  }
  res.send({ errors: result.array() });
});

app.post(
  "/api/sign-up",
  [
    // Validation rules
    check("email").isEmail().withMessage("Please provide a valid email"),
    check("password")
      .isLength({ min: 4 })
      .withMessage("Password must be at least 4 characters long"),
    check("firstName").not().isEmpty().withMessage("First name is required"),
    check("lastName").not().isEmpty().withMessage("Last name is required"),
  ],
  async (req, res) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
      const eventData = req.body;
      const userData = await userModel.exists({ email: eventData.email });
      if (userData) {
        return res.send({ msg: null });
      }
      await userModel.create(eventData);
      const accessToken = jwt.sign(eventData, process.env.SECRET_AUTH_TOKEN, {
        expiresIn: "1h",
      });
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
    if (result.isEmpty()) {
      const loginEmail = req.body.email;
      const loginPassword = req.body.password;
      const userData = await userModel.exists({ email: loginEmail });
      if (userData) {
        const accessToken = jwt.sign(userData, process.env.SECRET_AUTH_TOKEN, {
          expiresIn: "1h",
        });
        console.log("Access", accessToken);
        res.send({ msg: { userData, token: accessToken } });
      } else {
        res.send({ msg: null });
      }
      return;
    }
    res.send({ errors: result.array() });
  }
);

app.get("/hello-world", (req, res) => {
  console.log("Hello World");
  res.json({ message: "Hello World!" });
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
