import { Bell, User } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';
import TabBar from './TabBar';
import { useNotificationStore } from '@/stores';

export default function Layout() {
  const navigate = useNavigate();
  const unreadCount = useNotificationStore((s) => s.getUnreadCount());

  return (
    <div className="app-container min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 bg-brand-dark/80 backdrop-blur-md sticky top-0 z-40">
        <h1 className="text-xl font-bold font-display bg-gradient-to-r from-brand-cyan to-brand-green bg-clip-text text-transparent">
          智慧体育
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/notifications')}
            className="relative flex items-center justify-center w-9 h-9 rounded-full bg-brand-card hover:bg-brand-card-hover transition-colors"
          >
            <Bell size={18} className="text-brand-gray-light" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-orange rounded-full text-[10px] font-bold flex items-center justify-center text-white">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-brand-card hover:bg-brand-card-hover transition-colors"
          >
            <User size={18} className="text-brand-gray-light" />
          </button>
        </div>
      </header>

      <main className="flex-1 page-content">
        <Outlet />
      </main>

      <TabBar />
    </div>
  );
}
