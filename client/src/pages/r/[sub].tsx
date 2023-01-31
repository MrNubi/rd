import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import PostCard from '../../components/PostCard';
import SideBar from '../../components/SideBar';
import { useAuthState } from '../../context/auth';
import { Post } from '../../types';

const subPage = () => {
  const [ownSub, setOwnSub] = useState(false);
  const { authenticated, user } = useAuthState();
  const router = useRouter();
  const subName = router.query.sub;
  const fileInPutRef = useRef<HTMLInputElement>(null);

  const fetcher = async (url: string) => {
    try {
      const res = await axios.get(url);
      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  };

  // 여기에서의 sub는 파일 명 안의 [sub]를 받음

  const {
    data: sub,
    error,
    mutate,
  } = useSWR(subName ? `/subs/${subName}` : null);
  useEffect(() => {
    if (!sub || !user) return;
    setOwnSub(authenticated && user.username === sub.username);
  }, [sub]);

  //HTMLInputElement: input 태그에 대한 속성, 메서드 등을 가지고있음
  //정의된 속성 중 원하는 것을 가져와서 꺼내 쓰는 형식
  // useRef: 특정 돔을 리액트에서 고르는 핸들러
  // useRef로 그 엘리먼트의 크기, 스크롤 위치, 포커스 여부 등을 가져오거나 조절 가능

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) return;

    const file = event.target.files[0];
    console.log('file', file);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', fileInPutRef.current!.name);

    try {
      await axios.post(`/subs/${sub.name}/upload`, formData, {
        headers: { 'Context-Type': 'multipart/form-data' },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const openFileInput = (type: string) => {
    if (!authenticated) {
      return;
    }
    const fileInput = fileInPutRef.current;
    //fileInPutRef를 선택
    if (fileInput) {
      fileInput.name = type;
      fileInput.click();
    }
  };

  let renderPosts;
  if (!sub) {
    renderPosts = <p className="text-lg text-center">로딩중...</p>;
  } else if (sub.posts.length === 0) {
    console.log('subs', sub);
    renderPosts = (
      <p className="text-lg text-center">아직 작성된 포스트가 없습니다.</p>
    );
    console.log('posts', sub.posts);
  } else {
    renderPosts = sub.posts.map((post: Post) => (
      <PostCard key={post.identifier} post={post} subMutate={mutate} />
    ));
  }

  console.log(`sub`, sub);

  return (
    <>
      {
        sub && (
          <React.Fragment>
            <div>
              <input
                type="file"
                hidden={true}
                ref={fileInPutRef}
                onChange={uploadImage}
              ></input>

              {/* 베너이미지 자리 */}
              <div className="bg-gray-400">
                {sub.bannerUrl ? (
                  <div
                    className="h-56"
                    style={{
                      backgroundImage: `url(${sub.bannerUrl})`,
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: `cover`,
                      backgroundPosition: `center`,
                    }}
                    onClick={() => openFileInput('banner')}
                  ></div>
                ) : (
                  <div
                    className="h-20 bg-gray-400"
                    onClick={() => openFileInput('banner')}
                  ></div>
                )}
              </div>
              {/* sub(커뮤) 메타데이터 자리 */}
              <div className="h-20 bg-white">
                <div className="relative flex max-w-5xl px5 mx-auto">
                  <div className=" absolute" style={{ top: -15 }}>
                    {sub.imageUrl && (
                      <Image
                        src={sub.imageUrl}
                        alt="커뮤니티 페이지"
                        width={70}
                        height={70}
                        className=" rounded-full"
                        onClick={() => openFileInput('image')}
                      />
                    )}
                  </div>
                  <div className=" pt-1 pl-24">
                    <div className=" flex items-center">
                      <h1 className="mb-1 text-3xl font-bold">{sub.title}</h1>
                    </div>
                    <p className=" text-small font-bold text-gray-400">
                      /r/{sub.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* 포스트와 사이드 바 부분 */}
            <div className="flex max-w-5xl px-4 pt-5 mx-auto">
              <div className="w-full md:mr-3 md:w-8/12">{renderPosts}</div>
              <SideBar sub={sub} />
            </div>
          </React.Fragment>
        )
        // 컴포넌트가 여러 엘리먼트를 return 할때 jsx규칙상 하나의 태그로 묶어서 return 해줘야 하는데, 이때 fragment를 사용하면 dom에 별도의 노드를 추가하지 않고 여러자식을 그룹화 할 수 있다
        // <>는 <React.Fragment>s의 단축문법
        // But <>는 props를 완전히 사용할 수 없지만, React.Fragments는 key를 넣어줄 수 있음
        //의의: 의미없는 div층 제거 가능
      }
    </>
  );
};

export default subPage;
