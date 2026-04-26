import { Link } from 'react-router-dom'
import { Scale, User, Briefcase, ArrowRight } from 'lucide-react'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl relative animate-slide-up">
        <div className="card p-8 md:p-12">
          <div className="flex items-center gap-3 mb-12 justify-center">
            <div className="w-12 h-12 rounded-2xl bg-navy-800 flex items-center justify-center shadow-lg">
              <Scale size={24} className="text-white" />
            </div>
            <h1 className="font-display font-bold text-navy-800 text-2xl tracking-tight">Avocat-Link</h1>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Join our Community</h2>
            <p className="text-slate-500">Choose the account type that fits your needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client Option */}
            <Link 
              to="/register/client" 
              className="group p-8 rounded-3xl border-2 border-slate-100 hover:border-navy-800 bg-white hover:bg-navy-50/30 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-50 group-hover:bg-white flex items-center justify-center text-slate-400 group-hover:text-navy-800 transition-colors mb-6">
                <User size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">I am a Client</h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                I'm looking for professional legal advice and want to connect with expert lawyers.
              </p>
              <div className="mt-auto flex items-center gap-2 text-navy-800 font-bold text-sm">
                Register as Client <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Agent Option */}
            <Link 
              to="/register/agent" 
              className="group p-8 rounded-3xl border-2 border-slate-100 hover:border-navy-800 bg-white hover:bg-navy-50/30 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-50 group-hover:bg-white flex items-center justify-center text-slate-400 group-hover:text-navy-800 transition-colors mb-6">
                <Briefcase size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">I am an Agent</h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                I am a legal professional looking to provide services and manage client requests.
              </p>
              <div className="mt-auto flex items-center gap-2 text-navy-800 font-bold text-sm">
                Register as Agent <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>

          <p className="mt-12 text-center text-sm text-slate-500 font-medium">
            Already have an account? <Link to="/login" className="text-navy-800 font-bold hover:underline">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
