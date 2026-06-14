import { useEffect, useMemo, useState } from 'react';
import { Calendar, MessageSquare, Send, UserRound } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const formatTime = (value) => {
  if (!value) return '';
  return new Date(value).toLocaleString('en-PK', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function Messages() {
  const { user, profile } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [activeContactId, setActiveContactId] = useState('');
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const isDoctor = profile?.role === 'doctor';

  const contacts = useMemo(() => {
    const map = new Map();

    appointments.forEach((appointment) => {
      const contactId = isDoctor ? appointment.patient_id : appointment.doctor_id;
      if (!contactId || map.has(contactId)) return;

      map.set(contactId, {
        id: contactId,
        name: isDoctor ? appointment.patient_name || 'Patient' : appointment.doctor_name || 'Doctor',
        subtitle: appointment.appointment_date
          ? `${appointment.appointment_date}${appointment.appointment_time ? ` at ${appointment.appointment_time}` : ''}`
          : 'Appointment contact',
      });
    });

    return Array.from(map.values());
  }, [appointments, isDoctor]);

  const activeContact = contacts.find((contact) => contact.id === activeContactId);

  useEffect(() => {
    if (!user || !profile) return;

    let active = true;
    const fetchAppointments = async () => {
      setLoading(true);
      const ownerField = isDoctor ? 'doctor_id' : 'patient_id';
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq(ownerField, user.id)
        .order('created_at', { ascending: false });

      if (!active) return;
      if (error) {
        toast.error('Unable to load conversations');
        setAppointments([]);
      } else {
        setAppointments(data || []);
      }
      setLoading(false);
    };

    fetchAppointments();
    return () => { active = false; };
  }, [user, profile, isDoctor]);

  useEffect(() => {
    if (!activeContactId && contacts.length > 0) {
      setActiveContactId(contacts[0].id);
    }
  }, [activeContactId, contacts]);

  useEffect(() => {
    if (!user || !activeContactId) {
      setMessages([]);
      return;
    }

    let active = true;
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (!active) return;
      if (error) {
        setMessages([]);
        return;
      }

      const conversation = (data || []).filter((message) => (
        (message.sender_id === user.id && message.receiver_id === activeContactId)
        || (message.sender_id === activeContactId && message.receiver_id === user.id)
      ));
      setMessages(conversation);
    };

    fetchMessages();
    return () => { active = false; };
  }, [user, activeContactId]);

  const sendMessage = async () => {
    const content = draft.trim();
    if (!content) return;
    if (!activeContactId) {
      toast.error('Select a conversation first');
      return;
    }

    setSending(true);
    const { error } = await supabase.from('messages').insert([{
      sender_id: user.id,
      receiver_id: activeContactId,
      content,
    }]);

    if (error) {
      toast.error('Message could not be sent');
    } else {
      setDraft('');
      const newMessage = {
        id: `local-${Date.now()}`,
        sender_id: user.id,
        receiver_id: activeContactId,
        content,
        created_at: new Date().toISOString(),
      };
      setMessages((current) => [...current, newMessage]);
    }
    setSending(false);
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Messages</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Continue appointment conversations with your {isDoctor ? 'patients' : 'doctors'}</p>
      </div>

      <div className="messages-layout">
        <div className="card" style={{ padding: 0, overflow: 'hidden', minHeight: 520 }}>
          <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 700 }}>Conversations</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{contacts.length} appointment contacts</div>
          </div>

          {loading ? (
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 64 }} />)}
            </div>
          ) : contacts.length === 0 ? (
            <div style={{ padding: 28, textAlign: 'center', color: 'var(--text-secondary)' }}>
              <MessageSquare size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px', display: 'block' }} />
              No conversations yet
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {contacts.map(contact => (
                <button
                  key={contact.id}
                  type="button"
                  onClick={() => setActiveContactId(contact.id)}
                  style={{
                    display: 'flex',
                    gap: 12,
                    alignItems: 'center',
                    padding: '14px 16px',
                    border: 'none',
                    borderBottom: '1px solid var(--border)',
                    cursor: 'pointer',
                    background: activeContactId === contact.id ? 'rgba(14,165,233,0.1)' : 'transparent',
                    color: 'inherit',
                    textAlign: 'left',
                    fontFamily: 'Inter',
                  }}
                >
                  <div className="avatar avatar-md">
                    {contact.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {isDoctor ? contact.name : `Dr. ${contact.name.replace(/^Dr\.\s*/i, '')}`}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                      <Calendar size={12} /> {contact.subtitle}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="card" style={{ minHeight: 520, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(14,165,233,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserRound size={19} color="var(--primary-light)" />
            </div>
            <div>
              <div style={{ fontWeight: 800 }}>{activeContact ? (isDoctor ? activeContact.name : `Dr. ${activeContact.name.replace(/^Dr\.\s*/i, '')}`) : 'Select a conversation'}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Patient-doctor communication</div>
            </div>
          </div>

          <div style={{ flex: 1, padding: 18, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, background: 'rgba(255,255,255,0.015)' }}>
            {!activeContact ? (
              <div style={{ margin: 'auto', color: 'var(--text-secondary)', textAlign: 'center' }}>
                <MessageSquare size={42} color="var(--text-muted)" style={{ display: 'block', margin: '0 auto 12px' }} />
                Choose a conversation to start messaging
              </div>
            ) : messages.length === 0 ? (
              <div style={{ margin: 'auto', color: 'var(--text-secondary)', textAlign: 'center' }}>
                No messages yet
              </div>
            ) : (
              messages.map(message => {
                const mine = message.sender_id === user.id;
                return (
                  <div key={message.id} style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '72%',
                      padding: '10px 13px',
                      borderRadius: 12,
                      background: mine ? 'rgba(14,165,233,0.18)' : 'var(--bg-card2)',
                      border: mine ? '1px solid rgba(14,165,233,0.26)' : '1px solid var(--border)',
                    }}>
                      <div style={{ fontSize: 14, lineHeight: 1.5 }}>{message.content}</div>
                      <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 5, textAlign: mine ? 'right' : 'left' }}>
                        {formatTime(message.created_at)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div style={{ padding: 16, borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
            <input
              className="input"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder={activeContact ? 'Write a message...' : 'Select a conversation first'}
              disabled={!activeContact || sending}
            />
            <button className="btn btn-primary btn-icon" onClick={sendMessage} disabled={!activeContact || sending || !draft.trim()} title="Send message">
              {sending ? <div className="spinner" style={{ width: 16, height: 16 }} /> : <Send size={17} />}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
