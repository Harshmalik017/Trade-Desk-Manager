import Link from 'next/link';
import Image from 'next/image';
import { Building2, Landmark, Sparkles, UsersRound } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';

const HIGHLIGHTS = [
  {
    title: 'Banking-grounded execution',
    text: 'Designed by a former trade desk manager, aligned to real AD bank document and follow-up expectations.',
    icon: Landmark,
  },
  {
    title: 'Lane-separated visibility',
    text: 'EDPMS and IDPMS bills are always split clearly, helping teams avoid mixed updates and missed ageing cases.',
    icon: Building2,
  },
  {
    title: 'Reliable communication',
    text: 'Pitch and proposal tools are built for founder, associate, and client conversations across channels.',
    icon: UsersRound,
  },
];

export function AboutPage() {
  return (
    <>
      <section className="card hero colorful">
        <div className="grid items-center gap-5 md:grid-cols-[1.35fr_1fr]">
          <div>
            <Badge variant="secondary">
              <Sparkles size={14} /> About BillClear Desk
            </Badge>
            <h1>A practical trade-compliance operating desk for modern teams</h1>
            <p>
              Led by consultant <b>Nikhil Goswami</b>, we help exporters and importers move open bills from pending to
              closure support using structured reconciliation, documentation checks, and disciplined bank follow-ups.
            </p>
          </div>
          <div className="mx-auto max-w-[220px]">
            <Image
              src="/Nikhil-Goswami.png"
              alt="Consultant Nikhil Goswami"
              width={433}
              height={577}
              className="h-auto w-full rounded-lg object-contain"
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="section">What makes us different</h2>
        <div className="grid g3">
          {HIGHLIGHTS.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title}>
                <div className="step-icon">
                  <Icon size={18} />
                </div>
                <h3 className="h3-sm">{item.title}</h3>
                <p className="muted">{item.text}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="card soft">
        <h2>Built for founders, CFO teams, and trade operations</h2>
        <p className="muted">
          Whether you have five open bills or a large ageing portfolio, BillClear Desk gives one shared operating
          rhythm across documentation, reconciliation, and follow-up updates.
        </p>
        <div className="row actions">
          <Button asChild>
            <Link href="/services">Explore our services</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
