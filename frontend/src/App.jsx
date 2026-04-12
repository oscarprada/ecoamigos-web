import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/public/HomePage';
import RankingPage from './pages/public/RankingPage';
import WinnersPage from './pages/public/WinnersPage';
import PrizesPage from './pages/public/PrizesPage';
import LoginPage from './pages/auth/LoginPage';
import LeaderDashboard from './pages/leader/LeaderDashboard';
import RegisterRecyclingPage from './pages/leader/RegisterRecyclingPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminReviewsPage from './pages/admin/AdminReviewsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminContentPage from './pages/admin/AdminContentPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/ranking" element={<RankingPage />} />
            <Route path="/winners" element={<WinnersPage />} />
            <Route path="/prizes" element={<PrizesPage />} />
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute roles={['leader', 'admin']} />}>
              <Route path="/leader" element={<LeaderDashboard />} />
              <Route path="/leader/register" element={<RegisterRecyclingPage />} />
            </Route>

            <Route element={<ProtectedRoute roles={['admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/reviews" element={<AdminReviewsPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/content" element={<AdminContentPage />} />
              <Route path="/admin/settings" element={<AdminSettingsPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
