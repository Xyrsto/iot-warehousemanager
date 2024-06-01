import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        username: {
            type: String,
            required: true,
        },
        hashedPassword: {
            type: String,
            required: true,
        },
        role: {
            type: Boolean,
            required: true,
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model('User', userSchema);

export { User }; 
