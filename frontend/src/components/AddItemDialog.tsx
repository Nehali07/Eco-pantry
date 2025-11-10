import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editItem?: any;
}

const CATEGORIES = [
  'Fruits & Vegetables',
  'Dairy & Eggs',
  'Meat & Fish',
  'Grains & Pasta',
  'Canned Goods',
  'Frozen',
  'Beverages',
  'Snacks',
  'Condiments',
  'Other',
];

export function AddItemDialog({ open, onOpenChange, editItem }: AddItemDialogProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Other',
    quantity: 1,
    unit: '',
    expiry_date: '',
  });

  useEffect(() => {
    if (editItem) {
      setFormData({
        name: editItem.name,
        category: editItem.category,
        quantity: editItem.quantity,
        unit: editItem.unit || '',
        expiry_date: editItem.expiry_date || '',
      });
    } else {
      setFormData({
        name: '',
        category: 'Other',
        quantity: 1,
        unit: '',
        expiry_date: '',
      });
    }
  }, [editItem, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const dataToSave = {
      ...formData,
      user_id: user!.id,
      expiry_date: formData.expiry_date || null,
      unit: formData.unit || null,
    };

    let error;
    if (editItem) {
      const { error: updateError } = await supabase
        .from('pantry_items')
        .update(dataToSave)
        .eq('id', editItem.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('pantry_items')
        .insert([dataToSave]);
      error = insertError;
    }

    if (error) {
      toast.error(`Failed to ${editItem ? 'update' : 'add'} item`);
    } else {
      toast.success(`Item ${editItem ? 'updated' : 'added'} successfully`);
      onOpenChange(false);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Tomatoes"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                step="0.1"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="kg, pcs, L"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiry">Expiry Date (Optional)</Label>
            <Input
              id="expiry"
              type="date"
              value={formData.expiry_date}
              onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 eco-button">
              {loading ? 'Saving...' : editItem ? 'Update' : 'Add Item'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}