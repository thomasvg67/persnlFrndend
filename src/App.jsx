import React from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Index from './pages/Index';
import Notes from './pages/Notes';
import Contacts from './pages/Contacts';
import Login from './pages/Login';
import LockScreen from './pages/LockScreen';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import Error404 from './pages/Error404';
import Profile from './pages/Profile';
import AccSettings from './pages/AccSettings';
import NewUser from './pages/NewUser';

import ProtectedRoute from './contexts/ProtectedRoute';
import PublicRoute from './contexts/PublicRoute';
import AppsDTCustom from './pages/AppsDTCustom';
import AppsToDoList from './pages/AppsToDoList';
import EditUser from './pages/EditUser';
import ViewUser from './pages/ViewUser';
import Scrum from './pages/Scrum';
import AddNewNames from './pages/Names/AddNewNames';
import GnrlNms from './pages/Names/GnrlNms';
import MedStats from './pages/MedicalStatistics/MedStats';
import Quotes from './pages/Quotes';
import Dictionary from './pages/Dictionary';
import Medicines from './pages/Medicines';
import Diary from './pages/Diary';
import Index2 from './pages/index2';
import Stories from './pages/Stories';
import BussIdea from './pages/BussIdea';
// import MissionVission from './pages/Mission';
import Calendar from './pages/Calendar';
import ListTable from './pages/listTable';
import ContactTest from './pages/ContactTest';
import ContactTest1 from './pages/ContactTest1';
import ContactTest2 from './pages/ContactTest2';
import AppsDTContact from './pages/AppsDTContact';
import MyTimeline from './pages/MyTimeline';
import Chat from './pages/Chat';
import Mailbox from './pages/Mailbox';
import MutualFund from './pages/MutualFund';
import Shares from './pages/Shares';
import Memories from './pages/Memories';
import SharesFollow from './pages/SharesFollow';
import SharesSnoozed from './pages/SharesSnoozed';
import SharesWishlist from './pages/SharesWishlist';
import SharesOther from './pages/SharesOther';
import MutualFundFollow from './pages/MutualFundFollow';
import MutualFundSnoozed from './pages/MutualFundSnoozed';
import MutualFundWishlist from './pages/MutualFundWishlist';
import MutualFundOther from './pages/MutualFundOther';
import MemoriesBday from './pages/MemoriesBday';
import MemoriesWedding from './pages/MemoriesWedding';
import MemoriesDeath from './pages/MemoriesDeath';
import MemoriesOther from './pages/MemoriesOther';
import Mission from './pages/Mission';
import Vission from './pages/Vission';
import BudgetY from './pages/BudgetY';
import BudgetHY from './pages/BudgetHY';
import Fund from './pages/Fund';
import FinancialOL from './pages/FinancialOL';
import Budget from './pages/Budget';
import BudgetQuarterly from './pages/BudgetQuarterly';
import Plan from './pages/Plan';
import PlanQuarterly from './pages/PlanQuarterly';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} />

        <Routes>
          <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/prsnl" element={<ProtectedRoute><Index2 /></ProtectedRoute>} />
          <Route path="/nts" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
          {/* <Route path="/cnts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} /> */}
          <Route path="/cnts" element={<ProtectedRoute><AppsDTContact /></ProtectedRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/lock" element={<LockScreen />} />
          <Route path="/prfl" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/sttgs" element={<ProtectedRoute><AccSettings /></ProtectedRoute>} />
          <Route path="/nwUsr" element={<ProtectedRoute><NewUser /></ProtectedRoute>} />
          <Route path="/edtUsr" element={<ProtectedRoute><EditUser /></ProtectedRoute>} />
          <Route path="/vwUsr" element={<ProtectedRoute><ViewUser /></ProtectedRoute>} />
          <Route path="/usrLst" element={<ProtectedRoute><AppsDTCustom /></ProtectedRoute>} />
          <Route path="/tdLst" element={<ProtectedRoute><AppsToDoList /></ProtectedRoute>} />
          <Route path="/scrmBrd" element={<ProtectedRoute><Scrum /></ProtectedRoute>} />
          <Route path="/newNames" element={<ProtectedRoute><AddNewNames /></ProtectedRoute>} />
          <Route path="/gnrlNms" element={<ProtectedRoute><GnrlNms /></ProtectedRoute>} />
          <Route path="/mdcSts" element={<ProtectedRoute><MedStats /></ProtectedRoute>} />
          <Route path="/quotes" element={<ProtectedRoute><Quotes /></ProtectedRoute>} />
          <Route path="/dict" element={<ProtectedRoute><Dictionary /></ProtectedRoute>} />
          <Route path="/medic" element={<ProtectedRoute><Medicines /></ProtectedRoute>} />
          <Route path="/diary" element={<ProtectedRoute><Diary /></ProtectedRoute>} />
          <Route path="/stry" element={<ProtectedRoute><Stories /></ProtectedRoute>} />
          <Route path="/bussIdea" element={<ProtectedRoute><BussIdea /></ProtectedRoute>} />
          <Route path="/mission" element={<ProtectedRoute><Mission /></ProtectedRoute>} />
          <Route path="/vission" element={<ProtectedRoute><Vission /></ProtectedRoute>} />
          <Route path="/clndr" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
          <Route path="/myTmln" element={<ProtectedRoute><MyTimeline /></ProtectedRoute>} />
          <Route path="/listTable" element={<ProtectedRoute><ListTable /></ProtectedRoute>} />
          <Route path="/contactTest" element={<ProtectedRoute><ContactTest /></ProtectedRoute>} />
          <Route path="/contactTest1" element={<ProtectedRoute><ContactTest1 /></ProtectedRoute>} />
          <Route path="/contactTest2" element={<ProtectedRoute><ContactTest2 /></ProtectedRoute>} />
          <Route path="/appdtcnt" element={<ProtectedRoute><AppsDTContact /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/mailbox" element={<ProtectedRoute><Mailbox /></ProtectedRoute>} />
           <Route path="/mutlFnd" element={<ProtectedRoute><MutualFund /></ProtectedRoute>} />
          {/*<Route path="/mutlFndFlw" element={<ProtectedRoute><MutualFund /></ProtectedRoute>} />
          <Route path="/mutlFndSnzd" element={<ProtectedRoute><MutualFund /></ProtectedRoute>} />
          <Route path="/mutlFndWshlst" element={<ProtectedRoute><MutualFund /></ProtectedRoute>} />
          <Route path="/mutlFndOthr" element={<ProtectedRoute><MutualFund /></ProtectedRoute>} /> */}
          <Route path="/mutualFund/:type?" element={<ProtectedRoute><MutualFund /></ProtectedRoute>}/>


          <Route path="/shrs" element={<ProtectedRoute><Shares /></ProtectedRoute>} />
          <Route path="/shrsFlw" element={<ProtectedRoute><SharesFollow /></ProtectedRoute>} />
          <Route path="/shrsSnzd" element={<ProtectedRoute><SharesSnoozed /></ProtectedRoute>} />
          <Route path="/shtsWshlst" element={<ProtectedRoute><SharesWishlist /></ProtectedRoute>} />
          <Route path="/shrsOthr" element={<ProtectedRoute><SharesOther /></ProtectedRoute>} />

          <Route path="/memris" element={<ProtectedRoute><Memories /></ProtectedRoute>} />
          <Route path="/memrisBday" element={<ProtectedRoute><MemoriesBday /></ProtectedRoute>} />
          <Route path="/memrisWedng" element={<ProtectedRoute><MemoriesWedding /></ProtectedRoute>} />
          <Route path="/memrisDth" element={<ProtectedRoute><MemoriesDeath /></ProtectedRoute>} />
          <Route path="/memrisOthr" element={<ProtectedRoute><MemoriesOther /></ProtectedRoute>} />

          <Route path="/bdgtYrly" element={<ProtectedRoute><BudgetY /></ProtectedRoute>} />
          <Route path="/budgetHYrly" element={<ProtectedRoute><BudgetHY /></ProtectedRoute>} />

          <Route path="/plan/:type" element={<ProtectedRoute><Plan /></ProtectedRoute>} />
          <Route path="/planQtr" element={<ProtectedRoute><PlanQuarterly /></ProtectedRoute>} />
          <Route path="/fund/:type" element={<ProtectedRoute><Fund /></ProtectedRoute>} />
          <Route path="/financialOL/:type" element={<ProtectedRoute><FinancialOL /></ProtectedRoute>} />
          <Route path="/budget/:type" element={<ProtectedRoute><Budget /></ProtectedRoute>} />
          <Route path="/budgetQtr" element={<ProtectedRoute><BudgetQuarterly /></ProtectedRoute>} />


          {/* Add other routes as needed */}

          {/* Catch-all route for 404 errors */}
          <Route path="*" element={<Error404 />} />
        </Routes>

      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
