import type { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  right?: ReactNode;
}

export default function Header({ title, showBack = false, right }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="relative">
      <div className="flex items-center gap-2 px-4 py-3">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-card hover:bg-brand-card-hover transition-colors"
          >
            <ChevronLeft size={20} className="text-brand-cyan" />
          </button>
        )}
        <h1 className={cn('text-lg font-bold text-white font-display', showBack && 'flex-1 text-center')}>
          {title}
        </h1>
        {right ? right : showBack ? <div className="w-8" /> : null}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-cyan to-transparent" />
    </div>
  );
}
