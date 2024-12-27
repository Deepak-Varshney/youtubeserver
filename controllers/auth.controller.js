import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';


export const signup = async (req, res) => {
    try {
        const { username, email, password, channelName, about, profilePicture } = req.body;
        const isUserExist = await User.findOne({ username });
        const isEmailExist = await User.findOne({ email });
        if (isUserExist) {
            res.status(400).json({ error: 'Username already exists' });
        } else if (isEmailExist) {
            res.status(400).json({ error: 'Email already exists' });
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const user = new User({ username, email, password: hashedPassword, channelName, about, profilePicture });
            await user.save();
            console.log(user);
            res.status(201).json({ message: "User has been registered successfully", success: "Yes", data: user });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

export const signin = async (req, res) => {
    try {
        const { username, password } = req.body; // username can be either username or email
        const user = await User.findOne({ $or: [{ username: username }, { email: username }] });
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "JWT_SECRETELKJSLDJFKSJDF");
            res.cookie('token', token, {sameSite: 'none'});
            const { password, ...others } = user._doc;
            res.status(200).json({ message: "User has been logged in successfully", success: "Yes", token, others, user });
        } else {
            res.status(400).json({ error: "Invalid Credentials" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

export const signout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: "User has been logged out successfully", success: "Yes" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
