'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { CreditCard, Send } from 'lucide-react';
import { submitPaymentAction } from '@/app/dashboard/ads/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PAYMENT_METHODS = [
  { value: 'jazzcash', label: 'JazzCash' },
  { value: 'easypaisa', label: 'EasyPaisa' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'other', label: 'Other' },
];

export function PaymentSubmissionForm({ adId, amount }: { adId: string; amount?: number }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [transactionRef, setTransactionRef] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [senderName, setSenderName] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    if (!senderName.trim()) {
      toast.error('Please enter the sender name');
      return;
    }

    startTransition(async () => {
      const result = await submitPaymentAction({
        adId,
        transactionRef,
        proofUrl,
        notes: `[${paymentMethod.toUpperCase()}] Sender: ${senderName}${notes ? ` | ${notes}` : ''}`,
      });

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success('Payment submitted for verification');
      setTransactionRef('');
      setProofUrl('');
      setNotes('');
      setPaymentMethod('');
      setSenderName('');
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-3 rounded-[1.25rem] border border-orange-200 bg-orange-50 p-4">
        <CreditCard className="h-5 w-5 text-orange-600" />
        <div>
          <p className="text-sm font-medium text-orange-900">Payment Required</p>
          {amount ? (
            <p className="text-lg font-semibold text-orange-700">Rs {amount.toLocaleString('en-PK')}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="payment_method">Payment Method</Label>
        <select
          id="payment_method"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
          required
        >
          <option value="">Select payment method</option>
          {PAYMENT_METHODS.map((method) => (
            <option key={method.value} value={method.value}>{method.label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sender_name">Sender Name</Label>
        <Input id="sender_name" value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="Name on the payment account" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="transaction_ref">Transaction Reference</Label>
        <Input id="transaction_ref" value={transactionRef} onChange={(e) => setTransactionRef(e.target.value)} placeholder="Unique transaction ID" required />
        <p className="text-xs text-slate-500">Must be unique across all payments</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="proof_url">Payment Screenshot URL</Label>
        <Input id="proof_url" type="url" placeholder="https://..." value={proofUrl} onChange={(e) => setProofUrl(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional note for finance team" />
      </div>

      <Button type="submit" disabled={isPending} className="w-full rounded-full bg-slate-950 hover:bg-slate-800">
        <Send className="mr-2 h-4 w-4" />
        {isPending ? 'Submitting...' : 'Submit Payment Proof'}
      </Button>
    </form>
  );
}
