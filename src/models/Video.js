import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, maxLength: 30 },
    content: { type: String, required: true, trim: true, maxLength: 400 },
    videoFileUrl: { type: String },
    imageFileUrl: { type: String },
    createdAt: { type: Date, required: true, default: Date.now },
    comments: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "Comment" }],
    owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }
});

const videoModel = mongoose.model('Video', videoSchema);
export default videoModel;