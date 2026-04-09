import { Navigate, Route, Routes } from 'react-router-dom';

import { AppShell } from './layout/AppShell';
import { ArtistPage } from './pages/ArtistPage';
import { HomePage } from './pages/HomePage';
import { InfoHubPage } from './pages/InfoHubPage';
import { InfoSectionPage } from './pages/InfoSectionPage';
import { LineupPage } from './pages/LineupPage';
import { MapPage } from './pages/MapPage';
import { PerformancePage } from './pages/PerformancePage';
import { ReviewPage } from './pages/ReviewPage';
import { SchedulePage } from './pages/SchedulePage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="lineup" element={<LineupPage />} />
        <Route path="map" element={<MapPage />} />
        <Route path="schedule" element={<SchedulePage />} />
        <Route path="info" element={<InfoHubPage />} />
        <Route path="info/settings" element={<SettingsPage />} />
        <Route path="info/section/:id" element={<InfoSectionPage />} />
        <Route path="artist/:id" element={<ArtistPage />} />
        <Route path="performance/:id/review" element={<ReviewPage />} />
        <Route path="performance/:id" element={<PerformancePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
