import { useState, useRef } from 'react'
import { X, Upload, Loader, Send, Scale } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { storage } from '../../lib/storage'
import { supabase } from '../../lib/supabaseClient'

export default function RequestModal({ lawyer, onClose, onSuccess }) {
  const { user, profile } = useAuth()
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef()

  async function handleSubmit() {
    if (!description.trim()) return toast.error('Please describe your legal issue')
    setLoading(true)

    try {
      let evidence_url = null
      if (file) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `${user.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('documents')
          .getPublicUrl(filePath)
          
        evidence_url = publicUrl
      }

      await storage.addRequest({
        client_id: user.id,
        lawyer_id: lawyer.id,
        client_name: profile?.full_name || user.email.split('@')[0],
        description: description.trim(),
        evidence_url,
        category: lawyer.specialty || 'General'
      })

      toast.success('Consultation request submitted!')
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Error submitting request:', error.message)
      toast.error('Failed to submit request: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-modal w-full max-w-lg animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy-800 flex items-center justify-center">
              <Scale size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Submit Request</h2>
              <p className="text-xs text-slate-500">To {lawyer.full_name || lawyer.name} · {lawyer.specialty}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
              Describe your legal issue <span className="text-red-400">*</span>
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={5}
              placeholder="Describe your situation here..."
              className="input-field resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
              Supporting Document <span className="text-slate-400">(PDF/Image)</span>
            </label>
            <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:bg-slate-50 transition-all">
              <Upload size={20} className="mx-auto mb-2 text-slate-400" />
              <p className="text-sm font-medium text-slate-700">{file ? file.name : 'Drop file or click to upload'}</p>
              <input ref={fileRef} type="file" className="hidden" onChange={e => setFile(e.target.files[0])} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 pb-6">
          <button onClick={onClose} className="btn-secondary" disabled={loading}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading || !description.trim()} className="btn-primary">
            {loading ? <><Loader size={15} className="animate-spin" /> Submitting...</> : <><Send size={15} /> Submit Request</>}
          </button>
        </div>
      </div>
    </div>
  )
}
