import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await axios.post('http://localhost:8000/api/auth/login', formData);
      const { access_token } = response.data;

      localStorage.setItem('token', access_token);
      onLoginSuccess(access_token);
    } catch (err) {
      setError('Invalid username or password');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4 font-inter">
      <div className="w-full max-w-md bg-[#141414] border border-[#222] rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#D9FF00] rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(217,255,0,0.3)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">HealthAnalytics</h1>
          <p className="text-[#555] text-xs font-bold uppercase tracking-[0.2em] mt-2">Secure Access Gateway</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-[#888] uppercase tracking-widest mb-2 ml-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-4 py-3 text-white text-sm focus:border-[#D9FF00] focus:ring-1 focus:ring-[#D9FF00] outline-none transition-all"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-[#888] uppercase tracking-widest mb-2 ml-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-4 py-3 text-white text-sm focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] outline-none transition-all"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-[10px] font-bold uppercase tracking-wider py-2 px-3 rounded-md text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#D9FF00] hover:bg-[#e6ff33] disabled:bg-[#444] disabled:cursor-not-allowed text-black font-black uppercase tracking-widest py-4 rounded-lg shadow-lg transform transition-all active:scale-[0.98] mt-4"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-[#222] flex justify-between items-center">
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-[#A855F7]"></div>
            <div className="w-2 h-2 rounded-full bg-[#2DD4BF]"></div>
            <div className="w-2 h-2 rounded-full bg-[#D9FF00]"></div>
          </div>
          <p className="text-[#444] text-[9px] font-bold uppercase tracking-tighter">
            System V2.0.4 • 2026 Edition
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
