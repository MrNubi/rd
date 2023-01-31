import dayjs from 'dayjs';
import Link from 'next/link';
import React from 'react';
import { useAuthState } from '../context/auth';
import { Sub } from '../types';

type Props = {
  sub: Sub;
};

const SideBar = ({ sub }: Props) => {
  const { authenticated } = useAuthState();
  return (
    <div className="hidden w-4/12 ml-3 md:block">
      {/* 기본적으로 hidden, 작아지면 없는 상태를 디폴트로 주고 md보다 커지면 block해주면서 나타나게 */}
      <div className="bg-white border rounded">
        <div className="p-3 bg-gray-400 rounded-t">
          <p className="font-semibold text-white">사이드바</p>
        </div>
        <div className="p-3">
          <p className="mb-3 text-base">{sub?.description}</p>
          <div className="flex mb-3 text-sm font-medium">
            <div className="w-1/2">
              <p>{`100(맴버 숫자 들갈자리)`}</p>
              <p>멤버</p>
            </div>
          </div>
          <p className="my-3"> {dayjs(sub?.createdAt).format('MM.DD.YYYY')}</p>
          {authenticated && (
            <div className="mx-0 my-2">
              <Link legacyBehavior href={`/r/${sub.name}/create`}>
                <a className="w-full p-2 text-sm text-white bg-gray-400 rounded">
                  포스트 생성
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
