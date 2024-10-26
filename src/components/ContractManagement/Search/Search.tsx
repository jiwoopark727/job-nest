import React, { useState, useEffect } from 'react';
import Btn from './Btn';
import clipboard from '../../../assets/images/clipboard.png';
import SearchDropDown from './SearchDropDown';
import SearchCheck from './SearchCheck';
import SearchDate from './SearchDate';
import { FiSearch, FiRefreshCw } from 'react-icons/fi';
import SearchBtn from './SearchBtn';
import SearchResults from './SearchResults';
import axios from 'axios';

interface SearchProps {
  onCreateDraft: () => void;
}

type Data = {
  계약일: string;
  잔금일: string;
  만기일: string;
  계약서유형: string;
  거래유형: string;
  계약상태: string;
  중개유형: string;
  소재지: string;
  매매보증금: number;
  매도임대인: string;
  매수입차인: string;
  공동중개업소: string | null;
  계약서번호: string;
};

const Search: React.FC<SearchProps> = ({ onCreateDraft }) => {
  const contractType = [
    '아파트',
    '주상복합',
    '오피스텔',
    '도시형생활주택',
    '상가',
    '사무실',
    '연립',
    '다세대',
    '아파트분양권',
    '주상복합분양권',
    '오피스텔분양권',
    '조합원입주권',
    '단독주택',
    '다가구주택',
    '다중주택',
    '원룸',
    '상가주택',
    '상가건물',
    '건물',
    '공장',
    '창고',
    '부동산',
    '토지',
    '표준임대차계약서',
    '주택표준임대차계약서',
    '상가건물임대차표준계약서',
    '전대차(주택)',
    '전대차(상가)',
    '상가권리금',
    '권리양도양수',
  ];
  const transactionType = ['매매', '전세', '월세', '연세'];
  const contractStatusOptions = [
    { label: '전체' },
    { label: '계약중' },
    { label: '계약완료' },
  ];

  const brokerageTypeOptions = [{ label: '공동중개' }, { label: '단독중개' }];

  const [selectedContractType, setSelectedContractType] = useState<
    string | null
  >(null);
  const [selectedTransactionType, setSelectedTransactionType] = useState<
    string | null
  >(null);
  const [selectedContractStatus, setSelectedContractStatus] = useState<
    string | null
  >(null);
  const [selectedBrokerageType, setSelectedBrokerageType] = useState<
    string | null
  >(null);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [data, setData] = useState<Data[]>([]);
  const [filteredData, setFilteredData] = useState<Data[]>([]);
  const [isSearchClicked, setIsSearchClicked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 데이터
  const fetchData = async () => {
    setIsLoading(true);
    const url = `${import.meta.env.VITE_BASE_URL}/contract-list`;
    try {
      const response = await axios.get(url, {
        headers: {
          'Referrer-Policy': 'no-referrer',
        },
      });

      const fetchedData =
        response.data?.result.map((item: any) => ({
          계약일: item.contract_date,
          잔금일: item.balance_date,
          만기일: item.end_date,
          계약서유형: item.contract_type,
          거래유형: item.transaction_type,
          계약상태: item.contract_status,
          중개유형: item.brokerage_type || null,
          소재지: item.juso,
          매매보증금: item.deposit,
          매도임대인: item.seller,
          매수입차인: item.buyer,
          공동중개업소: item.partner_realtor,
          계약서번호: item.contract_num,
        })) ?? [];

      setData(fetchedData);
    } catch (err: any) {
      console.error('데이터를 가져오는 데 실패했습니다.', err);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const resetAll = () => {
    setSelectedContractType(null);
    setSelectedTransactionType(null);
    setSelectedContractStatus(null);
    setSelectedBrokerageType(null);
    setStartDate(new Date());
    setEndDate(new Date());
    setSelectedPeriod('');
    setFilteredData(data); // 초기화 시 전체 데이터
    setIsSearchClicked(false);
  };

  const handleSearch = () => {
    const today = new Date();
    const startDateObj = startDate ? new Date(startDate) : today;
    const endDateObj = endDate ? new Date(endDate) : today;

    console.log('Start Date Object:', startDateObj?.toDateString());
    console.log('End Date Object:', endDateObj?.toDateString());

    const filteredResults = data.filter((item) => {
      const isContractTypeMatch =
        !selectedContractType || item.계약서유형 === selectedContractType;
      const isTransactionTypeMatch =
        !selectedTransactionType || item.거래유형 === selectedTransactionType;

      // 계약 상태
      const endDate = new Date(item.만기일);
      let isContractStatusMatch = true;
      if (selectedContractStatus === '계약완료') {
        isContractStatusMatch = endDate < today; // 만기일이 오늘 이전
      } else if (selectedContractStatus === '계약중') {
        isContractStatusMatch = endDate >= today; // 만기일이 오늘까지
      }

      // 중개 유형
      const isBrokerageTypeMatch =
        !selectedBrokerageType ||
        (selectedBrokerageType === '공동중개' && item.공동중개업소 !== null) ||
        (selectedBrokerageType === '단독중개' && item.공동중개업소 === null);

      const contractDate = new Date(item.계약일);
      let isDateInRange = true;
      // 초기 검색도 필터링하기
      if (startDateObj && endDateObj) {
        if (startDateObj.toDateString() === endDateObj.toDateString()) {
          isDateInRange =
            contractDate.toDateString() === startDateObj.toDateString();
        } else {
          isDateInRange =
            contractDate >= startDateObj && contractDate <= endDateObj;
        }
      }

      return (
        isContractTypeMatch &&
        isTransactionTypeMatch &&
        isContractStatusMatch &&
        isBrokerageTypeMatch &&
        isDateInRange
      );
    });

    setFilteredData(filteredResults);
    setIsSearchClicked(true);
  };

  return (
    <div className='mb-16'>
      <div className='flex  w-[1142px] mt-[80px]  justify-between'>
        <div className='flex items-center mb-4'>
          <img src={clipboard} alt='Clipboard' className='w-[23px] h-[23px]' />
          <span className='text-[35px]  font-bold pl-[10px]'>계약관리</span>
        </div>
        <Btn onClick={onCreateDraft} />
      </div>
      <div className='bg-white w-[1142px] h-[457px] flex justify-center'>
        <h1>
          <div className='text-[20px] font-bold my-4'>계약서 검색</div>
          <div className='w-[1076px] h-[1px] bg-black'></div>
          <div className='flex items-center'>
            <div className='text-[13px] w-[100px] my-4 font-bold'>날짜조회</div>
            <SearchDate
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              selectedPeriod={selectedPeriod}
              setSelectedPeriod={setSelectedPeriod}
            />
          </div>
          <div className='w-[1076px] h-[1px] bg-[#CCCCCC]'></div>
          <div className='flex items-center'>
            <div className='w-[500px] flex items-center'>
              <div className='text-[13px] my-4 font-bold w-[100px]'>
                계약서 종류
              </div>
              <SearchDropDown
                items={contractType}
                selectedItem={selectedContractType}
                onSelect={setSelectedContractType}
              />
            </div>
            <div className='text-[13px] my-4 font-bold w-[100px]'>
              계약서상태
            </div>
            <SearchCheck
              options={contractStatusOptions}
              selectedOption={selectedContractStatus}
              onSelect={setSelectedContractStatus}
            />
          </div>
          <div className='w-[1076px] h-[1px] bg-[#CCCCCC]'></div>
          <div className='flex items-center'>
            <div className='flex w-[500px] items-center'>
              <div className='text-[13px] my-4 font-bold w-[100px]'>
                거래유형
              </div>
              <SearchDropDown
                items={transactionType}
                selectedItem={selectedTransactionType}
                onSelect={setSelectedTransactionType}
              />
            </div>
            <div className='text-[13px] my-4 font-bold w-[100px]'>중개유형</div>
            <SearchCheck
              options={brokerageTypeOptions}
              selectedOption={selectedBrokerageType}
              onSelect={setSelectedBrokerageType}
            />
          </div>
          <div className='w-[1076px] h-[1px] bg-[#CCCCCC]'></div>
          <div className='flex justify-center gap-2 mt-6'>
            <SearchBtn
              icon={<FiRefreshCw />}
              text='초기화'
              borderColor='gray'
              textColor='black'
              onClick={resetAll}
            />

            <SearchBtn
              icon={<FiSearch />}
              text='검색'
              borderColor='#335995'
              textColor='#335995'
              onClick={handleSearch}
            />
          </div>
        </h1>
      </div>
      {isSearchClicked && (
        <SearchResults filteredData={filteredData} isLoading={isLoading} />
      )}
    </div>
  );
};

export default Search;
