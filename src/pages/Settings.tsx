
import React from 'react';
import { useApp } from '@/contexts/AppContext';

export default function Settings() {
  const { state, dispatch } = useApp();

  const handleUpgrade = () => {
    if (state.user) {
      const upgradedUser = { ...state.user, subscriptionTier: 'pro' as const };
      dispatch({ type: 'SET_USER', payload: upgradedUser });
    }
  };

  if (!state.user) {
    return (
      <div className="max-w-6xl mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Settings</h1>
        <p className="opacity-70 text-lg">[ COMING SOON ]</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="opacity-70">Manage your account and preferences</p>
      </div>

      {/* Account Information */}
      <div className="space-y-6">
        <h2 className="text-xl border-b border-current pb-2">Account</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Email:</span>
            <span className="opacity-70">{state.user.email}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Subscription:</span>
            <span className={`px-3 py-1 border border-current text-sm ${
              state.user.subscriptionTier === 'pro' ? 'text-green-400' : 'text-yellow-400'
            }`}>
              {state.user.subscriptionTier.toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Member since:</span>
            <span className="opacity-70">{state.user.createdAt.toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="text-center space-y-8">
        <div className="border border-current p-12">
          <h2 className="text-2xl font-bold mb-4">Advanced Settings</h2>
          <p className="opacity-70 mb-6">Subscriptions, custom themes, personalization, and account management</p>
          <div className="text-lg font-bold opacity-50">[ COMING SOON ]</div>
        </div>
      </div>
    </div>
  );
}
