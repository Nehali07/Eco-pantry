import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { AddItemDialog } from '@/components/AddItemDialog';

interface PantryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string | null;
  expiry_date: string | null;
}

export default function Pantry() {
  const { user } = useAuth();
  const [items, setItems] = useState<PantryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PantryItem | null>(null);

  useEffect(() => {
    if (user) {
      loadItems();
    }
  }, [user]);

  const loadItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pantry_items')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load pantry items');
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('pantry_items').delete().eq('id', id);

    if (error) {
      toast.error('Failed to delete item');
    } else {
      toast.success('Item deleted');
      loadItems();
    }
  };

  const handleEdit = (item: PantryItem) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingItem(null);
    loadItems();
  };

  const categories = Array.from(new Set(items.map((item) => item.category)));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Pantry</h1>
          <p className="text-muted-foreground mt-1">Manage your groceries and ingredients</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="eco-button">
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      ) : items.length === 0 ? (
        <Card className="eco-card">
          <CardContent className="py-12 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No items yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by adding your first pantry item
            </p>
            <Button onClick={() => setDialogOpen(true)} className="eco-button">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Item
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category}>
              <h2 className="text-xl font-semibold mb-3 text-primary">{category}</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items
                  .filter((item) => item.category === category)
                  .map((item) => (
                    <Card key={item.id} className="eco-card">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{item.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.quantity} {item.unit || 'units'}
                            </p>
                            {item.expiry_date && (
                              <p className="text-sm text-accent mt-2">
                                Expires: {new Date(item.expiry_date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEdit(item)}
                              className="h-8 w-8"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDelete(item.id)}
                              className="h-8 w-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <AddItemDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        editItem={editingItem}
      />
    </div>
  );
}

// Placeholder import for the icon
import { Package } from 'lucide-react';