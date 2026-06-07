import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mountain } from 'lucide-react';
import Header from '@/components/Header';
import { routes } from '@/mock/routes';
import type { RouteItem } from '@/mock/routes';
import { cn } from '@/lib/utils';

type FilterKey = 'all' | 'favorited' | 'easy' | 'medium' | 'hard';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'favorited', label: '收藏' },
  { key: 'easy', label: '简单' },
  { key: 'medium', label: '中等' },
  { key: 'hard', label: '困难' },
];

const DIFF_MAP: Record<RouteItem['difficulty'], { label: string; cls: string }> = {
  easy: { label: '简单', cls: 'bg-brand-green/20 text-brand-green' },
  medium: { label: '中等', cls: 'bg-brand-orange/20 text-brand-orange' },
  hard: { label: '困难', cls: 'bg-brand-red/20 text-brand-red' },
};

export default function Routes() {
  const [filter, setFilter] = useState<FilterKey>('all');

  const filtered = routes.filter((r) => {
    if (filter === 'all') return true;
    if (filter === 'favorited') return r.favorited;
    return r.difficulty === filter;
  });

  return (
    <div>
      <Header title="路线" />

      <div className="page-content space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all',
                filter === f.key
                  ? 'bg-gradient-brand text-white shadow-glow'
                  : 'bg-brand-card border border-brand-border/50 text-brand-gray hover:text-white'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((route) => (
            <Link
              key={route.id}
              to={`/routes/${route.id}`}
              className="brand-card flex items-center gap-4 block"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-cyan/20 to-brand-green/20 flex items-center justify-center flex-shrink-0">
                <Mountain size={22} className="text-brand-cyan" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-white text-sm font-semibold truncate">{route.name}</h3>
                  <Heart
                    size={16}
                    className={cn(
                      'flex-shrink-0 ml-2',
                      route.favorited ? 'text-brand-red fill-brand-red' : 'text-brand-gray'
                    )}
                  />
                </div>
                <div className="flex items-center gap-3 text-xs text-brand-gray">
                  <span>{route.distance} km</span>
                  <span>↑{route.elevation}m</span>
                  <span className={cn('px-2 py-0.5 rounded-full', DIFF_MAP[route.difficulty].cls)}>
                    {DIFF_MAP[route.difficulty].label}
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {filtered.length === 0 && (
            <p className="text-brand-gray text-sm text-center py-8">暂无符合条件的路线</p>
          )}
        </div>
      </div>
    </div>
  );
}
