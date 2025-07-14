
import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { state } = useApp();
  const location = useLocation();

  const isLandingPage = location.pathname === '/';

  return (
    <div className={`min-h-screen transition-colors ${
      state.theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'
    }`}>
      {!isLandingPage && (
        <nav className="border-b border-gray-800 p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center font-mono">
            <Link to="/" className="text-lg font-bold hover:opacity-70">
              Tpix
            </Link>
            
            <div className="flex items-center space-x-6">
              <Link to="/practice" className="hover:opacity-70">
                [ practice ]
              </Link>
              <Link to="/dashboard" className="hover:opacity-70">
                [ dashboard ]
              </Link>
              <Link to="/compete" className="hover:opacity-70">
                [ compete ]
              </Link>
              <Link to="/game" className="hover:opacity-70">
                [ game ]
              </Link>
              <Link to="/settings" className="hover:opacity-70">
                [ settings ]
              </Link>
            </div>
          </div>
        </nav>
      )}
      
      <main className="font-mono">
        {children}
      </main>
    </div>
  );
}
