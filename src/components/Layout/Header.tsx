import axios from 'axios';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login, logout } from '../../redux/loginSlice';
import { RootState } from '../../redux/store';
import { useGoogleLogin } from '@react-oauth/google';

type TUserInfo = {
  userName: string;
  userEmail: string;
};

const Header = () => {
  const navigate = useNavigate();
  const loginState = useSelector((state: RootState) => state.auth.login);
  const userInfoObj = localStorage.getItem('userInfo');
  const userInfo = userInfoObj ? JSON.parse(userInfoObj) : null;
  const dispatch = useDispatch();

  //로그인
  const handleLogin = (data: TUserInfo) => {
    console.log(data);
    dispatch(login({ userName: data?.userName, userEmail: data?.userEmail }));
  };

  //로그아웃
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // 로컬 토큰 삭제
    dispatch(logout());
  };

  // Google OAuth 로그인 함수
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const token = tokenResponse.access_token; // access_token을 사용
      localStorage.setItem('authToken', token); // 토큰 저장
      // Google People API로 사용자 정보 요청
      try {
        const userInfoResponse = await axios.get(
          'https://people.googleapis.com/v1/people/me',
          {
            params: {
              personFields: 'names,emailAddresses',
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userInfo = userInfoResponse.data;
        console.log('사용자 이름:', userInfo.names[0].displayName);
        console.log('사용자 G메일:', userInfo.emailAddresses[0].value);

        const obj: TUserInfo = {
          userName: userInfo.names[0].displayName,
          userEmail: userInfo.emailAddresses[0].value,
        };
        // Redux 에 로그인을 함과 동시에 사용자 정보 전달 + 로컬스토리지에 사용자 정보 저장
        localStorage.setItem('userInfo', JSON.stringify(obj));
        handleLogin(obj);
      } catch (error) {
        console.error('사용자 정보를 가져오는 도중 오류 발생:', error);
      }
    },
    onError: () => {
      console.error('Google 로그인 실패');
    },
    scope:
      'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
  });

  // 기존 로그인 토큰 받아오기
  // const getLoginToken = async () => {
  //   try {
  //     const response = await axios.get(
  //       'https://api.safehomes.co.kr/realtors/api/token'
  //     );

  //     if (response.status === 200 && response.data.message === 'success') {
  //       const token = response.data.cookie;
  //       localStorage.setItem('authToken', token); // 토큰 저장
  //       handleLogin(true);
  //     }
  //   } catch (error) {
  //     console.error('로그인 토큰을 가져오는 도중 에러 발생:', error);
  //   }
  // };

  // 페이지 로드 시 로컬 스토리지에서 토큰 확인
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userInfoObj = localStorage.getItem('userInfo');
    if (token && userInfoObj) {
      const userInfo = JSON.parse(userInfoObj);
      if (userInfo.userName && userInfo.userEmail) {
        handleLogin(userInfo);
      }
    }
  }, []);

  const clickLogo = () => {
    navigate('/'); // 홈 페이지로 이동
  };

  return (
    <div className='h-[100px] flex items-center bg-[#fff] border-b border-[#ededed]'>
      <div
        className='text-[40px] w-[164px] h-[50px] flex items-center justify-center ml-[40px] font-black text-[#347fff] cursor-pointer select-none'
        onClick={clickLogo}
      >
        JobNest
      </div>
      <div className='flex items-center ml-auto'>
        <ul className='flex gap-[38px]'>
          <li
            className='font-medium text-[18px] select-none cursor-pointer'
            onClick={() => navigate('/propertyManagementMain')}
          >
            매물 관리
          </li>
          <li className='font-medium text-[18px] select-none'>
            <Link to='/contractManagement'>계약 관리</Link>
          </li>
          <li
            className='font-medium text-[18px] cursor-pointer select-none'
            onClick={() => navigate('/registrationIssuance')}
          >
            등기/대장 발급
          </li>
        </ul>

        {loginState && Boolean(Object.keys(userInfo).length) ? (
          <>
            <span className='text-[#8894A0] ml-[88px] select-none'>
              {userInfo?.userName}님 환영합니다!
            </span>
            <button
              className='bg-[#347fff] w-[130px] h-[42px] ml-[50px] font-medium mr-[41px] text-white select-none'
              onClick={() => {
                handleLogout();
              }}
            >
              로그아웃
            </button>
          </>
        ) : (
          <button
            className='bg-[#347fff] w-[130px] h-[42px] ml-[50px] font-medium mr-[41px] text-white select-none'
            onClick={() => {
              loginWithGoogle();
            }}
          >
            로그인
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
