import { useEffect } from 'react';

const PropertyMap = () => {
  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      // 카카오 맵 API 로드 체크
      const container = document.getElementById(`map`);
      const options = {
        center: new window.kakao.maps.LatLng(
          36.7713718911621,
          126.934133774914
        ),
        level: 3,
      };

      const map = new window.kakao.maps.Map(container, options);

      const imageSrc = 'src/assets/images/marker.png', // 마커이미지의 주소입니다
        imageSize = new window.kakao.maps.Size(60, 59), // 마커이미지의 크기입니다
        imageOption = { offset: new window.kakao.maps.Point(27, 69) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

      // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
      const markerImage = new window.kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption
      );

      // 초기 마커 추가
      const markerPosition = new window.kakao.maps.LatLng(
        36.7713718911621,
        126.934133774914
      );

      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        image: markerImage,
      });

      marker.setMap(map);

      // 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
      const mapTypeControl = new window.kakao.maps.MapTypeControl();

      // 지도에 컨트롤을 추가해야 지도위에 표시됩니다
      // kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
      map.addControl(
        mapTypeControl,
        window.kakao.maps.ControlPosition.TOPRIGHT
      );

      // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
      const zoomControl = new window.kakao.maps.ZoomControl();
      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

      window.kakao.maps.event.addListener(
        map,
        'click',
        function (mouseEvent: { latLng: any }) {
          // 클릭한 위도, 경도 정보를 가져옵니다
          const latlng = mouseEvent.latLng;

          // 마커 위치를 클릭한 위치로 옮깁니다
          marker.setPosition(latlng);

          let message = '클릭한 위치의 위도는 ' + latlng.getLat() + ' 이고, ';
          message += '경도는 ' + latlng.getLng() + ' 입니다';

          console.log(message);

          const resultDiv = document.getElementById('clickLatlng');
          if (resultDiv) {
            resultDiv.innerHTML = message;
          }
        }
      );
    }
  }, []);

  return (
    <>
      <div id='map' className='w-full h-4/5'></div>
    </>
  );
};

export default PropertyMap;
