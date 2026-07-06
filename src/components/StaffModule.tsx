/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  CheckSquare, 
  Calendar, 
  Star, 
  Phone, 
  UserCheck, 
  Briefcase, 
  Plus,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { Employee, AttendanceRecord, UserRole } from '../types';

interface StaffModuleProps {
  employees: Employee[];
  attendance: AttendanceRecord[];
  activeRole: UserRole;
  currency: string;
  language: 'en' | 'ha';
  onSaveAttendance: (records: Omit<AttendanceRecord, 'id'>[]) => void;
  onAddEmployee: (emp: Employee) => void;
}

export default function StaffModule({
  employees,
  attendance,
  activeRole,
  currency,
  language,
  onSaveAttendance,
  onAddEmployee
}: StaffModuleProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  
  // Create Staff fields
  const [name, setName] = useState('');
  const [role, setRole] = useState('Factory Operator');
  const [phone, setPhone] = useState('');
  const [salary, setSalary] = useState<number>(50000);

  // Temporary attendance list for the logging form
  const [attendanceStates, setAttendanceStates] = useState<Record<string, 'Present' | 'Absent' | 'Late'>>(() => {
    const initial: Record<string, 'Present' | 'Absent' | 'Late'> = {};
    employees.forEach(emp => {
      initial[emp.id] = 'Present';
    });
    return initial;
  });

  const canWrite = activeRole === 'Administrator' || activeRole === 'Super Admin' || activeRole === 'Factory Manager';

  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canWrite) {
      alert('Your current role does not permit modifying human resources.');
      return;
    }

    onAddEmployee({
      id: 'emp-' + Date.now(),
      name,
      role,
      phone,
      salary,
      joinedDate: new Date().toISOString().split('T')[0],
      performanceRating: 5
    });

    // Reset Form
    setShowAddForm(false);
    setName('');
    setPhone('');
    setSalary(50000);
  };

  const handleAttendanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canWrite) {
      alert('Your current role does not permit logging attendance.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const records = employees.map(emp => ({
      date: today,
      employeeId: emp.id,
      employeeName: emp.name,
      status: attendanceStates[emp.id] || 'Present'
    }));

    onSaveAttendance(records);
    setShowAttendanceForm(false);
    alert('Attendance ledger successfully logged for today.');
  };

  const handleStateChange = (empId: string, status: 'Present' | 'Absent' | 'Late') => {
    setAttendanceStates(prev => ({
      ...prev,
      [empId]: status
    }));
  };

  return (
    <div className="space-y-6" id="staff-module">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700/40">
        <div>
          <h2 className="text-lg font-display font-bold text-white flex items-center gap-2 tracking-tight">
            <Users className="text-indigo-400 w-5 h-5" />
            {language === 'en' ? 'Human Resources & Attendance Books' : 'Ma\'aikata da Rijistar Halarta'}
          </h2>
          <p className="text-xs font-sans text-slate-400 mt-0.5">
            {language === 'en' 
              ? 'Log daily staff check-ins, view employee roles, adjust salaries, and evaluate performance ratings.' 
              : 'Gudanar da halartar ma\'aikata na kullum, bashi da saita kudaden albashi.'}
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {canWrite && (
            <>
              <button
                onClick={() => {
                  setShowAttendanceForm(!showAttendanceForm);
                  setShowAddForm(false);
                }}
                className="bg-indigo-600/30 hover:bg-indigo-600 text-indigo-400 hover:text-white font-display font-bold text-xs px-4 py-2.5 rounded-xl border border-indigo-700/50 transition-all cursor-pointer shadow-sm flex-1 sm:flex-initial text-center justify-center flex items-center gap-1.5 uppercase tracking-wider"
              >
                <CheckSquare className="w-4 h-4" />
                {language === 'en' ? 'Log Daily Attendance' : 'Rikodin Halarta'}
              </button>
              <button
                onClick={() => {
                  setShowAddForm(!showAddForm);
                  setShowAttendanceForm(false);
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-display font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-md flex-1 sm:flex-initial text-center justify-center flex items-center gap-1.5 uppercase tracking-wider"
              >
                <Plus className="w-4 h-4" />
                {language === 'en' ? 'Onboard Employee' : 'Sabuwar Ma\'aikaci'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Forms Grid split */}
      {(showAddForm || showAttendanceForm) && (
        <div className="grid grid-cols-1 gap-6">
          
          {/* Add Staff form */}
          {showAddForm && (
            <form onSubmit={handleAddStaffSubmit} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-xl animate-in fade-in duration-200">
              <div className="border-b border-slate-700/60 pb-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Employee Onboarding Profile</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Abubakar Bello"
                    className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 px-3 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400">Phone</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 803 111 2222"
                    className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 px-3 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400">Role / Designation</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2.5 px-3 text-xs focus:outline-none"
                  >
                    <option value="Production Supervisor">Production Supervisor</option>
                    <option value="Machine Operator">Machine Operator</option>
                    <option value="Warehouse Store Keeper">Warehouse Store Keeper</option>
                    <option value="Senior Cashier">Senior Cashier</option>
                    <option value="Delivery Driver">Delivery Driver</option>
                    <option value="Sales & Marketing Officer">Sales & Marketing Officer</option>
                    <option value="Security Guard">Security Guard</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400">Monthly Base Salary (₦)</label>
                  <input
                    type="number"
                    min="30000"
                    required
                    value={salary}
                    onChange={(e) => setSalary(Number(e.target.value))}
                    className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 px-3 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2 border-t border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="py-2 px-4 rounded-xl border border-slate-700 hover:bg-slate-700/50 text-slate-300 font-medium text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md cursor-pointer"
                >
                  Onboard Employee
                </button>
              </div>
            </form>
          )}

          {/* Attendance logging form */}
          {showAttendanceForm && (
            <form onSubmit={handleAttendanceSubmit} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-xl animate-in fade-in duration-200">
              <div className="border-b border-slate-700/60 pb-2 flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Log Today's Staff Attendance</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Date: {new Date().toISOString().split('T')[0]}</p>
                </div>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-2 divide-y divide-slate-700/40">
                {employees.map(emp => (
                  <div key={emp.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2.5 gap-2">
                    <div>
                      <span className="text-xs font-bold text-white block">{emp.name}</span>
                      <span className="text-[10px] text-slate-400">{emp.role}</span>
                    </div>
                    
                    <div className="flex gap-1.5 bg-slate-900 p-1 rounded-lg self-stretch sm:self-auto justify-around">
                      {(['Present', 'Absent', 'Late'] as const).map(status => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => handleStateChange(emp.id, status)}
                          className={`text-[9px] font-bold px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                            (attendanceStates[emp.id] || 'Present') === status 
                              ? (status === 'Present' ? 'bg-emerald-600 text-white shadow' : 
                                 status === 'Absent' ? 'bg-red-600 text-white shadow' : 'bg-amber-600 text-white shadow')
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 justify-end pt-2 border-t border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setShowAttendanceForm(false)}
                  className="py-2 px-4 rounded-xl border border-slate-700 hover:bg-slate-700/50 text-slate-300 font-medium text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md cursor-pointer"
                >
                  Save Attendance Sheet
                </button>
              </div>
            </form>
          )}

        </div>
      )}

      {/* Employee List Grid */}
      <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 shadow-lg space-y-4">
        <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">Employee Directory</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map(emp => (
            <div key={emp.id} className="bg-slate-900/40 border border-slate-700/40 rounded-xl p-4 flex flex-col justify-between hover:border-indigo-500/30 transition-all font-sans">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-display font-extrabold text-white leading-tight uppercase tracking-wide">{emp.name}</h4>
                    <span className="text-[10px] font-display text-indigo-400 font-semibold block mt-1 uppercase tracking-wider">{emp.role}</span>
                  </div>
                  <div className="flex items-center text-amber-400 gap-0.5" title="Performance index">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span className="text-[10px] font-mono font-bold">{emp.performanceRating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="space-y-1 text-[10px] text-slate-400 border-t border-slate-800/80 pt-2.5">
                  <div className="flex justify-between">
                    <span>Contact Phone:</span>
                    <span className="font-mono font-semibold text-white">{emp.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Salary:</span>
                    <span className="font-mono font-semibold text-white">₦{emp.salary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Joined Date:</span>
                    <span className="font-mono text-white">{emp.joinedDate}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
