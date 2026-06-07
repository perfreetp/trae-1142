interface PaceDisplayProps {
  pace: number;
}

export default function PaceDisplay({ pace }: PaceDisplayProps) {
  const minutes = Math.floor(pace / 60);
  const seconds = pace % 60;

  return (
    <div className="flex items-baseline gap-0.5 font-display">
      <span className="text-4xl font-bold text-white">{String(minutes).padStart(2, '0')}</span>
      <span className="text-4xl font-bold text-brand-cyan">:</span>
      <span className="text-4xl font-bold text-white">{String(seconds).padStart(2, '0')}</span>
      <span className="ml-1 text-sm text-brand-gray">/km</span>
    </div>
  );
}
