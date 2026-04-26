import { useState } from 'react'
import { FileText, ExternalLink, Check, X, Calendar, Clock, Loader, Trash2 } from 'lucide-react'
import StatusBadge from '../ui/StatusBadge'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { storage } from '../../lib/storage'

export default function LawyerRequestCard({ request, onUpdate }) {
  const [loading, setLoading] = useState(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [appointmentDate, setAppointmentDate] = useState('')

  async function handleAction(action) {
    setLoading(action)
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600))

      if (action === 'delete') {
        // We'll use 'rejected' as the status for 'deleted' so it disappears 
        // from the dashboard based on the filter I just added.
        storage.updateRequest(request.id, { status: 'rejected' })
        toast.success('Request removed')
      } else {
        await storage.updateRequest(request.id, {
          status: action,
          appointment_date: action === 'accepted' ? (appointmentDate || new Date().toISOString()) : null
        })

        // Add notification for client if accepted
        if (action === 'accepted') {
          await storage.addNotification({
            user_id: request.client_id,
            message: `Maître ${request.lawyers?.name || 'A lawyer'} has accepted your consultation request! Check your dashboard for the RDV details.`
          })
        }

        toast.success(`Request ${action}!`)
      }

      setShowDatePicker(false)
      onUpdate?.()
    } catch (error) {
      console.error('Error updating request:', error.message)
      toast.error('Operation failed')
    } finally {
      setLoading(null)
    }
  }

  const clientName = request.profiles?.full_name || request.client_name || 'Anonymous Client'

  return (
    <div className="card p-6 animate-fade-in space-y-5 border-0 shadow-sm hover:shadow-md transition-all group relative">
      {/* Delete button for accepted requests */}
      {request.status === 'accepted' && (
        <button 
          onClick={() => handleAction('delete')}
          className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
          title="Remove from dashboard"
        >
          <X size={18} />
        </button>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center text-white text-sm font-bold shadow-sm">
            {clientName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 capitalize">{clientName}</p>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
              <Clock size={11} />
              {request.consultation_date ? format(new Date(request.consultation_date), 'MMM d, yyyy') : 'No date'}
            </div>
          </div>
        </div>
        <StatusBadge status={request.status} />
      </div>

      <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
        <p className="text-sm text-slate-600 leading-relaxed italic">"{request.description}"</p>
      </div>

      {request.evidence_url && (
        <div className="pt-1">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Evidence Documents</label>
          <a
            href={request.evidence_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-navy-800 hover:text-indigo-600 font-bold bg-white border border-slate-200 px-4 py-2 rounded-xl transition-all shadow-sm hover:border-navy-800"
          >
            <FileText size={14} className="text-navy-800" />
            View Justificatif
            <ExternalLink size={12} className="opacity-50" />
          </a>
        </div>
      )}

      {request.status === 'accepted' && request.appointment_date && (
        <div className="flex items-center gap-3 text-sm text-emerald-800 bg-emerald-50/50 px-4 py-3 rounded-2xl border border-emerald-100">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
            <Calendar size={16} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Confirmed RDV</p>
            <p className="font-semibold">{format(new Date(request.appointment_date), 'MMM d, yyyy · h:mm a')}</p>
          </div>
        </div>
      )}

      {request.status === 'pending' && (
        <div className="pt-2 space-y-4">
          {!showDatePicker ? (
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDatePicker(true)} 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm shadow-emerald-200"
              >
                <Check size={18} /> Accept & Set RDV
              </button>
              <button 
                onClick={() => handleAction('rejected')} 
                className="flex-1 bg-white hover:bg-red-50 text-red-600 border border-red-100 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                disabled={loading}
              >
                <X size={18} /> Reject
              </button>
            </div>
          ) : (
            <div className="bg-navy-900 text-white rounded-2xl p-5 space-y-4 animate-scale-in">
              <div>
                <label className="block text-[10px] font-bold text-navy-300 uppercase tracking-widest mb-2">Select Appointment (RDV)</label>
                <input
                  type="datetime-local"
                  value={appointmentDate}
                  onChange={e => setAppointmentDate(e.target.value)}
                  className="w-full bg-navy-800 border-navy-700 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleAction('accepted')} 
                  className="flex-[2] bg-white text-navy-900 hover:bg-indigo-50 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50" 
                  disabled={loading || !appointmentDate}
                >
                  {loading === 'accepted' ? <Loader size={16} className="animate-spin" /> : <><Check size={16} /> Confirm RDV</>}
                </button>
                <button 
                  onClick={() => setShowDatePicker(false)} 
                  className="flex-1 bg-navy-800 text-navy-300 hover:text-white py-3 rounded-xl text-sm font-bold transition-all" 
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
