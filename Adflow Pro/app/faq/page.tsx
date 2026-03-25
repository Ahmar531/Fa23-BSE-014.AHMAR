import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const faqs = [
  {
    question: 'How does the ad approval process work?',
    answer:
      'After creating your ad, it goes through moderation review. Once approved, you submit payment proof. After payment verification by our admin team, your ad is scheduled and published according to your selected package.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept various payment methods. After selecting your package, you will receive payment instructions. You then submit proof of payment (transaction reference and screenshot) for verification.',
  },
  {
    question: 'How long does it take for my ad to go live?',
    answer:
      'Typically 24-48 hours. This includes moderation review (12-24 hours) and payment verification (12-24 hours). Premium packages may receive priority processing.',
  },
  {
    question: 'Can I edit my ad after it is published?',
    answer:
      'You can edit draft ads freely. For published ads, please contact support for modifications. Major changes may require re-moderation.',
  },
  {
    question: 'What happens when my ad expires?',
    answer:
      'You will receive a notification 48 hours before expiry. After expiry, your ad is no longer visible to the public but remains in your dashboard. You can renew it by purchasing a new package.',
  },
  {
    question: 'What is the difference between packages?',
    answer:
      'Basic (7 days, category placement), Standard (15 days, category priority, manual refresh), Premium (30 days, homepage placement, auto-refresh every 3 days). Higher packages get better visibility and ranking.',
  },
  {
    question: 'Can I get a refund?',
    answer:
      'Refunds are available before your ad is published. Once published, refunds are not available but you can request early termination. Contact support for assistance.',
  },
  {
    question: 'How does the ranking algorithm work?',
    answer:
      'Ads are ranked based on: featured status (50 points), package weight (10-30 points), freshness (0-10 points), admin boost (0-100 points), and verified seller status (5 points).',
  },
  {
    question: 'What types of media can I upload?',
    answer:
      'We support external media URLs only (no local uploads). You can use direct image URLs, GitHub raw URLs, or YouTube video links. We automatically generate thumbnails for YouTube videos.',
  },
  {
    question: 'How do I become a verified seller?',
    answer:
      'Complete your seller profile with business information and submit for verification. Our team reviews applications and grants verified status to legitimate businesses.',
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            AdFlow Pro
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/explore" className="text-sm hover:text-primary">
              Explore Ads
            </Link>
            <Link href="/packages" className="text-sm hover:text-primary">
              Packages
            </Link>
            <Link href="/faq" className="text-sm hover:text-primary">
              FAQ
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground">
            Find answers to common questions about AdFlow Pro
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-12 bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle>Still have questions?</CardTitle>
            <CardDescription>
              We're here to help! Contact our support team for personalized assistance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/contact">
              <Button>Contact Support</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
