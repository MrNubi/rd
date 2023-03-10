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
import useSWRInfinite from 'swr/infinite';
import { Post, Sub } from '../types';
import axios from 'axios';
import PostCard from '../components/PostCard';
import { useEffect, useState } from 'react';

const Home: NextPage = () => {
  let router = useRouter();
  const fetcher = async (url: string) => {
    return await axios.get(url).then((res) => res.data);
  };
  const address = `http://localhost:4000/api/subs/sub/topSubs`;

  const { data: topSubs } = useSWR<Sub[]>(address, fetcher);
  console.log('topSubs : ', topSubs);
  const { authenticated } = useAuthState();

  const getKey = (pageIndex: number, previousPageData: Post[]) => {
    if (previousPageData && !previousPageData.length) {
      return null;
      //previousPageData가 있고, 그 길이가 부정값(null, 0 이런거)면 null 반환
      //-> 더이상 가져 올 페이지가 없기 때문
    }
    //아니라면(더 가져올 페이지가 있다면), 경로를 지정해줌
    return `/posts?page=${pageIndex}`;
  };
  const {
    data,
    error,
    size: page,
    setSize: setPage,
    isValidating,
    mutate,
  } = useSWRInfinite<Post[]>(getKey);

  const isInitialLoading = !data && !error;
  const posts: Post[] = data ? ([] as Post[]).concat(...data) : [];
  /*
      data: 각 페이지의 가져오기 응답값의 배열
      error: useSWR의 error과 동일
      size: 가져올 페이지 및 반환될 페이지의 수
      setSize :  가져와야 되는  페이지의 수를 설정
      isValidating: useSWR과 동일, 데이터 fetching중인지 알아내는 boolean 값 -> loading중인지 아닌지
      -> 일부 자료에서는 const isLoading = (!data && !error) || isValidating 이런식으로 data와 error이 없는 상황까지 넣어서 로딩을 체크해준다고함
      mutate : useSWR의 바인딩된 뮤테이트 함수와 동일하지만, 데이터 배열을 다룸
      
    */

  const [observedPost, setObservedPost] = useState(''); //8번째 댓글 id 넣을 곳
  const observeElement = (element: HTMLElement | null) => {
    if (!element) {
      //null 은 여기서 catch
      console.log(`!element return`);
      return;
    }
    //element가 있다면, 브라우저의 뷰포트와 설정한 엘리먼트간의 교차점을 관찰
    const observer = new IntersectionObserver(
      //entries 는 IntersectionObserverEntries의 인스턴스의 배열
      (entries) => {
        //isIntersecting: 관찰 대상들끼리의 교차 여부 Boolean
        if (entries[0].isIntersecting === true) {
          console.log('마지막 포스트에 왔습니다.');
          setPage(page + 1);
          observer.unobserve(element); //이 전에 옵저빙하고있던 것을 없에줌
        }
      },
      { threshold: 1 } // 다 들어갔을 때 콜백함수 실행
    );
    // 대상 요소의 관찰을 시작
    observer.observe(element);
  };
  useEffect(() => {
    //post가 없다면 바로 리턴
    if (!posts || posts.length === 0) return;
    // posts 배열 안의 마지막 아이디 가져오기
    const id = posts[posts.length - 1].identifier;
    // post 배열에 새로 포스트가 들어가서 포스트가 바뀌었으면
    // 바뀐 포스트 배열의 마지막 포스트를 찾아서 걔 id따줘야됨
    // 즉, 그 포스트가 observedPost 되는 것
    if (id !== observedPost) {
      setObservedPost(id);
      observeElement(document.getElementById(id));
    }
  }, [posts]);

  return (
    <div className="flex mt-5 max-w-5xl px-4 pt-5 mx-auto">
      {/* 포스트 리스트 */}

      <div className="w-full md:mr-3 md:w-8/12">
        {/*md 사이즈일때 사이즈 재조정하라고 지정해놓음  */}
        {isInitialLoading && (
          <p className="text-lg text-center">로딩중입니다...</p>
        )}
        {posts?.map((post) => (
          <PostCard key={post.identifier} post={post} mutate={mutate} />
        ))}
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
                <div className="w-full p-2 text-center text-white bg-gray-400 rounded">
                  커뮤니티 만들기
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
