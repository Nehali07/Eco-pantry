import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, AlertTriangle, ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalItems: 0,
    expiringCount: 0,
  });
  const [expiringItems, setExpiringItems] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const { data: items } = await supabase
      .from('pantry_items')
      .select('*')
      .eq('user_id', user!.id);

    const { data: expiring } = await supabase
      .from('pantry_items')
      .select('*')
      .eq('user_id', user!.id)
      .not('expiry_date', 'is', null)
      .lte('expiry_date', threeDaysFromNow.toISOString().split('T')[0])
      .order('expiry_date', { ascending: true })
      .limit(5);

    setStats({
      totalItems: items?.length || 0,
      expiringCount: expiring?.length || 0,
    });
    setExpiringItems(expiring || []);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your pantry overview</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="eco-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
            <p className="text-xs text-muted-foreground">Items in your pantry</p>
          </CardContent>
        </Card>

        <Card className="eco-card border-accent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertTriangle className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expiringCount}</div>
            <p className="text-xs text-muted-foreground">Within 3 days</p>
          </CardContent>
        </Card>

        <Card className="eco-card bg-secondary/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">AI Recipes</CardTitle>
            <ChefHat className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ready</div>
            <p className="text-xs text-muted-foreground">Generate from pantry</p>
          </CardContent>
        </Card>
      </div>

      {expiringItems.length > 0 && (
        <Card className="eco-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-accent" />
              Items Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expiringItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-accent/10 rounded-xl"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Expires: {new Date(item.expiry_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-accent">
                    {Math.ceil(
                      (new Date(item.expiry_date).getTime() - new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{' '}
                    days
                  </div>
                </div>
              ))}
            </div>
            <Link to="/alerts">
              <Button variant="outline" className="w-full mt-4 eco-button">
                View All Alerts
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <Card className="eco-card warm-gradient">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Get Recipe Suggestions</h3>
              <p className="text-sm text-foreground/80 mt-1">
                Let AI suggest delicious recipes from your pantry items
              </p>
            </div>
            <Link to="/recipes">
              <Button size="lg" className="eco-button">
                Generate Recipes
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}