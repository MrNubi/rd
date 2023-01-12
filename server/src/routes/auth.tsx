import { isEmpty, validate } from 'class-validator';
import { Request, Response, Router } from 'express';
import { User } from '../entities/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import dotenv from 'dotenv';

const router = Router();

const mapError = (errors: Object[]) => {
  return errors.reduce((prev: any, err: any) => {
    //reduce: 배열.reduce((누적값, 현잿값, 인덱스, 요소) => { return 결과 }, 초깃값(없을시 0부터));
    //누적값이라는데 주의, 숫자뿐아니라 배열이나 객체등도 쓸 수 있어 sort, every, some, find, findIndex, includes도 다 reduce로 구현 가능
    // prev에 err을 계속 더해 return
    // 초기값은 {}
    prev[err.property] = Object.entries(err.constraints)[0][1];
    // 우리가 줬던 '이메일이 잘못됬습니다' 같은 값들이 .entries에 의해 쪼개지면서 잡아짐
    //.entries(key, value) =>  key랑 value로 묶인 값을 풀어 배열로 리턴 -> 쪼개놨으니까 각각의 문자열을
    //index[0]과[1]로 불러서 잡아냄
    //{'a' : '1', 'b' :'2'} => [ ['a', '1'] , ['b', '2']  ]
    // 이걸 prev에 계속 더해준다 => 누적값
    return prev;
  }, {});
};

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  console.log(
    'email, username, password',
    `${email}, ${username}, ${password}`
  );

  try {
    let errors: any = {};

    // 이메일과 유저이름이 이미 저장 사용되고 있는 것인지 확인.
    const emailUser = await User.findOneBy({ email });
    const usernameUser = await User.findOneBy({ username });
    //findOneBy: typeORM에 속함, sellect기능을 하는데, By가 뒤에 붙으면 조건을 입력받고, by가 없으면
    // select할 컬럼, where, order, relation 등 다양한 옵션 여부까지 설정하여 select할 수 있음

    // 이미 있다면 (emailUser==true) errors 객체에 넣어줌.
    if (emailUser) errors.email = '이미 해당 이메일 주소가 사용되었습니다.';
    if (usernameUser) errors.username = '이미 이 사용자 이름이 사용되었습니다.';

    // 에러가 있다면 return으로 에러를 response 보내줌.
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }
    // 에러가 없다면 user객체 새로 만들어서 저장
    const user = new User();
    user.email = email;
    user.username = username;
    user.password = password;

    // 엔티티에 정해 놓은 조건으로 user 데이터의 유효성 검사를 해줌.
    errors = await validate(user);

    if (errors.length > 0) return res.status(400).json(mapError(errors));
    // errors가 0글자 이상이면(error이 존재) -> mapError함수에 errors담아서 실행

    // 유저 정보를 user table에 저장.
    await user.save();
    // .save는 user가 상속받은 baseEntity에 속한기능
    return res.json(user);
  } catch (error) {
    //트켓문 이용, 트라이부분이 처리가 안된다면 -> 서버측 에러로 처리
    console.error(error);
    return res.status(500).json({ error });
  }
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    let errors: any = {};
    // 비워져있다면 에러를 프론트엔드로 보내주기
    if (isEmpty(username))
      errors.username = '사용자 이름은 비워둘 수 없습니다.';
    if (isEmpty(password)) errors.password = '비밀번호는 비워둘 수 없습니다.';
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    // 디비에서 유저 찾기
    const user = await User.findOneBy({ username });
    //없으면 없다고 오류만들기
    if (!user)
      return res
        .status(404)
        .json({ username: '사용자 이름이 등록되지 않았습니다.' });

    // 유저가 있다면 비밀번호 비교하기 password는 입력한 값, user.password는 db꺼
    const passwordMatches = await bcrypt.compare(password, user.password);

    // 비밀번호가 다르다면 에러 보내기
    if (!passwordMatches) {
      return res.status(401).json({ password: '비밀번호가 잘못되었습니다.' });
    }

    // 비밀번호가 맞다면 토큰 생성 -> jwt 이용, 앞의 값과 뒤의 값 하쳐서
    const token = jwt.sign({ username }, process.env.JWT_SECRET);

    // 쿠키저장
    res.set(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, //일주일
        path: '/',
      })
    );

    return res.json({ user, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

const logout = async (_: Request, res: Response) => {
  res.set(
    'Set-Cookie',
    cookie.serialize('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0),
      path: '/',
    })
  );
  res.status(200).json({ success: true });
};

router.post('/register', register);
router.post('/login', login);

export default router;
