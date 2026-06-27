/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { User, Mail, Phone, Lock, X, Check } from 'lucide-react';
import { UserAccount } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onSave: (updatedUser: UserAccount) => void;
  language: 'en' | 'ha';
}

export default function ProfileModal({
  isOpen,
  onClose,
  currentUser,
  onSave,
  language
}: ProfileModalProps) {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [password, setPassword] = useState(currentUser.password || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    const updatedUser: UserAccount = {
      ...currentUser,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password: password.trim()
    };

    onSave(updatedUser);
    setSuccess('Profile updated successfully!');
    setError('');
    setTimeout(() => {
      setSuccess('');
      onClose();
    }, 1500);
  };

  return createPortal(
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-slate-800 p-4 flex justify-between items-center bg-slate-950/40">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-sky-500/10 text-sky-400 rounded-lg">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {language === 'en' ? 'Update Profile Credentials' : 'Gyara Bayanan Bayani'}
              </h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">{currentUser.role}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-slate-800 p-1 rounded-lg transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs py-2 px-3 rounded-lg font-medium">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs py-2 px-3 rounded-lg font-medium flex items-center gap-2">
              <Check className="w-3.5 h-3.5" /> {success}
            </div>
          )}

          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-sky-400" /> Full Trading Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 text-white border border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 transition-all"
              placeholder="e.g. Maryam Bello"
              required
            />
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-sky-400" /> Workspace Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 text-white border border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 transition-all"
              placeholder="e.g. maryam@nilewater.com"
              required
            />
          </div>

          {/* Phone Field */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-sky-400" /> Mobile Phone Line
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-950 text-white border border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 transition-all"
              placeholder="e.g. +234 803 000 1111"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-sky-400" /> Account Security Password
            </label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 text-white border border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 transition-all font-mono"
              placeholder="Enter new password"
              required
            />
          </div>

          {/* Submit/Cancel Buttons */}
          <div className="flex gap-3 justify-end pt-3 border-t border-slate-800/60 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white font-medium text-xs transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Save Profile Updates
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
