import { useState } from 'react';
import Header from '@/components/Header';

const defaultZones = [
  { name: 'Z1 轻松', min: 0, max: 125, color: 'bg-brand-gray' },
  { name: 'Z2 有氧', min: 126, max: 145, color: 'bg-brand-cyan' },
  { name: 'Z3 节奏', min: 146, max: 160, color: 'bg-brand-green' },
  { name: 'Z4 阈值', min: 161, max: 175, color: 'bg-brand-orange' },
  { name: 'Z5 极限', min: 176, max: 200, color: 'bg-brand-red' },
];

export default function ProfileHeartRate() {
  const [maxHR, setMaxHR] = useState('190');
  const [restHR, setRestHR] = useState('60');
  const [zones, setZones] = useState(defaultZones);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateZone = (index: number, field: 'min' | 'max', value: string) => {
    const newZones = [...zones];
    newZones[index] = { ...newZones[index], [field]: Number(value) };
    setZones(newZones);
  };

  return (
    <div className="page-content">
      <Header title="心率区间设置" showBack />

      <div className="brand-card mb-4">
        <h3 className="section-title text-sm mb-3">基础心率</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-brand-gray mb-1 block">最大心率 (bpm)</label>
            <input
              type="number"
              value={maxHR}
              onChange={(e) => setMaxHR(e.target.value)}
              className="brand-input w-full"
            />
          </div>
          <div>
            <label className="text-xs text-brand-gray mb-1 block">静息心率 (bpm)</label>
            <input
              type="number"
              value={restHR}
              onChange={(e) => setRestHR(e.target.value)}
              className="brand-input w-full"
            />
          </div>
        </div>
      </div>

      <div className="brand-card mb-4">
        <h3 className="section-title text-sm mb-3">自定义区间</h3>
        <div className="space-y-3">
          {zones.map((zone, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${zone.color} shrink-0`} />
              <span className="text-xs text-brand-gray w-16 shrink-0">{zone.name}</span>
              <input
                type="number"
                value={zone.min}
                onChange={(e) => updateZone(i, 'min', e.target.value)}
                className="brand-input flex-1 text-sm text-center"
              />
              <span className="text-brand-gray text-xs">—</span>
              <input
                type="number"
                value={zone.max}
                onChange={(e) => updateZone(i, 'max', e.target.value)}
                className="brand-input flex-1 text-sm text-center"
              />
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleSave} className="brand-btn w-full">
        {saved ? '保存成功' : '保存设置'}
      </button>
    </div>
  );
}
