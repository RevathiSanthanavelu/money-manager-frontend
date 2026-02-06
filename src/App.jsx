import React, { useState, useEffect } from 'react';
import './index.css';
import Auth from './pages/Auth';
import Home from './pages/Home';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  return user ? (
    <Home user={user} onLogout={handleLogout} />
  ) : (
    <Auth onLoginSuccess={handleLoginSuccess} />
  );
}

export default App;
