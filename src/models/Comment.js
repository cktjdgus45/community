import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    video: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Video" },
    createdAt: { type: Date, required: true, default: Date.now },
    text: { type: String, required: true },
})

const commentModel = mongoose.model('Comment', commentSchema);

export default commentModel;