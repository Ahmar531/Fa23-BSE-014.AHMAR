import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/DashboardLayout';
import { Users, Search, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const roleColor = { patient: 'badge-primary', doctor: 'badge-accent', assistant: 'badge-success', admin: 'badge-warning', super_admin: 'badge-danger' };

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const fetch = async () => {
    const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    setUsers(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const changeRole = async (id, role) => {
    await supabase.from('users').update({ role }).eq('id', id);
    toast.success('Role updated');
    fetch();
  };

  const filtered = users.filter(u => {
    const matchQ = !query || (u.full_name || '').toLowerCase().includes(query.toLowerCase()) || (u.email || '').toLowerCase().includes(query.toLowerCase());
    const matchR = roleFilter === 'all' || u.role === roleFilter;
    return matchQ && matchR;
  });

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Manage Users</h1>
        <p style={{ color: 'var(--text-secondary)' }}>View and manage all registered users</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div className="search-bar" style={{ flex: 1 }}>
          <Search size={16} color="var(--text-muted)" />
          <input placeholder="Search by name or email..." value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <select className="select" style={{ width: 180 }} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="all">All Roles</option>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="assistant">Assistant</option>
          <option value="admin">Admin</option>
          <option value="super_admin">Super Admin</option>
        </select>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 56 }} />)}
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead><tr><th>User</th><th>Email</th><th>Phone</th><th>Role</th><th>Joined</th><th>Change Role</th></tr></thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar avatar-sm" style={{ background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)' }}>
                        {(u.full_name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600 }}>{u.full_name || '—'}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{u.email}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{u.phone || '—'}</td>
                  <td><span className={`badge ${roleColor[u.role] || 'badge-muted'}`}>{u.role}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td>
                    <select className="select" style={{ padding: '6px 10px', fontSize: 12, width: 130 }} value={u.role}
                      onChange={e => changeRole(u.id, e.target.value)}>
                      <option value="patient">Patient</option>
                      <option value="doctor">Doctor</option>
                      <option value="assistant">Assistant</option>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
