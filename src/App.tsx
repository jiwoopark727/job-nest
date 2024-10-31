import { Route, Routes } from 'react-router-dom';
import { Layout } from './Layout';
import { GoogleOAuthProvider } from '@react-oauth/google';
import MainView from './views/Main/MainView';
import RegistrationIssuanceMainView from './views/RegistrationIssuance/RegistrationIssuanceMainView';
import RegistrationIssuanceViewHistroyView from './views/RegistrationIssuance/RegistrationIssuanceViewHistroyView';
import ContractDraftingView from './views/ContractManagement/ContractDraftingView';
import ContractManagementView from './views/ContractManagement/ContractManagementView';
import PropertyManagementMainView from './views/PropertyManagement/PropertyManagementMainView';
import PropertyMapView from './views/PropertyMap/PropertyMapView';

declare global {
  interface Window {
    kakao: any;
  }
}

const App = () => {
  return (
    <GoogleOAuthProvider clientId={`${import.meta.env.VITE_GOOGLE_CLIENT_ID}`}>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<MainView />} />
          <Route
            path='/propertyManagementMain'
            element={<PropertyManagementMainView />}
          />
          <Route path='/propertyMap' element={<PropertyMapView />} />
          <Route
            path='/registrationIssuance'
            element={<RegistrationIssuanceMainView />}
          />
          <Route
            path='/registrationIssuance/viewHistory'
            element={<RegistrationIssuanceViewHistroyView />}
          />
          <Route
            path='/contractManagement'
            element={<ContractManagementView />}
          />
          <Route path='/contractDrafting' element={<ContractDraftingView />} />
        </Route>
      </Routes>
    </GoogleOAuthProvider>
  );
};

export default App;
