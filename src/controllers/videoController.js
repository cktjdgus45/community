import News from '../models/News';
import User from '../models/User';
import Comment from '../models/Comment';

export const home = async (req, res) => {
    try {
        const news = await News.find({}).populate("owner");
        console.log(news);
        return res.render('home', { pageTitle: "home", news });
    } catch (error) {
        console.log(error);
    }
}

export const getUpload = (req, res) => {
    return res.render('upload', { pageTitle: "Upload News" });
}

export const postUpload = async (req, res) => {
    const videoFileUrl = req.files['video'] ? req.files['video'][0].path : "";
    const imageFileUrl = req.files['image'] ? req.files['image'][0].path : "";
    const { _id } = req.session.user;
    const { title, content } = req.body;
    try {
        const newNews = await News.create({
            title,
            content,
            videoFileUrl,
            imageFileUrl,
            owner: _id,
        });
        const user = await User.findById(_id).populate('news');
        user.news.push(newNews._id);
        user.save();
        return res.redirect('/');
    } catch (error) {
        console.log(error);
        return res.render('upload', { pageTitle: "Upload News", errorMessage: error._message });
    }
}

export const watch = async (req, res) => {
    const { id } = req.params;
    const news = await News.findById(id).populate("owner").populate("comments");
    console.log(news);
    if (!news) {
        return res.status(404).render('404', { pageTitle: 'News Not Found' });
    }
    return res.render('watch', { pageTitle: news.title, news });
}

export const getEdit = async (req, res) => {
    const { id } = req.params;
    const { user: { _id } } = req.session;
    const news = await News.findById(id);
    if (!news) {
        return res.status(404).render('404', { pageTitle: 'News Not Found' });
    }
    if (String(news.owner) !== _id) {
        return res.status(403).redirect('/');
    }
    return res.render('editNews', { pageTitle: `Edit ${news.title}`, news });
}

export const postEdit = async (req, res) => {
    const { id } = req.params;
    const { user: { _id } } = req.session;
    const { title, content } = req.body;
    const videoFileUrl = req.files['video'] ? req.files['video'][0].path : "";
    const imageFileUrl = req.files['image'] ? req.files['image'][0].path : "";
    const news = await News.findById({ _id: id });

    if (!news) {
        return res.status(404).render('404', { pageTitle: 'News Not Found' });
    }

    if (String(news.owner) !== _id) {
        return res.status(403).redirect('/');
    }

    await News.findByIdAndUpdate(id, {
        title,
        content,
        videoFileUrl: videoFileUrl === news.videoFileUrl ? news.videoFileUrl : videoFileUrl,
        imageFileUrl: imageFileUrl === news.imageFileUrl ? news.imageFileUrl : imageFileUrl
    });
    return res.redirect(`/news/${id}`);
}


export const deleteNews = async (req, res) => {
    const { id } = req.params;
    const { user: { _id } } = req.session;
    const news = await News.findById(id);

    if (!news) {
        return res.status(404).render('404', { pageTitle: 'News Not Found' });
    }

    if (String(news.owner) !== _id) {
        return res.status(403).redirect('/');
    }
    await News.findByIdAndDelete(id);
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

    const news = await News.findById(id);
    if (!news) {
        return res.sendStatus(404);
    }
    const comment = await Comment.create({
        text,
        owner: _id,
        news: id,
    });

    news.comments.push(comment._id);
    news.save();
    return res.status(201).json({
        newCommentId: comment._id
    });
}

export const deleteComment = async (req, res) => {
    const { id } = req.params;
    const { user: { _id } } = req.session;
    const comment = await Comment.findById(id);
    const news = await News.findById(comment.news);

    if (!news) {
        return res.sendStatus(404);
    }
    news.comments = news.comments.filter((commentId) => {
        return String(commentId) !== id
    });

    news.save();
    if (!comment) {
        return res.sendStatus(404);
    }
    if (String(comment.owner) !== _id) {
        return res.status(403).redirect('/');
    }
    await Comment.findByIdAndDelete(id);
    return res.sendStatus(201);
}