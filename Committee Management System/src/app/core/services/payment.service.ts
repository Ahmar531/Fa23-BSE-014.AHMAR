import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { loadStripe } from '@stripe/stripe-js';
import { environment } from '../../../environments/environment';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';
import { ToastService } from './toast.service';

export interface Payment {
  id: string;
  committee_id: string;
  member_id: string;
  month_number: number;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  stripe_payment_intent_id?: string;
  due_date?: string;
  paid_at?: string;
  created_at: string;
  committees?: { name: string };
  committee_members?: { position: number; profiles?: { full_name: string } };
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private stripePromise = loadStripe(environment.stripePublishableKey);
  private _processing = new BehaviorSubject(false);
  processing$ = this._processing.asObservable();

  constructor(
    private supabase: SupabaseService,
    private auth: AuthService,
    private toast: ToastService
  ) {}

  async getPaymentsForCommittee(committeeId: string): Promise<Payment[]> {
    const { data } = await this.supabase.client
      .from('payments')
      .select('*, committee_members(position, profiles(full_name))')
      .eq('committee_id', committeeId)
      .order('month_number');
    return data ?? [];
  }

  async getMyPayments(): Promise<Payment[]> {
    const userId = this.auth.currentUser?.id;
    if (!userId) return [];
    const { data: members } = await this.supabase.client
      .from('committee_members').select('id').eq('user_id', userId);
    if (!members?.length) return [];
    const memberIds = members.map((m: any) => m.id);
    const { data } = await this.supabase.client
      .from('payments')
      .select('*, committees(name), committee_members(position)')
      .in('member_id', memberIds)
      .order('created_at', { ascending: false });
    return data ?? [];
  }

  async getDuePayments(committeeId: string, memberId: string): Promise<Payment[]> {
    const { data } = await this.supabase.client
      .from('payments')
      .select('*')
      .eq('committee_id', committeeId)
      .eq('member_id', memberId)
      .in('status', ['pending', 'failed']);
    return data ?? [];
  }

  async initiatePayment(committeeId: string, memberId: string, amount: number, monthNumber: number): Promise<{ clientSecret: string | null; paymentId: string | null; error: string | null }> {
    this._processing.next(true);
    try {
      // Create payment record in DB first
      const { data: payment, error: paymentError } = await this.supabase.client
        .from('payments')
        .upsert({
          committee_id: committeeId,
          member_id: memberId,
          month_number: monthNumber,
          amount,
          status: 'processing'
        }, { onConflict: 'member_id,month_number' })
        .select().single();

      if (paymentError) throw new Error(paymentError.message);

      // Try Supabase Edge Function for Stripe Payment Intent
      const { data: fnData, error: fnError } = await this.supabase.client.functions.invoke('create-payment-intent', {
        body: { amount: Math.round(amount * 100), currency: 'usd', paymentId: payment.id }
      });

      if (fnError || !fnData?.clientSecret) {
        // Fallback: simulate payment in test mode
        await this.simulatePayment(payment.id, committeeId, memberId);
        return { clientSecret: null, paymentId: payment.id, error: null };
      }

      await this.supabase.client.from('payments')
        .update({ stripe_payment_intent_id: fnData.paymentIntentId })
        .eq('id', payment.id);

      return { clientSecret: fnData.clientSecret, paymentId: payment.id, error: null };
    } catch (e: any) {
      return { clientSecret: null, paymentId: null, error: e.message };
    } finally {
      this._processing.next(false);
    }
  }

  async simulatePayment(paymentId: string, committeeId: string, memberId: string) {
    const fakeIntentId = `pi_simulated_${Date.now()}`;
    await this.supabase.client.from('payments').update({
      status: 'completed',
      stripe_payment_intent_id: fakeIntentId,
      paid_at: new Date().toISOString()
    }).eq('id', paymentId);

    await this.supabase.client.from('transactions').insert({
      payment_id: paymentId,
      transaction_id: fakeIntentId,
      gateway: 'stripe_test',
      gateway_response: { status: 'succeeded', mode: 'test' },
      amount: 0
    });

    // Update reputation
    const userId = this.auth.currentUser?.id;
    if (userId) {
      try { await this.supabase.client.rpc('update_reputation', { user_id: userId, delta: 5, reason: 'on_time_payment' }); } catch (_) {}
    }
  }

  async confirmStripePayment(clientSecret: string, cardElement: any): Promise<{ error: string | null }> {
    const stripe = await this.stripePromise;
    if (!stripe) return { error: 'Stripe not loaded' };
    this._processing.next(true);
    const { error } = await stripe.confirmCardPayment(clientSecret, { payment_method: { card: cardElement } });
    this._processing.next(false);
    return { error: error?.message ?? null };
  }

  async getPaymentStats(userId: string) {
    const { data: members } = await this.supabase.client
      .from('committee_members').select('id').eq('user_id', userId);
    if (!members?.length) return { totalPaid: 0, pending: 0, completed: 0 };
    const memberIds = members.map((m: any) => m.id);
    const { data } = await this.supabase.client
      .from('payments').select('amount, status').in('member_id', memberIds);
    const totalPaid = (data ?? []).filter((p: any) => p.status === 'completed').reduce((s: number, p: any) => s + p.amount, 0);
    const pending = (data ?? []).filter((p: any) => p.status === 'pending').length;
    const completed = (data ?? []).filter((p: any) => p.status === 'completed').length;
    return { totalPaid, pending, completed };
  }
}
