import { Link } from 'react-router-dom';
import {
  ClipboardCheck,
  Battery,
  FileText,
  Shirt,
  BarChart3,
  Users,
  Bell,
  Flame,
  Dumbbell,
  Timer,
  MapPin,
} from 'lucide-react';
import { useUserStore, useTrainingStore, useNotificationStore } from '@/stores';
import { cn } from '@/lib/utils';
import ProgressRing from '@/components/ProgressRing';
import PaceDisplay from '@/components/PaceDisplay';

const TODAY = '2026-06-08';

const typeLabels: Record<string, string> = {
  easy: '轻松跑',
  interval: '间歇',
  long: '长距离',
  tempo: '节奏跑',
  recovery: '恢复跑',
  speed: '速度',
  fartlek: '法特莱克',
};

const typeColors: Record<string, string> = {
  easy: 'bg-brand-green/20 text-brand-green',
  interval: 'bg-brand-red/20 text-brand-red',
  long: 'bg-brand-cyan/20 text-brand-cyan',
  tempo: 'bg-brand-orange/20 text-brand-orange',
  recovery: 'bg-brand-green/20 text-brand-green',
  speed: 'bg-brand-red/20 text-brand-red',
  fartlek: 'bg-brand-orange/20 text-brand-orange',
};

const quickAccess = [
  { label: '训练打卡', icon: ClipboardCheck, path: '/training/checkin', color: 'text-brand-green' },
  { label: '疲劳自评', icon: Battery, path: '/training/fatigue', color: 'text-brand-orange' },
  { label: '请假报备', icon: FileText, path: '/team/leave', color: 'text-brand-cyan' },
  { label: '装备检查', icon: Shirt, path: '/data/equipment', color: 'text-purple-400' },
  { label: '赛前测评', icon: BarChart3, path: '/data/assessment', color: 'text-brand-red' },
  { label: '活动报名', icon: Users, path: '/team/activity', color: 'text-yellow-400' },
];

const notificationIcons: Record<string, typeof Bell> = {
  training: Timer,
  activity: MapPin,
  leave: FileText,
  system: Bell,
};

export default function Home() {
  const { currentUser, role } = useUserStore();
  const { plans, getPlansByDate, getCompletionRate } = useTrainingStore();
  const { notifications } = useNotificationStore();

  const todayPlans = getPlansByDate(TODAY);
  const todayPlan = todayPlans[0];

  const weekStart = new Date('2026-06-08');
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });
  const weekPlans = weekDates.flatMap((d) => getPlansByDate(d));
  const weekCompletion = weekPlans.length > 0
    ? Math.round(weekPlans.reduce((sum, p) => sum + getCompletionRate(p.id), 0) / weekPlans.length)
    : 0;

  const recentNotifications = [...notifications]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date('2026-06-08T18:30:00');
    const diff = Math.floor((now.getTime() - d.getTime()) / 60000);
    if (diff < 60) return `${diff}分钟前`;
    if (diff < 1440) return `${Math.floor(diff / 60)}小时前`;
    return `${Math.floor(diff / 1440)}天前`;
  };

  return (
    <div className="page-content space-y-6">
      <div className="animate-slide-up">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-brand flex items-center justify-center">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-white">
              你好, {currentUser.name}
            </h2>
            <span className={cn(
              'inline-block mt-0.5 text-xs px-2 py-0.5 rounded-full font-medium',
              role === 'coach'
                ? 'bg-brand-orange/20 text-brand-orange'
                : 'bg-brand-cyan/20 text-brand-cyan'
            )}>
              {role === 'coach' ? '教练' : '队员'}
            </span>
          </div>
        </div>
      </div>

      {todayPlan && (
        <Link to="/training" className="block animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <div className="brand-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="section-title text-base">今日训练</h3>
              <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', typeColors[todayPlan.type])}>
                {typeLabels[todayPlan.type]}
              </span>
            </div>
            <h4 className="text-white font-semibold mb-2">{todayPlan.title}</h4>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-gray" />
                <span className="text-brand-gray-light">{todayPlan.targetDistance}km</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5 text-brand-gray" />
                <PaceDisplay pace={todayPlan.targetPace} />
              </div>
              <div className="flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5 text-brand-gray" />
                <span className="text-brand-gray-light">{todayPlan.heartRateZone}</span>
              </div>
            </div>
          </div>
        </Link>
      )}

      <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <h3 className="section-title mb-3">快捷入口</h3>
        <div className="grid grid-cols-3 gap-3">
          {quickAccess.map(({ label, icon: Icon, path, color }) => (
            <Link
              key={path}
              to={path}
              className="brand-card flex flex-col items-center gap-2 py-4 hover:scale-[1.02] active:scale-95"
            >
              <Icon className={cn('w-6 h-6', color)} />
              <span className="text-xs text-brand-gray-light">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
        <h3 className="section-title mb-3">本周进度</h3>
        <div className="brand-card flex items-center gap-5">
          <ProgressRing percentage={weekCompletion} size={90} strokeWidth={7} label="完成率" />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-brand-gray">训练计划</span>
              <span className="text-white font-medium">{weekPlans.length} 个</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-brand-gray">本周天数</span>
              <span className="text-white font-medium">7 天</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-brand-gray">整体完成</span>
              <span className="text-brand-green font-medium">{weekCompletion}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="section-title">最新通知</h3>
          <Link to="/notifications" className="text-xs text-brand-cyan">查看全部</Link>
        </div>
        <div className="space-y-2">
          {recentNotifications.map((n) => {
            const Icon = notificationIcons[n.type] || Bell;
            return (
              <div key={n.id} className="brand-card flex items-start gap-3 py-3">
                {!n.read && <div className="w-2 h-2 rounded-full bg-brand-cyan mt-1.5 shrink-0" />}
                <Icon className={cn('w-4 h-4 shrink-0 mt-0.5', n.read ? 'text-brand-gray' : 'text-brand-cyan')} />
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm truncate', n.read ? 'text-brand-gray' : 'text-white font-medium')}>
                    {n.title}
                  </p>
                  <p className="text-xs text-brand-gray mt-0.5 truncate">{n.message}</p>
                </div>
                <span className="text-[10px] text-brand-gray shrink-0">{formatTime(n.createdAt)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
