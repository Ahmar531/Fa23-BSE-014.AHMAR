import { requireRole } from '@/lib/auth';
import { ModeratorReviewPanel } from '@/components/moderator-review-panel';

export const dynamic = 'force-dynamic';

export default async function PendingReviewPage() {
  await requireRole(['moderator', 'admin', 'super_admin']);

  return <ModeratorReviewPanel initialStatus="pending" />;
}
