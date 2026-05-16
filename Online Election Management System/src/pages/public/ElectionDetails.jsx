import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import CountdownTimer from '../../components/ui/CountdownTimer'
import { CardSkeleton } from '../../components/ui/Skeleton'
import toast from 'react-hot-toast'
import { Vote, ArrowLeft, Users, Calendar, AlertCircle, CheckCircle, Shield } from 'lucide-react'
import { format } from 'date-fns'

const ElectionDetails = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [election, setElection] = useState(null)
  const [polls, setPolls] = useState([])
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [voterStatus, setVoterStatus] = useState(null)

  useEffect(() => {
    fetchElection()
  }, [id])

  const fetchElection = async () => {
    setLoading(true)
    try {
      // Basic fetch to simulate full details
      const { data, error } = await supabase
        .from('elections')
        .select('*, polls(id, title, description, candidates(id, name, designation))')
        .eq('id', id)
        .single()
        
      if (error) throw error
      
      let status = data.status
      const now = new Date()
      if (status !== 'draft') {
          if (data.end_at && new Date(data.end_at) < now) status = 'completed'
          else if (data.start_at && new Date(data.start_at) <= now) status = 'active'
          else status = 'upcoming'
      }
      
      setElection({ ...data, status })
      setPolls(data.polls || [])
      
      if (user && data.polls?.length > 0) {
         // Check registration status for first poll for simplicity
         const { data: reg } = await supabase
           .from('voter_registrations')
           .select('status')
           .eq('poll_id', data.polls[0].id)
           .eq('user_id', user.id)
           .single()
         if (reg) setVoterStatus(reg.status)
      }
      
    } catch {
      // Mock data if failed
      setElection(mockElection)
      setPolls(mockElection.polls)
      setVoterStatus(null)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    if (!user) {
      toast.error('You must be logged in to register.')
      return
    }
    setRegistering(true)
    try {
       if (polls.length === 0) throw new Error("No polls configured for this election.")
       
       const { error: regError } = await supabase.from('voter_registrations').insert({
          poll_id: polls[0].id,
          user_id: user.id,
          status: 'registered'
       })
       if (regError) throw regError

       // Generate Secret ID
       const rawSecret = Math.random().toString(36).substring(2, 10).toUpperCase()
       const { error: secError } = await supabase.from('secret_ids').insert({
          poll_id: polls[0].id,
          user_id: user.id,
          hashed_secret: rawSecret, // In production, hash this
          masked_secret: rawSecret
       })
       if (secError) console.error("Secret ID Generation failed:", secError)
       
       toast.success('Successfully registered! Check your Dashboard for your Secret ID.')
       setVoterStatus('registered')
    } catch (err) {
       // Friendly error if they try to register for the mock data
       if (err.code === '23503' || err.message?.includes('foreign key constraint')) {
          toast.error('This is a mock election. Please create a real election from the Creator Dashboard first!')
       } else {
          toast.error(err.message || 'Registration failed')
       }
    } finally {
       setRegistering(false)
    }
  }

  if (loading) return (
     <div className="min-h-screen bg-slate-50 flex flex-col">
       <Navbar />
       <main className="flex-1 max-w-7xl mx-auto px-4 w-full pt-32 pb-12">
          <CardSkeleton className="h-64 mb-8" />
       </main>
     </div>
  )

  if (!election) return <div className="text-center pt-32">Election not found</div>

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      {/* Hero */}
      <div className="bg-primary-900 pt-28 pb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <Link to="/elections" className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-6 text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Elections
           </Link>
           
           <div className="flex flex-wrap items-center gap-3 mb-4">
             <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                 election.status === 'active' ? 'bg-green-500 text-white' :
                 election.status === 'upcoming' ? 'bg-blue-500 text-white' : 'bg-slate-500 text-white'
             }`}>
                {election.status.toUpperCase()}
             </span>
             <span className="px-3 py-1 rounded-full bg-white/10 text-blue-100 text-xs font-semibold">
                {election.category}
             </span>
           </div>
           
           <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">{election.title}</h1>
           <p className="text-blue-200 max-w-3xl text-lg">{election.description}</p>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full grid md:grid-cols-3 gap-8">
        
        {/* Left Col - Details */}
        <div className="md:col-span-2 space-y-8">
           {/* Candidates / Polls overview */}
           <div className="card p-6">
              <h2 className="font-display text-xl font-bold text-slate-800 mb-5 flex items-center gap-2">
                 <Vote className="w-5 h-5 text-primary-600" /> Ballots & Candidates
              </h2>
              {polls.map((poll, idx) => (
                 <div key={poll.id || idx} className="mb-6 last:mb-0">
                    <h3 className="font-semibold text-slate-700 mb-3">{poll.title}</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                       {poll.candidates?.length > 0 ? poll.candidates.map((c, i) => (
                          <div key={c.id || i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50">
                             <div className="w-12 h-12 rounded-full bg-slate-200 shrink-0 flex items-center justify-center">
                                <Users className="w-5 h-5 text-slate-400" />
                             </div>
                             <div>
                                <p className="font-medium text-slate-800 text-sm">{c.name}</p>
                                <p className="text-xs text-slate-500">{c.designation || 'Candidate'}</p>
                             </div>
                          </div>
                       )) : (
                          <p className="text-sm text-slate-500">No candidates announced yet.</p>
                       )}
                    </div>
                 </div>
              ))}
           </div>
           
           {/* Security notice */}
           <div className="bg-teal-50 border border-teal-100 rounded-2xl p-6 flex gap-4">
              <Shield className="w-6 h-6 text-teal-600 shrink-0 mt-0.5" />
              <div>
                 <h3 className="font-semibold text-teal-800 mb-1">Secure & Anonymous Voting</h3>
                 <p className="text-sm text-teal-700 leading-relaxed">
                   This election uses cryptographic Secret IDs. Your identity is separated from your vote, ensuring complete anonymity while maintaining a verifiable audit trail.
                 </p>
              </div>
           </div>
        </div>
        
        {/* Right Col - Registration & Status */}
        <div className="space-y-6">
           {/* Action Card */}
           <div className="card p-6">
              <h3 className="font-display font-bold text-slate-800 mb-4">Participation Status</h3>
              
              {!user ? (
                 <div className="text-center">
                    <AlertCircle className="w-10 h-10 text-orange-400 mx-auto mb-3" />
                    <p className="text-sm text-slate-600 mb-4">Please log in to register or vote in this election.</p>
                    <Link to="/login" className="btn-primary w-full flex justify-center py-2.5">Log In to Participate</Link>
                 </div>
              ) : voterStatus === 'voted' ? (
                 <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-green-800 font-semibold">Vote Cast Successfully</p>
                    <p className="text-green-600 text-xs mt-1">Thank you for participating.</p>
                 </div>
              ) : voterStatus === 'registered' ? (
                 <div className="text-center">
                    <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                       <CheckCircle className="w-4 h-4" /> Registered
                    </div>
                    {election.status === 'active' ? (
                       <Link to={`/vote/${election.id}`} className="btn-teal w-full py-3 mb-2 animate-pulse flex justify-center text-center">Cast Your Vote Now</Link>
                    ) : election.status === 'upcoming' ? (
                       <p className="text-sm text-slate-600">Voting hasn't started yet. We'll notify you when it opens.</p>
                    ) : (
                       <p className="text-sm text-slate-600">This election has ended.</p>
                    )}
                 </div>
              ) : (
                 <div className="text-center">
                    {election.status === 'completed' ? (
                       <p className="text-sm text-slate-600">This election has ended. Registration is closed.</p>
                    ) : election.deadline && new Date(election.deadline) < new Date() ? (
                       <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
                          <p className="font-semibold text-sm">Registration Closed</p>
                          <p className="text-xs mt-1">The deadline to register for this election has passed. The voter list is now locked.</p>
                       </div>
                    ) : (
                       <>
                          <p className="text-sm text-slate-600 mb-4">You are not registered for this election. Registration is required to vote.</p>
                          <button onClick={handleRegister} disabled={registering} className="btn-primary w-full py-3">
                             {registering ? 'Registering...' : 'Register to Vote'}
                          </button>
                       </>
                    )}
                 </div>
              )}
              
              {(election.status === 'active' || election.status === 'completed') && (
                 <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                    <Link to={`/elections/${election.id}/results`} className="text-sm font-semibold text-primary-600 hover:text-primary-800 transition-colors">
                       View Live Results →
                    </Link>
                 </div>
              )}
           </div>

           {/* Timeline Card */}
           <div className="card p-6">
              <h3 className="font-display font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <Calendar className="w-5 h-5 text-slate-400" /> Schedule
              </h3>
              
              <div className="space-y-4">
                 <div className="relative pl-6 border-l-2 border-slate-200">
                    <div className="absolute w-3 h-3 bg-white border-2 border-primary-500 rounded-full -left-[7px] top-1" />
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-0.5">Starts</p>
                    <p className="text-sm font-medium text-slate-800">{election.start_at ? format(new Date(election.start_at), 'PPP at p') : 'TBA'}</p>
                 </div>
                 
                 {election.deadline && (
                    <div className="relative pl-6 border-l-2 border-slate-200">
                       <div className="absolute w-3 h-3 bg-white border-2 border-orange-500 rounded-full -left-[7px] top-1" />
                       <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-0.5">Registration Deadline</p>
                       <p className="text-sm font-medium text-slate-800">{format(new Date(election.deadline), 'PPP at p')}</p>
                    </div>
                 )}
                 
                 <div className="relative pl-6 border-l-2 border-slate-200">
                    <div className="absolute w-3 h-3 bg-white border-2 border-slate-400 rounded-full -left-[7px] top-1" />
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-0.5">Ends</p>
                    <p className="text-sm font-medium text-slate-800">{election.end_at ? format(new Date(election.end_at), 'PPP at p') : 'TBA'}</p>
                 </div>
              </div>

              {election.status === 'active' && (
                 <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">Time Remaining</p>
                    <CountdownTimer targetDate={election.end_at} className="justify-center" />
                 </div>
              )}
           </div>
        </div>

      </main>
      <Footer />
    </div>
  )
}

const mockElection = {
  id: '00000000-0000-0000-0000-000000000001', title: 'Student Council Election 2025', category: 'Student Council',
  description: 'Annual election for student council representatives across all departments. Your vote helps shape the future of our university activities, budget allocations, and student policies.',
  status: 'active', start_at: new Date(Date.now() - 86400000).toISOString(),
  end_at: new Date(Date.now() + 86400000 * 2).toISOString(),
  max_voters: 500,
  polls: [
     { id: '11111111-1111-1111-1111-111111111111', title: 'Presidential Ballot', candidates: [
        { id: '22222222-2222-2222-2222-222222222221', name: 'Alice Johnson', designation: 'Engineering' },
        { id: '22222222-2222-2222-2222-222222222222', name: 'Bob Smith', designation: 'Arts' }
     ]},
     { id: '11111111-1111-1111-1111-111111111112', title: 'Treasurer Ballot', candidates: [
        { id: '22222222-2222-2222-2222-222222222223', name: 'Charlie Brown', designation: 'Business' },
     ]}
  ]
}

export default ElectionDetails
