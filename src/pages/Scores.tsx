import { useState, useMemo } from 'react';
import { Send, ChevronDown, ChevronUp, Trophy, TrendingUp, Filter } from 'lucide-react';
import Header from '@/components/Header';
import { useUserStore, useTeamStore } from '@/stores';
import { cn } from '@/lib/utils';
import type { Score } from '@/mock/data';

function formatMinPace(minutes: number) {
  const min = Math.floor(minutes);
  const sec = Math.round((minutes - min) * 60);
  return `${min}'${sec.toString().padStart(2, '0')}"`;
}

function formatTime(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = Math.floor(minutes % 60);
  const sec = Math.round((minutes % 1) * 60);
  if (h > 0) return `${h}h${m.toString().padStart(2, '0')}'${sec.toString().padStart(2, '0')}"`;
  return `${m}'${sec.toString().padStart(2, '0')}"`;
}

function getDistanceType(distance: number): string {
  if (distance <= 5) return '5K';
  if (distance <= 10) return '10K';
  if (distance <= 21.1) return '半马';
  if (distance <= 42.2) return '全马';
  return '其他';
}

const distanceTypes = ['全部', '5K', '10K', '半马', '全马', '其他'];

export default function Scores() {
  const { role, currentUser } = useUserStore();
  const { scores, addScore, users } = useTeamStore();
  const isCoach = role === 'coach';
  const memberUsers = users.filter((u) => u.role === 'member');

  const [selectedMember, setSelectedMember] = useState(isCoach ? memberUsers[0]?.id ?? '' : currentUser.id);
  const [raceName, setRaceName] = useState('');
  const [distance, setDistance] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState('2026-06-08');
  const [submitted, setSubmitted] = useState(false);

  const [filterMonth, setFilterMonth] = useState('全部');
  const [filterDistType, setFilterDistType] = useState('全部');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const viewUserId = isCoach ? selectedMember : currentUser.id;

  const userScores = useMemo(() => {
    let filtered = scores
      .filter((s) => s.userId === viewUserId)
      .sort((a, b) => b.date.localeCompare(a.date));

    if (filterMonth !== '全部') {
      filtered = filtered.filter((s) => s.date.startsWith(filterMonth));
    }
    if (filterDistType !== '全部') {
      filtered = filtered.filter((s) => getDistanceType(s.distance) === filterDistType);
    }
    return filtered;
  }, [scores, viewUserId, filterMonth, filterDistType]);

  const allMonths = useMemo(() => {
    const months = new Set(scores.filter(s => s.userId === viewUserId).map(s => s.date.slice(0, 7)));
    return ['全部', ...Array.from(months).sort().reverse()];
  }, [scores, viewUserId]);

  const personalBest = useMemo(() => {
    const allUserScores = scores.filter(s => s.userId === viewUserId);
    if (allUserScores.length === 0) return null;
    return allUserScores.reduce((best, s) => s.pace < best.pace ? s : best, allUserScores[0]);
  }, [scores, viewUserId]);

  const monthlyNewCount = useMemo(() => {
    const currentMonth = '2026-06';
    return scores.filter(s => s.userId === viewUserId && s.date.startsWith(currentMonth)).length;
  }, [scores, viewUserId]);

  const handleSubmit = () => {
    if (!selectedMember || !raceName || !distance || !time || !date) return;
    const dist = Number(distance);
    const timeMin = Number(time);
    if (!dist || !timeMin) return;
    const pace = timeMin / dist;

    const newScore: Score = {
      id: `s_${Date.now()}`,
      userId: selectedMember,
      raceName,
      distance: dist,
      time: timeMin,
      pace: Math.round(pace * 100) / 100,
      date,
    };
    addScore(newScore);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
    setRaceName('');
    setDistance('');
    setTime('');
  };

  const viewUserName = users.find(u => u.id === viewUserId)?.name ?? '';

  return (
    <div className="page-content">
      <Header title="成绩台账" showBack />

      {isCoach && (
        <div className="brand-card mb-4">
          <h3 className="section-title mb-4">录入新成绩</h3>
          <div className="space-y-3">
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="brand-input w-full"
            >
              {memberUsers.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="比赛名称"
              value={raceName}
              onChange={(e) => setRaceName(e.target.value)}
              className="brand-input w-full"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                step="0.1"
                placeholder="距离 (km)"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="brand-input w-full"
              />
              <input
                type="number"
                step="0.1"
                placeholder="完赛时间 (分钟)"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="brand-input w-full"
              />
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="brand-input w-full"
            />
            <button
              onClick={handleSubmit}
              disabled={!selectedMember || !raceName || !distance || !time}
              className="brand-btn w-full flex items-center justify-center gap-2"
            >
              <Send size={16} />
              {submitted ? '录入成功' : '提交成绩'}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="brand-card flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-orange/20 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5 text-brand-orange" />
          </div>
          <div>
            <p className="text-[10px] text-brand-gray">个人最佳配速</p>
            <p className="font-display font-bold text-brand-orange">
              {personalBest ? formatMinPace(personalBest.pace) : '--'}
            </p>
          </div>
        </div>
        <div className="brand-card flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-cyan/20 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-brand-cyan" />
          </div>
          <div>
            <p className="text-[10px] text-brand-gray">本月新增成绩</p>
            <p className="font-display font-bold text-brand-cyan">{monthlyNewCount} 条</p>
          </div>
        </div>
      </div>

      {isCoach && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
          {memberUsers.map((u) => (
            <button
              key={u.id}
              onClick={() => setSelectedMember(u.id)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                selectedMember === u.id
                  ? 'bg-gradient-brand text-white shadow-glow'
                  : 'bg-brand-card text-brand-gray hover:bg-brand-card-hover',
              )}
            >
              {u.name}
            </button>
          ))}
        </div>
      )}

      {!isCoach && (
        <h3 className="section-title mb-3">{viewUserName}的成绩记录</h3>
      )}
      {isCoach && (
        <h3 className="section-title mb-3">{viewUserName}的成绩记录</h3>
      )}

      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1 text-xs text-brand-gray hover:text-brand-cyan transition-colors"
        >
          <Filter className="w-3.5 h-3.5" />
          筛选
          {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        <span className="text-xs text-brand-gray ml-auto">
          共 {userScores.length} 条记录
        </span>
      </div>

      {showFilters && (
        <div className="brand-card mb-4 space-y-3 animate-slide-up">
          <div>
            <label className="text-xs text-brand-gray mb-1.5 block">月份</label>
            <div className="flex gap-2 flex-wrap">
              {allMonths.map((m) => (
                <button
                  key={m}
                  onClick={() => setFilterMonth(m)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium transition-all',
                    filterMonth === m
                      ? 'bg-brand-cyan/20 text-brand-cyan'
                      : 'bg-brand-deeper text-brand-gray hover:text-white',
                  )}
                >
                  {m === '全部' ? '全部' : m.slice(5) + '月'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-brand-gray mb-1.5 block">距离类型</label>
            <div className="flex gap-2 flex-wrap">
              {distanceTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterDistType(t)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium transition-all',
                    filterDistType === t
                      ? 'bg-brand-cyan/20 text-brand-cyan'
                      : 'bg-brand-deeper text-brand-gray hover:text-white',
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {userScores.map((s) => {
          const isExpanded = expandedId === s.id;
          const isBest = personalBest?.id === s.id;
          return (
            <div key={s.id} className="brand-card">
              <button
                onClick={() => setExpandedId(isExpanded ? null : s.id)}
                className="w-full flex items-center justify-between"
              >
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold text-sm">{s.raceName}</span>
                    {isBest && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-orange/20 text-brand-orange font-medium">
                        PB
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-brand-gray mt-1">{s.date}</div>
                </div>
                <div className="flex gap-5 items-center">
                  <div className="text-center">
                    <div className="text-brand-cyan font-display font-bold text-sm">{s.distance}</div>
                    <div className="text-[10px] text-brand-gray">km</div>
                  </div>
                  <div className="text-center">
                    <div className="text-brand-green font-display font-bold text-sm">{formatMinPace(s.pace)}</div>
                    <div className="text-[10px] text-brand-gray">配速</div>
                  </div>
                  {isExpanded ? <ChevronUp size={16} className="text-brand-gray" /> : <ChevronDown size={16} className="text-brand-gray" />}
                </div>
              </button>
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-brand-border grid grid-cols-2 gap-3 animate-slide-up">
                  <div className="bg-brand-deeper rounded-lg p-2.5">
                    <p className="text-[10px] text-brand-gray">比赛名称</p>
                    <p className="text-sm text-white mt-0.5">{s.raceName}</p>
                  </div>
                  <div className="bg-brand-deeper rounded-lg p-2.5">
                    <p className="text-[10px] text-brand-gray">比赛日期</p>
                    <p className="text-sm text-white mt-0.5">{s.date}</p>
                  </div>
                  <div className="bg-brand-deeper rounded-lg p-2.5">
                    <p className="text-[10px] text-brand-gray">距离</p>
                    <p className="text-sm text-white mt-0.5">{s.distance} km</p>
                  </div>
                  <div className="bg-brand-deeper rounded-lg p-2.5">
                    <p className="text-[10px] text-brand-gray">完赛时间</p>
                    <p className="text-sm text-white mt-0.5">{formatTime(s.time)}</p>
                  </div>
                  <div className="bg-brand-deeper rounded-lg p-2.5 col-span-2">
                    <p className="text-[10px] text-brand-gray">配速</p>
                    <p className="text-sm text-white mt-0.5">{formatMinPace(s.pace)} /km</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {userScores.length === 0 && (
          <div className="text-center py-12">
            <p className="text-brand-gray text-sm">暂无成绩记录</p>
          </div>
        )}
      </div>
    </div>
  );
}
