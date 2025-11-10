import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';

export default function Shopping() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [newItem, setNewItem] = useState('');
  const [newQuantity, setNewQuantity] = useState('');

  useEffect(() => {
    if (user) loadItems();
  }, [user]);

  const loadItems = async () => {
    const { data } = await supabase
      .from('shopping_list')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });
    setItems(data || []);
  };

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem) return;

    const { error } = await supabase.from('shopping_list').insert([
      { user_id: user!.id, item_name: newItem, quantity: newQuantity }
    ]);

    if (error) {
      toast.error('Failed to add item');
    } else {
      toast.success('Item added');
      setNewItem('');
      setNewQuantity('');
      loadItems();
    }
  };

  const toggleCheck = async (id: string, checked: boolean) => {
    await supabase.from('shopping_list').update({ checked: !checked }).eq('id', id);
    loadItems();
  };

  const deleteItem = async (id: string) => {
    await supabase.from('shopping_list').delete().eq('id', id);
    toast.success('Item removed');
    loadItems();
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <h1 className="text-3xl font-bold">Shopping List</h1>
      
      <Card className="eco-card">
        <CardContent className="pt-6">
          <form onSubmit={addItem} className="flex gap-2">
            <Input placeholder="Item name" value={newItem} onChange={(e) => setNewItem(e.target.value)} />
            <Input placeholder="Qty" value={newQuantity} onChange={(e) => setNewQuantity(e.target.value)} className="w-24" />
            <Button type="submit" className="eco-button"><Plus className="w-4 h-4" /></Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {items.map((item) => (
          <Card key={item.id} className="eco-card">
            <CardContent className="py-4 flex items-center gap-3">
              <Checkbox checked={item.checked} onCheckedChange={() => toggleCheck(item.id, item.checked)} />
              <div className="flex-1">
                <span className={item.checked ? 'line-through text-muted-foreground' : ''}>{item.item_name}</span>
                {item.quantity && <span className="text-sm text-muted-foreground ml-2">({item.quantity})</span>}
              </div>
              <Button size="icon" variant="ghost" onClick={() => deleteItem(item.id)}><Trash2 className="w-4 h-4" /></Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}