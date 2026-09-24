import Link from 'next/link';
import { Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';

const CONTACT_CHANNELS = [
  {
    title: 'Email us',
    value: 'desk@billcleardesk.demo',
    hint: 'Best for detailed bill lists and document summaries.',
    icon: Mail,
  },
  {
    title: 'Call / WhatsApp',
    value: '+91 90000 00000',
    hint: 'Best for quick package discovery and onboarding calls.',
    icon: Phone,
  },
  {
    title: 'Coverage',
    value: 'India-wide AD bank support',
    hint: 'Remote-first operating model with periodic review touchpoints.',
    icon: MapPin,
  },
];

export function ConnectPage() {
  return (
    <>
      <section className="card hero colorful">
        <Badge>Connect with us</Badge>
        <h1>Let’s discuss your pending bill portfolio</h1>
        <p>
          Share your current bill status and we will suggest the right service plan with a practical timeline for
          review and closure support.
        </p>
      </section>

      <section>
        <h2 className="section">Contact channels</h2>
        <div className="grid g3">
          {CONTACT_CHANNELS.map((channel) => {
            const Icon = channel.icon;
            return (
              <Card key={channel.title}>
                <div className="step-icon">
                  <Icon size={18} />
                </div>
                <h3 className="h3-sm">{channel.title}</h3>
                <p className="big">{channel.value}</p>
                <p className="muted">{channel.hint}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="card soft">
        <h2>Before the first consultation, keep this ready</h2>
        <ul>
          <li>Approximate count of open Export (EDPMS) bills and Import (IDPMS) bills</li>
          <li>Oldest pending month for each lane</li>
          <li>Any known documentation or discrepancy blockers</li>
        </ul>
        <div className="row actions">
          <Button asChild>
            <Link href="/pricing">See pricing first</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/login">
              <ShieldCheck size={16} /> Continue to login
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
