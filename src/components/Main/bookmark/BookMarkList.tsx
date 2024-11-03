import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookBookmark } from '@fortawesome/free-solid-svg-icons';

type Bookmark = {
  id: number;
  title: string;
  url: string;
  checked: boolean;
  ogImage: string;
};

type TPropsList = {
  bookmarksArray: Bookmark[];
};

const BookMarkList = ({ bookmarksArray }: TPropsList) => {
  return (
    <>
      {bookmarksArray.map((val, idx) =>
        //bookmarksArray의 checked가 true인 것만 나열
        val.checked ? (
          <div className='mb-[10px]' key={idx}>
            <a className='m-auto' href={val.url} target='_blank'>
              <div className='border-black boder-solid border w-[180px] h-[180px] mb-[12px] flex cursor-pointer'>
                {!val.ogImage || val.ogImage === 'default' ? (
                  <FontAwesomeIcon
                    className='m-auto w-[40px] h-[40px] text-[#347fff]'
                    icon={faBookBookmark}
                  />
                ) : (
                  <img
                    className='m-auto object-scale-down'
                    src={val.ogImage}
                    alt={`${val.title} og image`}
                  ></img>
                )}
              </div>
            </a>
            <a className='m-auto' href={val.url} target='_blank'>
              <button className='w-[182px] h-[34px] text-[14px] font-medium'>
                {val.title}
              </button>
            </a>
          </div>
        ) : (
          <></>
        )
      )}
    </>
  );
};
export default BookMarkList;
