import googleCalendarPlugin from '@fullcalendar/google-calendar';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

const FullCalender = () => {
  // Redux 상태에서 login 상태 가져오기
  const loginState = useSelector((state: RootState) => state.auth.login);

  const userInfoObj = localStorage.getItem('userInfo');
  const userInfo = userInfoObj ? JSON.parse(userInfoObj) : null;

  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
  const [load, setLoad] = useState(false);
  const handleLoad = () => {
    setLoad(!load);
  };
  return (
    <>
      {load && loginState ? (
        <div className='bg-white w-[900px] border border-gray-400'>
          <div className='cal-container p-[20px]'>
            <FullCalendar
              plugins={[dayGridPlugin, googleCalendarPlugin]}
              initialView='dayGridMonth'
              googleCalendarApiKey={API_KEY}
              events={{
                googleCalendarId: userInfo.userEmail,
              }}
              eventDisplay={'block'}
              eventTextColor={'#FFF'}
              eventColor={'#347fff'}
              height={'500px'}
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
            onClick={() => {
              handleLoad();
            }}
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
export default FullCalender;
