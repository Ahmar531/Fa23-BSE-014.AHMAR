import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import { Users, Plus, Trash2, ArrowLeft, Image as ImageIcon } from 'lucide-react'

const ManageCandidates = () => {
  const { id: electionId } = useParams()
  const { user } = useAuth()
  const [election, setElection] = useState(null)
  const [polls, setPolls] = useState([])
  const [loading, setLoading] = useState(true)
  const [newCandidate, setNewCandidate] = useState({ name: '', designation: '', manifesto: '' })
  const [activePoll, setActivePoll] = useState(null)
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    fetchData()
  }, [electionId])

  const fetchData = async () => {
    try {
      // Fetch election
      const { data: elData, error: elError } = await supabase
        .from('elections')
        .select('*')
        .eq('id', electionId)
        .single()
        
      if (elError) throw elError
      setElection(elData)

      // Fetch polls and candidates
      const { data: pollData, error: pollError } = await supabase
        .from('polls')
        .select('*, candidates(*)')
        .eq('election_id', electionId)
        
      if (pollError) throw pollError
      setPolls(pollData || [])
      if (pollData?.length > 0) setActivePoll(pollData[0].id)
      
    } catch (error) {
      toast.error('Failed to load election data')
    } finally {
      setLoading(false)
    }
  }

  const handleAddCandidate = async (e) => {
    e.preventDefault()
    if (!activePoll) return toast.error('Please select a poll first')
    
    setIsAdding(true)
    try {
      const { data, error } = await supabase
        .from('candidates')
        .insert([{
           poll_id: activePoll,
           name: newCandidate.name,
           designation: newCandidate.designation,
           manifesto: newCandidate.manifesto
        }])
        .select()
        .single()
        
      if (error) throw error
      
      toast.success('Candidate added successfully')
      setNewCandidate({ name: '', designation: '', manifesto: '' })
      fetchData() // Refresh list
    } catch (error) {
      toast.error(error.message || 'Failed to add candidate')
    } finally {
      setIsAdding(false)
    }
  }

  const handleDeleteCandidate = async (candidateId) => {
    if (!confirm('Are you sure you want to remove this candidate?')) return
    
    try {
       const { error } = await supabase.from('candidates').delete().eq('id', candidateId)
       if (error) throw error
       toast.success('Candidate removed')
       fetchData()
    } catch (error) {
       toast.error(error.message || 'Failed to remove candidate')
    }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  const currentPoll = polls.find(p => p.id === activePoll)

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/creator" className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-800">Manage Candidates</h1>
          <p className="text-slate-500 text-sm mt-1">{election?.title}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Sidebar: Polls */}
        <div className="md:col-span-1 space-y-4">
           <h3 className="font-semibold text-slate-700">Ballots (Polls)</h3>
           {polls.length === 0 ? (
             <p className="text-sm text-slate-500">No polls exist for this election.</p>
           ) : (
             polls.map(poll => (
                <button 
                  key={poll.id} 
                  onClick={() => setActivePoll(poll.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                     activePoll === poll.id ? 'bg-primary-50 border-primary-500 shadow-sm' : 'bg-white border-slate-200 hover:border-primary-300'
                  }`}
                >
                   <p className={`font-semibold ${activePoll === poll.id ? 'text-primary-800' : 'text-slate-700'}`}>{poll.title}</p>
                   <p className="text-xs text-slate-500 mt-1">{poll.candidates?.length || 0} Candidates</p>
                </button>
             ))
           )}
           <button className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-sm font-medium text-slate-600 hover:border-primary-500 hover:text-primary-600 transition-colors flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add New Ballot
           </button>
        </div>

        {/* Main: Candidates List & Add Form */}
        <div className="md:col-span-2 space-y-6">
           {currentPoll ? (
             <>
                <div className="card p-6">
                   <h3 className="font-display font-bold text-slate-800 mb-4 flex items-center gap-2">
                     <Users className="w-5 h-5 text-primary-600" /> Candidates in {currentPoll.title}
                   </h3>
                   
                   <div className="space-y-4">
                      {currentPoll.candidates?.length > 0 ? currentPoll.candidates.map(candidate => (
                         <div key={candidate.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                                  {candidate.photo_url ? (
                                    <img src={candidate.photo_url} alt={candidate.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <ImageIcon className="w-5 h-5 text-slate-400" />
                                  )}
                               </div>
                               <div>
                                  <p className="font-bold text-slate-800">{candidate.name}</p>
                                  <p className="text-xs text-slate-500">{candidate.designation}</p>
                               </div>
                            </div>
                            <button onClick={() => handleDeleteCandidate(candidate.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                               <Trash2 className="w-4 h-4" />
                            </button>
                         </div>
                      )) : (
                         <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                            <p className="text-sm text-slate-500">No candidates added yet.</p>
                         </div>
                      )}
                   </div>
                </div>

                {/* Add Form */}
                {election?.status !== 'active' && election?.status !== 'completed' && (
                  <form onSubmit={handleAddCandidate} className="card p-6">
                    <h3 className="font-display font-semibold text-slate-800 mb-4">Add New Candidate</h3>
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                       <div>
                          <label className="form-label">Full Name</label>
                          <input type="text" value={newCandidate.name} onChange={e => setNewCandidate({...newCandidate, name: e.target.value})} className="input-field" required />
                       </div>
                       <div>
                          <label className="form-label">Designation / Role</label>
                          <input type="text" value={newCandidate.designation} onChange={e => setNewCandidate({...newCandidate, designation: e.target.value})} className="input-field" />
                       </div>
                       <div className="sm:col-span-2">
                          <label className="form-label">Manifesto (Short bio)</label>
                          <textarea value={newCandidate.manifesto} onChange={e => setNewCandidate({...newCandidate, manifesto: e.target.value})} className="input-field resize-none" rows="3" />
                       </div>
                    </div>
                    <div className="flex justify-end">
                       <button type="submit" disabled={isAdding} className="btn-primary flex items-center gap-2">
                          {isAdding ? 'Adding...' : <><Plus className="w-4 h-4" /> Add Candidate</>}
                       </button>
                    </div>
                  </form>
                )}
             </>
           ) : (
             <div className="card p-12 text-center">
                <p className="text-slate-500">Select a ballot from the left to manage candidates.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  )
}

export default ManageCandidates
