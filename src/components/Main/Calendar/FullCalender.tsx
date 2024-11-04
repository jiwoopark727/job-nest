// import googleCalendarPlugin from '@fullcalendar/google-calendar';
// import FullCalendar, { EventInput } from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import interactionPlugin from '@fullcalendar/interaction';
// import { useRef, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../../redux/store';

// const FullCalender = () => {
//   const calendarRef = useRef<FullCalendar | null>(null); // calendarRef 타입 설정
//   // Redux 상태에서 login 상태 가져오기
//   const loginState = useSelector((state: RootState) => state.auth.login);
//   const userInfoObj = localStorage.getItem('userInfo');
//   const userInfo = userInfoObj ? JSON.parse(userInfoObj) : null;

//   const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
//   const [load, setLoad] = useState(false);
//   const handleLoad = () => {
//     setLoad(!load);
//   };

//   const [events, setEvents] = useState<EventInput[]>([]); // 일정 상태 관리

//   // 일정 추가
//   const handleDateSelect = (selectInfo: any) => {
//     const title = prompt('새로운 일정 제목을 입력하세요');
//     const calendarApi = calendarRef.current?.getApi(); // getApi()로 FullCalendar API 접근

//     calendarApi?.unselect(); // 선택 해제

//     if (title && calendarApi) {
//       const newEvent = {
//         id: String(events.length + 1),
//         title,
//         start: selectInfo.startStr,
//         end: selectInfo.endStr,
//         allDay: selectInfo.allDay,
//       };
//       calendarApi.addEvent(newEvent); // 캘린더에 새 이벤트 추가
//       setEvents((prevEvents) => [...prevEvents, newEvent]); // 상태 업데이트
//     }
//   };

//   // 일정 삭제
//   const handleEventClick = (clickInfo: any) => {
//     clickInfo.jsEvent.preventDefault(); // 기본 동작 방지 (링크 이동 방지)

//     if (confirm(`'${clickInfo.event.title}' 일정을 삭제하시겠습니까?`)) {
//       clickInfo.event.remove(); // 캘린더에서 이벤트 삭제
//       setEvents((prevEvents) =>
//         prevEvents.filter((event) => event.id !== clickInfo.event.id)
//       ); // 상태에서도 삭제
//     }
//   };

//   return (
//     <>
//       {load && loginState ? (
//         <div className='bg-white w-[900px] border border-gray-400'>
//           <div className='cal-container p-[20px] text-[14px]'>
//             <FullCalendar
//               ref={calendarRef} // ref를 FullCalendar에 연결
//               plugins={[dayGridPlugin, googleCalendarPlugin, interactionPlugin]} // interactionPlugin 추가
//               initialView='dayGridMonth'
//               googleCalendarApiKey={API_KEY}
//               events={{
//                 googleCalendarId: userInfo.userEmail,
//               }}
//               eventDisplay={'block'}
//               eventTextColor={'#FFF'}
//               eventColor={'#347fff'}
//               height={'500px'}
//               contentHeight='auto'
//               headerToolbar={{
//                 left: 'prev,next today',
//                 center: 'title',
//                 right: 'dayGridMonth,dayGridWeek,dayGridDay',
//               }}
//               locale='ko' // 한국어로 로케일 설정
//               buttonText={{
//                 today: '오늘',
//                 month: '월간',
//                 week: '주간',
//                 day: '일간',
//               }}
//               selectable={true} // 날짜 선택 가능 설정
//               select={handleDateSelect} // 날짜 선택 시 실행될 함수
//               eventClick={handleEventClick} // 이벤트 클릭 시 실행될 함수
//             />
//           </div>
//         </div>
//       ) : (
//         ''
//       )}

//       {loginState ? (
//         <div className='flex justify-end mt-[20px]'>
//           <button
//             className='px-4 py-2 bg-[#347fff] text-white w-[136px] h-[42px] rounded-md shadow-md text-[15px] font-extrabold'
//             onClick={() => {
//               handleLoad();
//             }}
//           >
//             구글 캘린더
//           </button>
//         </div>
//       ) : (
//         ''
//       )}
//     </>
//   );
// };
// export default FullCalender;

import googleCalendarPlugin from '@fullcalendar/google-calendar';
import FullCalendar, { EventInput } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import axios, { AxiosError } from 'axios';

const FullCalendarComponent = () => {
  const calendarRef = useRef<FullCalendar | null>(null);
  const loginState = useSelector((state: RootState) => state.auth.login);
  const userInfoObj = localStorage.getItem('userInfo');
  const userInfo = userInfoObj ? JSON.parse(userInfoObj) : null;

  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
  const [load, setLoad] = useState(false);
  const [events, setEvents] = useState<EventInput[]>([]); // 일정 상태 관리

  const handleLoad = () => {
    setLoad(!load);
  };

  // 로컬스토리지에서 토큰 가져오기
  const token = localStorage.getItem('authToken');

  // Google Calendar에서 이벤트 불러오기
  const fetchGoogleEvents = async () => {
    if (!token) {
      console.error('토큰이 없음. 다시 로그인');
      return;
    }

    try {
      console.log('Fetching events from Google Calendar...');
      const response = await axios.get(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            maxResults: 50, // 필요한 경우 더 많은 결과를 요청할 수 있습니다
            singleEvents: true, // 반복 이벤트를 개별 이벤트로 표시
            orderBy: 'startTime', // 이벤트를 시작 시간 기준으로 정렬
          },
        }
      );

      console.log('Events fetched successfully:', response.data.items);

      const googleEvents = response.data.items.map((event: any) => ({
        id: event.id,
        title: event.summary,
        start: event.start.dateTime || event.start.date,
        end: event.end.dateTime || event.end.date,
      }));
      setEvents(googleEvents);
    } catch (error) {
      const axiosError = error as AxiosError; // AxiosError로 타입 단언
      if (axiosError.response?.status === 401) {
        alert('토큰이 만료되었습니다. 다시 로그인해주세요.');
        localStorage.removeItem('authToken');
      } else {
        console.error('이벤트를 가져오는 중 오류 발생:', error);
      }
    }
  };

  // 일정 추가
  const handleDateSelect = async (selectInfo: any) => {
    if (!token) return;

    const title = prompt('새로운 일정 제목을 입력하세요');
    if (!title) {
      console.log('일정 제목이 입력되지 않아 추가를 취소합니다.');
      return;
    }

    try {
      console.log('일정 추가 요청을 전송 중...');
      const isAllDay = selectInfo.allDay; // 선택한 일정이 하루 종일인지 확인
      const eventData = isAllDay
        ? {
            summary: title,
            start: { date: selectInfo.startStr.split('T')[0] }, // 날짜만 전달
            end: { date: selectInfo.endStr.split('T')[0] }, // 종료 날짜도 날짜만 전달
          }
        : {
            summary: title,
            start: { dateTime: selectInfo.startStr }, // ISO 8601 형식이어야 함
            end: { dateTime: selectInfo.endStr }, // ISO 8601 형식이어야 함
          };

      const response = await axios.post(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events`,
        eventData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newEvent = response.data;
      console.log('일정 추가 성공:', newEvent);

      setEvents((prevEvents) => [
        ...prevEvents,
        {
          id: newEvent.id,
          title: newEvent.summary,
          start: newEvent.start.dateTime || newEvent.start.date,
          end: newEvent.end.dateTime || newEvent.end.date,
        },
      ]);
    } catch (error) {
      console.error('일정 추가 중 오류 발생:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios 에러 응답:', error.response);
      }
    }

    calendarRef.current?.getApi().unselect();
  };

  // 일정 삭제
  const handleEventClick = async (clickInfo: any) => {
    if (!token) return;

    if (confirm(`'${clickInfo.event.title}' 일정을 삭제하시겠습니까?`)) {
      try {
        await axios.delete(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events/${clickInfo.event.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== clickInfo.event.id)
        );
      } catch (error) {
        console.error('일정 삭제 중 오류 발생:', error);
      }
    }
  };

  useEffect(() => {
    fetchGoogleEvents(); // 컴포넌트 마운트 시 Google Calendar 이벤트 가져오기
  }, []);

  return (
    <>
      {load && loginState ? (
        <div className='bg-white w-[900px] border border-gray-400'>
          <div className='cal-container p-[20px] text-[14px]'>
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, googleCalendarPlugin, interactionPlugin]}
              initialView='dayGridMonth'
              events={events}
              locale='ko'
              eventDisplay='block'
              eventTextColor='#FFF'
              eventColor='#347fff'
              height='500px'
              contentHeight='auto'
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek,dayGridDay',
              }}
              buttonText={{
                today: '오늘',
                month: '월간',
                week: '주간',
                day: '일간',
              }}
              selectable={true}
              select={handleDateSelect}
              eventClick={handleEventClick}
            />
          </div>
        </div>
      ) : (
        ''
      )}

      {loginState ? (
        <div className='flex justify-end mt-[20px]'>
          <button
            className='px-4 py-2 bg-[#347fff] text-white w-[136px] h-[42px] rounded-md shadow-md text-[15px] font-extrabold'
            onClick={handleLoad}
          >
            구글 캘린더
          </button>
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default FullCalendarComponent;