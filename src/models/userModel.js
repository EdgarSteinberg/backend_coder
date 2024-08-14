import mongoose from 'mongoose';
import { createHash } from '../utils/cryptoUtil.js';

const userCollection = "users";

const userSchema = mongoose.Schema({
    first_name: { type: String, minLength: 3, require: true },
    last_name: { type: String, minLength: 3, require: true },
    email: { type: String, minLength: 5, require: true, unique: true, trim: true },
    age: { type: Number, min: 18, require: true },
    password: { type: String, require: true },
    username: { type: String, unique: true, trim: true },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts",
        default: null 
    },
    role: {
        type: String,
        require: true,
        enum: ['user', 'admin', 'premium'], // Define los roles posibles
        default: "user" 
    },
    documents: {
        type: [
            {
                name: {
                    type: String,
                    required: true
                },
                reference: {
                    type: String,
                    required: true
                }
            }
        ],
        default: []
    },
    last_connection: { type: Date }
});


const userModel = mongoose.model(userCollection, userSchema);

export default userModel;