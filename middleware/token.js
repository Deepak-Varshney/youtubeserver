import jwt from 'jsonwebtoken';
import {User} from '../models/user.model.js';


export const verifyToken = async (req, res, next) => {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({error: 'You need to Login first'});
        }else{
            try {
                const decode = jwt.verify(token, process.env.JWT_SECRET);
                req.user = await User.findById(decode.userId).select('-password');
                next();
            } catch (error) {
                console.error('Token verification error:', error); // Add error logging
                res.status(401).json({error: "Token is not valid"})
            }
        }
}