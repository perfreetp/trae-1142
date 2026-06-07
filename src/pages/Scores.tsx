import { useState } from 'react';
import { Send } from 'lucide-react';
import Header from '@/components/Header';
import { useUserStore, useTeamStore } from '@/stores';
import type { Score } from '@/mock/data';

function formatMinPace(minutes: number) {
  const min = Math.floor(minutes);
  const sec = Math.round((minutes - min) * 60);
  return `${min}'${sec.toString().padStart(2, '0')}"`;
}

export default function Scores() {
  const { role, users, currentUser } = useUserStore();
  const { scores, addScore } = useTeamStore();
  const isCoach = role === 'coach';

  const memberUsers = users.filter((u) => u.role === 'member');

  const [selectedMember, setSelectedMember] = useState(memberUsers[0]?.id ?? '');
  const [raceName, setRaceName] = useState('');
  const [distance, setDistance] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState('2026-06-08');
  const [submitted, setSubmitted] = useState(false);

  const viewUserId = isCoach ? 'm1' : currentUser.id;
  const userScores = scores
    .filter((s) => s.userId === viewUserId)
    .sort((a, b) => b.month.localeCompare(a.month));

  const handleSubmit = () => {
    if (!selectedMember || !raceName || !distance || !time) return;
    const dist = Number(distance);
    const timeMin = Number(time);
    if (!dist || !timeMin) return;
    const pace = timeMin / dist;

    const newScore: Score = {
      userId: selectedMember,
      month: date.slice(0, 7),
      distance: dist,
      pace: Math.round(pace * 100) / 100,
    };
    addScore(newScore);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
    setRaceName('');
    setDistance('');
    setTime('');
  };

  return (
    <div className="page-content">
      <Header title="成绩录入" showBack />

      {isCoach && (
        <div className="brand-card mb-6">
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

      <div>
        <h3 className="section-title mb-3">成绩记录</h3>
        <div className="space-y-3">
          {userScores.map((s, i) => (
            <div key={i} className="brand-card flex items-center justify-between">
              <div>
                <div className="text-white font-semibold">{s.month}</div>
                <div className="text-xs text-brand-gray mt-1">月度成绩</div>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-brand-cyan font-display font-bold">{s.distance}</div>
                  <div className="text-xs text-brand-gray">公里</div>
                </div>
                <div className="text-center">
                  <div className="text-brand-green font-display font-bold">{formatMinPace(s.pace)}</div>
                  <div className="text-xs text-brand-gray">配速/km</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
