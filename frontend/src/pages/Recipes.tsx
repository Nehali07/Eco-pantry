import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChefHat, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function Recipes() {
  const { user } = useAuth();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadIngredients();
    }
  }, [user]);

  const loadIngredients = async () => {
    const { data } = await supabase
      .from('pantry_items')
      .select('name')
      .eq('user_id', user!.id);

    if (data) {
      setIngredients(data.map((item) => item.name));
    }
  };

  const generateRecipes = async () => {
    if (ingredients.length === 0) {
      toast.error('Add some items to your pantry first');
      return;
    }

    setLoading(true);
    try {
      // Get user preferences
      const { data: profile } = await supabase
        .from('profiles')
        .select('dietary_preferences')
        .eq('id', user!.id)
        .single();

      const { data, error } = await supabase.functions.invoke('generate-recipes', {
        body: {
          ingredients,
          dietaryPreferences: profile?.dietary_preferences || [],
        },
      });

      if (error) {
        if (error.message.includes('Rate limit')) {
          toast.error('Too many requests. Please wait a moment and try again.');
        } else if (error.message.includes('credits')) {
          toast.error('AI credits depleted. Please add credits to continue.');
        } else {
          toast.error('Failed to generate recipes');
        }
        console.error('Recipe generation error:', error);
      } else {
        setRecipes(data.recipes);
        toast.success('Recipes generated successfully!');
      }
    } catch (err) {
      toast.error('Something went wrong');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ChefHat className="w-8 h-8 text-secondary" />
          AI Recipe Suggestions
        </h1>
        <p className="text-muted-foreground mt-1">
          Get creative recipes based on your pantry items
        </p>
      </div>

      <Card className="eco-card warm-gradient">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Your Available Ingredients</h3>
              <p className="text-sm text-foreground/80 mt-1">
                {ingredients.length} items in your pantry
              </p>
            </div>
            <Button
              onClick={generateRecipes}
              disabled={loading || ingredients.length === 0}
              size="lg"
              className="eco-button"
            >
              {loading ? (
                'Generating...'
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Recipes
                </>
              )}
            </Button>
          </div>

          {ingredients.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ingredient, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-background/50 rounded-full text-sm"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {recipes && (
        <Card className="eco-card">
          <CardHeader>
            <CardTitle>Suggested Recipes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none whitespace-pre-wrap">
              {recipes}
            </div>
          </CardContent>
        </Card>
      )}

      {!recipes && !loading && (
        <Card className="eco-card">
          <CardContent className="py-12 text-center">
            <ChefHat className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No recipes yet</h3>
            <p className="text-muted-foreground">
              Click the button above to generate AI-powered recipe suggestions
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}