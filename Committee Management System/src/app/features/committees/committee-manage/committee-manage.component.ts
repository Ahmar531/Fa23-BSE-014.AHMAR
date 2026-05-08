import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CommitteeService, Committee, CommitteeMember } from '../../../core/services/committee.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-committee-manage',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="animate-fade-in" style="max-width:900px;">
      <div style="margin-bottom:20px;">
        <a [routerLink]="['/committees', committeeId()]" style="color:#94a3b8;font-size:13px;text-decoration:none;">← Back to Committee</a>
        <h2 style="font-size:20px;font-weight:700;margin-top:8px;">Manage Committee</h2>
        @if (committee()) { <p style="color:#94a3b8;font-size:14px;">{{ committee()!.name }}</p> }
      </div>

      <!-- Pending Requests -->
      <div class="glass-card" style="padding:24px; margin-bottom:20px;">
        <h3 style="font-size:16px;font-weight:700;margin-bottom:16px;">⏳ Pending Join Requests ({{ pendingMembers().length }})</h3>
        @if (pendingMembers().length === 0) {
          <p style="color:#94a3b8;font-size:13px;">No pending requests.</p>
        } @else {
          <div style="display:flex;flex-direction:column;gap:12px;">
            @for (m of pendingMembers(); track m.id) {
              <div class="member-row">
                <div class="avatar-sm">{{ getInitials(m.profiles?.full_name || 'U') }}</div>
                <div style="flex:1;">
                  <p style="font-weight:600;font-size:14px;">{{ m.profiles?.full_name }}</p>
                  <p style="color:#94a3b8;font-size:12px;">{{ m.profiles?.email }} • ⭐ {{ m.profiles?.reputation_score ?? 100 }}</p>
                </div>
                <div style="display:flex;gap:8px;">
                  <button class="btn-success" style="padding:6px 14px;font-size:12px;" (click)="approveMember(m.id)" [id]="'approve-'+m.id">✓ Approve</button>
                  <button class="btn-danger" style="padding:6px 14px;font-size:12px;" (click)="rejectMember(m.id)" [id]="'reject-'+m.id">✕ Reject</button>
                </div>
              </div>
            }
          </div>
        }
      </div>

      <!-- Active Members -->
      <div class="glass-card" style="padding:24px; margin-bottom:20px;">
        <h3 style="font-size:16px;font-weight:700;margin-bottom:16px;">✅ Active Members ({{ approvedMembers().length }})</h3>
        <table class="data-table">
          <thead><tr><th>Pos</th><th>Member</th><th>Phone</th><th>Reputation</th><th>Actions</th></tr></thead>
          <tbody>
            @for (m of approvedMembers(); track m.id) {
              <tr>
                <td><span style="font-weight:700;color:#818cf8;">#{{ m.position }}</span></td>
                <td>
                  <div style="display:flex;align-items:center;gap:8px;">
                    <div class="avatar-sm">{{ getInitials(m.profiles?.full_name || 'U') }}</div>
                    <div>
                      <p style="font-weight:600;font-size:13px;">{{ m.profiles?.full_name }}</p>
                      <p style="color:#94a3b8;font-size:11px;">{{ m.profiles?.email }}</p>
                    </div>
                  </div>
                </td>
                <td style="color:#94a3b8;font-size:13px;">{{ m.profiles?.phone || '—' }}</td>
                <td><span style="color:#fbbf24;">⭐ {{ m.profiles?.reputation_score ?? 100 }}</span></td>
                <td>
                  @if (m.user_id !== auth.currentUser?.id) {
                    <button class="btn-danger" style="padding:4px 10px;font-size:12px;" (click)="removeMember(m.id)" [id]="'rm-'+m.id">Remove</button>
                  } @else {
                    <span style="color:#64748b;font-size:12px;">You (Admin)</span>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Committee Status Control -->
      <div class="glass-card" style="padding:24px;">
        <h3 style="font-size:16px;font-weight:700;margin-bottom:16px;">⚙️ Committee Status</h3>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <button class="btn-success" (click)="updateStatus('active')" [disabled]="committee()?.status === 'active'" id="status-active">Set Active</button>
          <button class="btn-secondary" (click)="updateStatus('open')" [disabled]="committee()?.status === 'open'" id="status-open">Set Open</button>
          <button class="btn-danger" (click)="updateStatus('cancelled')" [disabled]="committee()?.status === 'cancelled'" id="status-cancel">Cancel Committee</button>
        </div>
        <p style="color:#94a3b8;font-size:12px;margin-top:12px;">Current status: <strong style="color:#f1f5f9;">{{ committee()?.status }}</strong></p>
      </div>
    </div>
  `,
  styles: [`
    .member-row { display:flex;align-items:center;gap:12px;padding:14px;background:rgba(15,23,42,0.5);border-radius:10px;border:1px solid rgba(99,102,241,0.08); }
    .avatar-sm { width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#10b981);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:white;flex-shrink:0; }
  `]
})
export class CommitteeManageComponent implements OnInit {
  route = inject(ActivatedRoute);
  committeeService = inject(CommitteeService);
  auth = inject(AuthService);
  toast = inject(ToastService);

  committeeId = signal('');
  committee = signal<Committee | null>(null);
  members = signal<CommitteeMember[]>([]);

  pendingMembers = () => this.members().filter(m => m.status === 'pending');
  approvedMembers = () => this.members().filter(m => m.status === 'approved');
  getInitials(name: string) { return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'; }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.committeeId.set(id);
    const [c, m] = await Promise.all([this.committeeService.getCommitteeById(id), this.committeeService.getMembers(id)]);
    this.committee.set(c); this.members.set(m);
  }

  async reload() { const m = await this.committeeService.getMembers(this.committeeId()); this.members.set(m); }

  async approveMember(id: string) {
    const { error } = await this.committeeService.approveRejectMember(id, true);
    if (error) this.toast.error(error); else { this.toast.success('Member approved!'); await this.reload(); }
  }

  async rejectMember(id: string) {
    const { error } = await this.committeeService.approveRejectMember(id, false);
    if (error) this.toast.error(error); else { this.toast.success('Member rejected'); await this.reload(); }
  }

  async removeMember(id: string) {
    const { error } = await this.committeeService.removeMember(id);
    if (error) this.toast.error(error); else { this.toast.success('Member removed'); await this.reload(); }
  }

  async updateStatus(status: string) {
    const { error } = await this.committeeService.updateStatus(this.committeeId(), status);
    if (error) this.toast.error(error);
    else { this.toast.success('Status updated'); const c = await this.committeeService.getCommitteeById(this.committeeId()); this.committee.set(c); }
  }
}
