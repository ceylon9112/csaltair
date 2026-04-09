import { useState } from 'react';
import { Link } from 'react-router-dom';

import { requestPermissionsIfNeededAsync } from '@/services/notifications/NotificationService';
import { clearAllLocalDataAsync } from '@/services/storage/clearLocalData';
import { usePreferencesStore, type ReminderDefault } from '@/store/preferencesStore';

export function SettingsPage() {
  const highContrast = usePreferencesStore((s) => s.highContrast);
  const setHighContrast = usePreferencesStore((s) => s.setHighContrast);
  const textScale = usePreferencesStore((s) => s.textScale);
  const setTextScale = usePreferencesStore((s) => s.setTextScale);
  const notificationsEnabled = usePreferencesStore((s) => s.notificationsEnabled);
  const setNotificationsEnabled = usePreferencesStore((s) => s.setNotificationsEnabled);
  const reminderDefault = usePreferencesStore((s) => s.reminderDefaultMinutes);
  const setReminderDefault = usePreferencesStore((s) => s.setReminderDefault);
  const [busy, setBusy] = useState(false);

  async function onRequestNotif() {
    const ok = await requestPermissionsIfNeededAsync();
    window.alert(ok ? 'Notifications enabled (native app).' : 'Browser build: use the Expo app for system notifications.');
  }

  async function onClear() {
    if (!window.confirm('Clear local data? Removes schedule, reviews, and preferences in this browser.')) return;
    setBusy(true);
    try {
      await clearAllLocalDataAsync();
      window.alert('Cleared.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page">
      <Link to="/info" className="caption">
        ← Info
      </Link>
      <h1 className="title" style={{ marginTop: 12 }}>
        Settings
      </h1>

      <div className="card">
        <label className="row" style={{ justifyContent: 'space-between' }}>
          <span>Notifications (native)</span>
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={(e) => setNotificationsEnabled(e.target.checked)}
          />
        </label>
        <p className="caption">Web build: toggles saved; Expo app handles OS permission.</p>
        <button type="button" className="btn secondary" style={{ marginTop: 8 }} onClick={() => void onRequestNotif()}>
          Request permission
        </button>
      </div>

      <div className="card">
        <div className="subtitle">Default reminder (minutes)</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
          {([15, 30, 60] as ReminderDefault[]).map((m) => (
            <button
              key={m}
              type="button"
              className={reminderDefault === m ? 'btn' : 'btn secondary'}
              onClick={() => setReminderDefault(m)}>
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <label className="row" style={{ justifyContent: 'space-between' }}>
          <span>High contrast</span>
          <input type="checkbox" checked={highContrast} onChange={(e) => setHighContrast(e.target.checked)} />
        </label>
      </div>

      <div className="card">
        <div className="subtitle">Text size</div>
        <select
          className="input"
          value={textScale}
          onChange={(e) => setTextScale(e.target.value as 'default' | 'large' | 'extraLarge')}>
          <option value="default">Default</option>
          <option value="large">Large</option>
          <option value="extraLarge">Extra large</option>
        </select>
      </div>

      <button type="button" className="btn secondary" disabled={busy} onClick={() => void onClear()}>
        Clear local data
      </button>

      <p className="caption" style={{ marginTop: 24 }}>
        Patron web build · Jazz Fest 2026 beta
      </p>
    </div>
  );
}
