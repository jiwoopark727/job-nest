import { useEffect, useRef, useState } from 'react';

const PropertyMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [keyword, setKeyword] = useState('순천향대학교 빌라');
  const [tmpKeyword, setTmpKeyword] = useState('순천향대학교 빌라');
  const [places, setPlaces] = useState([]);
  const [pagination, setPagination] = useState<any>(null);

  useEffect(() => {
    if (!window.kakao || !mapRef.current) return;

    const map = new window.kakao.maps.Map(mapRef.current, {
      center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
      level: 3,
    });

    const ps = new window.kakao.maps.services.Places();
    const infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 });

    // 키워드 검색 함수
    const searchPlaces = () => {
      if (!keyword.trim()) {
        alert('키워드를 입력해주세요!');
        return;
      }

      ps.keywordSearch(keyword, (data: any, status: any, pagination: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          setPlaces(data);
          setPagination(pagination);
          displayPlaces(data, map, infowindow);
        } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
          alert('검색 결과가 존재하지 않습니다.');
        } else {
          alert('검색 중 오류가 발생했습니다.');
        }
      });
    };

    // 검색 결과 목록과 마커 표시
    const displayPlaces = (places: any[], map: any, infowindow: any) => {
      const bounds = new window.kakao.maps.LatLngBounds();
      const markers = [];

      places.forEach((place) => {
        const position = new window.kakao.maps.LatLng(place.y, place.x);
        const marker = new window.kakao.maps.Marker({
          position,
          map,
        });

        marker.setMap(map);
        markers.push(marker);
        bounds.extend(position);

        // 마커 이벤트 추가
        window.kakao.maps.event.addListener(marker, 'mouseover', () => {
          infowindow.setContent(
            `
            <div style="width:150px;text-align:center;padding:4px 0;">${place.place_name}</div>
            `
          );
          infowindow.open(map, marker);
        });
        window.kakao.maps.event.addListener(marker, 'mouseout', () => {
          infowindow.close();
        });
      });

      map.setBounds(bounds);
    };

    // 검색 함수 호출
    searchPlaces();
  }, [keyword]);

  // 페이지 네이션 표시
  const displayPagination = () => {
    if (!pagination) return null;
    const pageNumbers = [];
    for (let i = 1; i <= pagination.last; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => pagination.gotoPage(i)}
          className={`mx-1 ${i === pagination.current ? 'font-bold' : ''}`}
        >
          {i}
        </button>
      );
    }
    return <div className='mt-4 text-center'>{pageNumbers}</div>;
  };

  return (
    <div className='relative w-full h-full'>
      <div ref={mapRef} className='w-full h-full'></div>

      {/* 메뉴 및 검색 영역 */}
      <div className='absolute top-0 left-0 p-4 bg-white rounded-lg shadow-md z-10 w-[300px] h-full'>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setKeyword(keyword);
          }}
          className='flex flex-col items-center space-y-2'
        >
          <label className='font-semibold'>주소</label>
          <input
            type='text'
            value={tmpKeyword}
            onChange={(e) => setTmpKeyword(e.target.value)}
            className='p-2 border rounded w-full'
            placeholder='검색할 키워드 입력'
            spellCheck='false'
            autoComplete='false'
          />
          <button
            type='submit'
            className='px-3 py-[6px] bg-[#347fff] text-white rounded text-[13px]'
            onClick={() => setKeyword(tmpKeyword)}
          >
            검색하기
          </button>
        </form>

        <hr className='my-2 border-gray-400' />

        {/* 검색 결과 목록 */}
        <ul className='overflow-y-auto max-h-[580px]'>
          {places.map((place: any, index: number) => (
            <li key={index} className='cursor-pointer p-2 border-b'>
              <div className='flex items-start space-x-2'>
                <div className='w-[20px] h-[20px] bg-[#347fff] text-white text-center rounded-full text-[14px]'>
                  {index + 1}
                </div>
                <div className='flex flex-col'>
                  <span className='font-bold text-[15px]'>
                    {place.place_name}
                  </span>
                  {place.road_address_name && (
                    <span className='text-[13px] text-gray-600'>
                      {place.road_address_name}
                    </span>
                  )}
                  <span className='text-[13px] text-gray-600'>
                    {place.address_name}
                  </span>
                  <span className='text-sm text-green-600'>{place.phone}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* 페이지 네이션 */}
        {displayPagination()}
      </div>
    </div>
  );
};

export default PropertyMap;
