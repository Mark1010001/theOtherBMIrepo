import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Login from './components/Login';

const API_BASE = 'http://localhost:8000/api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [activeStandard, setActiveStandard] = useState('Global WHO Standard');
  const [populationData, setPopulationData] = useState(null);
  const [userResults, setUserResults] = useState(null);
  const [metrics, setMetrics] = useState({
    gender: 'Male',
    age: 20,
    weight: 84,
    height: 190,
    hip_cm: 92
  });

  const fetchPopulationData = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${API_BASE}/data`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPopulationData(response.data);
    } catch (error) {
      console.error('Error fetching population data:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const calculateMetrics = async (currentMetrics, currentStandard) => {
    if (!token) return;
    try {
      const response = await axios.post(`${API_BASE}/calculate`, {
        ...currentMetrics,
        active_standard: currentStandard
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserResults(response.data);
    } catch (error) {
      console.error('Error calculating metrics:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setPopulationData(null);
    setUserResults(null);
  };

  useEffect(() => {
    if (token) {
      fetchPopulationData();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      calculateMetrics(metrics, activeStandard);
    }
  }, [metrics, activeStandard, token]);

  if (!token) {
    return <Login onLoginSuccess={(t) => setToken(t)} />;
  }

  return (
    <div className="flex h-screen bg-black overflow-hidden font-sans">
      <Sidebar
        metrics={metrics}
        setMetrics={setMetrics}
        results={userResults}
        activeStandard={activeStandard}
        setActiveStandard={setActiveStandard}
      />

      <main className="flex-1 overflow-y-auto custom-scrollbar">
        {populationData && (
          <Dashboard
            data={populationData}
            userResults={userResults}
            userMetrics={metrics}
            onLogout={handleLogout}
          />
        )}
      </main>
    </div>
  );
}

export default App;