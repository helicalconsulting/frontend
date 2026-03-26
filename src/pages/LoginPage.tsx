import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { login as loginService } from '@/services/authService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Eye, EyeOff, Loader2, Shield } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('ADMIN');
  const [password, setPassword] = useState('admin123');
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
      setError(err instanceof Error ? err.message : 'Login failed');
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
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-2xl shadow-blue-500/25">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">
            Workflow Approval
          </h1>
          <p className="mt-2 text-sm text-blue-200/70">
            Enterprise Governance & Approval Platform
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300 animate-in fade-in">
                {error}
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
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/25 text-white font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-[11px] text-blue-200/40">
            Program protected as described in Help About SYSPRO
          </p>
        </div>

        {/* Hint */}
        <div className="mt-4 rounded-lg border border-white/5 bg-white/5 px-4 py-3 backdrop-blur-sm">
          <p className="text-xs text-blue-200/50 text-center">
            <span className="font-semibold text-blue-200/70">Demo:</span>{' '}
            Username: ADMIN | Password: admin123
          </p>
        </div>
      </div>
    </div>
  );
}
