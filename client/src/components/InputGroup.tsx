import React from 'react';
import cls from 'classnames';

interface InputGroupProps {
  className?: string;
  type?: string;
  placeholder?: string;
  value: string;
  error: string | undefined;
  setValue: (str: string) => void;
}

export const InputGroup: React.FC<InputGroupProps> = ({
  className = 'mb-2 ',
  type = 'text',
  placeholder = '',
  error,
  value,
  setValue,
}) => {
  return (
    <div className={className}>
      <input
        //input 요소들 주입시 넣어야할것 명시
        type={type}
        style={{ minWidth: 300 }}
        className={cls(
          `w-full p-3 transition rounded-2xl text-center duration-200 border border-gray-400  bg-gray-50 focus:bg-white hover:bg-white`,
          { 'border-red-500': error }
          //cls(`이름`, {Boolean판정시 교체할 값:Boolean}) ->true면 Boolean판정시 교체할 값이, false면 백틱 안의 이름 출력
        )}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        // onChange로 위의 value번경, (e), 즉 이벤트 발생시 타겟 벨류로 밸류를 바꿔씀
      />
      <small className="font-medium text-red-500">{error} </small>
      {/* 에러메세지 전달*/}
    </div>
  );
};
export default InputGroup;
//classname 라이브러리 쓰는 이유: 에러 발생같은 이벤트 처리시 classname 전환을 통한 css통제를 더욱 쉽게 가져가기 위해
//사용법: className이라는 모듈 안에 이름값 : Boolean에서 Boolean이 true면 그대로, false면 ''으로 출력
