import Link from 'next/link';
import {
  LayoutDashboard,
  ListTodo,
  Megaphone,
  Settings2,
  ShieldCheck,
  UserCircle2,
  Users,
} from 'lucide-react';
import type { AuthenticatedUser } from '@/lib/auth';
import { getPortalsForRole, getRoleBadgeLabel, type PortalId } from '@/lib/roles';

type SidebarNavItem = {
  href: string;
  label: string;
  hint?: string;
};

const PORTAL_ICONS = {
  client: UserCircle2,
  moderator: ShieldCheck,
  admin: Settings2,
} as const;

export function PortalSidebar(props: {
  user: AuthenticatedUser;
  currentPortal: PortalId;
  title: string;
  description: string;
  navItems: SidebarNavItem[];
}) {
  const portals = getPortalsForRole(props.user.role);

  return (
    <aside className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">AdFlow Pro</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{props.title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">{props.description}</p>
      </div>

      <div className="mt-7">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Module Access</p>
        <div className="mt-4 space-y-3">
          {portals.map((portal) => {
            const Icon = PORTAL_ICONS[portal.id];
            const isCurrent = portal.id === props.currentPortal;
            const href = portal.canAccess ? portal.href : portal.loginHref;

            return (
              <Link
                key={portal.id}
                href={href}
                className={`block rounded-[1.5rem] border px-4 py-4 transition ${
                  isCurrent
                    ? 'border-slate-950 bg-slate-950 text-white'
                    : portal.canAccess
                      ? 'border-slate-200 bg-slate-50/80 text-slate-900 hover:border-slate-300 hover:bg-white'
                      : 'border-dashed border-slate-300 bg-slate-50/50 text-slate-700 hover:border-slate-400'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span
                      className={`rounded-2xl p-2 ${
                        isCurrent
                          ? 'bg-white/10 text-white'
                          : portal.canAccess
                            ? 'bg-slate-900 text-white'
                            : 'bg-white text-slate-500'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-medium">{portal.label}</p>
                      <p className={`mt-1 text-sm ${isCurrent ? 'text-slate-300' : 'text-slate-600'}`}>
                        {portal.canAccess
                          ? portal.description
                          : portal.accessHint}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] ${
                      isCurrent
                        ? 'bg-white/10 text-white'
                        : portal.canAccess
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isCurrent ? 'Current' : portal.canAccess ? 'Open' : 'Login'}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-7">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Workspace Navigation</p>
        <div className="mt-4 space-y-2">
          {props.navItems.map((item) => {
            const ItemIcon = item.href.includes('/users')
              ? Users
              : item.href.includes('approved') || item.href.includes('rejected') || item.href.includes('ads')
                ? Megaphone
                : item.href.includes('/moderator')
                  ? ListTodo
                  : LayoutDashboard;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-start gap-3 rounded-2xl border border-transparent px-4 py-3 text-sm transition hover:border-slate-200 hover:bg-slate-50"
              >
                <ItemIcon className="mt-0.5 h-4 w-4 text-slate-500" />
                <div>
                  <p className="font-medium text-slate-900">{item.label}</p>
                  {item.hint ? <p className="mt-1 text-xs leading-5 text-slate-500">{item.hint}</p> : null}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-7 rounded-[1.5rem] bg-slate-950 p-4 text-white">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Signed In As</p>
        <p className="mt-3 text-lg font-semibold">{props.user.full_name || props.user.email}</p>
        <p className="mt-2 text-sm text-slate-300">{getRoleBadgeLabel(props.user.role)}</p>
      </div>
    </aside>
  );
}
