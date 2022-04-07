import User from "../models/user";
import { hashPassword, comparePassword } from "../utils/auth";

export const register = async (msg) => {
	try {
		// console.log(req.body);
		// const { name, email, password, role } = req.body;
		var jsonMsg = JSON.parse(msg);
		var name = jsonMsg.name;
		var email = jsonMsg.email;
		var password = jsonMsg.password;
		var role = jsonMsg.role;
		//validation
		if (!name) return (JSON.stringify("Name is required!"));
		if (!password || password.length < 6) {
			return (JSON.stringify("Password must have greater than 5 characters!"));
		}

		let userExist = await User.findOne({ email }).exec();
		if (userExist) return (JSON.stringify("Email already exists!"));

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
		return (JSON.stringify({ ok: true }));
	} catch (error) {
		console.log(error);
		return (JSON.stringify("Error! Try again."));
	}
};

export const login = async (msg) => {
	var jsonMsg = JSON.parse(msg)
	console.log("login==", jsonMsg.email)
	try {
		// console.log(req.body);
		// const { email, password } = req.body;
		var email = jsonMsg.email;
		var password = jsonMsg.password;

		const user = await User.findOne({ email }).exec();
		// if (!user) return res.status(400).send("Email not registred!");
		if (!user) return (JSON.stringify("Email not registered!"));

		console.log("********************************************************************************");
		console.log("User -> ", user);
		console.log("********************************************************************************");

		const match = await comparePassword(password, user.password);
		if (!match) return (JSON.stringify("Invalid password"));
		user.password = undefined;
		return (msg);
	} catch (error) {
		console.log(error);
		return (JSON.stringify("Error! Try again"));
	}
};
