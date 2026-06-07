import { Bell, Calendar, FileText, Settings, Check } from 'lucide-react';
import Header from '@/components/Header';
import { useNotificationStore } from '@/stores';
import type { Notification } from '@/mock';

const typeConfig: Record<Notification['type'], { icon: typeof Bell; color: string }> = {
  training: { icon: Bell, color: 'text-brand-cyan' },
  activity: { icon: Calendar, color: 'text-brand-green' },
  leave: { icon: FileText, color: 'text-brand-orange' },
  system: { icon: Settings, color: 'text-purple-400' },
};

function getTimeGroup(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date('2026-06-08T23:59:59');
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '昨天';
  return '更早';
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

export default function Notifications() {
  const { notifications, markAsRead, markAllAsRead } = useNotificationStore();

  const sorted = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const groups: Record<string, typeof sorted> = {};
  for (const n of sorted) {
    const group = getTimeGroup(n.createdAt);
    if (!groups[group]) groups[group] = [];
    groups[group].push(n);
  }

  const groupOrder = ['今天', '昨天', '更早'];
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="page-content">
      <Header
        title="通知"
        right={
          unreadCount > 0 ? (
            <button onClick={markAllAsRead} className="text-sm text-brand-cyan hover:text-brand-green transition-colors">
              全部已读
            </button>
          ) : null
        }
      />

      <div className="space-y-6">
        {groupOrder.map((group) => {
          const items = groups[group];
          if (!items?.length) return null;

          return (
            <div key={group}>
              <div className="text-xs text-brand-gray mb-2 font-medium">{group}</div>
              <div className="space-y-2">
                {items.map((n) => {
                  const config = typeConfig[n.type];
                  const Icon = config.icon;

                  return (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`brand-card flex gap-3 cursor-pointer ${!n.read ? 'border-brand-cyan/30' : ''}`}
                    >
                      <div className={`${config.color} p-2 rounded-xl bg-brand-deeper h-fit`}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${!n.read ? 'text-white' : 'text-brand-gray-light'}`}>
                            {n.title}
                          </span>
                          {!n.read && (
                            <span className="w-2 h-2 rounded-full bg-brand-cyan flex-shrink-0" />
                          )}
                        </div>
                        <p className={`text-sm mt-1 truncate ${!n.read ? 'text-brand-gray-light' : 'text-brand-gray'}`}>
                          {n.message}
                        </p>
                        <span className="text-xs text-brand-gray mt-1 block">{formatTime(n.createdAt)}</span>
                      </div>
                      {n.read && (
                        <Check size={14} className="text-brand-gray flex-shrink-0 mt-1" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
