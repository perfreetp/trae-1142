import { Home, Dumbbell, Users, Map, BarChart3 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const tabs = [
  { path: '/', label: '首页', icon: Home },
  { path: '/training', label: '训练', icon: Dumbbell },
  { path: '/team', label: '队伍', icon: Users },
  { path: '/routes', label: '路线', icon: Map },
  { path: '/data', label: '数据', icon: BarChart3 },
] as const;

export default function TabBar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-brand-deeper border-t border-brand-border/50">
      <div className="app-container flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const isActive = tab.path === '/' 
            ? location.pathname === '/' 
            : location.pathname.startsWith(tab.path);
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all',
                isActive
                  ? 'bg-gradient-brand shadow-glow'
                  : 'text-brand-gray hover:text-brand-gray-light'
              )}
            >
              <Icon size={20} className={cn(isActive && 'text-white')} />
              <span
                className={cn(
                  'text-[10px] font-medium',
                  isActive ? 'text-white' : 'text-brand-gray'
                )}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
