import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/adminLogin.css';

const AdminLogin = () => {
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (loginData.username === 'drd@jntugv.edu.in' && loginData.password === 'admin@123') {
        navigate('/submissions');
      } else {
        setErrorMessage('Invalid login credentials. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('There was an error during login. Please try again.');
    }
  };

  return (
    <div className="admin-login-container">
      <h2 className="admin-login-title">Admin Login</h2>
      <form onSubmit={handleSubmit} className="admin-login-form">
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={loginData.username}
          onChange={handleChange}
          placeholder="Enter Username"
          required
          className="form-input"
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={loginData.password}
          onChange={handleChange}
          placeholder="Enter Password"
          required
          className="form-input"
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit" className="submit-btn">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
