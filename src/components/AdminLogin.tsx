'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { KeyRound, Mail, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD } from '@/lib/constants';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function AdminLogin({ nextPath }: { nextPath?: string }) {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState(DEMO_ADMIN_EMAIL);
  const [password, setPassword] = useState(DEMO_ADMIN_PASSWORD);
  const [error, setError] = useState('');

  const next = nextPath && nextPath.startsWith('/') ? nextPath : '/dashboard';

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
      <Card className="auth-card">
        <Badge variant="secondary" className="auth-badge">
          <ShieldCheck size={14} /> Secure demo access
        </Badge>
        <h1>Admin login</h1>
        <p className="muted">Use the mock credentials below to access the desk dashboard and workflows.</p>
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
          <Link href="/">Back to landing page</Link>
        </p>
      </Card>
    </section>
  );
}
