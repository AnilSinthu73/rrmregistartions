import React, { useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import RRMForm from './components/RRMForm';
import Submissions from './components/submissions';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated by reading from localStorage
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<RRMForm />} />
        <Route
          path="/admin"
          element={<AdminLogin setIsAuthenticated={handleLogin} />}
        />
        <Route
          path="/submissions"
          element={
            isAuthenticated ? (
              <Submissions onLogout={handleLogout} />
            ) : (
              <Navigate to="/admin" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
