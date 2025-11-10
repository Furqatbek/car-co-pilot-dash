import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SubscriptionGateProps {
  children: ReactNode;
  feature?: string;
}

export const SubscriptionGate = ({ children, feature = 'this feature' }: SubscriptionGateProps) => {
  const { subscription } = useAuth();
  const navigate = useNavigate();

  if (subscription.tier === 'premium') {
    return <>{children}</>;
  }

  return (
    <Card className="border-warning bg-warning/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-warning" />
          Premium Feature
        </CardTitle>
        <CardDescription>
          Upgrade to Premium to unlock {feature}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          className="w-full" 
          onClick={() => navigate('/subscription')}
        >
          <Crown className="w-4 h-4 mr-2" />
          Upgrade to Premium
        </Button>
      </CardContent>
    </Card>
  );
};
