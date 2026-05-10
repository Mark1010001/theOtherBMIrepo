import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:8000/api/auth/guest');
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      onLoginSuccess(access_token);
    } catch (err) {
      setError('Guest access failed');
      console.error('Guest login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        const response = await axios.post('http://localhost:8000/api/auth/login', formData);
        const { access_token } = response.data;

        localStorage.setItem('token', access_token);
        onLoginSuccess(access_token);
      } else {
        // Signup
        await axios.post('http://localhost:8000/api/auth/signup', {
          username,
          password,
          full_name: fullName
        });

        // Auto login after signup
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        const response = await axios.post('http://localhost:8000/api/auth/login', formData);
        const { access_token } = response.data;

        localStorage.setItem('token', access_token);
        onLoginSuccess(access_token);
      }
    } catch (err) {
      setError(isLogin ? 'Invalid username or password' : (err.response?.data?.detail || 'Registration failed'));
      console.error('Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-4 font-inter transition-colors duration-300">
      <div className="w-full max-w-md bg-bg-card border border-border-dim rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(217,255,0,0.3)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-black text-text-header tracking-tighter uppercase">HealthAnalytics</h1>
          <p className="text-text-dim text-xs font-bold uppercase tracking-[0.2em] mt-2">Secure Access Gateway</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 ml-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-bg-input border border-border-dim rounded-lg px-4 py-3 text-text-main text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all"
                placeholder="Enter your full name"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 ml-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-bg-input border border-border-dim rounded-lg px-4 py-3 text-text-main text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 ml-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-bg-input border border-border-dim rounded-lg px-4 py-3 text-text-main text-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
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
            className="w-full bg-brand hover:bg-[#e6ff33] disabled:bg-[#444] disabled:cursor-not-allowed text-black font-black uppercase tracking-widest py-4 rounded-lg shadow-lg transform transition-all active:scale-[0.98] mt-4"
          >
            {isLoading ? 'Authenticating...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-dim"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold">
              <span className="bg-bg-card px-2 text-text-muted">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGuestLogin}
            disabled={isLoading}
            className="w-full bg-bg-input hover:bg-border-dim border border-border-dim text-text-main font-bold uppercase tracking-widest py-3 rounded-lg transition-all active:scale-[0.98]"
          >
            Guest Access
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-text-dim hover:text-brand text-xs font-bold uppercase tracking-wider transition-colors"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-border-dim flex justify-between items-center">
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-secondary"></div>
            <div className="w-2 h-2 rounded-full bg-tertiary"></div>
            <div className="w-2 h-2 rounded-full bg-brand"></div>
          </div>
          <p className="text-text-dim text-[9px] font-bold uppercase tracking-tighter">
            System V2.0.4 • 2026 Edition
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;