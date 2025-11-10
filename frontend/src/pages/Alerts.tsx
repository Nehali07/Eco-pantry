import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function Alerts() {
  const { user } = useAuth();
  const [expiringItems, setExpiringItems] = useState<any[]>([]);

  useEffect(() => {
    if (user) loadExpiring();
  }, [user]);

  const loadExpiring = async () => {
    const threeDays = new Date();
    threeDays.setDate(threeDays.getDate() + 3);

    const { data } = await supabase
      .from('pantry_items')
      .select('*')
      .eq('user_id', user!.id)
      .not('expiry_date', 'is', null)
      .lte('expiry_date', threeDays.toISOString().split('T')[0])
      .order('expiry_date', { ascending: true });

    setExpiringItems(data || []);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <AlertTriangle className="text-accent" />
        Expiry Alerts
      </h1>
      
      {expiringItems.length === 0 ? (
        <Card className="eco-card"><CardContent className="py-12 text-center text-muted-foreground">No items expiring soon</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {expiringItems.map((item) => (
            <Card key={item.id} className="eco-card border-accent">
              <CardContent className="py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-accent font-medium">{Math.ceil((new Date(item.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days</p>
                    <p className="text-sm text-muted-foreground">{new Date(item.expiry_date).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}