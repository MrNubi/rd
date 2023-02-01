import express from 'express';
import morgan from 'morgan';
import { AppDataSource } from './data-source';
import authRoutes from './routes/auth';
import subRoutes from './routes/subs';
import postRoutes from './routes/posts';
import voteRoutes from './routes/votes';
import userRoutes from './routes/users';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

const app = express();
// 엔트리 파일(시작점이라는 뜻)
const origin = 'http://localhost:3000';
app.use(
  cors({
    origin,
    credentials: true,
  })
);
// cors 설치후 origin 포트 설정

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
dotenv.config();

app.use('/api/auth', authRoutes);
app.use(express.static('public'));
app.use('/api/subs', subRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/users', userRoutes);

app.get('/', (_, res) => res.send('Running!'));

let port = 4000;
app.listen(port, async () => {
  console.log(`running at http://localhost:${port}`);

  // once in your application bootstrap
  AppDataSource.initialize()
    .then(() => {
      // here you can start to work with your database
      console.log('database initialized');
    })
    .catch((error) => console.log(error));
});
// tip: 같은 포트끼리 매칭 안시키면 당연히 에러던짐
// cors써서 뚫어주자
