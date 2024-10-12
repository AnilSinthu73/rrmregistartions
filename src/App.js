import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import RRMForm from './components/RRMForm';
import Submissions from './components/submissions';

const App = () => {
  return (
    <Router>
      {/* <nav style={{ backgroundColor: '#f0f0f0', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <ul style={{ display: 'flex', listStyleType: 'none', margin: '0', padding: '0' }}>
          <li style={{ marginRight: '20px' }}>
            <Link to="/admin-login" style={{ textDecoration: 'none', color: 'blue' }}>Admin Login</Link>
          </li>
          <li style={{ marginRight: '20px' }}>
            
          </li>
          <li>
            <Link to="/" style={{ textDecoration: 'none', color: 'blue' }}>RRM Form</Link>
          </li>
        </ul>
      </nav> */}
      <Routes>
        <Route path="/" element={<RRMForm />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/submissions" element={<Submissions />} />
      </Routes>
    </Router>
  );
};

export default App;
