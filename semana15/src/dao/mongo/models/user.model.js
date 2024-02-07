import mongoose from "mongoose"

const UserModel = mongoose.model("users", new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    cart:
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'carts',
			}
}))

export default UserModel