import { Home, UtensilsCrossed, ChefHat, ShoppingCart, Clock, BarChart3, User, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: UtensilsCrossed, label: 'Pantry', path: '/pantry' },
  { icon: ChefHat, label: 'Recipes', path: '/recipes' },
  { icon: ShoppingCart, label: 'Shopping List', path: '/shopping' },
  { icon: Clock, label: 'Expiry Alerts', path: '/alerts' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export function Sidebar() {
  const { signOut } = useAuth();

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          <span className="text-2xl">🌿</span>
          Eco Pantry
        </h1>
        <p className="text-xs text-muted-foreground mt-1">Zero-Waste Living</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                'hover:bg-primary/10',
                isActive
                  ? 'bg-primary text-primary-foreground font-medium shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-4 py-3 rounded-xl w-full
                     text-muted-foreground hover:text-foreground hover:bg-destructive/10
                     transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}