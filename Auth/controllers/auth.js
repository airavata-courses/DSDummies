import User from "../models/user";
import { hashPassword, comparePassword } from "../utils/auth";

export const register = async (req, res) => {
	try {
		console.log(req.body);
		const { name, email, password, role } = req.body;

		//validation
		if (!name) return res.status(400).send("Name is required!");
		if (!password || password.length < 6) {
			return res.status(400).send("Password must have greater than 5 characters!");
		}

		let userExist = await User.findOne({ email }).exec();
		if (userExist) return res.status(400).send("Email already exist!");

		//hasing password
		const hashedPass = await hashPassword(password);

		//add user to DB
		const user = new User({
			name,
			email,
			password: hashedPass,
			role,
		}).save();

		console.log("User Successfully saved!!!");
		return res.json({ ok: true });
	} catch (error) {
		console.log(error);
		return res.status(400).send("Error. Try Again!");
	}
};

export const login = async (req, res) => {
	try {
		console.log(req.body);
		const { email, password } = req.body;

		const user = await User.findOne({ email }).exec();
		if (!user) return res.status(400).send("Email not registred!");

		console.log("********************************************************************************");
		console.log("User -> ", user);
		console.log("********************************************************************************");

		const match = await comparePassword(password, user.password);
		if (!match) return res.status(400).send("Invalid Password!");

		user.password = undefined;

		return res.json(user);
	} catch (error) {
		console.log(error);
		return res.status(400).send("Error. Try Again!");
	}
};
