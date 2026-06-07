import { useState, useMemo } from 'react';
import { Check, Flame, Trophy, MapPin, Clock } from 'lucide-react';
import { useUserStore, useTrainingStore } from '@/stores';
import { cn } from '@/lib/utils';
import Header from '@/components/Header';
import PaceDisplay from '@/components/PaceDisplay';

export default function CheckIn() {
  const { currentUser } = useUserStore();
  const { selectedDate, selectedPlanId, records, checkIn, upsertRecord, getRecordsByUser, getRecordByPlanAndUser, getPlansByDate } = useTrainingStore();
  const [justCheckedIn, setJustCheckedIn] = useState(false);
  const [animating, setAnimating] = useState(false);

  const todayPlans = getPlansByDate(selectedDate);
  const activePlanId = selectedPlanId ?? todayPlans[0]?.id ?? '';
  const todayRecord = getRecordByPlanAndUser(activePlanId, currentUser.id);
  const isCheckedIn = todayRecord?.checkedIn ?? false;

  const userRecords = getRecordsByUser(currentUser.id);

  const consecutiveDays = useMemo(() => {
    const sortedRecords = [...userRecords]
      .filter((r) => r.checkedIn)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let count = 0;
    const checkDate = new Date(selectedDate);

    for (const record of sortedRecords) {
      const recordDate = new Date(record.date);
      const diffDays = Math.floor(
        (checkDate.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === count) {
        count++;
      } else {
        break;
      }
    }

    return count;
  }, [userRecords, selectedDate]);

  const todayPlan = todayPlans.find(p => p.id === activePlanId);

  const handleCheckIn = () => {
    if (isCheckedIn || animating) return;

    setAnimating(true);

    if (todayRecord) {
      checkIn(todayRecord.id);
    } else if (activePlanId) {
      upsertRecord({
        id: `r-${Date.now()}`,
        userId: currentUser.id,
        planId: activePlanId,
        date: selectedDate,
        distance: 0,
        duration: 0,
        pace: 0,
        avgHR: 0,
        heartRateZones: { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 },
        fatigue: 0,
        note: '',
        checkedIn: true,
        completed: false,
      });
    }

    setTimeout(() => {
      setJustCheckedIn(true);
      setAnimating(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header title="打卡签到" showBack />

      <div className="page-content space-y-6">
        {todayPlan && (
          <div className="brand-card animate-slide-up">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-brand-cyan" />
              <span className="text-sm font-medium text-white">{todayPlan.title}</span>
            </div>
            <p className="text-xs text-brand-gray">{todayPlan.targetDistance}km · {todayPlan.mainSession}</p>
          </div>
        )}

        <div className="flex flex-col items-center py-8 animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <button
            onClick={handleCheckIn}
            disabled={isCheckedIn}
            className={cn(
              'w-[120px] h-[120px] rounded-full flex items-center justify-center transition-all duration-300',
              isCheckedIn
                ? 'bg-gradient-brand shadow-glow-green'
                : 'bg-brand-card border-2 border-brand-cyan/50 hover:border-brand-cyan shadow-glow cursor-pointer',
              animating && 'scale-110',
              justCheckedIn && 'animate-scale-in',
            )}
          >
            {isCheckedIn ? (
              <Check className="w-12 h-12 text-white" strokeWidth={3} />
            ) : (
              <Flame className="w-12 h-12 text-brand-cyan" />
            )}
          </button>
          <p className={cn(
            'mt-4 font-display font-bold text-lg',
            isCheckedIn ? 'text-brand-green' : 'text-white',
          )}>
            {isCheckedIn ? '已打卡' : '点击打卡'}
          </p>
          <p className="text-sm text-brand-gray mt-1">
            {isCheckedIn ? '今日训练已完成 ✓' : '完成训练后记得打卡哦'}
          </p>
        </div>

        <div className="brand-card flex items-center justify-around animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-col items-center">
            <Trophy className="w-6 h-6 text-brand-orange mb-1" />
            <span className="font-display text-2xl font-bold text-white">{consecutiveDays}</span>
            <span className="text-[10px] text-brand-gray">连续打卡</span>
          </div>
          <div className="w-px h-10 bg-brand-border" />
          <div className="flex flex-col items-center">
            <Flame className="w-6 h-6 text-brand-cyan mb-1" />
            <span className="font-display text-2xl font-bold text-white">
              {userRecords.filter((r) => r.checkedIn).length}
            </span>
            <span className="text-[10px] text-brand-gray">累计打卡</span>
          </div>
        </div>

        {todayRecord && todayRecord.distance > 0 && (
          <div className="brand-card animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <h3 className="section-title text-base mb-3">今日训练</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center p-3 bg-brand-deeper rounded-xl">
                <MapPin className="w-4 h-4 text-brand-cyan mb-1" />
                <span className="font-display font-bold text-white">{todayRecord.distance}km</span>
                <span className="text-[10px] text-brand-gray">距离</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-brand-deeper rounded-xl">
                <Clock className="w-4 h-4 text-brand-green mb-1" />
                <span className="font-display font-bold text-white">{todayRecord.duration}min</span>
                <span className="text-[10px] text-brand-gray">用时</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-brand-deeper rounded-xl">
                <Flame className="w-4 h-4 text-brand-orange mb-1" />
                <PaceDisplay pace={todayRecord.pace} />
                <span className="text-[10px] text-brand-gray">配速</span>
              </div>
            </div>
          </div>
        )}

        {justCheckedIn && (
          <div className="brand-card border-brand-green/30 bg-brand-green/5 animate-scale-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-green/20 flex items-center justify-center">
                <Check className="w-5 h-5 text-brand-green" />
              </div>
              <div>
                <p className="text-brand-green font-semibold">打卡成功！</p>
                <p className="text-xs text-brand-gray mt-0.5">
                  连续打卡 {consecutiveDays} 天，继续加油！
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
