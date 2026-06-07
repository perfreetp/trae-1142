import { useState } from 'react';
import { MapPin, Calendar, UserPlus, Plus } from 'lucide-react';
import Header from '@/components/Header';
import { useTeamStore, useUserStore } from '@/stores';

export default function Activity() {
  const { activities, joinActivity } = useTeamStore();
  const { currentUser, role } = useUserStore();
  const [showCreate, setShowCreate] = useState(false);
  const isCoach = role === 'coach';

  return (
    <div>
      <Header title="活动报名" showBack />

      <div className="page-content space-y-4">
        {isCoach && (
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="brand-btn-outline flex items-center gap-2 text-sm w-full justify-center"
          >
            <Plus size={16} />
            创建活动
          </button>
        )}

        {isCoach && showCreate && (
          <div className="brand-card space-y-4">
            <h2 className="section-title text-base">新建活动</h2>
            <div>
              <label className="text-brand-gray text-xs mb-1 block">活动名称</label>
              <input type="text" placeholder="输入活动名称" className="brand-input w-full" />
            </div>
            <div>
              <label className="text-brand-gray text-xs mb-1 block">活动日期</label>
              <input type="date" className="brand-input w-full" />
            </div>
            <div>
              <label className="text-brand-gray text-xs mb-1 block">活动地点</label>
              <input type="text" placeholder="输入活动地点" className="brand-input w-full" />
            </div>
            <div>
              <label className="text-brand-gray text-xs mb-1 block">最大人数</label>
              <input type="number" placeholder="20" className="brand-input w-full" />
            </div>
            <button className="brand-btn w-full">发布活动</button>
          </div>
        )}

        <div className="space-y-4">
          {activities.map((act) => {
            const joined = act.participants.includes(currentUser.id);
            const fillPct = Math.round((act.participants.length / act.maxParticipants) * 100);

            return (
              <div key={act.id} className="brand-card space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-white font-semibold text-sm">{act.title}</h3>
                  {joined ? (
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-brand-green/20 text-brand-green whitespace-nowrap">
                      已报名
                    </span>
                  ) : (
                    <button
                      onClick={() => joinActivity(act.id, currentUser.id)}
                      className="flex items-center gap-1 text-xs px-3 py-1 rounded-full font-semibold bg-brand-cyan/20 text-brand-cyan hover:bg-brand-cyan/30 transition-colors whitespace-nowrap"
                    >
                      <UserPlus size={12} />
                      报名
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-4 text-brand-gray text-xs">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {act.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {act.location}
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-brand-gray">
                      {act.participants.length} / {act.maxParticipants} 人
                    </span>
                    <span className="text-brand-cyan">{fillPct}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-brand-deeper overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-brand transition-all"
                      style={{ width: `${fillPct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
