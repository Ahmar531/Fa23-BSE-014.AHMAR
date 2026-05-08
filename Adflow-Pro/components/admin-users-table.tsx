'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ShieldOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type AdminUser = {
  id: string;
  name: string | null;
  email: string;
  role: 'client' | 'moderator' | 'admin' | 'super_admin';
  created_at: string;
  disabled: boolean;
  can_manage: boolean;
  assignable_roles: Array<'client' | 'moderator' | 'admin' | 'super_admin'>;
};

const ROLE_LABELS: Record<AdminUser['role'], string> = {
  client: 'user',
  moderator: 'moderator',
  admin: 'admin',
  super_admin: 'super_admin',
};

export function AdminUsersTable() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyUserId, setBusyUserId] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users', { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.error ?? 'Failed to load users');
      setUsers(payload.data ?? []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const updateRole = async (id: string, role: AdminUser['role']) => {
    setBusyUserId(id);
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'role', role }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.error ?? 'Failed to update role');
      toast.success('Role updated');
      setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, role } : user)));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update role');
    } finally {
      setBusyUserId(null);
    }
  };

  const disableUser = async (id: string) => {
    const confirmed = window.confirm('Disable this user account?');
    if (!confirmed) return;

    setBusyUserId(id);
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'disable' }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.error ?? 'Failed to disable user');
      toast.success('User disabled');
      setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, disabled: true } : user)));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to disable user');
    } finally {
      setBusyUserId(null);
    }
  };

  return (
    <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <CardContent className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">User Management</h2>
          <Button variant="outline" className="rounded-full" onClick={loadUsers}>
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-16 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-600">
            No users found.
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="grid gap-3 rounded-2xl border border-slate-200 p-4 md:grid-cols-[1.2fr_0.7fr_0.5fr] md:items-center">
                <div>
                  <p className="font-medium text-slate-900">{user.name || 'Unnamed User'}</p>
                  <p className="text-sm text-slate-600">{user.email}</p>
                  <p className="text-xs text-slate-500">Created: {new Date(user.created_at).toLocaleString()}</p>
                </div>

                <Select
                  value={user.role}
                  onValueChange={(value) => updateRole(user.id, value as AdminUser['role'])}
                  disabled={!user.can_manage || busyUserId === user.id}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={user.role}>{ROLE_LABELS[user.role]}</SelectItem>
                    {user.assignable_roles
                      .filter((role) => role !== user.role)
                      .map((role) => (
                        <SelectItem key={role} value={role}>
                          {ROLE_LABELS[role]}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    className="rounded-full"
                    disabled={user.disabled || !user.can_manage || busyUserId === user.id}
                    onClick={() => disableUser(user.id)}
                  >
                    <ShieldOff className="mr-2 h-4 w-4" />
                    {busyUserId === user.id
                      ? 'Working...'
                      : user.disabled
                        ? 'Disabled'
                        : user.can_manage
                          ? 'Disable'
                          : 'Restricted'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
