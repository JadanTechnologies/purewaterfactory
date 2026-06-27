/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shield, Key, Droplet, Users, Lock } from 'lucide-react';
import { UserRole } from '../types';
import { db } from '../db';

interface LoginScreenProps {
  onLogin: (role: string, name: string) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const usersList = db.getUsers();
  
  const [selectedUserId, setSelectedUserId] = useState(usersList[0]?.id || 'usr-1');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    const user = usersList.find(u => u.id === selectedUserId);
    if (user) {
      if (user.password && password !== user.password) {
        setError('Incorrect password. Please verify security key.');
        return;
      }
      onLogin(user.role, user.name);
    } else {
      setError('Selected user not found.');
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      setError('Please enter email');
      return;
    }
    setForgotSuccess('A password reset link has been dispatched to your email address!');
    setTimeout(() => {
      setShowForgot(false);
      setForgotSuccess('');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4" id="login-container">
      <div className="w-full max-w-4xl bg-slate-800 rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden flex flex-col md:flex-row transition-all duration-300">
        
        {/* Left pane: Branding & Concept */}
        <div className="md:w-5/12 bg-gradient-to-br from-blue-600 via-sky-600 to-teal-500 p-8 flex flex-col justify-between text-white relative">
          <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md">
                <Droplet className="w-8 h-8 text-white fill-sky-200" />
              </div>
              <div>
                <h1 className="font-display font-extrabold tracking-wide text-lg leading-tight">NILE PREMIUM</h1>
                <p className="text-[10px] text-sky-100 uppercase tracking-widest font-bold">Table Water Factory</p>
              </div>
            </div>
          </div>

          <div className="my-8 relative z-10">
            <h2 className="text-2xl font-display font-extrabold tracking-tight mb-3">Enterprise Factory Operations</h2>
            <p className="text-sky-100 text-sm leading-relaxed font-sans">
              Automating raw materials audit, conversion yields, billing cycles, damage reports, and logistics metrics in real time.
            </p>
          </div>

          <div className="relative z-10 border-t border-white/20 pt-4 flex justify-between items-center text-[10px] font-mono tracking-widest text-sky-200 uppercase">
            <span>Enterprise Edition v4.2</span>
            <span>₦ Currency Native</span>
          </div>
        </div>

        {/* Right pane: Actionable Login Forms */}
        <div className="md:w-7/12 p-8 flex flex-col justify-center bg-slate-800 text-slate-100">
          {!showForgot ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <h2 className="text-2xl font-display font-bold tracking-tight text-white mb-1">Welcome back</h2>
                <p className="text-slate-400 text-sm font-sans">Select your workspace role to begin session.</p>
              </div>

              {/* Grid of Users to Select */}
              <div className="space-y-2">
                <label className="text-xs font-display font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-sky-400" /> Authorized User Account
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {usersList.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        setSelectedUserId(u.id);
                        setError('');
                      }}
                      className={`text-left p-3 rounded-xl border text-xs transition-all duration-200 cursor-pointer ${
                        selectedUserId === u.id
                          ? 'border-sky-500 bg-sky-500/10 text-white shadow-md'
                          : 'border-slate-700 bg-slate-900/40 text-slate-300 hover:bg-slate-700/40 hover:border-slate-600'
                      }`}
                      id={`user-btn-${u.id}`}
                    >
                      <div className="font-display font-bold flex items-center justify-between tracking-wide">
                        <span className="truncate max-w-[120px]">{u.name}</span>
                        {selectedUserId === u.id && <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></div>}
                      </div>
                      <div className="flex justify-between items-center mt-1 text-[9px] text-slate-400 font-sans">
                        <span className="bg-slate-800 px-1.5 py-0.5 rounded text-sky-400 font-mono font-bold uppercase">{u.role}</span>
                        <span className="truncate max-w-[80px]">{u.email}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-display font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Key className="w-3.5 h-3.5 text-sky-400" /> Security Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-xs font-sans text-sky-400 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter security key"
                    className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all duration-200"
                    id="login-password-input"
                  />
                </div>
              </div>

              {error && <p className="text-red-400 text-xs bg-red-950/40 border border-red-900/30 px-3 py-2 rounded-lg font-sans">{error}</p>}

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-display font-bold tracking-wide text-sm transition-all shadow-lg hover:shadow-sky-500/10 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                id="login-submit-btn"
              >
                <Shield className="w-4 h-4" /> Authenticate & Open Dashboard
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgotSubmit} className="space-y-6">
              <div>
                <h2 className="text-2xl font-display font-bold tracking-tight text-white mb-1">Recover Credentials</h2>
                <p className="text-slate-400 text-sm font-sans">Enter the registered factory email to receive authorization credentials.</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-display font-bold uppercase tracking-wider text-slate-400">Registered Email Address</label>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@nilewater.com"
                  className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2.5 px-4 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                  id="forgot-email-input"
                />
              </div>

              {forgotSuccess && <p className="text-emerald-400 text-xs bg-emerald-950/40 border border-emerald-900/30 px-3 py-2 rounded-lg font-sans">{forgotSuccess}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  className="w-1/2 py-2.5 px-4 rounded-xl border border-slate-700 hover:bg-slate-700/50 text-slate-300 font-sans font-medium text-xs transition-all cursor-pointer"
                >
                  Back to Sign In
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-sans font-medium text-xs transition-all cursor-pointer"
                >
                  Send Reset Code
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <div className="mt-6 text-center text-slate-500 text-xs font-mono tracking-wider" id="developer-credit-footer">
        Developed by <span className="text-slate-400 font-semibold hover:text-sky-400 transition-colors">Jadan Tech Solutions Nig Ltd</span>: <span className="text-sky-500/80">07061511390</span>
      </div>
    </div>
  );
}
