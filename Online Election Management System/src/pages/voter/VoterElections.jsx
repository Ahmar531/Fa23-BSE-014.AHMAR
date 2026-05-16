import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { CardSkeleton } from '../../components/ui/Skeleton'
import ElectionCard from '../../components/elections/ElectionCard'
import { Vote, Search } from 'lucide-react'
import { Link } from 'react-router-dom'

const VoterElections = () => {
  const { user } = useAuth()
  const [elections, setElections] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [registeredIds, setRegisteredIds] = useState(new Set())
  const [registering, setRegistering] = useState(null)

  useEffect(() => {
    if (user) {
      fetchElections()
      fetchRegistrations()
    }
  }, [user])

  const fetchElections = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('elections')
        .select('*')
        .neq('status', 'draft')
        .order('created_at', { ascending: false })
      if (error) throw error
      const enriched = (data || []).map(el => {
        let status = el.status
        const now = new Date()
        if (status !== 'draft') {
          if (el.end_at && new Date(el.end_at) < now) status = 'completed'
          else if (el.start_at && new Date(el.start_at) <= now) status = 'active'
          else status = 'upcoming'
        }
        return { ...el, status }
      })
      setElections(enriched)
    } catch {
      toast.error('Failed to load elections')
    } finally {
      setLoading(false)
    }
  }

  const fetchRegistrations = async () => {
    try {
      const { data: regs } = await supabase
        .from('voter_registrations')
        .select('polls:poll_id(election_id)')
        .eq('user_id', user.id)
      const ids = new Set((regs || []).map(r => r.polls?.election_id).filter(Boolean))
      setRegisteredIds(ids)
    } catch {}
  }

  const handleRegister = async (electionId) => {
    setRegistering(electionId)
    try {
      // Get the default poll for this election
      const { data: polls } = await supabase
        .from('polls')
        .select('id')
        .eq('election_id', electionId)
        .limit(1)

      if (!polls?.length) return toast.error('This election has no active polls yet')

      const { error } = await supabase.from('voter_registrations').insert([{
        poll_id: polls[0].id,
        user_id: user.id,
        status: 'registered'
      }])

      if (error) {
        if (error.code === '23505') return toast.error('You are already registered for this election')
        throw error
      }
      setRegisteredIds(prev => new Set([...prev, electionId]))
      toast.success('Successfully registered for this election!')
    } catch (err) {
      toast.error(err.message || 'Failed to register')
    } finally {
      setRegistering(null)
    }
  }

  const filtered = elections.filter(e => {
    const matchSearch = !search || e.title?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || e.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Vote className="w-6 h-6 text-primary-600" /> Available Elections
        </h1>
        <p className="text-slate-500 text-sm mt-1">Browse and register for upcoming and active elections</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search elections..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none cursor-pointer"
        >
          <option value="all">All</option>
          <option value="upcoming">Upcoming</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <CardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Vote className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No elections available at the moment.</p>
          <p className="text-xs text-slate-400 mt-1">Check back later for new elections.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((el, i) => (
            <div key={el.id} className="relative">
              <ElectionCard election={el} index={i} />
              <div className="mt-3">
                {registeredIds.has(el.id) ? (
                  el.status === 'active' ? (
                    <Link
                      to={`/vote/${el.id}`}
                      className="block w-full text-center py-2.5 rounded-xl text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                    >
                      Vote Now →
                    </Link>
                  ) : (
                    <div className="w-full text-center py-2.5 rounded-xl text-sm font-semibold bg-green-100 text-green-700 border border-green-200">
                      ✓ Registered
                    </div>
                  )
                ) : el.status !== 'completed' ? (
                  <button
                    onClick={() => handleRegister(el.id)}
                    disabled={registering === el.id}
                    className="block w-full text-center py-2.5 rounded-xl text-sm font-semibold bg-slate-800 text-white hover:bg-slate-700 transition-colors disabled:opacity-50"
                  >
                    {registering === el.id ? 'Registering...' : 'Register to Vote'}
                  </button>
                ) : (
                  <div className="w-full text-center py-2.5 rounded-xl text-sm text-slate-500 bg-slate-100">
                    Election Ended
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default VoterElections
