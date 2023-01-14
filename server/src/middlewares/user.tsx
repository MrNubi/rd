import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../entities/User';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 쿠키 안의 토큰 받기
    const token = req.cookies.token;

    if (!token) {
      return next();
      // 토큰이 없을 경우, next로 넘겨버리기
    }

    // username을 tocken을 해독해 얻어내기, process.env.JWT_SECRET은 해쉬 생성에 쓰이는 문자열
    const { username }: any = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOneBy({ username });

    // user가 없으면, user정보가 없는거니까 인증이 안되있다고 에러띄워주기
    if (!user) throw new Error('Unauthenticated 인증되지 않았습니다');

    // 유저 정보를 res.local.user에 넣어주기 -> res안에서 유저정보 꺼내쓰기 편하게
    res.locals.user = user;

    return next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: 'Something went wrong' });
  }
};
