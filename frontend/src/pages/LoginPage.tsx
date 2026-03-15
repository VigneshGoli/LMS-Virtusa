import { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { loginWithEmailPassword } from '../services/authApi'
import { useAuth } from '../auth/AuthContext'

const LoginPage = () => {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { refresh } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const restricted = params.get('restricted') === '1'
  const backendBase =
    import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:8080'

  const handleInstitutionLogin = async () => {
    try {
      setSubmitting(true)
      await loginWithEmailPassword(email, password)
      await refresh()
      navigate('/', { replace: true })
    } catch (e: unknown) {
      toast.error('Access is restricted to official MLRIT accounts')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-50">
      {/* Animated gradient wash */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_#1e293b,_#020617)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(245,128,37,0.20),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(0,148,68,0.20),transparent_55%)] bg-[length:200%_200%] animate-gradient-slow opacity-80" />

      {/* Floating academic / tech shapes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-28 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-10 bottom-10 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/4 h-40 w-40 -translate-x-1/2 rounded-3xl border border-slate-700/40 bg-slate-900/40 backdrop-blur-xl shadow-[0_0_50px_rgba(15,23,42,0.8)] animate-float-slow" />
        <div className="absolute right-12 top-1/3 h-32 w-32 rounded-full border border-dashed border-slate-600/40" />
        <div className="absolute left-10 bottom-24 h-24 w-24 rotate-6 rounded-2xl border border-slate-700/50 bg-slate-900/50" />
      </div>

      {/* Subtle watermark logo */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "url('/mlrit-full-logo.png')",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'min(60%, 520px)',
        }}
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-center">
          <div className="w-full max-w-md">
            <div className="mb-6 flex justify-center">
              <img
                src="/mlrit-full-logo.png"
                alt="MLR Institute of Technology"
                className="h-16 w-auto drop-shadow-[0_10px_30px_rgba(15,23,42,0.75)]"
              />
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.9)] backdrop-blur-xl">
              <h1 className="text-lg font-semibold text-white">
                MLRIT Library Management System
              </h1>
              <p className="mt-1 text-sm text-slate-200/80">Secure digital library sign-in portal</p>
              {restricted && (
                <div className="mt-4 rounded-xl border border-amber-300/80 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                  Access is restricted to official MLRIT accounts.
                </div>
              )}

              <div className="mt-6 space-y-4">
                <a
                  href={`${backendBase}/oauth2/authorization/google`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-slate-950/40 px-4 py-2.5 text-sm font-semibold text-slate-50 shadow-[0_12px_40px_rgba(15,23,42,0.65)] backdrop-blur-md transition hover:border-white/40 hover:bg-slate-900/60"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
                      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.657 32.653 29.243 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.957 3.043l5.657-5.657C34.046 6.053 29.272 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                      <path fill="#FF3D00" d="M6.306 14.691 12.963 19.58C14.769 15.108 19.14 12 24 12c3.059 0 5.842 1.154 7.957 3.043l5.657-5.657C34.046 6.053 29.272 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.197l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.223 0-9.623-3.326-11.283-7.962l-6.61 5.096C9.426 39.556 16.227 44 24 44z"/>
                      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.05 12.05 0 0 1-4.087 5.565l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
                    </svg>
                  </span>
                  Sign in with Google
                </a>

                <div className="relative py-2">
                  <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-slate-500/40" />
                  <div className="relative mx-auto w-fit rounded-full bg-slate-900/80 px-3 text-xs font-medium uppercase tracking-wide text-slate-300">
                    Or sign in with institutional credentials
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-100">
                    Institutional Email
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rollnumber@mlrit.ac.in"
                    className="w-full rounded-xl border border-slate-500/40 bg-slate-900/60 px-3 py-2.5 text-sm text-slate-50 outline-none ring-primary/40 placeholder:text-slate-500 focus:bg-slate-900/90 focus:ring"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-100">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your roll number (e.g. 22r21a05e5)"
                    className="w-full rounded-xl border border-slate-500/40 bg-slate-900/60 px-3 py-2.5 text-sm text-slate-50 outline-none ring-primary/40 placeholder:text-slate-500 focus:bg-slate-900/90 focus:ring"
                  />
                  <p className="text-xs text-slate-300">
                    Password is your roll number (without <span className="font-mono">@mlrit.ac.in</span>).
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleInstitutionLogin}
                  disabled={submitting}
                  className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(245,128,37,0.55)] transition hover:bg-primary/90 hover:shadow-[0_22px_55px_rgba(245,128,37,0.7)] disabled:opacity-60"
                >
                  {submitting ? 'Signing in…' : 'Login'}
                </button>

                <p className="text-xs text-slate-300">
                  Access is restricted to official MLRIT accounts only.
                </p>
              </div>
            </div>
            <div className="mt-4 text-center text-[11px] text-slate-400">
              MLR Institute of Technology • Digital Library Portal
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

