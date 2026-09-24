'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD } from '@/lib/constants';

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
      <div className="card auth-card">
        <h1>Admin login</h1>
        <p className="muted">Use the mock credentials below to access the desk dashboard and workflows.</p>
        <form onSubmit={submit}>
          <label>
            Email
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label>
            Password
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {error && <p className="err">{error}</p>}
          <button className="btn auth-btn" type="submit">
            Open dashboard
          </button>
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
      </div>
    </section>
  );
}
