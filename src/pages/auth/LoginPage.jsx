import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Scale, Eye, EyeOff, ArrowRight, User, Briefcase } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.email || !form.password) return toast.error('Please fill in all fields')
    setLoading(true)
    try {
      await signIn(form)
      toast.success('Welcome back!')
    } catch (err) {
      toast.error('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="card p-8 shadow-xl border-0">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-navy-800 flex items-center justify-center mb-4">
              <Scale size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Login Area</h1>
            <p className="text-sm text-slate-500 mt-1">Please enter your email and password</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="you@example.com"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
                className="input-field"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4 text-base shadow-lg shadow-indigo-100">
              {loading ? 'Verifying...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-100">
            <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">New User? Create Account</p>
            <div className="grid grid-cols-2 gap-4">
              <Link 
                to="/register/client" 
                className="flex flex-col items-center gap-2 py-4 px-2 rounded-2xl border-2 border-slate-50 hover:border-navy-800 text-slate-600 hover:text-navy-800 transition-all bg-white hover:bg-navy-50/30"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                   <User size={16} />
                </div>
                <span className="text-xs font-bold">As Client</span>
              </Link>
              <Link 
                to="/register/agent" 
                className="flex flex-col items-center gap-2 py-4 px-2 rounded-2xl border-2 border-slate-50 hover:border-navy-800 text-slate-600 hover:text-navy-800 transition-all bg-white hover:bg-navy-50/30"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                   <Briefcase size={16} />
                </div>
                <span className="text-xs font-bold">As Lawyer</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
