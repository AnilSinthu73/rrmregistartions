import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/adminLogin.css';

const AdminLogin = ({ setIsAuthenticated }) => {
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if(isAuthenticated){
      navigate('/submissions');
    }
  }, [navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      // Replace with your API call or validation logic
      if (loginData.username === `${process.env.username}` && loginData.password === `${process.env.password}`) {
        setIsAuthenticated();
        navigate('/submissions');
      } else {
        setErrorMessage('Invalid login credentials. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('There was an error during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <h2 className="admin-login-title">Admin Login</h2>
      <form onSubmit={handleSubmit} className="admin-login-form">
        <label htmlFor="username" className="form-label">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={loginData.username}
          onChange={handleChange}
          placeholder="Enter Username"
          required
          className="form-input"
        />

        <label htmlFor="password" className="form-label">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={loginData.password}
          onChange={handleChange}
          placeholder="Enter Password"
          required
          className="form-input"
        />

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
