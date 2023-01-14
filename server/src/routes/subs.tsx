import { Request, Response, Router } from 'express';
import { deflate } from 'zlib';
import jwt from 'jsonwebtoken';
import env from 'dotenv';
import { User } from '../entities/User';
import userMiddleware from '../middlewares/user';
import authMiddleware from '../middlewares/auth';

const createSub = async (req: Request, res: Response, next) => {
  const { name, title, description } = req.body;
  // 먼저, sub을 생성 가능한 유저인지 체크 -> 유저 정보 가져오기로 함(요청에서 보내주는 토큰을 이용, 판별)
  //유저 정보 없을 시 에러
  // 유저 정보가 있다면, sub 이름과 제목이 있는지 체크 (unique)
  // 통과하면, sub instense 생성 후 데이터베이스에 저장
  //저장한 정보 프론트에 전달해주기

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

  //유저정보 있음 -> sub 이름과 제목이 이미 있는지 체크
  // 통과하면 Instense 생성 후에 데이베이스 저장
  // 저장 후 프론트엔드에 정보전달
};

const router = Router();

//middlewares를 createSub에서 사용시켜주려면, 앞에다가 챙겨줘야됨

router.post('/', userMiddleware, authMiddleware, createSub);

export default router;
