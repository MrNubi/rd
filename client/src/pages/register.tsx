import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FormEvent, useState } from 'react';
import InputGroup from '../components/InputGroup';

function register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<any>({});

  let router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    // form의 onsubmit 이벤트 발생시 page가 refresh되는데, 그걸 막기 위해 작동(원래 동작을 막음)
    try {
      const res = await axios.post('/auth/register', {
        email,
        password,
        username,
        // email: email; 이래야하지만 이름이 같으므로 생략 가능
      });
      console.log('res', res);
      router.push('/login');
    } catch (error: any) {
      //any를 넣은건, 어차피 error에 다른 이상한 형식이 들어와서
      //오류낼 확률이 거의없고, 별로 안중요해서...
      console.log('error', error);
      setErrors(error.response.data || {});
    }
  };

  return (
    <div className="bg-white">
      <div className="flex flex-col items-center justify-center h-screen p-6">
        <div className="w-10/12 mx-auto md:w-96">
          <h1 className="mb-2 text-lg font-medium">회원가입</h1>
          <form
            onSubmit={handleSubmit}
            //submit 이벤트 발생시 handleSubmit 실행
          >
            <InputGroup
              placeholder="Email"
              value={email}
              setValue={setEmail}
              error={errors.email}
            />
            <InputGroup
              placeholder="Username"
              value={username}
              setValue={setUsername}
              error={errors.username}
            />
            <InputGroup
              placeholder="Password"
              value={password}
              setValue={setPassword}
              error={errors.password}
            />

            <button className="w-full py-2 mb-1 text-xs font-bold text-white uppercase bg-gray-400 border border-gray-400 rounded">
              회원 가입
            </button>
          </form>
          <small>
            이미 가입하셨나요?
            <Link legacyBehavior href="/login">
              <a className="ml-1 text-blue-500 uppercase">로그인</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}

export default register;
