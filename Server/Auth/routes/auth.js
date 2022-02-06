import express from "express";

import { register, login } from "../controllers/auth";

const router = express.Router();

const isWorking = async (req, res) => {
	return res.json("API is working!");
};

//check if api working
router.get("/isworking", isWorking);

//register user
router.put("/register", register);

//login
router.post("/login", login);

module.exports = router;
