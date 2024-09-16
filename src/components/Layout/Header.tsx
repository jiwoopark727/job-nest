import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const clickLogo = () => {
    navigate('/');
  };

  return (
    <>
      <div className='h-[100px] flex items-center bg-[#fff] border-b border-[#ededed]'>
        <div
          className='text-[40px] w-[164px] h-[50px] flex items-center justify-center ml-[40px] font-black text-[#347fff] cursor-pointer'
          onClick={clickLogo}
        >
          JobNest
        </div>
        <div className='flex items-center ml-auto'>
          <ul className='flex gap-[38px]'>
            <li className='font-medium text-[18px]'>매물 관리</li>
            <li className='font-medium text-[18px]'>
              <Link to='/contractManagement'>계약 관리</Link>
            </li>
            <li
              className='font-medium text-[18px] cursor-pointer'
              onClick={() => navigate('/RegistrationIssuanceView')}
            >
              등기/대장 발급
            </li>
          </ul>
          <span className='text-[#8894A0] ml-[88px]'>010-0000-0000</span>
          <button className='bg-[#347fff] w-[130px] h-[42px] ml-[50px] font-medium mr-[41px] text-white'>
            로그아웃
          </button>
        </div>
      </div>
    </>
  );
};
export default Header;
