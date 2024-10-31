import { useState } from 'react';
import Search from '../../components/ContractManagement/Search/Search';
import PreContractDrafting from '../../components/ContractManagement/Drafting/Pre/PreContractDrafting';

const ContractManagementView = () => {
  const [isDraftVisible, setIsDraftVisible] = useState(false);
  const handleShowDraft = () => {
    setIsDraftVisible(true);
  };

  const handleCancelDraft = () => {
    setIsDraftVisible(false);
  };
  return (
    <div className='bg-[#F7F8F9] h-full flex flex-col items-center w-full'>
      {isDraftVisible ? (
        <PreContractDrafting onCancel={handleCancelDraft} />
      ) : (
        <Search onCreateDraft={handleShowDraft} />
      )}
    </div>
  );
};
export default ContractManagementView;
