// import { useEffect, useRef, useState } from 'react';

// const PropertyMap = () => {
//   useEffect(() => {
//     if (window.kakao && window.kakao.maps) {
//       // 카카오 맵 API 로드 체크
//       const container = document.getElementById(`map`);
//       const options = {
//         center: new window.kakao.maps.LatLng(
//           36.7713718911621,
//           126.934133774914
//         ),
//         level: 3,
//       };

//       const map = new window.kakao.maps.Map(container, options);

//       const imageSrc = 'src/assets/images/marker.png', // 마커이미지의 주소입니다
//         imageSize = new window.kakao.maps.Size(45, 45), // 마커이미지의 크기입니다
//         imageOption = { offset: new window.kakao.maps.Point(27, 69) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

//       // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
//       const markerImage = new window.kakao.maps.MarkerImage(
//         imageSrc,
//         imageSize,
//         imageOption
//       );

//       // 초기 마커 추가
//       const markerPosition = new window.kakao.maps.LatLng(
//         36.7713718911621,
//         126.934133774914
//       );

//       const marker = new window.kakao.maps.Marker({
//         position: markerPosition,
//         image: markerImage,
//       });

//       marker.setMap(map);

//       // 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
//       const mapTypeControl = new window.kakao.maps.MapTypeControl();

//       // 지도에 컨트롤을 추가해야 지도위에 표시됩니다
//       // kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
//       map.addControl(
//         mapTypeControl,
//         window.kakao.maps.ControlPosition.TOPRIGHT
//       );

//       // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
//       const zoomControl = new window.kakao.maps.ZoomControl();
//       map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

//       window.kakao.maps.event.addListener(
//         map,
//         'click',
//         function (mouseEvent: { latLng: any }) {
//           // 클릭한 위도, 경도 정보를 가져옵니다
//           const latlng = mouseEvent.latLng;

//           // 마커 위치를 클릭한 위치로 옮깁니다
//           marker.setPosition(latlng);

//           let message = '클릭한 위치의 위도는 ' + latlng.getLat() + ' 이고, ';
//           message += '경도는 ' + latlng.getLng() + ' 입니다';

//           console.log(message);

//           const resultDiv = document.getElementById('clickLatlng');
//           if (resultDiv) {
//             resultDiv.innerHTML = message;
//           }
//         }
//       );
//     }
//   }, []);

//   return (
//     <>
//       <div id='map' className='w-full h-4/5'></div>
//     </>
//   );
// };

// export default PropertyMap;

import { useEffect, useRef, useState } from 'react';

const PropertyMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [keyword, setKeyword] = useState('한남동 양식집');
  const [tmpKeyword, setTmpKeyword] = useState('한남동 양식집');
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
            `<div class="text-black">${place.place_name}</div>`
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
          <label className='font-semibold'>키워드:</label>
          <input
            type='text'
            value={tmpKeyword}
            onChange={(e) => setTmpKeyword(e.target.value)}
            className='p-2 border rounded w-full'
            placeholder='검색할 키워드 입력'
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
        <ul className='overflow-y-auto max-h-[570px]'>
          {places.map((place: any, index: number) => (
            <li key={index} className='cursor-pointer p-2 border-b'>
              <div className='flex items-start space-x-2'>
                <div className='w-[22px] h-[22px] bg-[#347fff] text-white text-center rounded-full text-[15.5px]'>
                  {index + 1}
                </div>
                <div className='flex flex-col'>
                  <span className='font-bold'>{place.place_name}</span>
                  {place.road_address_name && (
                    <span className='text-sm text-gray-600'>
                      {place.road_address_name}
                    </span>
                  )}
                  <span className='text-sm text-gray-600'>
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
