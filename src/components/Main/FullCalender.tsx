import googleCalendarPlugin from '@fullcalendar/google-calendar';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useDispatch } from 'react-redux';

const FullCalender = () => {
  // Redux 상태에서 login 상태 가져오기
  const loginState = useSelector((state: RootState) => state.auth.login);
  // 안쓰긴 하는데 일단 가져와놓음
  const dispatch = useDispatch();

  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
  const [load, setLoad] = useState(false);
  const handleLoad = () => {
    setLoad(!load);
  };
  return (
    <>
      {load ? (
        <div className='bg-white w-[900px] border border-gray-400'>
          <div className='cal-container p-[20px]'>
            <FullCalendar
              plugins={[dayGridPlugin, googleCalendarPlugin]}
              initialView='dayGridMonth'
              googleCalendarApiKey={API_KEY}
              events={{
                googleCalendarId: 'jiwoopark727@gmail.com',
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
