const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/SettingsModule.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update imports - add Unlock and Calendar
content = content.replace(
  "Lock,\r\n  LockKeyhole\r\n} from 'lucide-react'",
  "Lock,\r\n  LockKeyhole,\r\n  Unlock,\r\n  Calendar\r\n} from 'lucide-react'"
);

// 2. Update types import
content = content.replace(
  "import { FactorySettings, UserRole, UserAccount, CustomRole } from '../types';",
  "import { FactorySettings, UserRole, UserAccount, CustomRole, LockdownState, EndOfDayReport } from '../types';"
);

// 3. Add lockdown and EOD props to interface
const propsOld = `  onSaveRole?: (role: CustomRole) => void;
  onDeleteRole?: (id: string) => void;
}`;

const propsNew = `  onSaveRole?: (role: CustomRole) => void;
  onDeleteRole?: (id: string) => void;
  lockdownState?: {
    lockdownEndDate: string | null;
    isLocked: boolean;
    onActivateLockdown: () => void;
    onUnlockWithToken: (token: string) => boolean;
    onClearLockdown: () => void;
  };
  endOfDayReports?: EndOfDayReport[];
}`;

content = content.replace(propsOld, propsNew);

// 4. Add playSound and lockdownToken state after function start
const funcOld = `}: SettingsModuleProps) {\n  \n  // Tabs management`;
const funcNew = `}: SettingsModuleProps) {\n  \n  // Lockdown token input\n  const [lockdownToken, setLockdownToken] = useState('');\n  \n  // Sound system\n  const playSound = (type: 'success' | 'error' | 'notification') => {\n    if (typeof Audio === 'undefined') return;\n    try {\n      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();\n      const oscillator = audioContext.createOscillator();\n      const gainNode = audioContext.createGain();\n      \n      oscillator.connect(gainNode);\n      gainNode.connect(audioContext.destination);\n      \n      let frequency: number, duration: number;\n      switch (type) {\n        case 'success':\n          frequency = 523.25;\n          duration = 200;\n          break;\n        case 'error':\n          frequency = 220;\n          duration = 300;\n          break;\n        case 'notification':\n          frequency = 349.23;\n          duration = 150;\n          break;\n        default:\n          frequency = 440;\n          duration = 200;\n      }\n      \n      oscillator.frequency.value = frequency;\n      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);\n      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);\n      oscillator.start();\n      oscillator.stop(audioContext.currentTime + duration / 1000);\n    } catch (e) {\n      // Audio not supported\n    }\n  };\n  \n  // Tabs management`;

content = content.replace(funcOld, funcNew);

// 5. Update tabs type
content = content.replace(
  "useState<'parameters' | 'roles' | 'users'>('parameters')",
  "useState<'parameters' | 'roles' | 'users' | 'eod'>('parameters')"
);

// 6. Add EOD tab button after Users tab
const usersTabOld = `              Users & Passwords
            </span>
          </button>
        </div>
      )}

      {/* Tab content 1: General Parameters */}`;

const usersTabNew = `              Users & Passwords
            </span>
          </button>
          <button
            onClick={() => { setActiveSubTab('eod'); setShowRoleForm(false); setShowUserForm(false); }}
            className={\`pb-3 px-4 text-xs font-bold transition-all cursor-pointer border-b-2 whitespace-nowrap \${
              activeSubTab === 'eod'
                ? 'border-sky-500 text-white font-black'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }\`}
          >
            <span className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              End of Day Reports
            </span>
          </button>
        </div>
      )}

      {/* Tab content 1: General Parameters */}`;

content = content.replace(usersTabOld, usersTabNew);

// 7. Add Lockdown panel after Reset panel
const resetPanelOld = `              <button
                onClick={handleResetConfirm}
                className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <RefreshCcw className="w-4 h-4" /> Restore Demo Database
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Tab content 2: Custom Roles & Permissions */}`;

const resetPanelNew = `              <button
                onClick={handleResetConfirm}
                className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <RefreshCcw className="w-4 h-4" /> Restore Demo Database
              </button>
            </div>

            {/* Lockdown System Panel */}
            <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 shadow-lg space-y-3.5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-700 pb-2">
                <Shield className="w-3.5 h-3.5 text-rose-400" /> System Lockdown Control
              </h3>
              {lockdownState?.isLocked ? (
                <div className="space-y-3">
                  <div className="p-3 bg-red-950/20 border border-red-900/40 rounded-lg">
                    <p className="text-[11px] text-red-400 font-bold">SYSTEM LOCKED</p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      The system is locked. Enter the developer unlock token to regain access.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400">Developer Unlock Token</label>
                    <input
                      type="password"
                      value={lockdownToken}
                      onChange={(e) => setLockdownToken(e.target.value)}
                      placeholder="Enter unlock token"
                      className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl py-2 px-3 text-xs focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        if (lockdownState.onUnlockWithToken(lockdownToken)) {
                          playSound('success');
                          alert('System unlocked successfully!');
                        } else {
                          playSound('error');
                          alert('Invalid token. Contact developer.');
                        }
                        setLockdownToken('');
                      }}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Unlock className="w-3.5 h-3.5" /> Unlock System
                    </button>
                  </div>
                </div>
              ) : lockdownState?.lockdownEndDate ? (
                <div className="space-y-3">
                  <div className="p-3 bg-amber-950/20 border border-amber-700/40 rounded-lg">
                    <p className="text-[11px] text-amber-400 font-bold">LOCKDOWN ACTIVE</p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Lockdown period ends: {new Date(lockdownState.lockdownEndDate).toDateString()}
                    </p>
                  </div>
                  <button
                    onClick={lockdownState.onClearLockdown}
                    className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <X className="w-3.5 h-3.5" /> Cancel Lockdown
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Activate a 7-day system lockdown. After the countdown finishes, the system will lock until unlocked with a developer token.
                  </p>
                  <button
                    onClick={() => {
                      if (confirm('Activate 7-day system lockdown? The system will lock automatically after the period ends.')) {
                        lockdownState?.onActivateLockdown();
                      }
                    }}
                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Lock className="w-4 h-4" /> Activate Lockdown (7 Days)
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Tab content 2: Custom Roles & Permissions */}`;

content = content.replace(resetPanelOld, resetPanelNew);

// 8. Add EOD tab content at end (before closing </div>)
const eofOld = `            </div>
          )}
        </div>
      )}

    </div>
  );
}`;

const eofNew = `            </div>
          )}
        </div>
      )}

      {/* Tab content 4: End of Day Reports */}
      {activeSubTab === 'eod' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-slate-800/20 p-4 rounded-xl border border-slate-700/40">
            <div>
              <h3 className="text-sm font-bold text-white">End of Day Reports</h3>
              <p className="text-xs text-slate-400 mt-0.5">Historical daily summary reports for factory operations.</p>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 shadow-lg space-y-4">
            {endOfDayReports && endOfDayReports.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {endOfDayReports.map(report => (
                  <div key={report.id} className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-xs font-bold text-white block">{report.date}</span>
                        <span className="text-[10px] text-slate-500">Generated by: {report.generatedBy}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(report.closedAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
                      <div className="p-2 bg-slate-800/60 rounded-lg">
                        <span className="text-slate-500 block">Total Sales</span>
                        <span className="text-emerald-400 font-bold">₦{report.totalSales.toLocaleString()}</span>
                      </div>
                      <div className="p-2 bg-slate-800/60 rounded-lg">
                        <span className="text-slate-500 block">Total Expenses</span>
                        <span className="text-rose-400 font-bold">₦{report.totalExpenses.toLocaleString()}</span>
                      </div>
                      <div className="p-2 bg-slate-800/60 rounded-lg">
                        <span className="text-slate-500 block">Production</span>
                        <span className="text-sky-400 font-bold">{report.totalProductionBags} bags</span>
                      </div>
                      <div className="p-2 bg-slate-800/60 rounded-lg">
                        <span className="text-slate-500 block">Closing Stock</span>
                        <span className="text-amber-400 font-bold">{report.closingStock} bags</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-slate-500">No End of Day reports generated yet.</p>
            )}
          </div>
        </div>
      )}

    </div>
  );
}`;

content = content.replace(eofOld, eofNew);

fs.writeFileSync(filePath, content);
console.log('Done updating SettingsModule.tsx');