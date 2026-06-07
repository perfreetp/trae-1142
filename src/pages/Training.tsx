import { Link } from 'react-router-dom';
import { CalendarDays, Dumbbell, Timer, Users, ArrowRight } from 'lucide-react';
import { useUserStore, useTrainingStore } from '@/stores';
import { cn } from '@/lib/utils';
import Header from '@/components/Header';
import PaceDisplay from '@/components/PaceDisplay';
import ProgressRing from '@/components/ProgressRing';

const TODAY = '2026-06-08';

const weekDays = ['一', '二', '三', '四', '五', '六', '日'];

const typeLabels: Record<string, string> = {
  easy: '轻松跑', interval: '间歇', long: '长距离',
  tempo: '节奏跑', recovery: '恢复跑', speed: '速度', fartlek: '法特莱克',
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

function getWeekDates(baseDate: string) {
  const base = new Date(baseDate);
  const dayOfWeek = base.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(base);
  monday.setDate(base.getDate() + mondayOffset);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split('T')[0];
  });
}

export default function Training() {
  const { role } = useUserStore();
  const { selectedDate, setSelectedDate, getPlansByDate, getCompletionRate } = useTrainingStore();

  const weekDates = getWeekDates(TODAY);
  const selectedPlans = getPlansByDate(selectedDate);
  const selectedPlan = selectedPlans[0];

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header title="训练计划" />

      <div className="page-content space-y-5">
        <div className="animate-slide-up">
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays className="w-4 h-4 text-brand-cyan" />
            <span className="text-sm text-brand-gray">本周训练日历</span>
          </div>
          <div className="flex gap-1.5">
            {weekDates.map((date, i) => {
              const plans = getPlansByDate(date);
              const isSelected = date === selectedDate;
              const isToday = date === TODAY;
              const dayNum = new Date(date).getDate();

              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={cn(
                    'flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl transition-all',
                    isSelected
                      ? 'bg-gradient-brand shadow-glow'
                      : 'bg-brand-card hover:bg-brand-card-hover',
                  )}
                >
                  <span className={cn(
                    'text-[10px] font-medium',
                    isSelected ? 'text-white/80' : 'text-brand-gray',
                  )}>
                    {weekDays[i]}
                  </span>
                  <span className={cn(
                    'text-sm font-bold',
                    isSelected ? 'text-white' : isToday ? 'text-brand-cyan' : 'text-white',
                  )}>
                    {dayNum}
                  </span>
                  {plans.length > 0 && (
                    <div className={cn(
                      'w-1.5 h-1.5 rounded-full',
                      isSelected ? 'bg-white' : 'bg-brand-green',
                    )} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {selectedPlan ? (
          <div className="animate-slide-up space-y-4" style={{ animationDelay: '0.05s' }}>
            <div className="brand-card">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display text-lg font-bold text-white">{selectedPlan.title}</h3>
                <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', typeColors[selectedPlan.type])}>
                  {typeLabels[selectedPlan.type]}
                </span>
              </div>
              <p className="text-sm text-brand-gray mb-4">{selectedPlan.description}</p>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-brand-deeper rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-brand-green/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs text-brand-green font-bold">热</span>
                  </div>
                  <div>
                    <p className="text-xs text-brand-gray mb-0.5">热身</p>
                    <p className="text-sm text-white">{selectedPlan.warmup}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-brand-deeper rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-brand-cyan/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs text-brand-cyan font-bold">主</span>
                  </div>
                  <div>
                    <p className="text-xs text-brand-gray mb-0.5">主训练</p>
                    <p className="text-sm text-white">{selectedPlan.mainSession}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-brand-deeper rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-brand-orange/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs text-brand-orange font-bold">冷</span>
                  </div>
                  <div>
                    <p className="text-xs text-brand-gray mb-0.5">放松</p>
                    <p className="text-sm text-white">{selectedPlan.cooldown}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="brand-card">
              <h4 className="text-sm font-medium text-brand-gray mb-3">训练目标</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-brand-cyan" />
                  <div>
                    <p className="text-[10px] text-brand-gray">目标配速</p>
                    <PaceDisplay pace={selectedPlan.targetPace} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-brand-orange" />
                  <div>
                    <p className="text-[10px] text-brand-gray">心率区间</p>
                    <span className="text-sm font-semibold text-brand-orange">{selectedPlan.heartRateZone}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-brand-green" />
                  <div>
                    <p className="text-[10px] text-brand-gray">目标距离</p>
                    <span className="text-sm font-semibold text-brand-green">{selectedPlan.targetDistance}km</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  <div>
                    <p className="text-[10px] text-brand-gray">训练对象</p>
                    <span className="text-sm font-semibold text-purple-400">{selectedPlan.targetGroup}</span>
                  </div>
                </div>
              </div>
            </div>

            {role === 'coach' && (
              <div className="brand-card flex items-center gap-4">
                <ProgressRing percentage={getCompletionRate(selectedPlan.id)} size={64} strokeWidth={6} />
                <div>
                  <p className="text-sm font-medium text-white">打卡完成率</p>
                  <p className="text-xs text-brand-gray mt-0.5">
                    已有 {getCompletionRate(selectedPlan.id)}% 队员完成打卡
                  </p>
                </div>
              </div>
            )}

            <Link
              to="/training/record"
              className="brand-btn flex items-center justify-center gap-2 w-full"
            >
              记录训练
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="animate-slide-up flex flex-col items-center justify-center py-16">
            <CalendarDays className="w-12 h-12 text-brand-gray/50 mb-3" />
            <p className="text-brand-gray text-sm">今日无训练安排</p>
            <p className="text-brand-gray/50 text-xs mt-1">享受休息日吧！</p>
          </div>
        )}
      </div>
    </div>
  );
}
