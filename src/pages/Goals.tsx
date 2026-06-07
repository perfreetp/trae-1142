import { Target, Timer, Repeat } from 'lucide-react';
import Header from '@/components/Header';
import { goals } from '@/mock';
import type { Goal } from '@/mock';

const typeConfig: Record<Goal['type'], { icon: typeof Target; color: string }> = {
  distance: { icon: Target, color: 'text-brand-cyan' },
  pace: { icon: Timer, color: 'text-brand-green' },
  frequency: { icon: Repeat, color: 'text-brand-orange' },
};

export default function Goals() {
  const userGoals = goals.filter((g) => g.userId === 'm1');

  return (
    <div className="page-content">
      <Header title="个人目标" showBack />

      <div className="space-y-4">
        {userGoals.map((goal) => {
          const config = typeConfig[goal.type];
          const Icon = config.icon;
          const progress = Math.min((goal.current / goal.target) * 100, 100);

          return (
            <div key={goal.id} className="brand-card">
              <div className="flex items-center gap-3 mb-3">
                <div className={`${config.color} p-2 rounded-xl bg-brand-deeper`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <div className="text-white font-semibold">{goal.label}</div>
                  <div className="text-xs text-brand-gray">截止 {goal.deadline}</div>
                </div>
                <div className="text-right">
                  <span className="text-brand-cyan font-display font-bold">{goal.current}</span>
                  <span className="text-brand-gray"> / {goal.target} {goal.unit}</span>
                </div>
              </div>

              <div className="h-2 bg-brand-deeper rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-cyan to-brand-green transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex justify-between mt-2">
                <span className="text-xs text-brand-gray">进度 {Math.round(progress)}%</span>
                <span className="text-xs text-brand-gray">
                  剩余 {(goal.target - goal.current).toFixed(1)} {goal.unit}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
