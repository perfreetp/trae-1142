import { Plus } from 'lucide-react';
import Header from '@/components/Header';
import { injuries } from '@/mock';

export default function InjuryPage() {
  const activeInjuries = injuries.filter((i) => i.status === 'active');
  const recoveredInjuries = injuries.filter((i) => i.status === 'recovered');

  return (
    <div className="page-content">
      <Header title="伤病提醒" showBack />

      {activeInjuries.length > 0 && (
        <div className="mb-6">
          <h3 className="section-title mb-3">进行中</h3>
          <div className="space-y-3">
            {activeInjuries.map((injury) => {
              const progress = (injury.daysPassed / injury.recoveryDays) * 100;
              const remaining = injury.recoveryDays - injury.daysPassed;

              return (
                <div key={injury.id} className="brand-card border-l-4 border-l-brand-red">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-white font-semibold">{injury.type}</div>
                      <div className="text-xs text-brand-gray mt-1">{injury.description}</div>
                    </div>
                    <span className="text-xs text-brand-red bg-brand-red/10 px-2 py-0.5 rounded-full">
                      恢复中
                    </span>
                  </div>

                  <div className="h-2 bg-brand-deeper rounded-full overflow-hidden mt-3">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-red to-brand-orange transition-all duration-700"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>

                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-brand-gray">
                      {injury.startDate} 开始
                    </span>
                    <span className="text-xs text-brand-orange">
                      预计还需 {remaining} 天
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {recoveredInjuries.length > 0 && (
        <div className="mb-6">
          <h3 className="section-title mb-3">已恢复</h3>
          <div className="space-y-3">
            {recoveredInjuries.map((injury) => (
              <div key={injury.id} className="brand-card border-l-4 border-l-brand-green">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-white font-semibold">{injury.type}</div>
                    <div className="text-xs text-brand-gray mt-1">{injury.description}</div>
                  </div>
                  <span className="text-xs text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-full">
                    已恢复
                  </span>
                </div>
                <div className="text-xs text-brand-gray mt-2">
                  {injury.startDate} ~ {injury.endDate}（共 {injury.recoveryDays} 天）
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button className="brand-btn-outline w-full flex items-center justify-center gap-2">
        <Plus size={16} />
        添加伤病记录
      </button>
    </div>
  );
}
