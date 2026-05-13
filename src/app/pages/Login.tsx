import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';
import logoImage from '../../imports/Outlook-wehy2530_(2).jfif';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const passwordResetMessage = (location.state as { passwordResetMessage?: string } | null)?.passwordResetMessage;

  useEffect(() => {
    if (passwordResetMessage) {
      toast.success(passwordResetMessage);
    }
  }, [passwordResetMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        toast.success('Successfully logged in!');
        navigate('/');
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      toast.error('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(to bottom right, var(--council-blue-light), white, var(--council-purple-light))' }}>
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img src={logoImage} alt="Warren Shire Council" className="h-24" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Warren Shire Portal</h1>
          <p className="text-gray-600 mt-2">Project Management System</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access the portal</CardDescription>
          </CardHeader>
          <CardContent>
            {passwordResetMessage && (
              <div className="mb-4 p-4 rounded-lg border" style={{ backgroundColor: 'var(--council-green-light)', borderColor: 'var(--council-green)' }}>
                <p className="text-sm" style={{ color: 'var(--council-green)' }}>
                  {passwordResetMessage}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@council.gov"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium hover:underline"
                  style={{ color: 'var(--council-blue)' }}
                >
                  Forgot Password?
                </Link>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 rounded-lg border" style={{ backgroundColor: 'var(--council-blue-light)', borderColor: 'var(--council-blue)' }}>
              <p className="text-sm font-medium mb-2" style={{ color: '#006FB9' }}>Demo Credentials:</p>
              <div className="space-y-1 text-sm" style={{ color: '#006FB9' }}>
                <p><strong>Admin:</strong> admin@council.gov / admin123</p>
                <p><strong>Project Manager:</strong> manager@council.gov / manager123</p>
                <p><strong>Staff Member:</strong> staff@council.gov / staff123</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-600 mt-6">
          © 2026 Council Project Management System
        </p>
      </div>
    </div>
  );
}
