import mongoose, { Schema } from 'mongoose';

const VideoSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    videoLink: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    videoType: {
        type: String,
        default: "All"
    },
    views: { type: Number, default: 0 },
    tags: [{ type: String }], // Tags for searching videos
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who liked the video
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who disliked the video
}, { timestamps: true })

export const Video = mongoose.model('Video', VideoSchema);
