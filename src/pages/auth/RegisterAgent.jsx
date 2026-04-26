import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, Phone, Banknote, Scale, Mail, Lock, User, Briefcase, CreditCard } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { storage } from '../../lib/storage'

const SPECIALITIES = [
  'Criminal Law', 'Family Law', 'Corporate Law', 'Real Estate Law',
  'Immigration Law', 'Intellectual Property', 'Labor Law', 'Tax Law',
  'Civil Litigation', 'General Practice',
]

export default function RegisterAgent() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ 
    email: '', 
    password: '', 
    name: '', 
    experience: '', 
    lawyerCardId: '',
    specialty: 'General Practice',
    phone: '',
    officeLocation: '',
    price: '1200'
  })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.email || !form.password || !form.name || !form.experience || !form.lawyerCardId || !form.phone || !form.officeLocation || !form.price) {
      return toast.error('Please fill in all fields')
    }
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')

    setLoading(true)
    try {
      await signUp({ 
        email: form.email, 
        password: form.password, 
        full_name: form.name,
        role: 'lawyer' 
      })
      
      const sessionUser = storage.getSession()
      if (sessionUser) {
        await storage.updateProfile(sessionUser.id, {
          specialty: form.specialty,
          experience_years: parseInt(form.experience) || 0,
          lawyer_card_id: form.lawyerCardId,
          phone_number: form.phone,
          office_location: form.officeLocation,
          consultation_price: parseInt(form.price) || 0
        })
      }

      toast.success('Agent account created!')
      navigate('/lawyer')
    } catch (err) {
      toast.error(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="card p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-2xl bg-navy-800 flex items-center justify-center shadow-lg">
              <Scale size={20} className="text-white" />
            </div>
            <h1 className="font-display font-bold text-navy-800 text-xl tracking-tight">Avocat-Link</h1>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-1">Register as Agent</h2>
          <p className="text-slate-500 text-sm mb-6">Join our professional legal network</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Maître John Smith"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Years Exp.</label>
                <div className="relative">
                  <Briefcase size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    value={form.experience}
                    onChange={e => setForm(p => ({ ...p, experience: e.target.value }))}
                    placeholder="10"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Lawyer Card ID</label>
                <div className="relative">
                  <CreditCard size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={form.lawyerCardId}
                    onChange={e => setForm(p => ({ ...p, lawyerCardId: e.target.value }))}
                    placeholder="L-12345"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Specialty</label>
                <select
                  value={form.specialty}
                  onChange={e => setForm(p => ({ ...p, specialty: e.target.value }))}
                  className="input-field appearance-none"
                >
                  {SPECIALITIES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">RDV Price (DA)</label>
                <div className="relative">
                  <Banknote size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    min="500"
                    max="5000"
                    value={form.price}
                    onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                    placeholder="1200"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Office Phone</label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  placeholder="05XX XX XX XX"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Office Location</label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={form.officeLocation}
                  onChange={e => setForm(p => ({ ...p, officeLocation: e.target.value }))}
                  placeholder="Street name, City"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="lawyer@example.com"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
              {loading ? 'Processing...' : 'Create Agent Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account? <Link to="/login" className="text-navy-800 font-bold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
