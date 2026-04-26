import { useState, useEffect } from 'react'
import { Search, Users, FileText } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/layout/Navbar'
import LawyerCard from '../../components/client/LawyerCard'
import RequestModal from '../../components/client/RequestModal'
import ClientRequestCard from '../../components/client/ClientRequestCard'
import { LawyerCardSkeleton, RequestCardSkeleton } from '../../components/ui/Skeletons'
import { storage } from '../../lib/storage'

const TABS = [
  { id: 'lawyers', label: 'Find a Lawyer', icon: Users },
  { id: 'requests', label: 'My Consultations', icon: FileText },
]

export default function ClientDashboard() {
  const { user } = useAuth()
  const [tab, setTab] = useState('lawyers')
  const [lawyers, setLawyers] = useState([])
  const [requests, setRequests] = useState([])
  const [loadingLawyers, setLoadingLawyers] = useState(true)
  const [loadingRequests, setLoadingRequests] = useState(true)
  const [selectedLawyer, setSelectedLawyer] = useState(null)
  const [search, setSearch] = useState('')
  const [filterSpeciality, setFilterSpeciality] = useState('All')

  useEffect(() => {
    fetchLawyers()
    fetchRequests()
  }, [])

  async function fetchLawyers() {
    try {
      const data = await storage.getProfiles()
      setLawyers(data.filter(p => p.role === 'lawyer') || [])
    } catch (error) {
      console.error('Error fetching lawyers:', error.message)
    } finally {
      setLoadingLawyers(false)
    }
  }

  async function fetchRequests() {
    if (!user) return
    try {
      const data = await storage.getRequests(user.id, 'client')
      setRequests(data || [])
    } catch (error) {
      console.error('Error fetching requests:', error.message)
    } finally {
      setLoadingRequests(false)
    }
  }

  const specialities = ['All', ...new Set(lawyers.map(l => l.specialty))]

  const filteredLawyers = lawyers.filter(l => {
    const matchSearch = l.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      l.specialty?.toLowerCase().includes(search.toLowerCase()) ||
      l.office_location?.toLowerCase().includes(search.toLowerCase())
    const matchSpec = filterSpeciality === 'All' || l.specialty === filterSpeciality
    return matchSearch && matchSpec
  })

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 page-enter">
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, <span className="text-navy-800">{user?.email?.split('@')[0]}</span> 👋
          </h1>
          <p className="text-slate-500 mt-1">Avocat-Link Cloud Portal</p>
        </div>

        <div className="flex gap-1 bg-slate-200/60 p-1 rounded-xl w-fit mb-6">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <t.icon size={15} />
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'lawyers' && (
          <div className="space-y-6 page-enter">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search lawyers..."
                  className="input-field pl-10"
                />
              </div>
              <select
                value={filterSpeciality}
                onChange={e => setFilterSpeciality(e.target.value)}
                className="input-field sm:w-48 appearance-none"
              >
                {specialities.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            {loadingLawyers ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => <LawyerCardSkeleton key={i} />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLawyers.map(lawyer => (
                  <LawyerCard key={lawyer.id} lawyer={lawyer} onSelect={setSelectedLawyer} />
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'requests' && (
          <div className="space-y-4 page-enter">
            {loadingRequests ? (
              Array.from({ length: 2 }).map((_, i) => <RequestCardSkeleton key={i} />)
            ) : requests.length > 0 ? (
              requests.map(request => (
                <ClientRequestCard key={request.id} request={request} />
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
                <FileText className="mx-auto text-slate-300 mb-3" size={40} />
                <p className="text-slate-500">No consultations found yet.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {selectedLawyer && (
        <RequestModal
          lawyer={selectedLawyer}
          onClose={() => setSelectedLawyer(null)}
          onSuccess={() => { 
            fetchRequests()
            setTab('requests') 
          }}
        />
      )}
    </div>
  )
}
