const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const authenticateToken = require("../middlewares/auth");
const sendPossibleManageOptions = require("../controllers/manageUserController.js");

router.get("/manage/users/:id", authenticateToken, sendPossibleManageOptions);
