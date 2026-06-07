import { cn } from '@/lib/utils';

interface HeartRateZonesProps {
  zones: {
    z1: number;
    z2: number;
    z3: number;
    z4: number;
    z5: number;
  };
}

const zoneConfig = [
  { key: 'z1' as const, label: 'Z1', color: 'bg-brand-gray', textColor: 'text-brand-gray' },
  { key: 'z2' as const, label: 'Z2', color: 'bg-brand-cyan', textColor: 'text-brand-cyan' },
  { key: 'z3' as const, label: 'Z3', color: 'bg-brand-green', textColor: 'text-brand-green' },
  { key: 'z4' as const, label: 'Z4', color: 'bg-brand-orange', textColor: 'text-brand-orange' },
  { key: 'z5' as const, label: 'Z5', color: 'bg-brand-red', textColor: 'text-brand-red' },
];

export default function HeartRateZones({ zones }: HeartRateZonesProps) {
  const maxVal = Math.max(zones.z1, zones.z2, zones.z3, zones.z4, zones.z5, 1);

  return (
    <div className="flex flex-col gap-2">
      {zoneConfig.map(({ key, label, color, textColor }) => (
        <div key={key} className="flex items-center gap-3">
          <span className={cn('w-7 text-xs font-semibold font-display', textColor)}>
            {label}
          </span>
          <div className="flex-1 h-5 bg-brand-deeper rounded-full overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all duration-700 ease-out', color)}
              style={{ width: `${(zones[key] / maxVal) * 100}%` }}
            />
          </div>
          <span className="w-10 text-right text-xs font-medium text-brand-gray-light">
            {zones[key]}%
          </span>
        </div>
      ))}
    </div>
  );
}
