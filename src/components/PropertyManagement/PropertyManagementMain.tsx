import 'handsontable/dist/handsontable.full.min.css';
// import Handsontable from 'handsontable/base';
import { registerAllModules } from 'handsontable/registry';
import { HotTable } from '@handsontable/react';
import { useState } from 'react';

registerAllModules();

const PropertyManagementMain = () => {
  // 초기 시트 데이터 설정
  const [sheets, setSheets] = useState([
    {
      name: 'sheet 1',
      data: [
        [
          '선택',
          '번호',
          '물건형태',
          '소재지',
          '거래',
          '전세 금액',
          '월세 금액',
          '면적',
          '상태',
          '등록일',
          '비고',
        ],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
      ],
    },
    {
      name: 'sheet 2',
      data: [
        [
          '선택',
          '번호',
          '물건형태',
          '소재지',
          '거래',
          '전세 금액',
          '월세 금액',
          '면적',
          '상태',
          '등록일',
          '비고',
        ],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
      ],
    },
  ]);

  // 현재 활성 시트를 관리하는 상태
  const [activeSheetIndex, setActiveSheetIndex] = useState(0);

  // 새로운 시트 추가
  const addNewSheet = () => {
    const newSheet = {
      name: `sheet ${sheets.length + 1}`,
      data: [
        [
          '선택',
          '번호',
          '물건형태',
          '소재지',
          '거래',
          '전세 금액',
          '월세 금액',
          '면적',
          '상태',
          '등록일',
          '비고',
        ],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
      ],
    };
    setSheets([...sheets, newSheet]);
    setActiveSheetIndex(sheets.length); // 추가한 시트로 자동 전환
  };

  // 로컬 스토리지에 시트 데이터 저장
  const saveData = () => {
    const sheetData = sheets[activeSheetIndex].data;
    localStorage.setItem(
      `sheet${activeSheetIndex}_Data`,
      JSON.stringify(sheetData)
    );
    alert('데이터가 저장되었습니다.');
  };

  // 로컬 스토리지에서 시트 데이터 로드
  const loadData = () => {
    const savedData = localStorage.getItem(`sheet${activeSheetIndex}_Data`);
    if (savedData) {
      const updatedSheets = [...sheets];
      updatedSheets[activeSheetIndex].data = JSON.parse(savedData);
      setSheets(updatedSheets);
      alert('데이터가 로드되었습니다.');
    } else {
      alert('저장된 데이터가 없습니다.');
    }
  };

  // CSV 내보내기 기능
  const exportToCSV = () => {
    const sheetData = sheets[activeSheetIndex].data;
    const csvContent = sheetData.map((row) => row.join(',')).join('\n');

    // UTF-8 BOM 추가
    const bom = '\uFEFF';
    const blob = new Blob([bom + csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sheets[activeSheetIndex].name}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className='flex flex-row overflow-hidden'>
      <div>
        <div className='pl-[65px] pt-[21px] w-full flex justify-between'>
          <div className='pt-[29px]'>
            <span className='text-[35px] mb-[46px] font-extrabold select-none'>
              매물관리
            </span>
            <span className='text-[15px] ml-[30px] mb-[46px] font-bold select-none'>
              나만의 매물장을 만들어 효과적으로 관리하세요.
            </span>
          </div>
        </div>

        {/* 탭 UI */}
        <div className='flex pl-[57px] pt-[45px] justify-between text-[14px] w-[1223px]'>
          <div>
            {sheets.map((sheet, index) => (
              <button
                key={index}
                className={`px-3 py-1 mx-2 ${
                  index === activeSheetIndex
                    ? 'bg-[#347fff] text-white'
                    : 'bg-gray-200'
                }`}
                onClick={() => setActiveSheetIndex(index)}
              >
                {sheet.name}
              </button>
            ))}
            <button
              onClick={addNewSheet}
              className='px-3 py-1 mx-2 bg-gray-200 text-black'
            >
              + 새 시트 추가
            </button>
          </div>
          {/* 툴바 UI (파일 작업 관련) */}
          <div>
            <button
              onClick={saveData}
              className='px-3 py-1 mx-2 bg-blue-500 text-white'
            >
              저장
            </button>
            <button
              onClick={loadData}
              className='px-3 py-1 mx-2 bg-blue-500 text-white'
            >
              로드
            </button>
            <button
              onClick={exportToCSV}
              className='px-3 py-1 mx-2 bg-blue-500 text-white'
            >
              CSV 내보내기
            </button>
          </div>
        </div>

        {/* Handsontable 그리드 */}
        <div className='pl-[65px] pt-[12px] pb-[65px]'>
          <HotTable
            data={sheets[activeSheetIndex].data} // 현재 활성화된 시트 데이터만 표시
            rowHeaders={true}
            colHeaders={true}
            height='auto'
            width='1150px'
            autoWrapRow={true}
            autoWrapCol={true}
            minSpareRows={1}
            minSpareCols={1}
            colWidths={'100px'}
            rowHeights={'35px'}
            cells={() => {
              return { className: 'htCenter htMiddle' }; // 가운데 정렬 클래스 적용
            }}
            licenseKey='non-commercial-and-evaluation' // for non-commercial use only
          />
        </div>
      </div>
    </div>
  );
};
export default PropertyManagementMain;
