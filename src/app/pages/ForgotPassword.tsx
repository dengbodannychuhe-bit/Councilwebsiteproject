import { useState } from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ArrowLeft, Mail } from 'lucide-react';
import { toast } from 'sonner';
import logoImage from '../../imports/Outlook-wehy2530_(2).jfif';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function getErrorMessage(response: Response, fallback: string) {
  try {
    const data = await response.json();
    return data?.message || fallback;
  } catch {
    return fallback;
  }
}

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      toast.error('Please enter your registered email address');
      return;
    }

    if (!emailPattern.test(trimmedEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      if (!response.ok) {
        const message = await getErrorMessage(response, 'Unable to send reset email. Please try again.');
        throw new Error(message);
      }

      setSubmittedEmail(trimmedEmail);
      toast.success('Password reset email sent. Please check your inbox.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(to bottom right, var(--council-blue-light), white, var(--council-purple-light))' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img src={logoImage} alt="Warren Shire Council" className="h-24" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Forgot Password</h1>
          <p className="text-gray-600 mt-2">Enter your registered email to receive a reset link</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Reset your password</CardTitle>
            <CardDescription>We will email you a secure link to create a new password.</CardDescription>
          </CardHeader>
          <CardContent>
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
                    onChange={(event) => setEmail(event.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? 'Sending reset link...' : 'Send Reset Link'}
              </Button>
            </form>

            {submittedEmail && (
              <div className="mt-6 p-4 rounded-lg border" style={{ backgroundColor: 'var(--council-green-light)', borderColor: 'var(--council-green)' }}>
                <p className="text-sm" style={{ color: 'var(--council-green)' }}>
                  If an account exists for {submittedEmail}, a password reset link has been sent.
                </p>
              </div>
            )}

            <div className="mt-6">
              <Link to="/login">
                <Button type="button" variant="ghost" className="w-full gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
