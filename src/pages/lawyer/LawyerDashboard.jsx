import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/layout/Navbar'
import LawyerRequestCard from '../../components/lawyer/LawyerRequestCard'
import { RequestCardSkeleton } from '../../components/ui/Skeletons'
import { Inbox, Scale } from 'lucide-react'
import { storage } from '../../lib/storage'

export default function LawyerDashboard() {
  const { profile, user } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConsultations()
  }, [user])

  async function fetchConsultations() {
    if (!user) return
    try {
      const data = await storage.getRequests(user.id, 'lawyer')
      setRequests(data || [])
    } catch (error) {
      console.error('Error fetching consultations:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = () => {
    fetchConsultations()
  }

  // Filter out rejected requests as per user requirement
  const visibleRequests = requests.filter(r => r.status !== 'rejected')

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start justify-between mb-8 page-enter">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {profile?.full_name || 'Lawyer'}'s Dashboard
            </h1>
            <p className="text-slate-500 mt-1">
              Management of Legal Consultation Requests
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center gap-2 bg-navy-800 text-white px-4 py-2 rounded-xl text-sm font-medium">
              <Scale size={15} />
              {profile?.specialty || 'General Practice'}
            </div>
            {profile?.experience_years && (
              <div className="bg-white border-2 border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm">
                {profile.experience_years} years of experience
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Inbox size={20} className="text-navy-800" />
              All Consultations
            </h2>
            <div className="text-sm text-slate-500 font-medium">
              {visibleRequests.length} Requests
            </div>
          </div>

          {loading ? (
            <RequestCardSkeleton />
          ) : visibleRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {visibleRequests.map(request => (
                <LawyerRequestCard key={request.id} request={request} onUpdate={handleUpdate} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-sm">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Inbox className="text-slate-300" size={32} />
              </div>
              <p className="text-slate-500 font-medium">No consultation requests available.</p>
              <p className="text-slate-400 text-sm mt-1">New requests will appear here as they arrive.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
