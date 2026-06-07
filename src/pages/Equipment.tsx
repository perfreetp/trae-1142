import { Footprints, Watch, Shirt, AlertTriangle } from 'lucide-react';
import Header from '@/components/Header';
import { equipment } from '@/mock';
import type { Equipment } from '@/mock';

const typeConfig: Record<Equipment['type'], { icon: typeof Footprints; label: string }> = {
  shoes: { icon: Footprints, label: '跑鞋' },
  watch: { icon: Watch, label: '手表' },
  clothing: { icon: Shirt, label: '服装' },
  accessory: { icon: Watch, label: '配件' },
};

function getMileageColor(ratio: number): string {
  if (ratio > 0.8) return 'bg-brand-red';
  if (ratio > 0.6) return 'bg-brand-orange';
  return 'bg-brand-green';
}

function getMileageTextColor(ratio: number): string {
  if (ratio > 0.8) return 'text-brand-red';
  if (ratio > 0.6) return 'text-brand-orange';
  return 'text-brand-green';
}

export default function EquipmentPage() {
  return (
    <div className="page-content">
      <Header title="装备寿命" showBack />

      <div className="space-y-4">
        {equipment.map((item) => {
          const config = typeConfig[item.type];
          const Icon = config.icon;
          const hasMileage = item.maxMileage > 0;
          const ratio = hasMileage ? item.mileage / item.maxMileage : 0;
          const isNearingEnd = ratio > 0.8;

          return (
            <div key={item.id} className="brand-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-brand-cyan p-2 rounded-xl bg-brand-deeper">
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">{item.name}</span>
                    {isNearingEnd && hasMileage && (
                      <span className="flex items-center gap-1 text-brand-red text-xs bg-brand-red/10 px-2 py-0.5 rounded-full">
                        <AlertTriangle size={12} />
                        即将到期
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-brand-gray">
                    {item.brand} · {config.label} · {item.purchaseDate}
                  </div>
                </div>
              </div>

              {hasMileage ? (
                <>
                  <div className="h-2 bg-brand-deeper rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${getMileageColor(ratio)}`}
                      style={{ width: `${Math.min(ratio * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className={`text-xs font-medium ${getMileageTextColor(ratio)}`}>
                      {item.mileage} / {item.maxMileage} km
                    </span>
                    <span className="text-xs text-brand-gray">
                      剩余 {item.maxMileage - item.mileage} km
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-xs text-brand-gray">无需里程追踪</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
