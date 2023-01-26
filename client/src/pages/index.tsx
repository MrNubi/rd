import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import styles from '../styles/Home.module.css';
import Login from './login';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import Link from 'next/link';
import { useAuthState } from '../context/auth';
import useSWR from 'swr';
import { Sub } from '../types';
import axios from 'axios';

const Home: NextPage = () => {
  let router = useRouter();
  const fetcher = async (url: string) => {
    return await axios.get(url).then((res) => res.data);
  };
  const address = `http://localhost:4000/api/subs/sub/topSubs`;

  const { data: topSubs } = useSWR<Sub[]>(address, fetcher);
  console.log('topSubs : ', topSubs);
  const { authenticated } = useAuthState();

  return (
    <div className="flex max-w-5xl px-4 pt-5 mx-auto">
      {/* 포스트 리스트 */}

      <div className="w-full md:mr-3 md:w-8/12">
        {/*md 사이즈일때 사이즈 재조정하라고 지정해놓음  */}
        {
          // isInitialLoading &&
          <p className="text-lg text-center">로딩중입니다...</p>
        }
        {
          // posts?.map((post) => (
          //   <PostCard key={post.identifier} post={post} mutate={mutate} />
          // ))
        }
      </div>

      {/* 사이드바 */}
      <div className="hidden w-4/12 ml-3 md:block">
        {/* //md보다커지면 볼 수 있음 */}

        <div className="bg-white border rounded">
          <div className="p-4 border-b">
            <p className="text-lg font-semibold text-center">상위 커뮤니티</p>
          </div>

          {/* 커뮤니티 리스트 */}
          <div>
            {topSubs?.map((sub) => (
              <div
                key={sub.name}
                className="flex items-center px-4 py-2 text-xs border-b"
              >
                <Link legacyBehavior href={`/r/${sub.name}`}>
                  <a>
                    <Image
                      src={sub.imageUrl}
                      className="rounded-full cursor-pointer"
                      alt="Sub"
                      width={24}
                      height={24}
                    />
                  </a>
                </Link>
                <Link legacyBehavior href={`/r/${sub.name}`}>
                  <a className="ml-2 font-bold hover:cursor-pointer">
                    /r/{sub.name}
                  </a>
                </Link>
                <p className="ml-auto font-md">{sub.postCount}</p>
              </div>
            ))}
          </div>
          {authenticated && (
            <div className="w-full py-6 text-center">
              <Link legacyBehavior href="/subs/create">
                <a className="w-full p-2 text-center text-white bg-gray-400 rounded">
                  커뮤니티 만들기
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
