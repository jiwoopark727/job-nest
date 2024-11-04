import { useState } from 'react';

type TBookmark = {
  id: number;
  title: string;
  url: string;
  checked: boolean;
  ogImage: string;
};

type TPropsAddModal = {
  closeAddModal: () => void;
  bookmarksArray: TBookmark[];
  updateBookmarksArray: (item: TBookmark[]) => void;
};

const BookMarkAdd = ({
  closeAddModal,
  bookmarksArray,
  updateBookmarksArray,
}: TPropsAddModal) => {
  const [inputTitleValue, setInputTitleValue] = useState('제목을 입력하세요');
  const [inputUrlValue, setInputUrlValue] = useState('url을 입력하세요');

  const handleTitleFocus = () => {
    if (inputTitleValue === '제목을 입력하세요') {
      setInputTitleValue('');
    }
  };
  const handleUrlFocus = () => {
    if (inputUrlValue === 'url을 입력하세요') {
      setInputUrlValue('');
    }
  };
  const handleTitleBlur = () => {
    if (inputTitleValue === '') {
      setInputTitleValue('제목을 입력하세요');
    }
  };
  const handleUrlBlur = () => {
    if (inputUrlValue === '') {
      setInputUrlValue('url을 입력하세요');
    }
  };

  const handleFocusChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputTitleValue(e.target.value); // input 값 업데이트
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputUrlValue(e.target.value); // input 값 업데이트
  };

  const savedBookmarks = localStorage.getItem('Bookmark');
  // 데이터를 다시 객체 배열로 변환
  const tempBookmarksArray = savedBookmarks ? JSON.parse(savedBookmarks) : [];

  return (
    <>
      <div className='w-[311px] h-[220px] bg-white rounded-[15px] fixed right-[24%] top-[58%]'>
        <p className='px-[22px] pt-[24px]'>
          <input
            type='text'
            value={inputTitleValue}
            onFocus={handleTitleFocus}
            onBlur={handleTitleBlur}
            onChange={handleFocusChange}
            spellCheck='false'
            className='border-2 border-[#ccccc] w-[267px] h-[41px] rounded-[6px] text-[14px] pl-[14px]'
          />
        </p>
        <p className='px-[22px] pt-[12px]'>
          <input
            type='text'
            value={inputUrlValue}
            onFocus={handleUrlFocus}
            onBlur={handleUrlBlur}
            onChange={handleUrlChange}
            spellCheck='false'
            className='border-2 border-[#ccccc] w-[267px] h-[41px] rounded-[6px] text-[14px] pl-[14px]'
          />
        </p>
        <div className='w-[122px] h-[34px] grid gap-[6px] grid-cols-2 pt-[34px] ml-[93px]'>
          <button
            className='w-[58px] h-[34px] border border-[#747474] rounded-[6px] text-[14px]'
            onClick={closeAddModal}
          >
            취소
          </button>
          <button
            className='w-[58px] h-[34px] border border-[#747474] rounded-[6px] text-[14px] bg-[#747474] text-white'
            onClick={() => {
              const newBookmark = {
                id: tempBookmarksArray[tempBookmarksArray.length - 1].id + 1,
                title: inputTitleValue,
                url: inputUrlValue,
                checked: true,
                ogImage: '',
              };
              // 기존 북마크 배열에 새 북마크를 추가
              const newBookmarksArray = [...tempBookmarksArray, newBookmark];
              updateBookmarksArray(newBookmarksArray);

              console.log(newBookmarksArray);

              // 로컬 스토리지에 새 북마크 배열을 저장
              localStorage.setItem(
                'Bookmark',
                JSON.stringify(newBookmarksArray)
              );

              closeAddModal();
            }}
          >
            저장
          </button>
        </div>
        {/* <pre>{JSON.stringify(inputTitleValue)}</pre>
          <pre>{JSON.stringify(inputUrlValue)}</pre>
          <pre>{JSON.stringify(tempBookmarksArray.length)}</pre> */}
      </div>
    </>
  );
};
export default BookMarkAdd;
