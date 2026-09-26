'use client';

import { FormEvent, useState } from 'react';
import { Building2, KeyRound, Save } from 'lucide-react';
import { seedCompanyProfile } from '@/lib/mock-data';
import { useOnlineStatus } from '@/lib/use-online-status';
import { AppDialog } from './AppDialog';
import { NoNetworkState } from './NoNetworkState';
import { PageHeader } from './PageHeader';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function SettingsPage() {
  const online = useOnlineStatus();
  const [profile, setProfile] = useState(seedCompanyProfile);
  const [passwordState, setPasswordState] = useState({ current: '', next: '', confirm: '' });
  const [profileMessage, setProfileMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  function submitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfileDialogOpen(false);
    setProfileMessage('Company profile updated successfully (mock action).');
  }

  function submitPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!passwordState.current || !passwordState.next || !passwordState.confirm) {
      setPasswordMessage('Fill all password fields.');
      return;
    }
    if (passwordState.next !== passwordState.confirm) {
      setPasswordMessage('New password and confirm password must match.');
      return;
    }
    setPasswordDialogOpen(false);
    setPasswordState({ current: '', next: '', confirm: '' });
    setPasswordMessage('Password reset completed successfully (mock action).');
  }

  return (
    <>
      <PageHeader title="Settings" subtitle="Manage company profile and admin security settings." />

      {!online && (
        <NoNetworkState
          title="Network unavailable"
          message="You can still edit values locally, but updates should be retried once network connectivity returns."
        />
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="clay space-y-3">
          <h2 className="inline-flex items-center gap-2 text-base font-semibold">
            <Building2 size={16} /> Company profile
          </h2>
          <div className="grid gap-2 text-sm">
            <p>
              <b>Company:</b> {profile.companyName}
            </p>
            <p>
              <b>Consultant:</b> {profile.consultantName}
            </p>
            <p>
              <b>Email:</b> {profile.supportEmail}
            </p>
            <p>
              <b>Phone:</b> {profile.supportPhone}
            </p>
            <p>
              <b>City:</b> {profile.city}
            </p>
          </div>
          <Button onClick={() => setProfileDialogOpen(true)}>
            <Save size={15} /> Edit profile
          </Button>
          {profileMessage && <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">{profileMessage}</p>}
        </Card>

        <Card className="clay space-y-3">
          <h2 className="inline-flex items-center gap-2 text-base font-semibold">
            <KeyRound size={16} /> Password reset
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Update admin password for mock portal access control and demo security review flows.
          </p>
          <Button onClick={() => setPasswordDialogOpen(true)}>
            <KeyRound size={15} /> Reset password
          </Button>
          {passwordMessage && <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">{passwordMessage}</p>}
        </Card>
      </div>

      <AppDialog open={profileDialogOpen} title="Edit company profile" onClose={() => setProfileDialogOpen(false)}>
        <form className="grid gap-3" onSubmit={submitProfile}>
          <Label>
            Company name
            <Input
              value={profile.companyName}
              onChange={(e) => setProfile((prev) => ({ ...prev, companyName: e.target.value }))}
              required
            />
          </Label>
          <Label>
            Consultant name
            <Input
              value={profile.consultantName}
              onChange={(e) => setProfile((prev) => ({ ...prev, consultantName: e.target.value }))}
              required
            />
          </Label>
          <Label>
            Support email
            <Input
              type="email"
              value={profile.supportEmail}
              onChange={(e) => setProfile((prev) => ({ ...prev, supportEmail: e.target.value }))}
              required
            />
          </Label>
          <Label>
            Support phone
            <Input
              value={profile.supportPhone}
              onChange={(e) => setProfile((prev) => ({ ...prev, supportPhone: e.target.value }))}
              required
            />
          </Label>
          <Label>
            City
            <Input value={profile.city} onChange={(e) => setProfile((prev) => ({ ...prev, city: e.target.value }))} required />
          </Label>
          <Button type="submit">Save profile</Button>
        </form>
      </AppDialog>

      <AppDialog open={passwordDialogOpen} title="Reset password" onClose={() => setPasswordDialogOpen(false)}>
        <form className="grid gap-3" onSubmit={submitPassword}>
          <Label>
            Current password
            <Input
              type="password"
              value={passwordState.current}
              onChange={(e) => setPasswordState((prev) => ({ ...prev, current: e.target.value }))}
              required
            />
          </Label>
          <Label>
            New password
            <Input
              type="password"
              value={passwordState.next}
              onChange={(e) => setPasswordState((prev) => ({ ...prev, next: e.target.value }))}
              required
            />
          </Label>
          <Label>
            Confirm new password
            <Input
              type="password"
              value={passwordState.confirm}
              onChange={(e) => setPasswordState((prev) => ({ ...prev, confirm: e.target.value }))}
              required
            />
          </Label>
          <Button type="submit">Confirm reset</Button>
        </form>
      </AppDialog>
    </>
  );
}
