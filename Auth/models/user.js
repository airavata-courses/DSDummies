import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
	{
		name: {
			type: String,
			trim: true,
			required: true,
		},
		email: {
			type: String,
			trim: true,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			trim: true,
			required: true,
			min: 6, // specifying min and max xharacter password can have
			max: 64,
		},
		picture: {
			type: String,
			default: "/avatar.png",
		},
		role: {
			type: [String],
			default: ["Consumer"],
			enum: ["Consumer", "Provider", "Admin"],
		},
		passwordResetCode: {
			data: String,
			default: "",
		},
	},

	{ timestamps: true }
);

export default mongoose.model("User", userSchema);
