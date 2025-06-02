import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSuccess = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img 
              src="/lovable-uploads/5f87692c-a4e5-4595-8ad0-26c2ce2c520e.png" 
              alt="iQube Logo" 
              className="w-16 h-16 object-contain" 
            />
            <h1 className="text-4xl font-bold text-gray-900">iQube</h1>
          </div>
          <p className="text-gray-600">
            Sign in to access your question generation dashboard
          </p>
        </div>

        <LoginForm onSuccess={handleLoginSuccess} />

        {/* Demo Mode Notice */}
        <Card className="mt-6 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold text-blue-900 mb-2">Try iQube Without Logging In</h3>
              <p className="text-sm text-blue-700 mb-4">
                Experience our AI question generation features without creating an account.
              </p>
              <Button
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
                onClick={() => navigate('/')}
              >
                Try Demo Mode
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
