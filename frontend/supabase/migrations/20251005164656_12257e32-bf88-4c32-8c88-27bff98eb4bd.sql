-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  dietary_preferences TEXT[], -- array of preferences like 'vegetarian', 'vegan', etc.
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create pantry_items table
CREATE TABLE public.pantry_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity NUMERIC NOT NULL DEFAULT 1,
  unit TEXT,
  expiry_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.pantry_items ENABLE ROW LEVEL SECURITY;

-- Pantry items policies
CREATE POLICY "Users can view their own pantry items"
  ON public.pantry_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pantry items"
  ON public.pantry_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pantry items"
  ON public.pantry_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pantry items"
  ON public.pantry_items FOR DELETE
  USING (auth.uid() = user_id);

-- Create shopping_list table
CREATE TABLE public.shopping_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  quantity TEXT,
  checked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.shopping_list ENABLE ROW LEVEL SECURITY;

-- Shopping list policies
CREATE POLICY "Users can view their own shopping list"
  ON public.shopping_list FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert items to their shopping list"
  ON public.shopping_list FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shopping list"
  ON public.shopping_list FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete items from their shopping list"
  ON public.shopping_list FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to update updated_at on pantry_items
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_pantry_item_updated
  BEFORE UPDATE ON public.pantry_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();