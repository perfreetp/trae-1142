import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Medal, CalendarPlus, Users } from 'lucide-react';
import Header from '@/components/Header';
import { useTeamStore, useUserStore } from '@/stores';
import { cn } from '@/lib/utils';

const AVATAR_COLORS = [
  'bg-brand-cyan',
  'bg-brand-green',
  'bg-brand-orange',
  'bg-purple-500',
  'bg-pink-500',
  'bg-yellow-500',
];

export default function Team() {
  const { groups, getMembersByGroup, getRankingByMonthlyDistance, leaveRequests, approveLeave, rejectLeave } = useTeamStore();
  const { role } = useUserStore();
  const [activeGroup, setActiveGroup] = useState(groups[0]?.id ?? '');

  const members = getMembersByGroup(activeGroup);
  const ranking = getRankingByMonthlyDistance();
  const pendingRequests = leaveRequests.filter((r) => r.status === 'pending');
  const isCoach = role === 'coach';

  return (
    <div>
      <Header title="我的队伍" />

      <div className="page-content space-y-6">
        <div className="flex gap-2">
          {groups.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveGroup(g.id)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-semibold transition-all',
                activeGroup === g.id
                  ? 'bg-gradient-brand text-white shadow-glow'
                  : 'bg-brand-card border border-brand-border/50 text-brand-gray hover:text-white'
              )}
            >
              {g.name}
            </button>
          ))}
        </div>

        <section>
          <h2 className="section-title mb-3 flex items-center gap-2">
            <Users size={18} className="text-brand-cyan" />
            队伍成员
          </h2>
          <div className="brand-card space-y-3">
            {members.map((m, i) => (
              <div key={m.id} className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold',
                    AVATAR_COLORS[i % AVATAR_COLORS.length]
                  )}
                >
                  {m.name.charAt(0)}
                </div>
                <span className="text-white text-sm flex-1">{m.name}</span>
                <span
                  className={cn(
                    'text-xs px-2 py-0.5 rounded-full',
                    m.role === 'coach'
                      ? 'bg-brand-orange/20 text-brand-orange'
                      : 'bg-brand-cyan/20 text-brand-cyan'
                  )}
                >
                  {m.role === 'coach' ? '教练' : '队员'}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-title mb-3 flex items-center gap-2">
            <Medal size={18} className="text-brand-orange" />
            月跑量排行
          </h2>

          {ranking.length >= 3 && (
            <div className="flex items-end justify-center gap-4 mb-4">
              {[1, 0, 2].map((idx) => {
                const r = ranking[idx];
                if (!r) return null;
                const isFirst = idx === 0;
                return (
                  <div
                    key={r.userId}
                    className={cn(
                      'flex flex-col items-center',
                      isFirst ? 'order-1' : idx === 1 ? 'order-0' : 'order-2'
                    )}
                  >
                    <span className="text-2xl mb-1">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                    </span>
                    <div
                      className={cn(
                        'w-14 rounded-t-lg flex flex-col items-center justify-end pt-2',
                        idx === 0
                          ? 'h-24 bg-yellow-500/20'
                          : idx === 1
                            ? 'h-20 bg-gray-400/20'
                            : 'h-16 bg-orange-700/20'
                      )}
                    >
                      <div
                        className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold mb-1',
                          AVATAR_COLORS[ranking.indexOf(r) % AVATAR_COLORS.length]
                        )}
                      >
                        {r.name.charAt(0)}
                      </div>
                      <span className="text-white text-xs font-semibold">{r.name}</span>
                      <span className="text-brand-gray text-[10px]">{r.distance.toFixed(1)}km</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="brand-card space-y-2">
            {ranking.map((r, i) => (
              <div key={r.userId} className="flex items-center gap-3 py-1">
                <span
                  className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                    i < 3
                      ? i === 0
                        ? 'bg-yellow-500/20 text-yellow-500'
                        : i === 1
                          ? 'bg-gray-400/20 text-gray-400'
                          : 'bg-orange-700/20 text-orange-400'
                      : 'bg-brand-card text-brand-gray'
                  )}
                >
                  {i + 1}
                </span>
                <span className="text-white text-sm flex-1">{r.name}</span>
                <span className="text-brand-cyan text-sm font-semibold">{r.distance.toFixed(1)} km</span>
              </div>
            ))}
          </div>
        </section>

        <div className="flex gap-3">
          <Link to="/team/leave" className="brand-btn-outline flex items-center gap-2 text-sm flex-1 justify-center">
            <CalendarPlus size={16} />
            请假报备
          </Link>
          <Link to="/team/activity" className="brand-btn flex items-center gap-2 text-sm flex-1 justify-center">
            <Users size={16} />
            活动报名
          </Link>
        </div>

        {isCoach && pendingRequests.length > 0 && (
          <section>
            <h2 className="section-title mb-3 text-brand-orange">待审批请假</h2>
            <div className="space-y-3">
              {pendingRequests.map((req) => {
                const user = useTeamStore.getState().users.find((u) => u.id === req.userId);
                return (
                  <div key={req.id} className="brand-card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm font-semibold">
                        {user?.name ?? req.userId}
                      </span>
                      <span className="text-brand-gray text-xs">{req.date}</span>
                    </div>
                    <p className="text-brand-gray text-xs mb-3">{req.reason}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveLeave(req.id)}
                        className="flex-1 py-1.5 rounded-full text-xs font-semibold bg-brand-green/20 text-brand-green hover:bg-brand-green/30 transition-colors"
                      >
                        通过
                      </button>
                      <button
                        onClick={() => rejectLeave(req.id)}
                        className="flex-1 py-1.5 rounded-full text-xs font-semibold bg-brand-red/20 text-brand-red hover:bg-brand-red/30 transition-colors"
                      >
                        拒绝
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
