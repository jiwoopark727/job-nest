import {
  faEllipsis,
  faSquareCheck as faSolidSquareCheck,
} from '@fortawesome/free-solid-svg-icons';
import { faSquareCheck as faRegularSquareCheck } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import BookMarkAdd from './BookMarkAdd';
import BookMarkEdit from './BookMarkEdit';

type TBookmark = {
  id: number;
  title: string;
  url: string;
  checked: boolean;
  ogImage: string;
};

type TPropsManageModal = {
  closeModal: () => void;
  bookmarksArray: TBookmark[];
  updateBookmarksArray: (item: TBookmark[]) => void;
  toggleCheckbox: (id: number) => void;
};

const BookMarkManageModal = ({
  closeModal,
  bookmarksArray,
  updateBookmarksArray,
  toggleCheckbox,
}: TPropsManageModal) => {
  const [menuBar, setMenuBar] = useState<{ [key: number]: boolean }>({});

  const clickMenuBar = (id: number, idx: number) => {
    setMenuBar((prev) => ({
      [id]: !prev[id],
    }));
    const element = document.getElementById('scrollbar');
    setTimeout(() => {
      if (idx > 8) {
        element?.scrollTo({
          top: element.scrollHeight,
        });
      }
    }, 10);
  };

  const [addModal, setAddModal] = useState(false);
  const handleAddModal = () => {
    setAddModal(true);
  };
  const closeAddModal = () => {
    setAddModal(false);
  };

  const [editModal, setEditModal] = useState(false);
  const handleEditModal = () => {
    setEditModal(true);
  };
  const closeEditModal = () => {
    setEditModal(false);
  };

  const [nowBookmarkId, setNowBookmarkId] = useState(0);

  const deletBookmarksArray = (idx: number) => {
    const tempBookmarksArray = bookmarksArray;
    const newBookmarksArray = tempBookmarksArray.filter(
      (bookmarksArray) => bookmarksArray.id !== idx
    );
    updateBookmarksArray(newBookmarksArray);

    // 로컬 스토리지에 새 북마크 배열을 저장
    localStorage.setItem('Bookmark', JSON.stringify(newBookmarksArray));
  };

  return (
    <>
      <div
        id='modal-content'
        className='bg-white w-[330px] h-[600px] relative rounded-[10px] overflow-hidden'
      >
        <div className='border border-b-1 p-3 mb-[5px]'>
          <button
            className='absolute top-4 right-4 text-black text-[14px] font-medium select-none'
            onClick={closeModal}
          >
            닫기
          </button>
          <span className='text-black text-[20px] font-medium ml-[6px] my-[9px] cursor-default select-none'>
            즐겨찾기 관리
          </span>
        </div>
        <div id='scrollbar' className='overflow-y-scroll h-[450px] select-none'>
          {bookmarksArray.map((val, idx) => (
            // 체크박스
            <div className='pt-[12px] pl-[20px] relative group' key={idx}>
              {val.checked ? (
                <FontAwesomeIcon
                  icon={faSolidSquareCheck}
                  color='#636363'
                  className='mr-[11px] text-[23px] cursor-pointer'
                  onClick={() => {
                    toggleCheckbox(val.id);
                  }}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faRegularSquareCheck}
                  color='#636363'
                  className='mr-[11px] text-[23px] cursor-pointer'
                  onClick={() => {
                    toggleCheckbox(val.id);
                  }}
                />
              )}
              {/* 즐겨찾기 타이틀 */}
              <span className='text-[#8894A0] text-[20px] cursor-default'>
                <span
                  onClick={() => {
                    toggleCheckbox(val.id);
                  }}
                  className='cursor-pointer'
                >
                  {val.title}
                </span>
                {/* ...버튼 */}
                <FontAwesomeIcon
                  className='absolute hidden cursor-pointer right-3 group-hover:inline-block'
                  color='#8894A0'
                  icon={faEllipsis}
                  onClick={() => {
                    clickMenuBar(val.id, idx);
                    setNowBookmarkId(val.id);
                  }}
                />
              </span>
              {menuBar[val.id] ? (
                <span className='flex flex-col right-10 top-3 absolute z-60'>
                  <button
                    className='text-[14px] border border-black px-[18px] py-[6px] z-50 bg-white'
                    onClick={() => {
                      clickMenuBar(val.id, idx);
                      handleEditModal();
                    }}
                  >
                    수정
                  </button>
                  <button
                    className='text-[14px] border border-black px-[18px] py-[6px] z-50 bg-white'
                    onClick={() => {
                      clickMenuBar(val.id, idx);
                      deletBookmarksArray(nowBookmarkId);
                    }}
                  >
                    삭제
                  </button>
                </span>
              ) : (
                <div></div>
              )}
              {editModal ? (
                <BookMarkEdit
                  nowBookmarkId={nowBookmarkId}
                  bookmarksArray={bookmarksArray}
                  updateBookmarksArray={updateBookmarksArray}
                  closeEditModal={closeEditModal}
                />
              ) : (
                <></>
              )}
            </div>
          ))}
        </div>
        <p className='absolute bottom-[14px] left-[20px]'>
          <button
            className='border border-[#ededed] text-[#347fff] bg-[#f8f8f8] w-[289px] h-[53px] text-[18px] font-medium rounded-[10px]'
            onClick={handleAddModal}
          >
            페이지 추가
          </button>
        </p>
      </div>
      {addModal ? (
        <BookMarkAdd
          bookmarksArray={bookmarksArray}
          updateBookmarksArray={updateBookmarksArray}
          closeAddModal={closeAddModal}
        />
      ) : (
        <></>
      )}
    </>
  );
};
export default BookMarkManageModal;
