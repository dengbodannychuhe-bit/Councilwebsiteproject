import { Outlet, Link, useLocation } from 'react-router';
import { LayoutDashboard, FolderOpen, Menu, Briefcase, LogOut, User, Bell, FileText, Globe } from 'lucide-react';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from './components/ui/sheet';
import { useAuth } from './context/AuthContext';
import { useAudit } from './context/AuditContext';
import { useNavigate } from 'react-router';
import logoImage from 'figma:asset/43e84afc83c01e9a516370dd3d2d23a22f7f519e.png';

export function Layout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { getUnreadNotificationCount } = useAudit();
  const navigate = useNavigate();
  const unreadCount = getUnreadNotificationCount();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigation = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Portfolio', path: '/portfolio', icon: Briefcase },
    { name: 'Projects', path: '/projects', icon: FolderOpen },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: unreadCount },
    { name: 'Public Updates', path: '/public-updates', icon: Globe },
    { name: 'Audit Logs', path: '/audit-logs', icon: FileText, adminOnly: true },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavLinks = () => (
    <>
      {navigation
        .filter(item => !item.adminOnly || user?.role === 'Admin')
        .map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'text-gray-700 hover:bg-gray-100'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              style={isActive(item.path) ? { backgroundColor: 'var(--council-blue-light)', color: 'var(--council-blue)' } : {}}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <Badge
                  className="text-white text-xs"
                  style={{ backgroundColor: 'var(--council-orange)' }}
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-6">
                  <div className="flex flex-col gap-2">
                    <NavLinks />
                  </div>
                </SheetContent>
              </Sheet>
              <img src={logoImage} alt="Warren Shire Council" className="h-12" />
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <Badge variant="outline" style={{ color: 'var(--council-purple)', borderColor: 'var(--council-purple)' }}>
                  {user?.role}
                </Badge>
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{user?.name}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex flex-col gap-2">
                <NavLinks />
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}