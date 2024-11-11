import { useState } from 'react';

type TBookmark = {
  id: number;
  title: string;
  url: string;
  checked: boolean;
  ogImage: string;
};

type TPropsAddModal = {
  nowBookmarkId: number;
  closeEditModal: () => void;
  bookmarksArray: TBookmark[];
  updateBookmarksArray: (item: TBookmark[]) => void;
};

const BookMarkEdit = ({
  nowBookmarkId,
  closeEditModal,
  bookmarksArray,
  updateBookmarksArray,
}: TPropsAddModal) => {
  const [nowTitle, setNowTitle] = useState(
    bookmarksArray[nowBookmarkId - 1].title
  );
  const [nowUrl, setNowUrl] = useState(bookmarksArray[nowBookmarkId - 1].url);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNowTitle(e.target.value); // input 값 업데이트
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNowUrl(e.target.value); // input 값 업데이트
  };

  const tempBookmarksArray = bookmarksArray;
  const editBookmarksArray = () => {
    tempBookmarksArray.map((val, idx) => {
      if (idx === nowBookmarkId - 1) {
        val.title = nowTitle;
        val.url = nowUrl;
      }
    });
  };

  return (
    <>
      <div className='w-[311px] h-[220px] bg-white rounded-[15px] fixed right-[24%] top-[32%]'>
        <p className='px-[22px] pt-[24px]'>
          <input
            type='text'
            value={nowTitle}
            onChange={handleTitleChange}
            spellCheck='false'
            className='border-2 border-[#ccccc] w-[267px] h-[41px] rounded-[6px] text-[14px] pl-[14px]'
          />
        </p>
        <p className='px-[22px] pt-[12px]'>
          <input
            type='text'
            value={nowUrl}
            onChange={handleUrlChange}
            spellCheck='false'
            className='border-2 border-[#ccccc] w-[267px] h-[41px] rounded-[6px] text-[14px] pl-[14px]'
          />
        </p>
        <div className='w-[122px] h-[34px] grid gap-[6px] grid-cols-2 pt-[34px] ml-[93px]'>
          <button
            className='w-[58px] h-[34px] border border-[#747474] rounded-[6px] text-[14px]'
            onClick={closeEditModal}
          >
            취소
          </button>
          <button
            className='w-[58px] h-[34px] border border-[#747474] rounded-[6px] text-[14px] bg-[#747474] text-white'
            onClick={() => {
              editBookmarksArray();
              updateBookmarksArray(tempBookmarksArray);

              // 로컬 스토리지에 새 북마크 배열을 저장
              localStorage.setItem(
                'Bookmark',
                JSON.stringify(tempBookmarksArray)
              );

              closeEditModal();
            }}
          >
            수정
          </button>
        </div>
        {/* <pre>{JSON.stringify(nowTitle)}</pre>
        <pre>{JSON.stringify(nowUrl)}</pre> */}
      </div>
    </>
  );
};
export default BookMarkEdit;
