import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Analytics() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, categories: 0 });

  useEffect(() => {
    if (user) loadStats();
  }, [user]);

  const loadStats = async () => {
    const { data } = await supabase.from('pantry_items').select('*').eq('user_id', user!.id);
    const categories = new Set(data?.map(i => i.category) || []);
    setStats({ total: data?.length || 0, categories: categories.size });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="eco-card">
          <CardHeader><CardTitle>Total Items Tracked</CardTitle></CardHeader>
          <CardContent><div className="text-4xl font-bold text-primary">{stats.total}</div></CardContent>
        </Card>
        <Card className="eco-card">
          <CardHeader><CardTitle>Categories Used</CardTitle></CardHeader>
          <CardContent><div className="text-4xl font-bold text-secondary">{stats.categories}</div></CardContent>
        </Card>
      </div>
    </div>
  );
}