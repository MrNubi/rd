import React, { ChangeEvent, useCallback, useRef, useState, VFC } from 'react';

interface Props {
  className?: string;
}

const TextEditer = ({ className }: Props) => {
  const editerRef = useRef<HTMLDivElement>(null);
  const IMGfileInPutRef = useRef<HTMLInputElement>(null);
  const handleImage = useCallback(() => {
    IMGfileInPutRef?.current?.click();
  }, []);
  // 버튼 클릭 시 에디터가 포커스를 잃기 때문에 다시 에디터에 포커스를 해줌
  function focusEditor() {
    const editor = editerRef.current;
    editor?.focus({ preventScroll: true });
  }
  function setStyle(style: string) {
    document.execCommand(style);
    focusEditor();
  }

  const [clickBold, setClickBold] = useState(false);
  const [clickItalic, setClickItalic] = useState(false);
  const [clickUnderline, setClickUnderline] = useState(false);
  const [clickStrike, setClickStrike] = useState(false);
  const [clickOL, setClickOL] = useState(false);
  const [clickUL, setClickUL] = useState(false);

  const onEditerChange = useCallback((e: any) => {
    console.log(e);
  }, []);

  const onClickBold = useCallback(() => {
    // setClickBold((prev) => !prev);
    setStyle('bold');
  }, [setStyle]);

  const onClickItalic = useCallback(() => {
    // setClickItalic((prev) => !prev);
    setStyle('italic');
  }, [setStyle]);

  const onClickUnderline = useCallback(() => {
    // setClickUnderline((prev) => !prev);
    setStyle('underline');
  }, [setStyle]);

  const onClickStrike = useCallback(() => {
    // setClickStrike((prev) => !prev);

    setStyle('strikeThrough');
  }, [setStyle]);

  const onClickOL = useCallback(() => {
    // setClickOL((prev) => !prev);

    setStyle('insertOrderedList');
  }, [setStyle]);

  const onClickUL = useCallback(() => {
    // setClickUL((prev) => !prev);

    setStyle('insertUnorderedList');
  }, [setStyle]);

  const onChangeImgInput = useCallback(
    (e: any) => {
      const files = e.target.files;
      if (!!files) {
        insertImageDate(files[0]);
      }
    },
    [insertImageDate]
  );
  function insertImageDate(file: File) {
    const reader = new FileReader();
    reader.addEventListener('load', function (e) {
      focusEditor();
      document.execCommand('insertImage', false, `${reader.result}`);
    });
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <div className=" w-3/4 flex flex-row justify-between">
        <button
          id="btn-bold"
          className={clickBold ? ' bg-slate-400' : ' bg-transparent'}
          onClick={onClickBold}
        >
          <b>B</b>
        </button>
        <button
          id="btn-italic"
          className={clickItalic ? ' bg-slate-400' : ' bg-transparent'}
          onClick={onClickItalic}
        >
          <i>I</i>
        </button>
        <button
          id="btn-underline"
          className={clickUnderline ? ' bg-slate-400' : ' bg-transparent'}
          onClick={onClickUnderline}
        >
          <u>U</u>
        </button>
        <button
          id="btn-strike"
          className={clickStrike ? ' bg-slate-400' : ' bg-transparent'}
          onClick={onClickStrike}
        >
          <s>S</s>
        </button>
        <button
          id="btn-ordered-list"
          className={clickOL ? ' bg-slate-400' : ' bg-transparent'}
          onClick={onClickOL}
        >
          OL
        </button>
        <button
          id="btn-unordered-list"
          className={clickUL ? ' bg-slate-400' : ' bg-transparent'}
          onClick={onClickUL}
        >
          UL
        </button>
        <button id="btn-image" onClick={handleImage}>
          <img src="/img.png" alt="이미지" />
        </button>
        <input
          type="file"
          hidden
          ref={IMGfileInPutRef}
          onChange={onChangeImgInput}
        ></input>
      </div>

      <div
        id="editor"
        className=" w-full max-w-full py-4 px-6 border border-solid border-gray-400 rounded overflow-auto flex-wrap "
        contentEditable="true"
        ref={editerRef}
        onChange={onEditerChange}
      ></div>
    </div>
  );
};

export default TextEditer;
