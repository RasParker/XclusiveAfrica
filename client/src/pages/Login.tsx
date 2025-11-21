
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname;

  // Redirect if user is already logged in
  useEffect(() => {
    const checkAndRedirect = async () => {
      if (user && !authLoading) {
        let redirectPath = from;
        
        if (!redirectPath) {
          if (user.role === 'admin') {
            redirectPath = '/admin/dashboard';
          } else if (user.role === 'creator') {
            redirectPath = '/creator/dashboard';
          } else if (user.role === 'fan') {
            // Check if fan has any subscriptions
            try {
              const response = await fetch(`/api/subscriptions/fan/${user.id}`);
              if (response.ok) {
                const subscriptions = await response.json();
                const hasActiveSubscriptions = subscriptions && subscriptions.length > 0 && 
                  subscriptions.some((sub: any) => sub.status === 'active');
                
                redirectPath = hasActiveSubscriptions ? '/fan/feed' : '/explore';
              } else {
                redirectPath = '/explore';
              }
            } catch (error) {
              console.error('Error checking subscriptions:', error);
              redirectPath = '/explore';
            }
          }
        }
        
        navigate(redirectPath, { replace: true });
      }
    };
    
    checkAndRedirect();
  }, [user, authLoading, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      
      // Small delay to ensure state is updated
      setTimeout(async () => {
        // Get the user after login to determine redirect path
        const storedUser = localStorage.getItem('jukwaa_user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          
          let redirectPath = from;
          
          if (!redirectPath) {
            if (user.role === 'admin') {
              redirectPath = '/admin/dashboard';
            } else if (user.role === 'creator') {
              redirectPath = '/creator/dashboard';
            } else if (user.role === 'fan') {
              // Check if fan has any subscriptions
              try {
                const response = await fetch(`/api/subscriptions/fan/${user.id}`);
                if (response.ok) {
                  const subscriptions = await response.json();
                  // Check if they have any active subscriptions
                  const hasActiveSubscriptions = subscriptions && subscriptions.length > 0 && 
                    subscriptions.some((sub: any) => sub.status === 'active');
                  
                  redirectPath = hasActiveSubscriptions ? '/fan/feed' : '/explore';
                } else {
                  // If API fails, default to explore
                  redirectPath = '/explore';
                }
              } catch (error) {
                console.error('Error checking subscriptions:', error);
                // If check fails, default to explore
                redirectPath = '/explore';
              }
            }
          }
          
          navigate(redirectPath, { replace: true });
        }
      }, 100);
    } catch (error) {
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
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="text-center space-y-2">
              <Link 
                to="/forgot-password" 
                className="text-sm text-white hover:underline"
              >
                Forgot your password?
              </Link>
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-500 hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
