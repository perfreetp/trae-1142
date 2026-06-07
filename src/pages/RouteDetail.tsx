import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, MapPin } from 'lucide-react';
import Header from '@/components/Header';
import { routes } from '@/mock/routes';
import type { RouteItem } from '@/mock/routes';
import { cn } from '@/lib/utils';

const DIFF_MAP: Record<RouteItem['difficulty'], { label: string; cls: string }> = {
  easy: { label: '简单', cls: 'bg-brand-green/20 text-brand-green' },
  medium: { label: '中等', cls: 'bg-brand-orange/20 text-brand-orange' },
  hard: { label: '困难', cls: 'bg-brand-red/20 text-brand-red' },
};

export default function RouteDetail() {
  const { id } = useParams<{ id: string }>();
  const route = routes.find((r) => r.id === id);
  const [favorited, setFavorited] = useState(route?.favorited ?? false);

  if (!route) {
    return (
      <div>
        <Header title="路线详情" showBack />
        <div className="page-content">
          <p className="text-brand-gray text-center py-12">路线不存在</p>
        </div>
      </div>
    );
  }

  const diff = DIFF_MAP[route.difficulty];

  return (
    <div>
      <Header title={route.name} showBack />

      <div className="page-content space-y-5">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-cyan/30 via-brand-green/20 to-brand-dark p-6">
          <div className="flex items-center justify-around mb-4">
            <div className="text-center">
              <p className="text-3xl font-display font-bold text-white">{route.distance}</p>
              <p className="text-brand-gray text-xs mt-1">公里</p>
            </div>
            <div className="w-px h-12 bg-brand-border/50" />
            <div className="text-center">
              <p className="text-3xl font-display font-bold text-white">{route.elevation}</p>
              <p className="text-brand-gray text-xs mt-1">海拔(m)</p>
            </div>
          </div>
          <span className={cn('inline-block text-xs px-3 py-1 rounded-full font-semibold', diff.cls)}>
            {diff.label}
          </span>
        </div>

        <p className="text-brand-gray-light text-sm leading-relaxed">{route.description}</p>

        <div className="flex flex-wrap gap-2">
          {route.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs bg-brand-card border border-brand-border/50 text-brand-cyan"
            >
              {tag}
            </span>
          ))}
        </div>

        <button
          onClick={() => setFavorited(!favorited)}
          className={cn(
            'brand-btn-outline w-full flex items-center justify-center gap-2',
            favorited && 'border-brand-red/50 text-brand-red hover:bg-brand-red/10'
          )}
        >
          <Heart size={16} className={favorited ? 'fill-brand-red' : ''} />
          {favorited ? '已收藏' : '收藏路线'}
        </button>

        <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-brand-deeper via-brand-card to-brand-dark h-48 relative border border-brand-border/30">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin size={32} className="text-brand-cyan mx-auto mb-2" />
              <p className="text-brand-gray text-xs">路线地图预览</p>
            </div>
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs text-brand-gray">
            <span>0 km</span>
            <span>{(route.distance / 2).toFixed(1)} km</span>
            <span>{route.distance} km</span>
          </div>
          <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-brand-cyan/30">
            <div
              className="h-full bg-gradient-to-r from-brand-cyan to-brand-green rounded-full"
              style={{ width: '75%' }}
            />
            <div className="absolute -top-1 left-0 w-2.5 h-2.5 rounded-full bg-brand-cyan" />
            <div className="absolute -top-1 right-0 w-2.5 h-2.5 rounded-full bg-brand-green" style={{ left: '75%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
