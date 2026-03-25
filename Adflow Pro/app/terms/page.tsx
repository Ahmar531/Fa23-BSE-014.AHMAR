import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            AdFlow Pro
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>1. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>
              By accessing and using AdFlow Pro, you accept and agree to be bound by the terms and
              provision of this agreement. If you do not agree to these terms, please do not use our
              service.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>2. User Accounts</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and
              for all activities that occur under your account. You must notify us immediately of any
              unauthorized use of your account.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>3. Ad Content Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>All ads must comply with the following guidelines:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Content must be legal, truthful, and not misleading</li>
              <li>No spam, duplicate, or low-quality content</li>
              <li>No adult content, illegal products, or services</li>
              <li>No hate speech, discrimination, or offensive material</li>
              <li>Must respect intellectual property rights</li>
            </ul>
            <p className="mt-4">
              We reserve the right to reject or remove any ad that violates these guidelines.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>4. Payment and Refunds</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>
              All payments must be made in advance. Refunds are available only before your ad is
              published. Once an ad is live, no refunds will be issued. Package durations start from
              the publish date, not the payment date.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>5. Moderation and Approval</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>
              All ads undergo moderation review before publication. We reserve the right to reject any
              ad without providing a detailed reason. Typical review time is 12-24 hours, but may vary
              during high-volume periods.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>6. Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>
              AdFlow Pro is provided "as is" without warranties of any kind. We are not responsible
              for any direct, indirect, incidental, or consequential damages arising from your use of
              the service.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>7. Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective
              immediately upon posting. Your continued use of the service constitutes acceptance of the
              modified terms.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>8. Contact</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>
              For questions about these terms, please contact us at{' '}
              <a href="mailto:legal@adflowpro.com" className="text-primary hover:underline">
                legal@adflowpro.com
              </a>
            </p>
          </CardContent>
        </Card>

        <p className="text-sm text-muted-foreground text-center mt-8">
          Last updated: March 19, 2026
        </p>
      </div>
    </div>
  );
}
