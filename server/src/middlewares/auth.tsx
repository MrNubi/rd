import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../entities/User';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('mid_auth');
    // middlewares.user에서 res에 넣어줬으니까 여기선 이렇게 가져오면 됨
    const user: User | undefined = res.locals.user;

    // user가 없으면, user정보가 없는거니까 인증이 안되있다고 에러띄워주기
    if (!user) throw new Error('Unauthenticated 인증되지 않았습니다');

    return next();
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .json({ error: 'Unauthenticated + 들어오긴 왔는데 뭔가가 잘못됨' });
  }
};
