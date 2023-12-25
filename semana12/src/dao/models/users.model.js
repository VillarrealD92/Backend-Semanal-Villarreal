import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const collectionName = 'users';

const userSchema = new mongoose.Schema({
    first_name: { type: String },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user', enum: ['user', 'admin'] },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' } 
});

// Hash de la contraseña antes de guardarla en la base de datos
userSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) {
            return next();
        }

        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

const userModel = mongoose.model(collectionName, userSchema);
export default userModel;
