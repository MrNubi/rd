import axios from 'axios';
import Link from 'next/link';
import { useAuthDispatch, useAuthState } from '../context/auth';

const navbar: React.FC = () => {
  const { loading, authenticated } = useAuthState();
  const dispatch = useAuthDispatch();

  const handleLogout = () => {
    axios
      .post('/auth/logout')
      .then(() => {
        //보낸 이후 해야할 일 넣기

        //logout상태로 설정
        dispatch('LOGOUT');

        //페이지 리로드 강제
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between px-5 bg-white h-13">
      <span className="text-2xl font-semibold text-gray-400">
        <Link legacyBehavior href="/">
          {/* <a>
                <Image
                    src="/reddit-name-logo.png"
                    alt="logo"
                    width={80}
                    height={45}
                >
                </Image>
                </a> */}
          Community logo
        </Link>
      </span>
      <div className="max-w-full px-4">
        <div className="relative flex items-center bg-gray-100 border rounded hover:border-gray-700 hover:bg-white">
          {/* <FaSearch className="ml-2 text-gray-400" /> */}
          <input
            type="text"
            placeholder="Search ..."
            className="px-3 py-1 bg-transparent rounded h-7 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex">
        {!loading &&
          (authenticated ? (
            //인증이 된 상태 -> 버튼은 로그아웃을 지시해야 함
            <button
              className="w-20 px-2 mr-2 text-sm text-center text-white bg-gray-400 rounded h-7"
              onClick={handleLogout}
            >
              로그아웃
            </button>
          ) : (
            <>
              {/* 안증이 안 된 상태 -> 로그인을 위해 기능해야함 */}
              <Link legacyBehavior href="/login">
                <a className="w-20 px-2 pt-1 mr-2 text-sm text-center text-blue-500 border border-blue-500 rounded h-7">
                  로그인
                </a>
              </Link>
              <Link legacyBehavior href="/register">
                <a className="w-20 px-2 pt-1 text-sm text-center text-white bg-gray-400 rounded h-7">
                  회원가입
                </a>
              </Link>
            </>
          ))}
      </div>
    </div>
  );
};

export default navbar;
