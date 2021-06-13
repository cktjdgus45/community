import express from 'express';
import { protectorMiddleware, videoUpload } from '../localsMiddleware';
import { deleteNews, getEdit, getUpload, postEdit, postUpload, watch } from '../controllers/videoController';

const newsRouter = express.Router();

newsRouter.route('/:id([0-9a-f]{24})').get(watch);
newsRouter.route('/:id([0-9a-f]{24})/delete').all(protectorMiddleware).get(deleteNews);
newsRouter.route('/:id([0-9a-f]{24})/edit').all(protectorMiddleware).get(getEdit).post(videoUpload.fields([{ name: 'video', maxCount: 1 }, { name: 'image', maxCount: 1 }]), postEdit);
newsRouter.route('/upload').all(protectorMiddleware).get(getUpload).post(videoUpload.fields([{ name: 'video', maxCount: 1 }, { name: 'image', maxCount: 1 }]), postUpload);

export default newsRouter;