import { Comment } from '../models/comment.model.js';

export const addComment = async (req, res) => {
    try {
        const { message } = req.body;
        let {id} = req.params;
        const newComment = new Comment({ message, video:id, user: req.user._id });
        await newComment.save();
        res.status(201).json({ message: 'Comment added successfully', success: true, data: newComment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getAllCommentsByVideoId = async (req, res) => {
    try {
        let { id } = req.params;
        const comments = await Comment.find({ video: id }).populate('user', 'username channelName profilePicture').sort({ updatedAt: -1 });
        if (!comments) {
            return res.status(404).json({ message: 'Comments not found' });
        }
        res.status(201).json({ message: 'Comments fetched successfully', success: true, comments });
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized action! You can only delete your own comments' });
        }
        await Comment.deleteOne({ _id: commentId });
        res.status(200).json({ message: 'Comment deleted successfully', success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

export const editComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { message } = req.body;
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized action! You can only edit your own comment' });
        }
        comment.message = message;
        await comment.save();
        res.status(200).json({ message: 'Comment updated successfully', success: true, data: comment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};