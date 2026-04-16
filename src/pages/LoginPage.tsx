import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { login as loginService } from '@/services/authService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Eye, EyeOff, Loader2, Building2, Sun, Moon, ChevronRight, Lock, User, Briefcase } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password123');
  const [company, setCompany] = useState('DEMO');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await loginService({ username, password, company });
      login(response.token, response.user);
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Authentication failed. Please verify your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const theme = {
    pageBg: isDark
      ? 'bg-[#0a0f1c]'
      : 'bg-[#f0f2f5]',
    sidebarBg: isDark
      ? 'bg-gradient-to-b from-[#0d1526] to-[#111d35]'
      : 'bg-gradient-to-b from-[#1a3b6e] to-[#0f2554]',
    cardBg: isDark
      ? 'bg-[#111827] border border-[#1e2d45]'
      : 'bg-white border border-[#d0d8e4]',
    inputBg: isDark
      ? 'bg-[#0d1526] border border-[#1e3050] text-white placeholder:text-slate-500 focus:border-[#3b82f6]'
      : 'bg-[#f7f9fc] border border-[#c8d2e0] text-[#1a2332] placeholder:text-slate-400 focus:border-[#1a6fe0]',
    label: isDark ? 'text-[#8ba4c4]' : 'text-[#4a5e7a]',
    title: isDark ? 'text-white' : 'text-[#1a2332]',
    subtitle: isDark ? 'text-[#5b7aa0]' : 'text-[#5b7aa0]',
    divider: isDark ? 'border-[#1e2d45]' : 'border-[#d8e2ed]',
    footerText: isDark ? 'text-[#3a5070]' : 'text-[#8096b0]',
    demoBg: isDark ? 'bg-[#0d1828] border border-[#1a2d45]' : 'bg-[#edf1f8] border border-[#c8d8ec]',
    demoItemBg: isDark
      ? 'bg-[#0a1525] hover:bg-[#112040] border border-[#1a2d48]'
      : 'bg-white hover:bg-[#e8f0fb] border border-[#d0dcea]',
    toggleBg: isDark ? 'bg-[#0d1526] border border-[#1e3050]' : 'bg-white border border-[#c8d2e0]',
    iconColor: isDark ? 'text-[#4a7ab5]' : 'text-[#2060b0]',
    errorBg: isDark
      ? 'bg-[#2a0f0f] border border-[#5a1a1a] text-[#f87171]'
      : 'bg-[#fff1f1] border border-[#fca5a5] text-[#b91c1c]',
  };

  return (
    <div className={`flex min-h-screen ${theme.pageBg} font-['IBM_Plex_Sans',sans-serif] transition-colors duration-300`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; }

        .field-focus:focus-within label {
          color: #3b82f6;
        }

        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .anim-fade { animation: fadeSlideIn 0.5s ease forwards; }
        .anim-slide { animation: slideRight 0.5s ease forwards; }
        .anim-delay-1 { animation-delay: 0.1s; opacity: 0; }
        .anim-delay-2 { animation-delay: 0.2s; opacity: 0; }
        .anim-delay-3 { animation-delay: 0.3s; opacity: 0; }
        .anim-delay-4 { animation-delay: 0.4s; opacity: 0; }
        .anim-delay-5 { animation-delay: 0.5s; opacity: 0; }

        .btn-primary {
          position: relative;
          overflow: hidden;
        }
        .btn-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }
        .btn-primary:hover::after {
          transform: translateX(100%);
        }
        .input-icon-wrap {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          z-index: 1;
        }
        .input-padded {
          padding-left: 38px !important;
        }
        .sapbar {
          height: 3px;
          background: linear-gradient(90deg, #0050af, #1a73e8, #00b0f0);
        }
      `}</style>

      {/* Left Branding Panel */}
      <div className={`hidden lg:flex lg:w-[45%] xl:w-[40%] ${theme.sidebarBg} flex-col justify-between p-12 relative overflow-hidden`}>
        {/* Geometric background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-[0.04] bg-white" style={{transform:'translate(30%,-30%)'}} />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-[0.03] bg-white" style={{transform:'translate(-30%,30%)'}} />
          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          {/* Diagonal accent */}
          <div className="absolute inset-0" style={{background:'linear-gradient(135deg, transparent 60%, rgba(0,112,255,0.06) 100%)'}} />
        </div>

        {/* Logo + Brand */}
        <div className="relative z-10 anim-slide">
          <div className="flex items-center gap-3 mb-2">
            {/* 3x3 circle dots icon matching logo */}
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:'#1c2e4a'}}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="3"  cy="3"  r="2.2" fill="#4d9de0"/>
                <circle cx="11" cy="3"  r="2.2" fill="#4d9de0"/>
                <circle cx="19" cy="3"  r="2.2" fill="#4d9de0"/>
                <circle cx="3"  cy="11" r="2.2" fill="#4d9de0"/>
                <circle cx="11" cy="11" r="2.2" fill="#2a6db5"/>
                <circle cx="19" cy="11" r="2.2" fill="#4d9de0"/>
                <circle cx="3"  cy="19" r="2.2" fill="#4d9de0"/>
                <circle cx="11" cy="19" r="2.2" fill="#4d9de0"/>
                <circle cx="19" cy="19" r="2.2" fill="#4d9de0"/>
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-base leading-none tracking-wide">Helical</p>
              <p className="text-[#60a5fa] text-[11px] leading-none mt-1 font-medium">Workflow System</p>
            </div>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-sm">
          <div className="anim-slide anim-delay-1 mb-3">
            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-blue-400/70 border border-blue-500/20 bg-blue-500/10 px-3 py-1 rounded-full">
              Enterprise Platform
            </span>
          </div>
          <h2 className="anim-slide anim-delay-2 text-4xl xl:text-5xl font-bold text-white leading-[1.15] mb-4 tracking-tight">
            Workflow<br />
            <span style={{color:'#60a5fa'}}>Approval</span><br />
            System
          </h2>
          <p className="anim-slide anim-delay-3 text-sm text-blue-200/50 leading-relaxed mb-8 max-w-[280px]">
            Streamline enterprise approvals with end-to-end governance, audit trails, and multi-level authorization.
          </p>

          {/* Feature list */}
          <div className="space-y-3 anim-slide anim-delay-4">
            {['Multi-level Authorization', 'Real-time Audit Trails', 'Role-based Access Control'].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0" style={{background:'rgba(59,130,246,0.15)', border:'1px solid rgba(59,130,246,0.25)'}}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1.5 5L4 7.5L8.5 2.5" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-xs text-blue-200/60">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 anim-slide anim-delay-5">
          <div className={`border-t border-white/10 pt-6`}>
            <p className="text-[11px] text-blue-300/30 tracking-wide">
              © 2025 Helical Consulting. Enterprise Edition v4.2
            </p>
          </div>
        </div>
      </div>

      {/* Right Login Panel */}
      <div className={`flex-1 flex flex-col`}>
        {/* Top bar */}
        <div className="sapbar" />
        <div className={`flex items-center justify-between px-6 py-3 border-b ${theme.divider} ${theme.cardBg.split(' ')[0]}`}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{background:'#1c2e4a'}}>
              <svg width="16" height="16" viewBox="0 0 22 22" fill="none">
                <circle cx="3"  cy="3"  r="2.2" fill="#4d9de0"/>
                <circle cx="11" cy="3"  r="2.2" fill="#4d9de0"/>
                <circle cx="19" cy="3"  r="2.2" fill="#4d9de0"/>
                <circle cx="3"  cy="11" r="2.2" fill="#4d9de0"/>
                <circle cx="11" cy="11" r="2.2" fill="#2a6db5"/>
                <circle cx="19" cy="11" r="2.2" fill="#4d9de0"/>
                <circle cx="3"  cy="19" r="2.2" fill="#4d9de0"/>
                <circle cx="11" cy="19" r="2.2" fill="#4d9de0"/>
                <circle cx="19" cy="19" r="2.2" fill="#4d9de0"/>
              </svg>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-sm font-bold ${theme.title}`}>Helical</span>
              <span className={`text-xs ${theme.subtitle}`}>Workflow System</span>
            </div>
          </div>
          <button
            onClick={() => setIsDark(!isDark)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${theme.toggleBg} ${theme.label} hover:opacity-80`}
          >
            {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            {isDark ? 'Light' : 'Dark'}
          </button>
        </div>

        {/* Main form area */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-[420px]">

            {/* Page heading */}
            <div className="mb-8 anim-fade">
              <h1 className={`text-2xl font-bold ${theme.title} mb-1 tracking-tight`}>Sign In</h1>
              <p className={`text-sm ${theme.subtitle}`}>Enter your credentials to access the system</p>
            </div>

            {/* Form card */}
            <div className={`rounded-xl ${theme.cardBg} p-6 anim-fade anim-delay-1`}>
              <form onSubmit={handleSubmit} className="space-y-4">

                {error && (
                  <div className={`flex items-start gap-2.5 rounded-lg px-4 py-3 text-sm ${theme.errorBg}`}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5">
                      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                {/* Username */}
                <div className="space-y-1.5">
                  <label className={`block text-[11px] font-semibold uppercase tracking-[0.08em] ${theme.label}`}>
                    User Name <span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <div className="input-icon-wrap">
                    <User className={`input-icon h-3.5 w-3.5 ${theme.iconColor}`} />
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username"
                      className={`h-9 rounded-lg text-sm input-padded ${theme.inputBg}`}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className={`block text-[11px] font-semibold uppercase tracking-[0.08em] ${theme.label}`}>
                      Password <span className="text-red-400 ml-0.5">*</span>
                    </label>
                    <button type="button" className="text-[11px] text-blue-500 hover:text-blue-400 transition-colors">
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative input-icon-wrap">
                    <Lock className={`input-icon h-3.5 w-3.5 ${theme.iconColor}`} />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className={`h-9 rounded-lg text-sm input-padded pr-10 ${theme.inputBg}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${theme.label} hover:opacity-70 transition-opacity`}
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Company */}
                <div className="space-y-1.5">
                  <label className={`block text-[11px] font-semibold uppercase tracking-[0.08em] ${theme.label}`}>
                    Company Code <span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <div className="input-icon-wrap">
                    <Briefcase className={`input-icon h-3.5 w-3.5 ${theme.iconColor}`} />
                    <Input
                      id="company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. DEMO"
                      className={`h-9 rounded-lg text-sm input-padded ${theme.inputBg}`}
                      required
                    />
                  </div>
                </div>

                {/* Remember me */}
                <div className="flex items-center gap-2.5 pt-0.5">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-slate-500 accent-blue-600 cursor-pointer"
                  />
                  <label htmlFor="remember" className={`text-xs cursor-pointer ${theme.label}`}>
                    Keep me signed in
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full h-10 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
                  style={{background: isLoading ? '#1a4fa0' : 'linear-gradient(135deg, #1a5fd6 0%, #0038a0 100%)', boxShadow:'0 2px 12px rgba(26,95,214,0.35)'}}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Demo credentials */}
            <div className={`mt-4 rounded-xl ${theme.demoBg} p-4 anim-fade anim-delay-2`}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-4 rounded flex items-center justify-center" style={{background:'rgba(59,130,246,0.15)', border:'1px solid rgba(59,130,246,0.2)'}}>
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <circle cx="4" cy="3" r="1.5" fill="#60a5fa"/>
                    <path d="M1 7c0-1.657 1.343-3 3-3s3 1.343 3 3" stroke="#60a5fa" strokeWidth="1" strokeLinecap="round"/>
                  </svg>
                </div>
                <span className={`text-[11px] font-semibold uppercase tracking-wider ${theme.label}`}>Demo Accounts</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { user: 'admin', role: 'Super Admin', color: '#34d399' },
                  { user: 'approver1', role: 'Manager', color: '#fbbf24' },
                  { user: 'approver2', role: 'Finance', color: '#f97316' },
                  { user: 'requester', role: 'Staff', color: '#22d3ee' },
                ].map(({ user, role, color }) => (
                  <button
                    key={user}
                    type="button"
                    onClick={() => { setUsername(user); setPassword('password123'); setCompany('DEMO'); }}
                    className={`text-left p-2.5 rounded-lg transition-colors ${theme.demoItemBg}`}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{background: color}} />
                      <span className="text-[11px] font-semibold" style={{color}}>{user}</span>
                    </div>
                    <span className={`text-[10px] ${theme.footerText}`}>{role}</span>
                  </button>
                ))}
              </div>
              <p className={`text-[10px] ${theme.footerText} text-center mt-2.5 font-mono`}>
                Password: password123 · Company: DEMO
              </p>
            </div>

            {/* Footer */}
            <div className={`mt-5 flex items-center justify-between text-[11px] ${theme.footerText} anim-fade anim-delay-3`}>
              <div className="flex items-center gap-1.5">
                <Building2 className="h-3 w-3" />
                <span>Helical · Workflow System</span>
              </div>
              <div className="flex items-center gap-3">
                <span>Help</span>
                <span className={`${theme.divider} border-r h-3`} />
                <span>Privacy</span>
                <span className={`${theme.divider} border-r h-3`} />
                <span>Legal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}