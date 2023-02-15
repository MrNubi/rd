import React, { FormEvent, useCallback, useState } from 'react';
import InputGroup from '../components/InputGroup';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useAuthDispatch, useAuthState } from '../context/auth';

const Login = () => {
  let router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<any>({});
  const { authenticated } = useAuthState();
  const dispatch = useAuthDispatch();
  // 페이지 새로고침시 로그인 초기화 현상 고쳐야됨
  if (authenticated) router.push('/');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const res = await axios.post(
        '/auth/login',
        { password, username },
        { withCredentials: true }
      );

      dispatch('LOGIN', res.data?.user);
      // withCredentials: true ?
      //로그인 시 아이디와 비밀번호가 서버로 넘어오면 맞는지 확인 후 쿠키에 토큰을 발행
      // 다른 페이지에서의 인증도 다 이 토큰을 통해서 함
      // 지금 문제는 도메인 주소가 다를 경우(client: 3000포트 server: 4000포트) 별 다른 에러처리 없이 토큰발급이 안됨
      // 따라서 withCredentials를 설정해 서로 다른 도메인에 보낼때 creditial정보를 담을 수 있게 해줘야함
      //, 서로 다른 도메인(크로스 도메인)에 요청을 보낼 때 요청에 credential 정보를 담아서 보낼 지를 결정하는 항목
      //credential 정보가 포함되어 있는 요청: 쿠키를 첨부해서 보내는 요청 / 헤더에 Authorization 항목이 있는 요청
      //서버에서도 cors쪽에서 이걸 받도록 처리해야 완성

      router.push('/');
    } catch (error: any) {
      console.log(error);
      setErrors(error.response?.data || {});
    }

    test(event);
  };

  const test = useCallback(async (e: any) => {
    e.preventDefault();

    try {
      const res = await axios
        .post(
          'https://memolucky.run.goorm.io/users/dj-rest-auth/login/',
          { username: 'han1113', password: 'goddns1234' },
          { withCredentials: true }
        )
        .then((r) => {
          console.log(r);
        })
        .catch((error: any) => {
          console.error(error);
        });
    } catch {
      console.log('try-catch error');
    }

    //
  }, []);

  return (
    <div style={{ background: '#BEBEBE' }}>
      <div className="flex flex-col items-center justify-center h-screen p-6">
        <div className="w-10/12 bg-white p-3 rounded-xl mx-auto md:w-96">
          <h1 className="mb-2 text-center  text-lg font-bold">MEMOP</h1>
          <form onSubmit={handleSubmit}>
            <InputGroup
              className=" mb-3
            "
              placeholder="ID"
              value={username}
              setValue={setUsername}
              error={errors.username}
            />
            <InputGroup
              className=" mb-3
            "
              type="password"
              placeholder="PW"
              value={password}
              setValue={setPassword}
              error={errors.password}
            />
            <button
              className="w-full py-2 mb-1 text-xs font-bold text-white uppercaseborder border-gray-400 rounded-2xl"
              style={{ background: '#535353' }}
            >
              Login
            </button>
          </form>
          <small className=" flex justify-center">
            <Link
              className=" mr-2     uppercase"
              style={{ color: '#626262' }}
              href="/register"
            >
              아이디 찾기
            </Link>
            <Link
              className=" ml-2 uppercase"
              style={{ color: '#626262' }}
              href="/register"
            >
              비밀번호 찾기
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
