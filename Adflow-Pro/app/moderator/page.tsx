import { requireRole } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function ModeratorDashboard() {
  await requireRole(['moderator', 'admin', 'super_admin']);

  return (
    <div className="space-y-6">
      <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
        <CardHeader>
          <CardTitle>Moderation Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-slate-600">Review and manage user-submitted advertisements</p>
          
          <div className="space-y-3 pt-4">
            <Link href="/moderator/pending">
              <Button className="w-full justify-start rounded-full" variant="outline">
                <ClipboardList className="mr-2 h-4 w-4" />
                Review Pending Ads
              </Button>
            </Link>
            <Link href="/moderator/approved">
              <Button className="w-full justify-start rounded-full" variant="outline">
                <CheckCircle className="mr-2 h-4 w-4" />
                View Approved Ads
              </Button>
            </Link>
            <Link href="/moderator/rejected">
              <Button className="w-full justify-start rounded-full" variant="outline">
                <XCircle className="mr-2 h-4 w-4" />
                View Rejected Ads
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
