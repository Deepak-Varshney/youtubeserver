import express from 'express';
import { deleteUser, getUser, subscribe, unsubscribe, updateUserProfile } from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/token.js';

const router = express.Router();

router.get('/profile/:id', getUser);
router.put('/profile/update', verifyToken, updateUserProfile);
router.delete('/profile/delete', verifyToken, deleteUser);
router.put('/subscribe/:channelId', verifyToken, subscribe);
router.put('/unsubscribe/:channelId', verifyToken, unsubscribe);

export default router;