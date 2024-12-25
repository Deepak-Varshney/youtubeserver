import express from 'express';
import { addComment, deleteComment, editComment, getAllCommentsByVideoId } from '../controllers/comment.controller.js';
import { verifyToken } from '../middleware/token.js';

const router = express.Router();

router.post('/add/:id', verifyToken, addComment)
router.get('/video/:id', getAllCommentsByVideoId)
router.put('/edit/:commentId', verifyToken, editComment)
router.delete('/delete/:commentId', verifyToken, deleteComment)

export default router;