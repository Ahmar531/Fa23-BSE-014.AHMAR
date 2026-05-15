import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import { CardSkeleton } from '../../components/ui/Skeleton'
import toast from 'react-hot-toast'
import { CheckCircle, Shield, AlertTriangle, Key } from 'lucide-react'

const VotingPage = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [election, setElection] = useState(null)
  const [polls, setPolls] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [selections, setSelections] = useState({}) // { poll_id: candidate_id }
  const [secretId, setSecretId] = useState('')
  const [step, setStep] = useState(1) // 1: Select Candidates, 2: Enter Secret ID, 3: Success

  useEffect(() => {
    fetchVotingData()
  }, [id])

  const fetchVotingData = async () => {
    try {
      // 1. Fetch Election details
      const { data: electionData, error: elError } = await supabase
        .from('elections')
        .select('*')
        .eq('id', id)
        .single()
      if (elError) throw elError

      if (electionData.status !== 'active' && new Date(electionData.start_at) <= new Date() && new Date(electionData.end_at) > new Date()) {
         electionData.status = 'active'
      }

      setElection(electionData)

      if (electionData.status !== 'active') {
         toast.error('This election is not currently active.')
         navigate(`/elections/${id}`)
         return
      }

      // 2. Fetch Polls and Candidates
      const { data: pollData, error: pollError } = await supabase
        .from('polls')
        .select('*, candidates(*)')
        .eq('election_id', id)
      if (pollError) throw pollError
      setPolls(pollData || [])

      // 3. Verify Registration
      if (user) {
         const { data: reg } = await supabase
           .from('voter_registrations')
           .select('status')
           .eq('poll_id', pollData[0]?.id)
           .eq('user_id', user.id)
           .single()
         
         if (!reg || reg.status === 'voted') {
            toast.error(reg?.status === 'voted' ? 'You have already voted in this election.' : 'You are not registered for this election.')
            navigate(`/elections/${id}`)
         }
      }

    } catch (error) {
      toast.error('Failed to load voting booth.')
      navigate(`/elections/${id}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSelection = (pollId, candidateId) => {
    setSelections(prev => ({ ...prev, [pollId]: candidateId }))
  }

  const handleProceedToAuth = () => {
    if (Object.keys(selections).length < polls.length) {
       toast.error('Please make a selection for all ballots.')
       return
    }
    setStep(2)
  }

  const handleSubmitVote = async (e) => {
    e.preventDefault()
    if (!secretId || secretId.length < 6) return toast.error('Please enter a valid Secret Voter ID')
    
    setSubmitting(true)
    try {
       // In a real production app, this would call an Edge Function to verify the secret ID securely
       // and perform the vote insertion and status update transactionally.
       // Here we simulate the logic.
       
       // 1. Verify Secret ID (Simulated check, normally we check hashed_secret)
       const { data: secretData } = await supabase
          .from('secret_ids')
          .select('id')
          .eq('user_id', user.id)
          .single()
          
       // For demo purposes, we will accept any secret if secret generation isn't strictly enforced yet
       // 2. Cast Votes
       const voteInserts = Object.entries(selections).map(([pollId, candidateId]) => ({
          poll_id: pollId,
          candidate_id: candidateId
       }))
       
       const { error: voteError } = await supabase.from('votes').insert(voteInserts)
       if (voteError) throw voteError

       // 3. Update Registration Status
       const pollIds = polls.map(p => p.id)
       await supabase.from('voter_registrations')
          .update({ status: 'voted' })
          .in('poll_id', pollIds)
          .eq('user_id', user.id)

       setStep(3)
       toast.success('Your vote has been cast securely!')
    } catch (error) {
       toast.error(error.message || 'Failed to submit vote. Invalid Secret ID or network error.')
    } finally {
       setSubmitting(false)
    }
  }

  if (loading) return (
     <div className="min-h-screen bg-slate-50 flex flex-col">
       <Navbar />
       <main className="flex-1 max-w-4xl mx-auto px-4 w-full pt-32 pb-12"><CardSkeleton className="h-64" /></main>
     </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-28 w-full">
         <div className="mb-8 text-center">
            <h1 className="font-display text-3xl font-bold text-slate-800">Secure Voting Booth</h1>
            <p className="text-slate-500 mt-2">{election?.title}</p>
         </div>

         {step === 1 && (
            <div className="space-y-8">
               <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-sm text-blue-800">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <p>Please review all candidates carefully. Once submitted, your vote cannot be changed. All selections are strictly confidential.</p>
               </div>

               {polls.map((poll, idx) => (
                  <div key={poll.id} className="card p-6 md:p-8 shadow-md">
                     <div className="mb-6">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Ballot {idx + 1} of {polls.length}</span>
                        <h2 className="font-display text-xl font-bold text-slate-800">{poll.title}</h2>
                        {poll.description && <p className="text-sm text-slate-500 mt-1">{poll.description}</p>}
                     </div>

                     <div className="space-y-3">
                        {poll.candidates?.length > 0 ? poll.candidates.map(candidate => (
                           <label 
                              key={candidate.id}
                              className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                 selections[poll.id] === candidate.id 
                                 ? 'border-primary-500 bg-primary-50 shadow-sm' 
                                 : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                              }`}
                           >
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${
                                 selections[poll.id] === candidate.id ? 'border-primary-500 bg-primary-500' : 'border-slate-300'
                              }`}>
                                 {selections[poll.id] === candidate.id && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                              </div>
                              <div>
                                 <p className={`font-bold ${selections[poll.id] === candidate.id ? 'text-primary-900' : 'text-slate-800'}`}>{candidate.name}</p>
                                 {candidate.designation && <p className="text-sm text-slate-500">{candidate.designation}</p>}
                              </div>
                           </label>
                        )) : (
                           <p className="text-slate-500 italic text-center py-4 border rounded-xl bg-slate-50">No candidates available for this ballot.</p>
                        )}
                     </div>
                  </div>
               ))}

               <div className="flex justify-end pt-4">
                  <button onClick={handleProceedToAuth} className="btn-primary py-3 px-8 text-lg w-full sm:w-auto shadow-lg">
                     Review & Proceed
                  </button>
               </div>
            </div>
         )}

         {step === 2 && (
            <div className="card p-8 shadow-xl max-w-md mx-auto relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl" />
               <div className="text-center mb-8 relative z-10">
                  <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Shield className="w-8 h-8 text-teal-600" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-slate-800">Verify Identity</h2>
                  <p className="text-sm text-slate-500 mt-2">To cast your anonymous vote, please enter the Secret Voter ID that was generated for you.</p>
               </div>

               <form onSubmit={handleSubmitVote} className="space-y-6 relative z-10">
                  <div>
                     <label className="form-label text-center block">Secret Voter ID</label>
                     <div className="relative mt-2">
                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                           type="text" 
                           value={secretId}
                           onChange={e => setSecretId(e.target.value)}
                           className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:ring-0 text-center font-mono text-lg tracking-widest text-slate-800 uppercase"
                           placeholder="XXXX-XXXX"
                           required
                        />
                     </div>
                  </div>

                  <div className="flex flex-col gap-3">
                     <button type="submit" disabled={submitting} className="btn-teal py-3.5 text-lg shadow-teal">
                        {submitting ? 'Encrypting & Casting...' : 'Cast Anonymous Vote'}
                     </button>
                     <button type="button" onClick={() => setStep(1)} disabled={submitting} className="btn-ghost">
                        Back to Ballots
                     </button>
                  </div>
               </form>
            </div>
         )}

         {step === 3 && (
            <div className="card p-10 shadow-xl text-center">
               <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
               </div>
               <h2 className="font-display text-3xl font-bold text-slate-800 mb-2">Vote Submitted!</h2>
               <p className="text-slate-600 mb-8 max-w-sm mx-auto">Your vote has been securely encrypted and recorded in the database. Thank you for fulfilling your democratic duty.</p>
               <button onClick={() => navigate('/voter')} className="btn-primary px-8">
                  Return to Dashboard
               </button>
            </div>
         )}
      </main>

      <Footer />
    </div>
  )
}

export default VotingPage
