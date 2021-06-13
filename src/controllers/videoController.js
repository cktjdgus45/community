import Video from '../models/Video';
import User from '../models/User';
import Comment from '../models/Comment';

export const home = async (req, res) => {
    try {
        const videos = await Video.find({}).populate("owner");
        console.log(videos);
        return res.render('home', { pageTitle: "home", videos });

    } catch (error) {
        console.log(error);
    }
}
export const search = async (req, res) => {
    const { keyword } = req.query;
    let videos = [];
    if (keyword) {
        videos = await Video.find({
            title: {
                $regex: new RegExp(keyword, "i"),
            }
        });
        return res.render('search', { pageTitle: `searching ${keyword}`, videos });
    }
    return res.render('search', { pageTitle: "search", videos });
}

export const getUpload = (req, res) => {
    return res.render('upload', { pageTitle: "Upload Video" });
}

export const postUpload = async (req, res) => {
    const videoFileUrl = req.files['video'][0].path;
    const imageFileUrl = req.files['image'][0].path;
    const { _id } = req.session.user;
    const { title, content } = req.body;
    try {
        const newVideo = await Video.create({
            title,
            content,
            videoFileUrl,
            imageFileUrl,
            owner: _id,
        });
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        user.save();
        return res.redirect('/');
    } catch (error) {
        console.log(error);
        return res.render('upload', { pageTitle: "Upload Video", errorMessage: error._message });
    }
}

export const watch = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id).populate("owner").populate("comments");
    if (!video) {
        return res.status(404).render('404', { pageTitle: 'Video Not Found' });
    }
    return res.render('watch', { pageTitle: video.title, video });
}

export const getEdit = async (req, res) => {
    const { id } = req.params;
    const { user: { _id } } = req.session;
    const video = await Video.findById(id);
    if (!video) {
        return res.status(404).render('404', { pageTitle: 'Video Not Found' });
    }
    if (String(video.owner) !== _id) {
        return res.status(403).redirect('/');
    }
    return res.render('editVideo', { pageTitle: `Edit ${video.title}`, video });
}

export const postEdit = async (req, res) => {
    const { id } = req.params;
    const { title, description, hashtags } = req.body;
    const video = await Video.exists({ _id: id });
    if (!video) {
        return res.status(404).render('404', { pageTitle: 'Video Not Found' });
    }
    if (String(video.owner) !== _id) {
        return res.status(403).redirect('/');
    }
    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: Video.formatHashtags(hashtags)
    });
    return res.redirect(`/videos/${id}`);
}


export const deleteVideo = async (req, res) => {
    const { id } = req.params;
    const { user: { _id } } = req.session;
    const video = await Video.findById(id);
    if (!video) {
        return res.status(404).render('404', { pageTitle: 'Video Not Found' });
    }
    if (String(video.owner) !== _id) {
        return res.status(403).redirect('/');
    }
    await Video.findByIdAndDelete(id);
    return res.redirect('/');
}

export const createComment = async (req, res) => {
    const {
        body: {
            text
        },
        params: {
            id
        },
        session: {
            user: { _id }
        }
    } = req;
    const video = await Video.findById(id);
    if (!video) {
        return res.sendStatus(404);
    }
    const comment = await Comment.create({
        text,
        owner: _id,
        video: id,
    });

    video.comments.push(comment._id);
    video.save();
    return res.status(201).json({
        newCommentId: comment._id
    });
}

export const deleteComment = async (req, res) => {
    const { id } = req.params;
    const { user: { _id } } = req.session;
    const comment = await Comment.findById(id);
    const video = await Video.findById(comment.video);
    if (!video) {
        return res.sendStatus(404);
    }
    video.comments = video.comments.filter((commentId) => {
        return String(commentId) !== id
    });

    video.save();
    if (!comment) {
        return res.sendStatus(404);
    }
    if (String(comment.owner) !== _id) {
        return res.status(403).redirect('/');
    }
    await Comment.findByIdAndDelete(id);
    return res.sendStatus(201);
}