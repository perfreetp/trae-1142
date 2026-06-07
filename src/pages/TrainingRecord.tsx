import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ruler, Clock, Heart, StickyNote } from 'lucide-react';
import { useUserStore, useTrainingStore } from '@/stores';
import Header from '@/components/Header';
import PaceDisplay from '@/components/PaceDisplay';
import HeartRateZones from '@/components/HeartRateZones';

export default function TrainingRecord() {
  const navigate = useNavigate();
  const { currentUser } = useUserStore();
  const { selectedDate, addRecord, getPlansByDate } = useTrainingStore();

  const todayPlans = getPlansByDate(selectedDate);
  const planId = todayPlans[0]?.id ?? '';

  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [avgHR, setAvgHR] = useState('');
  const [zones, setZones] = useState({ z1: 30, z2: 30, z3: 20, z4: 15, z5: 5 });
  const [fatigue, setFatigue] = useState(5);
  const [note, setNote] = useState('');

  const distNum = parseFloat(distance) || 0;
  const durNum = parseFloat(duration) || 0;
  const calculatedPace = distNum > 0 && durNum > 0 ? Math.round((durNum / distNum) * 60) : 0;

  const handleZoneChange = (key: keyof typeof zones, value: number) => {
    setZones((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (!distNum || !durNum) return;

    addRecord({
      id: `r-${Date.now()}`,
      userId: currentUser.id,
      planId,
      date: selectedDate,
      distance: distNum,
      duration: durNum,
      pace: calculatedPace,
      avgHR: parseInt(avgHR) || 0,
      heartRateZones: zones,
      fatigue,
      note,
      checkedIn: false,
      completed: true,
    });

    navigate(-1);
  };

  const fatigueColor = fatigue <= 3
    ? 'text-brand-green'
    : fatigue <= 6
      ? 'text-brand-orange'
      : 'text-brand-red';

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header title="训练记录" showBack />

      <div className="page-content space-y-5">
        <div className="brand-card animate-slide-up">
          <h3 className="section-title text-base mb-4">配速数据</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs text-brand-gray mb-1.5">
                <Ruler className="w-3.5 h-3.5" />
                距离 (km)
              </label>
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="0.0"
                step="0.1"
                min="0"
                className="brand-input w-full"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs text-brand-gray mb-1.5">
                <Clock className="w-3.5 h-3.5" />
                用时 (分钟)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="0"
                min="0"
                className="brand-input w-full"
              />
            </div>
          </div>
          {calculatedPace > 0 && (
            <div className="flex items-center justify-center gap-2 py-3 bg-brand-deeper rounded-xl">
              <span className="text-sm text-brand-gray">计算配速</span>
              <PaceDisplay pace={calculatedPace} />
              <span className="text-xs text-brand-gray">/km</span>
            </div>
          )}
        </div>

        <div className="brand-card animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <h3 className="section-title text-base mb-4">心率数据</h3>
          <div className="mb-4">
            <label className="flex items-center gap-1.5 text-xs text-brand-gray mb-1.5">
              <Heart className="w-3.5 h-3.5 text-brand-red" />
              平均心率 (bpm)
            </label>
            <input
              type="number"
              value={avgHR}
              onChange={(e) => setAvgHR(e.target.value)}
              placeholder="0"
              min="0"
              max="220"
              className="brand-input w-full"
            />
          </div>
          <HeartRateZones zones={zones} />
          <div className="grid grid-cols-5 gap-2 mt-3">
            {(['z1', 'z2', 'z3', 'z4', 'z5'] as const).map((key) => (
              <div key={key} className="text-center">
                <input
                  type="number"
                  value={zones[key]}
                  onChange={(e) => handleZoneChange(key, Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                  className="brand-input w-full text-center text-xs py-1.5 px-1"
                  min="0"
                  max="100"
                />
                <span className="text-[10px] text-brand-gray mt-1 block">{key.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="brand-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="section-title text-base mb-4">疲劳自评 (RPE)</h3>
          <div className="flex items-center justify-center mb-3">
            <span className={`font-display text-5xl font-bold ${fatigueColor}`}>{fatigue}</span>
            <span className="text-brand-gray text-sm ml-2">/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={fatigue}
            onChange={(e) => setFatigue(parseInt(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #10B981 0%, #F97316 60%, #EF4444 100%)`,
            }}
          />
          <div className="flex justify-between text-[10px] text-brand-gray mt-1">
            <span>非常轻松</span>
            <span>适中</span>
            <span>极限</span>
          </div>
        </div>

        <div className="brand-card animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <label className="flex items-center gap-1.5 text-xs text-brand-gray mb-1.5">
            <StickyNote className="w-3.5 h-3.5" />
            训练笔记
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="记录今天训练的感受..."
            rows={3}
            className="brand-input w-full resize-none"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={!distNum || !durNum}
          className="brand-btn w-full disabled:opacity-40 disabled:cursor-not-allowed"
        >
          保存记录
        </button>
      </div>
    </div>
  );
}
