import express from 'express';
import { protectorMiddleware, publicOnlyMiddleware } from '../localsMiddleware';
import { finishGithubLogin, finishKakaoLogin, finishNaverLogin, finishGoogleLogin, logout, profile, startGoogleLogin, startGithubLogin, startKakaoLogin, startNaverLogin } from '../controllers/userController';

const userRouter = express.Router();

userRouter.use('/uploads', express.static("uploads"));

userRouter.get('/logout', protectorMiddleware, logout);

userRouter.get('/github/start', publicOnlyMiddleware, startGithubLogin);
userRouter.get('/github/finish', publicOnlyMiddleware, finishGithubLogin);
userRouter.get('/kakao/start', publicOnlyMiddleware, startKakaoLogin);
userRouter.get('/kakao/finish', publicOnlyMiddleware, finishKakaoLogin);
userRouter.get('/naver/start', publicOnlyMiddleware, startNaverLogin);
userRouter.get('/naver/finish', publicOnlyMiddleware, finishNaverLogin);
userRouter.get('/google/start', publicOnlyMiddleware, startGoogleLogin);
userRouter.get('/google/finish', publicOnlyMiddleware, finishGoogleLogin);


export default userRouter;