import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { login as loginService } from '@/services/authService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Eye, EyeOff, Loader2, Shield, Building2 } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password123');
  const [company, setCompany] = useState('EDU1');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl animate-pulse" />
        <div className="absolute -right-40 -bottom-40 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl animate-pulse delay-1000" />
        <div className="absolute left-1/2 top-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-500/5 blur-3xl animate-pulse delay-500" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-4 animate-scale-in">
        <div className="mb-8 text-center">
          <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 shadow-2xl shadow-blue-500/40 ring-4 ring-white/10">
            <Shield className="h-10 w-10 text-white drop-shadow-lg" />
            <div className="absolute inset-0 rounded-3xl bg-white/20 animate-pulse"></div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            Workflow Approval
          </h1>
          <p className="text-sm text-blue-200/80 font-medium">
            Enterprise Governance & Approval Platform
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl ring-1 ring-white/5">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-400/30 bg-red-500/20 backdrop-blur-sm px-4 py-3.5 text-sm text-red-200 animate-in shadow-lg shadow-red-500/10">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="h-5 w-5 rounded-full bg-red-500/30 flex items-center justify-center">
                    <span className="text-red-300 font-bold text-xs">!</span>
                  </div>
                </div>
                <div className="font-medium">{error}</div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-blue-200/80">
                User Name
              </label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-blue-400 focus:ring-blue-400/25"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-blue-200/80">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="border-white/10 bg-white/5 text-white placeholder:text-white/30 pr-10 focus:border-blue-400 focus:ring-blue-400/25"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-blue-200/80">
                Company
              </label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company code"
                className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-blue-400 focus:ring-blue-400/25"
                required
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-400/25"
              />
              <label htmlFor="remember" className="text-sm text-blue-200/70">
                Remember Me
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-500 hover:via-blue-600 hover:to-indigo-500 shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 text-white font-bold transition-all duration-300 active:scale-[0.98] relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Login
                    <span className="text-xl">→</span>
                  </>
                )}
              </span>
            </Button>
          </form>

          <p className="mt-6 text-center text-[11px] text-blue-200/40">
            Program protected as described in Help About SYSPRO
          </p>
        </div>

        {/* Hint */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md px-5 py-4 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center ring-2 ring-blue-400/30">
                <span className="text-blue-300 font-bold text-xs">i</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-blue-100 mb-1">Demo Credentials</p>
              <p className="text-xs text-blue-200/70 leading-relaxed">
                <span className="font-semibold text-blue-200">Users:</span> admin, approver1, approver2, requester
                <br />
                <span className="font-semibold text-blue-200">Password:</span> password123
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-center gap-2 text-blue-200/40">
          <Building2 className="h-4 w-4" />
          <span className="text-xs">Helical Consulting</span>
        </div>
      </div>
    </div>
  );
}
