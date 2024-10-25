import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { faSquareCheck as faSolidSquareCheck } from '@fortawesome/free-solid-svg-icons';
import { faSquareCheck as faRegularSquareCheck } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../assets/Loader.css';

type TBuildingData = {
  unique: string;
  kind: string;
  address: string;
};

type TApiResponse = {
  result: TBuildingData[];
  last_page: string;
  status: number;
};

const RegistrationIssuanceMain = () => {
  const navigate = useNavigate();
  const [inputAddress, setInputAddress] = useState('');
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleLoading = (status: boolean) => {
    setLoading(status);
  };

  const handleInputAddress = (val: string) => {
    setInputAddress(val);
  };

  const clearInput = () => {
    setInputAddress('');
  };

  const [data, setData] = useState<TBuildingData[]>([]);

  // 각 항목의 체크 상태를 관리하는 상태
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    {}
  );

  // 개별 체크박스의 상태를 토글하는 함수
  const handleCheckboxChange = (unique: string) => {
    setCheckedItems((prevState) => ({
      ...prevState,
      [unique]: !prevState[unique], // 해당 항목의 상태를 토글
    }));
    console.log(trueKeys.length);
  };

  // 검색을 위한 요청 함수 (axios 사용)
  const fetchSearchData = async (juso: string, pageNo: number) => {
    const base_url = import.meta.env.VITE_BASE_URL;
    const endpoint = '/juso/search';
    const full_url = `${base_url}${endpoint}`;

    handleLoading(true); // 검색을 시작할 때 로딩 시작

    try {
      const response = await axios.post(full_url, {
        juso: juso,
        page_no: pageNo,
      });

      const json: TApiResponse = response.data;

      if (json.status === 200) {
        setData(json.result);
        setPageCount(Number(json.last_page));
        setLoading(false);
      } else {
        console.error('API 요청이 실패했습니다.', json.status);
        setLoading(false);
      }
    } catch (error) {
      console.error('API 요청 중 오류 발생:', error);
      setLoading(false);
    }
  };

  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 관리
  const [currentPageGroup, setCurrentPageGroup] = useState(0); // 현재 페이지 그룹 관리
  const pagesPerGroup = 5; // 한 그룹에 표시할 페이지 수

  // 선택한 페이지로 이동
  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber); // 클릭한 페이지 번호를 상태로 설정
    fetchSearchData(inputAddress, pageNumber); // 페이지 번호에 따라 데이터 가져오기
  };

  const pageRendering = (pageCount: number) => {
    const pages = []; // 반환할 JSX 요소들을 저장할 배열
    const startPage = currentPageGroup * pagesPerGroup; // 현재 페이지 그룹에서 시작할 페이지
    const endPage = Math.min(startPage + pagesPerGroup, pageCount); // 페이지 그룹 내 끝 페이지

    for (let i = startPage; i < endPage; i++) {
      const pageNumber = i + 1;
      pages.push(
        <span key={i} className='select-none'>
          <button
            className={`m-2 rounded-full px-[10px] py-[2.2px] text-[15px] ${
              currentPage === pageNumber
                ? 'bg-[#347fff] text-white' // 현재 페이지일 때 스타일
                : 'text-gray-400 hover:text-gray-900'
            }`}
            onClick={() => {
              handlePageClick(i + 1);
              // setAllCheck(false);
            }}
          >
            {pageNumber}
          </button>
        </span>
      );
    }

    return <>{pages}</>; // 배열을 JSX 형태로 반환
  };

  // 이전 페이지 그룹으로 이동
  const handlePreviousGroup = () => {
    if (currentPageGroup > 0) {
      setCurrentPageGroup(currentPageGroup - 1);
      // setCurrentPage(currentPageGroup * pagesPerGroup); // 페이지 그룹의 첫 번째 페이지로 이동
    }
  };

  // 다음 페이지 그룹으로 이동
  const handleNextGroup = () => {
    const totalPageGroups = Math.ceil(pageCount / pagesPerGroup);
    if (currentPageGroup < totalPageGroups - 1) {
      setCurrentPageGroup(currentPageGroup + 1);
      // setCurrentPage((currentPageGroup + 1) * pagesPerGroup + 1); // 다음 페이지 그룹의 첫 번째 페이지로 이동
    }
  };

  const [allCheck, setAllCheck] = useState(false);
  const toggleCheckbox = () => {
    setAllCheck(!allCheck);

    // 전체 선택 또는 해제 시 모든 체크박스를 업데이트
    const updatedCheckedItems: { [key: string]: boolean } = {};
    data.forEach((item) => {
      updatedCheckedItems[item.unique] = !allCheck; // 전체 선택 시 true, 해제 시 false
    });
    setCheckedItems(updatedCheckedItems);
  };

  const [filterOption, setFilterOption] = useState('전체');
  const handleFilterOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterOption(e.target.value);
  };

  //체크된 아이템의 unique값 반환
  const trueKeys = Object.keys(checkedItems).filter((key) => checkedItems[key]);

  //unique값으로 주소값 찾기
  const getAddressByUnique = (unique: string): string | undefined => {
    const found = data.find((item) => item.unique === unique);
    return found ? found.address : undefined;
  };

  return (
    <div className='flex flex-row overflow-hidden'>
      <div
        className={`flex flex-col items-center grow-0 shrink-0 duration-700 ${
          trueKeys.length > 0 ? 'basis-[70%]' : 'basis-[100%]'
        }`}
      >
        <div className='pl-[65px] pt-[21px] w-full flex justify-between'>
          <div className='pt-[29px]'>
            <span className='text-[35px] mb-[46px] font-extrabold select-none'>
              등기/대장 열람
            </span>
            <span className='text-[15px] ml-[30px] mb-[46px] font-bold select-none'>
              동시에 여러 개의 등기 또는 대장을 발급받을 수 있어요.
            </span>
          </div>
          {trueKeys.length > 0 ? null : (
            <span>
              <button
                className='bg-[#347fff] w-[130px] h-[42px] mr-[24px] font-medium text-white'
                onClick={() => {
                  navigate('/registrationIssuance/viewHistory');
                }}
              >
                열람내역
              </button>
            </span>
          )}
        </div>
        {/* 사이드 바가 열리면 w를 좀 늘려줘야 버튼이 아래로 안 빠짐...! */}
        <div
          className={`w-[80%] mt-[42px] duration-700 ${
            trueKeys.length > 0 ? 'w-[90%]' : null
          }`}
        >
          <div className='flex flex-wrap'>
            <span
              className={`pr-[10px] grow-0 shrink-0 duration-700 ${
                trueKeys.length > 0 ? 'basis-[9%]' : 'basis-[7%]'
              }`}
            >
              <select
                className='text-[#6f6f6f] cursor-pointer w-[100%] h-[40px] border border-[#cccccc] text-[14x] pl-[7px] py-[1px]'
                name='doc'
                id='type'
                onChange={handleFilterOption}
              >
                <option value='전체'>전체</option>
                <option value='등기'>등기</option>
                <option value='대장'>대장</option>
              </select>
            </span>
            <span
              className={`relative grow-0 shrink-0 duration-700 ${
                trueKeys.length > 0 ? 'basis-[84%]' : 'basis-[88%]'
              }`}
            >
              <input
                type='text'
                placeholder='주소를 입력해주세요.'
                value={inputAddress}
                spellCheck='false'
                className='w-[100%] h-[40px] border border-[#cccccc] pl-[15px] pr-[30px]'
                onChange={(e) => {
                  handleInputAddress(e.target.value);
                }}
              />
              {inputAddress && (
                <button
                  onClick={clearInput}
                  className='absolute right-[15px] top-[50%] transform -translate-y-1/2 text-gray-500'
                >
                  ×
                </button>
              )}
            </span>
            <span
              className={`pl-[12px] relative grow-0 shrink-0 duration-700 ${
                trueKeys.length > 0 ? 'basis-[7%]' : 'basis-[5%]'
              }`}
            >
              <button
                className='text-[14px] w-[100%] h-[40px] bg-[#347fff] text-white rounded font-normal'
                onClick={() => {
                  fetchSearchData(inputAddress, 1);
                }}
              >
                검색
              </button>
            </span>
          </div>

          {/* 받아온 데이터들 출력 */}
          <div className='mt-[20px]'>
            {loading ? (
              <span className='flex justify-center items-center mt-[100px] mb-[140px]'>
                <span className='loader'></span>
              </span>
            ) : null}
            {/* 전체선택 체크박스 */}
            {data.length > 0 && !loading ? (
              <div>
                {allCheck ? (
                  <div className='flex items-center mb-[10px]'>
                    <FontAwesomeIcon
                      icon={faSolidSquareCheck}
                      color='#347fff'
                      className='mr-[8px] text-[23px] cursor-pointer'
                      onClick={() => {
                        toggleCheckbox();
                      }}
                    />
                    <span
                      onClick={() => {
                        toggleCheckbox();
                      }}
                      className='cursor-pointer select-none'
                    >
                      전체 선택
                    </span>
                  </div>
                ) : (
                  <div className='flex items-center mb-[10px]'>
                    <FontAwesomeIcon
                      icon={faRegularSquareCheck}
                      color='#636363'
                      className='mr-[8px] text-[23px] cursor-pointer'
                      onClick={() => {
                        toggleCheckbox();
                      }}
                    />
                    <span
                      onClick={() => {
                        toggleCheckbox();
                      }}
                      className='cursor-pointer select-none'
                    >
                      전체 선택
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <></>
            )}
            {/* 검색 결과 출력 */}
            <div className=''>
              {data.length > 0 && !loading
                ? data?.map((item) => (
                    <div
                      key={item.unique}
                      className={`mb-4 border ${
                        checkedItems[item.unique]
                          ? 'border-[#347fff] border-[1.5px] mb-[14px]'
                          : 'border-[#8894A0]'
                      }`}
                    >
                      <p className='text-[14px] text-[#6f6f6f] p-[9px] select-none flex items-center'>
                        <label className='pr-[15px] pl-[5px] pt-[6px] cursor-pointer'>
                          <input
                            type='checkbox'
                            className='accent-[#347fff] h-[17px] w-[17px] cursor-pointer'
                            checked={!!checkedItems[item.unique]} // 체크 상태에 따라 체크박스가 체크됨
                            onChange={() => handleCheckboxChange(item.unique)} // 체크박스를 클릭하면 상태 변경
                          />
                        </label>
                        <span className='text-black rounded-[20px] mr-[22px] border border-[#ccccc] py-[6px] px-4'>
                          {filterOption}
                        </span>
                        <span>{item.address}</span>
                      </p>
                    </div>
                  ))
                : null}
              {/* 페이지 네이션 파트 */}
              <div className='flex justify-center items-center py-[14px]'>
                {data.length > 0 ? (
                  <>
                    <span
                      className={`bg-gray-100 rounded-full px-1 mr-2 cursor-pointer select-none ${
                        currentPageGroup === 0 ? 'opacity-50' : ''
                      }`}
                      onClick={handlePreviousGroup}
                    >
                      ←
                    </span>
                    <div className='bg-gray-100 rounded-full select-none'>
                      {pageRendering(pageCount)}
                    </div>
                    <span
                      className={`bg-gray-100 rounded-full px-1 ml-2 cursor-pointer select-none ${
                        (currentPageGroup + 1) * pagesPerGroup >= pageCount
                          ? 'opacity-50'
                          : ''
                      }`}
                      onClick={handleNextGroup}
                    >
                      →
                    </span>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 사이드바 */}
      <div
        className={`h-screen bg-[#f2f2f2] my-[23px] grow-0 shrink-0 basis-[28.5%] transition-all duration-1000 relative ${
          trueKeys.length > 0 ? 'translate-x-0' : 'translate-x-[109%]'
        }`}
      >
        <div>
          <div className='pl-[32px] pt-[41px] pb-[35px]'>
            <span className='text-[20px] font-bold'>선택</span>
            <span className='ml-[30px] text-[14px] font-normal'>
              총 {trueKeys.length}개
            </span>
          </div>
        </div>
        {trueKeys.map((val) => (
          <div className='pl-[17px] pb-4'>
            <span className='text-black bg-white text-[13px] font-bold rounded-[20px] mr-[15px] border border-gray-400 py-[6px] px-4'>
              {filterOption}
            </span>
            <span className='text-[13px]'>{getAddressByUnique(val)}</span>
          </div>
        ))}
        <div className='flex justify-center'>
          <button className='absolute bottom-[30px] w-[356px] h-[42px] bg-[#347fff] text-white'>
            열람하기
          </button>
        </div>
      </div>
    </div>
  );
};
export default RegistrationIssuanceMain;
