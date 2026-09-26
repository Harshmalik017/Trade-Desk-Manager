'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { KeyRound, Mail, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD } from '@/lib/constants';
import { safeNextPath } from '@/lib/auth/session';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function AdminLogin({ nextPath }: { nextPath?: string }) {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState(DEMO_ADMIN_EMAIL);
  const [password, setPassword] = useState(DEMO_ADMIN_PASSWORD);
  const [error, setError] = useState('');

  const next = safeNextPath(nextPath);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(next);
    }
  }, [isAuthenticated, next, router]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = login(email, password);
    if (!result.ok) {
      setError(result.error ?? 'Unable to log in.');
      return;
    }
    router.replace(next);
  }

  return (
    <section className="auth-wrap">
      <Card className="auth-card colorful">
        <Badge variant="secondary" className="auth-badge">
          <ShieldCheck size={14} /> Secure demo access
        </Badge>
        <h1>Admin login</h1>
        <p className="muted">
          Use the mock credentials below to access the dashboard and internal workflows after exploring the website
          pages.
        </p>
        <form onSubmit={submit}>
          <Label>
            Email
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
            <Mail size={14} className="field-icon" />
          </Label>
          <Label>
            Password
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <KeyRound size={14} className="field-icon" />
          </Label>
          {error && <p className="err">{error}</p>}
          <Button className="auth-btn" type="submit">
            Open dashboard
          </Button>
        </form>
        <div className="mock-box">
          <b>Mock credentials</b>
          <p className="note">
            Email: <code>{DEMO_ADMIN_EMAIL}</code>
            <br />
            Password: <code>{DEMO_ADMIN_PASSWORD}</code>
          </p>
        </div>
        <p className="note">
          <Link href="/">Back to Home</Link> · <Link href="/connect">Connect with us</Link>
        </p>
      </Card>
    </section>
  );
}
