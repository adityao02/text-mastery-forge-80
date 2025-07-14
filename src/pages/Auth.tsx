
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const { dispatch } = useApp();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication
    const user = {
      id: '1',
      email,
      subscriptionTier: 'basic' as const,
      createdAt: new Date(),
    };
    
    dispatch({ type: 'SET_USER', payload: user });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Tpix</h1>
          <p className="mt-4 opacity-70">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm opacity-70 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border border-current p-3 focus:outline-none focus:opacity-100"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm opacity-70 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border border-current p-3 focus:outline-none focus:opacity-100"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 border border-current hover:opacity-70"
          >
            [ {isLogin ? 'sign in' : 'sign up'} ]
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm opacity-70 hover:opacity-100"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
