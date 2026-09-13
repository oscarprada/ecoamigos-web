import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';

import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/public/HomePage';
import NotFoundPage from './pages/public/NotFoundPage';
import RankingPage from './pages/public/RankingPage';
import EducationCategoryPage from './pages/public/EducationCategoryPage';

import LoginPage from './pages/auth/LoginPage';
import PasswordRecoveryPage from './pages/auth/PasswordRecoveryPage';

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

            {/* Públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/ranking" element={<RankingPage />} />

            {/* Educación ambiental */}
            <Route
              path="/educacion/:category"
              element={<EducationCategoryPage />}
            />

            {/* Login */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/forgot-password" element={<PasswordRecoveryPage key="forgot" />} />
            <Route path="/reset-password" element={<PasswordRecoveryPage key="reset" reset />} />

            {/* Líder */}
            <Route element={<ProtectedRoute roles={['leader', 'admin']} />}>
              <Route path="/leader" element={<LeaderDashboard />} />
            </Route>
            <Route element={<ProtectedRoute roles={['leader']} />}>
              <Route
                path="/leader/register"
                element={<RegisterRecyclingPage />}
              />
            </Route>

            {/* Admin */}
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
