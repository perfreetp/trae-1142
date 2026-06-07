import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StickyNote, ClipboardCheck } from 'lucide-react';
import { useUserStore, useTrainingStore } from '@/stores';
import { cn } from '@/lib/utils';
import Header from '@/components/Header';
import { Link } from 'react-router-dom';

const rpeDescriptions: Record<number, string> = {
  1: '非常轻松', 2: '很轻松', 3: '轻松', 4: '较轻松', 5: '适中',
  6: '稍吃力', 7: '吃力', 8: '很吃力', 9: '非常吃力', 10: '极限',
};

function getFatigueColor(value: number): string {
  if (value <= 3) return 'text-brand-green';
  if (value <= 6) return 'text-brand-orange';
  return 'text-brand-red';
}

function getFatigueBg(value: number): string {
  if (value <= 3) return 'bg-brand-green/10 border-brand-green/20';
  if (value <= 6) return 'bg-brand-orange/10 border-brand-orange/20';
  return 'bg-brand-red/10 border-brand-red/20';
}

export default function Fatigue() {
  const navigate = useNavigate();
  const { currentUser } = useUserStore();
  const { selectedDate, updateRecord, upsertRecord, getRecordByDate, getPlansByDate } = useTrainingStore();

  const existingRecord = getRecordByDate(currentUser.id, selectedDate);
  const todayPlan = getPlansByDate(selectedDate)[0];

  const [rpe, setRpe] = useState(existingRecord?.fatigue || 5);
  const [note, setNote] = useState(existingRecord?.note || '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (existingRecord) {
      setRpe(existingRecord.fatigue || 5);
      setNote(existingRecord.note || '');
    }
  }, [existingRecord]);

  const handleSubmit = () => {
    if (existingRecord) {
      updateRecord(existingRecord.id, { fatigue: rpe, note });
    } else {
      upsertRecord({
        id: `r-${Date.now()}`,
        userId: currentUser.id,
        planId: todayPlan?.id ?? '',
        date: selectedDate,
        distance: 0,
        duration: 0,
        pace: 0,
        avgHR: 0,
        heartRateZones: { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 },
        fatigue: rpe,
        note,
        checkedIn: false,
        completed: false,
      });
    }
    setSaved(true);
    setTimeout(() => {
      navigate(-1);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header title="疲劳自评" showBack />

      <div className="page-content space-y-6">
        {todayPlan && (
          <div className="brand-card animate-slide-up">
            <div className="flex items-center gap-2 mb-2">
              <ClipboardCheck className="w-4 h-4 text-brand-cyan" />
              <span className="text-sm font-medium text-white">当天计划</span>
            </div>
            <p className="text-sm text-brand-gray">{todayPlan.title} · {todayPlan.targetDistance}km</p>
            {existingRecord && existingRecord.fatigue > 0 && (
              <p className="text-[10px] text-brand-cyan mt-1">已有评分 RPE {existingRecord.fatigue}/10，修改后覆盖</p>
            )}
          </div>
        )}

        <div className="flex flex-col items-center py-6 animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <div className={cn('w-28 h-28 rounded-full flex items-center justify-center border-2 transition-all duration-300', getFatigueBg(rpe))}>
            <span className={cn('font-display text-5xl font-bold transition-colors duration-300', getFatigueColor(rpe))}>{rpe}</span>
          </div>
          <p className={cn('mt-3 font-display text-lg font-semibold transition-colors duration-300', getFatigueColor(rpe))}>{rpeDescriptions[rpe]}</p>
          <p className="text-sm text-brand-gray mt-1">RPE 主观疲劳量表</p>
        </div>

        <div className="brand-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="section-title text-base mb-4">疲劳等级</h3>
          <div className="relative">
            <div className="h-3 rounded-full overflow-hidden mb-2">
              <div className="h-full rounded-full" style={{ background: 'linear-gradient(to right, #10B981, #22D3EE, #F97316, #EF4444)' }} />
            </div>
            <input type="range" min="1" max="10" value={rpe} onChange={(e) => setRpe(parseInt(e.target.value))} className="w-full absolute top-0 left-0 opacity-0 cursor-pointer h-3" />
            <div className="flex justify-between">
              {Array.from({ length: 10 }, (_, i) => (
                <button key={i} onClick={() => setRpe(i + 1)} className={cn('w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition-all', rpe === i + 1 ? 'scale-110 ring-2 ring-white/50' : 'opacity-40 hover:opacity-70', i + 1 <= 3 ? 'bg-brand-green text-white' : i + 1 <= 6 ? 'bg-brand-orange text-white' : 'bg-brand-red text-white')}>
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="brand-card animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <h3 className="section-title text-base mb-3">等级说明</h3>
          <div className="space-y-2">
            {[
              { value: 1, label: '非常轻松', color: 'bg-brand-green' },
              { value: 3, label: '轻松', color: 'bg-brand-green' },
              { value: 5, label: '适中', color: 'bg-brand-orange' },
              { value: 7, label: '吃力', color: 'bg-brand-orange' },
              { value: 9, label: '非常吃力', color: 'bg-brand-red' },
              { value: 10, label: '极限', color: 'bg-brand-red' },
            ].map(({ value, label, color }) => (
              <div key={value} className="flex items-center gap-3">
                <div className={cn('w-3 h-3 rounded-full', color)} />
                <span className="text-sm text-brand-gray-light">{value} - {label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="brand-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <label className="flex items-center gap-1.5 text-xs text-brand-gray mb-1.5">
            <StickyNote className="w-3.5 h-3.5" />补充说明
          </label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="记录身体感受、不适部位等..." rows={3} className="brand-input w-full resize-none" />
        </div>

        <button onClick={handleSubmit} className={cn('brand-btn w-full', saved && 'opacity-60')}>
          {saved ? '已保存' : existingRecord?.fatigue ? '保存修改' : '提交评估'}
        </button>
      </div>
    </div>
  );
}
