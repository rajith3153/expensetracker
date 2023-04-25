import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Reports from './components/Reports/FilterReports'
import DashBoard from './components/Layout/DashBoard';
import Layout from './components/Layout/Layout';
import Account from './components/Accounts/AccountList.js';
import TransactionForm from './components/Forms/TransactionForm';
import RecentTransactions from './components/Transactions/RecentTransactions';
import Settings from './components/Settings/Settings';

const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashBoard/>} />
          <Route path="addincome" element={<TransactionForm />} />
          <Route path="Transactions" element={<RecentTransactions/>} />
          <Route path="reports" element={<Reports/>} />
          <Route path="Account" element={<Account/>} />
          <Route path="settings" element={<Settings/>} />
        </Route>
      </Routes>
    </BrowserRouter>
    </div>
  );
}
export default App;