import { useState } from 'react';
import Header from '@/components/Header';
import { useUserStore, useTrainingStore } from '@/stores';

export default function ProfileExport() {
  const { currentUser } = useUserStore();
  const { records, plans } = useTrainingStore();
  const [exported, setExported] = useState(false);

  const userRecords = records.filter((r) => r.userId === currentUser.id);

  const handleExport = () => {
    const data = {
      user: currentUser.name,
      exportDate: new Date().toISOString().split('T')[0],
      trainingRecords: userRecords.map((r) => ({
        date: r.date,
        distance: r.distance,
        duration: r.duration,
        pace: r.pace,
        avgHR: r.avgHR,
        fatigue: r.fatigue,
        checkedIn: r.checkedIn,
      })),
      totalPlans: plans.length,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `training_data_${currentUser.name}_${data.exportDate}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  return (
    <div className="page-content">
      <Header title="数据导出" showBack />

      <div className="brand-card mb-4">
        <h3 className="section-title text-sm mb-3">导出概览</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-brand-deeper rounded-xl p-3 text-center">
            <div className="text-xl font-display font-bold text-brand-cyan">{userRecords.length}</div>
            <div className="text-xs text-brand-gray mt-1">训练记录</div>
          </div>
          <div className="bg-brand-deeper rounded-xl p-3 text-center">
            <div className="text-xl font-display font-bold text-brand-green">{plans.length}</div>
            <div className="text-xs text-brand-gray mt-1">训练计划</div>
          </div>
        </div>
      </div>

      <div className="brand-card mb-4">
        <h3 className="section-title text-sm mb-2">导出格式</h3>
        <div className="flex items-center gap-3 p-3 bg-brand-deeper rounded-xl">
          <div className="w-10 h-10 bg-brand-cyan/20 rounded-xl flex items-center justify-center">
            <span className="text-brand-cyan font-bold text-xs">JSON</span>
          </div>
          <div>
            <div className="text-white text-sm font-medium">JSON 格式</div>
            <div className="text-xs text-brand-gray">包含所有训练记录和计划数据</div>
          </div>
        </div>
      </div>

      <button onClick={handleExport} className="brand-btn w-full">
        {exported ? '导出成功' : '导出数据'}
      </button>
    </div>
  );
}
