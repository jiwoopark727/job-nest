import { useEffect, useState } from 'react';
import { useCallback } from 'react';
import BookMarkList from './Bookmark/BookMarkList';
import BookMarkManageModal from './Bookmark/BookMarkManageModal';
import axios from 'axios';
import ToDoApp from './Todo/TodoButton';
import FullCalender from './Calendar/FullCalender';

type TBookmark = {
  id: number;
  title: string;
  url: string;
  checked: boolean;
  ogImage: string;
};

const BookMark = () => {
  const initialBookmarks = [
    {
      id: 1,
      title: '씨리얼',
      url: 'https://seereal.lh.or.kr/main.do',
      checked: true,
      ogImage: '',
    },
    {
      id: 2,
      title: '부동산거래관리시스템',
      url: 'https://irts.molit.go.kr/',
      checked: true,
      ogImage: '',
    },
    {
      id: 3,
      title: '건축행정시스템(세움터)',
      url: 'https://www.eais.go.kr/',
      checked: true,
      ogImage: 'default',
    },
    {
      id: 4,
      title: '토지이용계획열람',
      url: 'https://www.eum.go.kr/web/ar/lu/luLandDet.jsp',
      checked: true,
      ogImage: 'https://www.eum.go.kr/web/favicon.ico',
    },
    {
      id: 5,
      title: '정부24',
      url: 'https://www.gov.kr/portal/',
      checked: true,
      ogImage: '',
    },
    {
      id: 6,
      title: '인터넷등기소',
      url: 'https://www.iros.go.kr/',
      checked: true,
      ogImage: '',
    },
    {
      id: 7,
      title: '부동산 공시가격 알리미',
      url: 'https://www.realtyprice.kr/notice/main/mainBody.htm',
      checked: true,
      ogImage: '',
    },
    {
      id: 8,
      title: '통계지리정보 서비스',
      url: 'https://sgis.kostat.go.kr/',
      checked: true,
      ogImage: '',
    },
    {
      id: 9,
      title: '일사편리',
      url: 'https://www.kras.go.kr/',
      checked: true,
      ogImage: '',
    },
    {
      id: 10,
      title: '부동산 계산기',
      url: 'https://xn--989a00af8jnslv3dba.com/',
      checked: true,
      ogImage: '',
    },
  ];

  // 초기값을 빈 배열로 설정
  const [bookmarksArray, setBookmarksArray] = useState<TBookmark[]>([]);
  useEffect(() => {
    // 로컬 스토리지에서 북마크 데이터를 가져옴
    const savedBookmarks = localStorage.getItem('Bookmark');
    if (savedBookmarks) {
      setBookmarksArray(JSON.parse(savedBookmarks)); // 로컬 스토리지의 데이터를 상태로 설정
    } else {
      // 로컬 스토리지에 데이터가 없으면 초기 북마크를 저장
      localStorage.setItem('Bookmark', JSON.stringify(initialBookmarks));
      setBookmarksArray(initialBookmarks); // 상태를 초기 북마크로 설정
    }
  }, []); // 컴포넌트가 마운트될 때만 실행

  // 체크박스 상태를 변경하는 함수
  const toggleCheckbox = (id: number) => {
    setBookmarksArray((prevBookmarksArray: TBookmark[]) =>
      prevBookmarksArray.map((bookmarksArray: TBookmark) =>
        bookmarksArray.id === id
          ? { ...bookmarksArray, checked: !bookmarksArray.checked } // 체크 상태를 반전시킴
          : bookmarksArray
      )
    );
  };

  //즐겨찾기 목록 체크 여부 저장
  useEffect(() => {
    localStorage.setItem('Bookmark', JSON.stringify(bookmarksArray));
  }, [bookmarksArray]);

  const updateBookmarksArray = (item: TBookmark[]) => {
    setBookmarksArray(item);
  };

  const [manageModal, setManageModal] = useState(false);

  const handleBookMark = () => {
    setManageModal(true);
  };

  const closeModal = () => {
    setManageModal(false);
  };

  // 모달이 열릴 때 바디 스크롤 비활성화
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (manageModal) {
        const modalElement = document.getElementById('modal-content');
        if (modalElement && !modalElement.contains(e.target as Node)) {
          // 모달 외부에서 스크롤이 발생하면, body의 스크롤을 허용
          document.body.style.overflow = 'auto';
        } else {
          // 모달 내부에서 스크롤이 발생하면, body의 스크롤을 막음
          document.body.style.overflow = 'hidden';
        }
      }
    };

    window.addEventListener('wheel', handleWheel);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      document.body.style.overflow = 'auto'; // 컴포넌트가 unmount될 때 cleanup
    };
  }, [manageModal]);

  // 각 URL에 대해 og:image를 추출하는 함수
  const [hasFetchedMetaData, setHasFetchedMetaData] = useState(false);
  const fetchMetaData = async (bookmark: TBookmark) => {
    const base_url = import.meta.env.VITE_BASE_URL;
    const endpoint = '/crolls';
    const full_url = `${base_url}${endpoint}`;

    try {
      // if (bookmark.url === '') {
      const response = await axios.post(full_url, {
        url: bookmark.url,
      });
      const htmlData = response.data.result;

      // HTML에서 메타 데이터를 추출
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlData, 'text/html');

      // og:image 추출
      let ogImageUrl = null;
      const ogImageTag = doc.querySelector('meta[property="og:image"]');
      if (ogImageTag) {
        ogImageUrl = ogImageTag.getAttribute('content');

        // ogImageUrl이 상대 경로인 경우 절대 경로로 변경
        if (ogImageUrl && !/^(https?:)?\/\//.test(ogImageUrl)) {
          const url = new URL(bookmark.url);
          ogImageUrl =
            url.origin +
            (ogImageUrl.startsWith('/') ? ogImageUrl : '/' + ogImageUrl);
        }
      }

      // og:image가 없는 경우 favicon 추출
      let faviconUrl = '';
      if (!ogImageUrl) {
        const faviconTag = doc.querySelector(
          'link[rel="icon"], link[rel="shortcut icon"]'
        );

        faviconUrl = faviconTag ? faviconTag.getAttribute('href') : '';

        // faviconUrl이 상대 경로인 경우 절대 경로로 변경
        if (faviconUrl && !/^(https?:)?\/\//.test(faviconUrl)) {
          const url = new URL(bookmark.url);
          faviconUrl =
            url.origin +
            (faviconUrl.startsWith('/') ? faviconUrl : '/' + faviconUrl);
        }
      }

      console.log(ogImageUrl || faviconUrl);
      // 상태 업데이트
      setBookmarksArray((prevBookmarks) =>
        prevBookmarks.map((b) =>
          b.id === bookmark.id
            ? {
                ...b,
                ogImage:
                  (b.ogImage === '' &&
                    (ogImageUrl || faviconUrl) &&
                    /^(https?:)?\/\//.test(ogImageUrl || faviconUrl) &&
                    ogImageUrl) ||
                  faviconUrl,
                // ? ogImageUrl || faviconUrl
                // : ,
              }
            : b
        )
      );
      // }
    } catch (err) {
      console.error('메타 데이터를 가져오는 중 오류 발생:', err);
    }
  };

  // 모든 북마크에 대해 메타 데이터를 가져오는 함수
  // const fetchAllMetaData = useCallback(async () => {
  //   for (const bookmark of bookmarksArray) {
  //     if (!bookmark.ogImage) {
  //       console.log('fetchMetaData 실행');
  //       await fetchMetaData(bookmark);
  //     }
  //   }
  //   setHasFetchedMetaData(true); // 메타 데이터 가져오기 완료 상태 설정
  // }, [bookmarksArray]);

  const fetchAllMetaData = useCallback(async () => {
    const lastBookmark = bookmarksArray.slice(-1)[0]; // 마지막 항목 가져오기
    if (lastBookmark && !lastBookmark.ogImage) {
      console.log('fetchMetaData 실행');
      await fetchMetaData(lastBookmark);
    }
    setHasFetchedMetaData(true); // 메타 데이터 가져오기 완료 상태 설정
  }, [bookmarksArray]);

  useEffect(() => {
    if (bookmarksArray.length > 0 && !hasFetchedMetaData) {
      console.log('fetchAllMetaData 실행');
      fetchAllMetaData();
    }
  }, [bookmarksArray, hasFetchedMetaData, fetchAllMetaData]);

  useEffect(() => {
    // 가장 최근에 추가된 북마크 가져오기
    const lastBookmark = bookmarksArray.slice(-1)[0];
    if (lastBookmark && !lastBookmark.ogImage) {
      console.log('fetchMetaData 실행');
      fetchMetaData(lastBookmark);
    }
  }, [bookmarksArray]); // bookmarksArray가 변경될 때마다 실행

  return (
    <div className='ml-[65px] mt-[50px] mr-[65px] max-w-[1440px]'>
      <p className='text-[35px] mb-[46px] font-extrabold select-none'>
        즐겨찾기
      </p>

      <div className='grid grid-cols-7 gap-[30px]'>
        <BookMarkList bookmarksArray={bookmarksArray} />
        <div className='border-dash flex justify-center items-center w-[180px] h-[180px] mb-[12px] bg-[#f8f8f8]'>
          <button
            className='bg-[#347fff] text-white px-[20px] py-[12px] rounded-[10px] select-none'
            onClick={handleBookMark}
          >
            관리하기
          </button>
        </div>
      </div>

      {manageModal && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50'>
          <BookMarkManageModal
            closeModal={closeModal}
            bookmarksArray={bookmarksArray}
            updateBookmarksArray={updateBookmarksArray}
            toggleCheckbox={toggleCheckbox}
          ></BookMarkManageModal>
        </div>
      )}

      <div className='absolute right-[190px] bottom-14 select-none'>
        <FullCalender></FullCalender>
      </div>
      <div className='absolute right-9 bottom-14 select-none'>
        <ToDoApp />
      </div>
    </div>
  );
};
export default BookMark;
