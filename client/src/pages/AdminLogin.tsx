import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Shield } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, login, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect logic for already logged-in users
  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        // Non-admin users should be redirected to their appropriate dashboard
        const redirectPath = user.role === 'creator' ? '/creator/dashboard' : '/explore';
        navigate(redirectPath);
        toast({
          title: "Access Denied",
          description: "Admin access is restricted to authorized personnel only.",
          variant: "destructive",
        });
      }
    }
  }, [user, authLoading, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);

      // The useEffect above will handle redirection based on user role
      // But we also need to check the role immediately after login
      const response = await fetch('/api/auth/verify', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();

        // Store both user data and token
        localStorage.setItem('xclusive_user', JSON.stringify(data.user));
        if (data.token) {
          localStorage.setItem('xclusive_token', data.token);
        } else {
          console.error('No token received from admin login');
          throw new Error('Authentication token not received');
        }

        if (data.user?.role === 'admin') {
          toast({
            title: "Welcome Admin",
            description: "Successfully logged into admin panel.",
          });
          navigate('/admin/dashboard');
        } else {
          toast({
            title: "Access Denied",
            description: "This account does not have admin privileges.",
            variant: "destructive",
          });
          const redirectPath = data.user?.role === 'creator' ? '/creator/dashboard' : '/explore';
          navigate(redirectPath);
        }
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading spinner while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">P</span>
            </div>
            <span className="text-2xl font-bold text-gradient-primary">
              Pénc
            </span>
          </Link>
        </div>

        <Card className="bg-gradient-card border-border/50">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl">Admin Access</CardTitle>
            <CardDescription>
              Authorized personnel only
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="Enter your admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  data-testid="input-admin-email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    data-testid="input-admin-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                data-testid="button-admin-login"
              >
                {isLoading ? "Signing in..." : "Admin Sign In"}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Return to{' '}
                <Link to="/login" className="text-blue-500 hover:underline font-medium">
                  Regular Login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};