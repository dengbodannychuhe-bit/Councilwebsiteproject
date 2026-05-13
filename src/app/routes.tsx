import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from './Layout';
import { Dashboard } from './pages/Dashboard';
import { ProjectList } from './pages/ProjectList';
import { CreateProject } from './pages/CreateProject';
import { ProjectDetails } from './pages/ProjectDetails';
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { PortfolioDashboard } from './pages/PortfolioDashboard';
import { AuditLogs } from './pages/AuditLogs';
import { Notifications } from './pages/Notifications';
import { PublicUpdates } from './pages/PublicUpdates';
import { ProtectedRoute } from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/forgot-password',
    Component: ForgotPassword,
  },
  {
    path: '/reset-password',
    Component: ResetPassword,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: Dashboard },
      { path: 'portfolio', Component: PortfolioDashboard },
      { path: 'projects', Component: ProjectList },
      { path: 'projects/new', Component: CreateProject },
      { path: 'projects/:id', Component: ProjectDetails },
      { path: 'audit-logs', Component: AuditLogs },
      { path: 'notifications', Component: Notifications },
      { path: 'public-updates', Component: PublicUpdates },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
