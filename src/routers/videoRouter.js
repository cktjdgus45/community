import express from 'express';
import { protectorMiddleware, videoUpload, imageUpload } from '../localsMiddleware';
import { deleteVideo, getEdit, getUpload, postEdit, postUpload, watch } from '../controllers/videoController';

const videoRouter = express.Router();

videoRouter.route('/:id([0-9a-f]{24})').get(watch);
videoRouter.route('/:id([0-9a-f]{24})/delete').all(protectorMiddleware).get(deleteVideo);
videoRouter.route('/:id([0-9a-f]{24})/edit').all(protectorMiddleware).get(getEdit).post(postEdit);
videoRouter.route('/upload').get(getUpload).all(protectorMiddleware).post(videoUpload.fields([{ name: 'video', maxCount: 1 }, { name: 'image', maxCount: 1 }]), postUpload);

export default videoRouter;