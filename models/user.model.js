import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: ''
    },
    channelName: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    subscribers: { type: Number, default: 0 },
    subscribedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true })

export const User = mongoose.model('User', UserSchema);
