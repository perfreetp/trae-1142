import { useState } from 'react';
import { MapPin, Calendar, UserPlus, UserMinus, Plus, X, Users, UserX } from 'lucide-react';
import Header from '@/components/Header';
import { useTeamStore, useUserStore } from '@/stores';
import type { Activity } from '@/mock/data';

export default function Activity() {
  const { activities, joinActivity, leaveActivity, addActivity, users } = useTeamStore();
  const { currentUser, role } = useUserStore();
  const isCoach = role === 'coach';

  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [actDate, setActDate] = useState('');
  const [location, setLocation] = useState('');
  const [maxP, setMaxP] = useState('');

  const handleCreate = () => {
    if (!title || !actDate || !location || !maxP) return;
    const newActivity: Activity = {
      id: `a_${Date.now()}`,
      title,
      date: actDate,
      location,
      maxParticipants: Number(maxP),
      participants: [],
    };
    addActivity(newActivity);
    setTitle('');
    setActDate('');
    setLocation('');
    setMaxP('');
    setShowCreate(false);
  };

  const getUserName = (userId: string) => {
    return users.find((u) => u.id === userId)?.name ?? userId;
  };

  const handleRemoveParticipant = (activityId: string, userId: string) => {
    leaveActivity(activityId, userId);
  };

  return (
    <div>
      <Header title="活动报名" showBack />

      <div className="page-content space-y-4">
        {isCoach && (
          <button onClick={() => setShowCreate(!showCreate)} className="brand-btn-outline flex items-center gap-2 text-sm w-full justify-center">
            {showCreate ? <X size={16} /> : <Plus size={16} />}
            {showCreate ? '取消创建' : '创建活动'}
          </button>
        )}

        {isCoach && showCreate && (
          <div className="brand-card space-y-4 animate-slide-up">
            <h2 className="section-title text-base">新建活动</h2>
            <div>
              <label className="text-brand-gray text-xs mb-1 block">活动名称</label>
              <input type="text" placeholder="输入活动名称" value={title} onChange={(e) => setTitle(e.target.value)} className="brand-input w-full" />
            </div>
            <div>
              <label className="text-brand-gray text-xs mb-1 block">活动日期</label>
              <input type="date" value={actDate} onChange={(e) => setActDate(e.target.value)} className="brand-input w-full" />
            </div>
            <div>
              <label className="text-brand-gray text-xs mb-1 block">活动地点</label>
              <input type="text" placeholder="输入活动地点" value={location} onChange={(e) => setLocation(e.target.value)} className="brand-input w-full" />
            </div>
            <div>
              <label className="text-brand-gray text-xs mb-1 block">最大人数</label>
              <input type="number" placeholder="20" value={maxP} onChange={(e) => setMaxP(e.target.value)} className="brand-input w-full" />
            </div>
            <button onClick={handleCreate} disabled={!title || !actDate || !location || !maxP} className="brand-btn w-full">发布活动</button>
          </div>
        )}

        <div className="space-y-4">
          {activities.map((act) => {
            const joined = act.participants.includes(currentUser.id);
            const isFull = act.participants.length >= act.maxParticipants;
            const fillPct = act.maxParticipants > 0
              ? Math.round((act.participants.length / act.maxParticipants) * 100)
              : 0;
            const remaining = act.maxParticipants - act.participants.length;

            return (
              <div key={act.id} className="brand-card space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-white font-semibold text-sm">{act.title}</h3>
                  {!isCoach && (
                    joined ? (
                      <button onClick={() => leaveActivity(act.id, currentUser.id)} className="flex items-center gap-1 text-xs px-3 py-1 rounded-full font-semibold bg-brand-red/20 text-brand-red hover:bg-brand-red/30 transition-colors whitespace-nowrap">
                        <UserMinus size={12} />取消报名
                      </button>
                    ) : isFull ? (
                      <span className="text-xs px-3 py-1 rounded-full font-semibold bg-brand-gray/20 text-brand-gray whitespace-nowrap">已满</span>
                    ) : (
                      <button onClick={() => joinActivity(act.id, currentUser.id)} className="flex items-center gap-1 text-xs px-3 py-1 rounded-full font-semibold bg-brand-cyan/20 text-brand-cyan hover:bg-brand-cyan/30 transition-colors whitespace-nowrap">
                        <UserPlus size={12} />报名
                      </button>
                    )
                  )}
                </div>

                <div className="flex items-center gap-4 text-brand-gray text-xs">
                  <span className="flex items-center gap-1"><Calendar size={12} />{act.date}</span>
                  <span className="flex items-center gap-1"><MapPin size={12} />{act.location}</span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-brand-gray">{act.participants.length} / {act.maxParticipants} 人</span>
                    <div className="flex items-center gap-2">
                      <span className="text-brand-cyan">{fillPct}%</span>
                      {isCoach && <span className="text-brand-green">剩余 {remaining} 名额</span>}
                    </div>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-brand-deeper overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-brand transition-all" style={{ width: `${fillPct}%` }} />
                  </div>
                </div>

                {act.participants.length > 0 && (
                  <div className="pt-2 border-t border-brand-border">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Users className="w-3.5 h-3.5 text-brand-gray" />
                      <span className="text-xs text-brand-gray">报名名单</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {act.participants.map((pId) => (
                        <div key={pId} className="flex items-center gap-1">
                          <span className="text-xs px-2.5 py-1 rounded-full bg-brand-deeper text-brand-gray-light">
                            {getUserName(pId)}
                          </span>
                          {isCoach && (
                            <button
                              onClick={() => handleRemoveParticipant(act.id, pId)}
                              className="w-5 h-5 rounded-full bg-brand-red/10 flex items-center justify-center hover:bg-brand-red/20 transition-colors"
                              title={`移出${getUserName(pId)}`}
                            >
                              <UserX size={10} className="text-brand-red" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
