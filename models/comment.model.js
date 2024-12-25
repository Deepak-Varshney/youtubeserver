import mongoose, {Schema} from 'mongoose';

const CommentSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
        required: true,
    },
    message:{
        type: String
    },
},{timestamps: true})

export const Comment = mongoose.model('Comment', CommentSchema);
