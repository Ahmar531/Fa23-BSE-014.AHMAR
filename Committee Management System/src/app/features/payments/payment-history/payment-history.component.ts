import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PaymentService, Payment } from '../../../core/services/payment.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-payment-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="animate-fade-in">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
        <div>
          <h2 style="font-size:20px;font-weight:700;">Payment History</h2>
          <p style="color:#94a3b8;font-size:14px;">All your installment payments across committees</p>
        </div>
        <div style="display:flex;gap:12px;">
          <div class="stat-pill">💰 Total Paid: <strong style="color:#34d399;">PKR {{ totalPaid().toLocaleString() }}</strong></div>
        </div>
      </div>

      <!-- Summary Cards -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px;">
        <div class="glass-card" style="padding:20px;text-align:center;">
          <p style="color:#94a3b8;font-size:12px;margin-bottom:6px;">Completed</p>
          <p style="font-size:28px;font-weight:800;color:#34d399;">{{ completedCount() }}</p>
        </div>
        <div class="glass-card" style="padding:20px;text-align:center;">
          <p style="color:#94a3b8;font-size:12px;margin-bottom:6px;">Pending</p>
          <p style="font-size:28px;font-weight:800;color:#fbbf24;">{{ pendingCount() }}</p>
        </div>
        <div class="glass-card" style="padding:20px;text-align:center;">
          <p style="color:#94a3b8;font-size:12px;margin-bottom:6px;">Failed</p>
          <p style="font-size:28px;font-weight:800;color:#f87171;">{{ failedCount() }}</p>
        </div>
      </div>

      @if (loading()) {
        <div class="page-loader"><div class="spinner"></div></div>
      } @else if (payments().length === 0) {
        <div class="glass-card" style="padding:60px;text-align:center;">
          <div style="font-size:56px;margin-bottom:16px;">💳</div>
          <h3 style="font-size:18px;font-weight:700;margin-bottom:8px;">No payments yet</h3>
          <p style="color:#94a3b8;font-size:14px;margin-bottom:20px;">Join a committee and make your first payment.</p>
          <a routerLink="/committees" class="btn-primary">Browse Committees</a>
        </div>
      } @else {
        <div class="glass-card" style="overflow:hidden;">
          <table class="data-table">
            <thead>
              <tr><th>Committee</th><th>Month</th><th>Amount</th><th>Status</th><th>Transaction ID</th><th>Date</th></tr>
            </thead>
            <tbody>
              @for (p of payments(); track p.id) {
                <tr>
                  <td style="font-weight:600;font-size:13px;">{{ p.committees?.name || '—' }}</td>
                  <td style="color:#94a3b8;">Month {{ p.month_number }}</td>
                  <td style="color:#34d399;font-weight:700;">PKR {{ p.amount.toLocaleString() }}</td>
                  <td><span class="badge badge-{{p.status}}">{{ p.status }}</span></td>
                  <td style="font-family:monospace;font-size:11px;color:#64748b;">{{ (p.stripe_payment_intent_id || '—').slice(0,20) }}...</td>
                  <td style="color:#94a3b8;font-size:12px;">{{ p.paid_at ? formatDate(p.paid_at) : '—' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styles: [`.stat-pill { background:rgba(15,23,42,0.6);border:1px solid rgba(99,102,241,0.2);padding:8px 16px;border-radius:20px;font-size:13px;color:#94a3b8; }`]
})
export class PaymentHistoryComponent implements OnInit {
  paymentService = inject(PaymentService);
  auth = inject(AuthService);
  loading = signal(true);
  payments = signal<Payment[]>([]);
  totalPaid = () => this.payments().filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0);
  completedCount = () => this.payments().filter(p => p.status === 'completed').length;
  pendingCount = () => this.payments().filter(p => p.status === 'pending').length;
  failedCount = () => this.payments().filter(p => p.status === 'failed').length;
  formatDate(d: string) { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }

  async ngOnInit() {
    const data = await this.paymentService.getMyPayments();
    this.payments.set(data);
    this.loading.set(false);
  }
}
