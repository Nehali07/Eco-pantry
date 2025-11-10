import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function Profile() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) loadProfile();
  }, [user]);

  const loadProfile = async () => {
    const { data } = await supabase.from('profiles').select('full_name').eq('id', user!.id).single();
    if (data) setFullName(data.full_name || '');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('profiles').update({ full_name: fullName }).eq('id', user!.id);
    if (error) toast.error('Failed to update'); else toast.success('Profile updated');
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <h1 className="text-3xl font-bold">Profile Settings</h1>
      <Card className="eco-card">
        <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <Button type="submit" disabled={loading} className="eco-button">{loading ? 'Saving...' : 'Save Changes'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}