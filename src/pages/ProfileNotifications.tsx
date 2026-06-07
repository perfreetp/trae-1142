import { useState } from 'react';
import Header from '@/components/Header';

const items = [
  { key: 'training', label: '训练提醒', desc: '每日训练计划推送通知' },
  { key: 'activity', label: '活动通知', desc: '队内活动报名与变更提醒' },
  { key: 'leave', label: '请假审批', desc: '队员请假申请通知（教练）' },
  { key: 'equipment', label: '装备提醒', desc: '装备里程到期更换提醒' },
  { key: 'injury', label: '伤病提醒', desc: '伤病康复周期提醒' },
  { key: 'system', label: '系统通知', desc: '版本更新与公告通知' },
];

export default function ProfileNotifications() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    training: true,
    activity: true,
    leave: true,
    equipment: true,
    injury: true,
    system: false,
  });

  const toggle = (key: string) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="page-content">
      <Header title="通知偏好" showBack />

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.key} className="brand-card flex items-center justify-between">
            <div>
              <div className="text-white text-sm font-medium">{item.label}</div>
              <div className="text-xs text-brand-gray mt-0.5">{item.desc}</div>
            </div>
            <button
              onClick={() => toggle(item.key)}
              className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ml-3 ${
                prefs[item.key] ? 'bg-brand-cyan' : 'bg-brand-border'
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  prefs[item.key] ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
