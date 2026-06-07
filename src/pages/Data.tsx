import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Target, ClipboardList, Activity, Footprints, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Header from '@/components/Header';
import { useTeamStore, useUserStore } from '@/stores';
import { useTrainingStore } from '@/stores';

const quickLinks = [
  { label: '个人目标', path: '/data/goals', icon: Target, color: 'text-brand-cyan' },
  { label: '成绩录入', path: '/data/scores', icon: ClipboardList, color: 'text-brand-green' },
  { label: '赛前测评', path: '/data/assessment', icon: Activity, color: 'text-brand-orange' },
  { label: '装备寿命', path: '/data/equipment', icon: Footprints, color: 'text-purple-400' },
  { label: '伤病提醒', path: '/data/injury', icon: AlertTriangle, color: 'text-brand-red' },
];

function formatMinPace(minutes: number) {
  if (minutes <= 0) return '--';
  const min = Math.floor(minutes);
  const sec = Math.round((minutes - min) * 60);
  return `${min}'${sec.toString().padStart(2, '0')}"`;
}

export default function Data() {
  const { currentUser } = useUserStore();
  const scores = useTeamStore((s) => s.scores);
  const records = useTrainingStore((s) => s.records);

  const userScores = useMemo(
    () => scores.filter((s) => s.userId === currentUser.id),
    [scores, currentUser.id]
  );

  const currentMonth = '2026-06';

  const monthlyScores = useMemo(
    () => userScores.filter((s) => s.date.startsWith(currentMonth)),
    [userScores]
  );

  const monthlyDistance = useMemo(
    () => Math.round(monthlyScores.reduce((sum, s) => sum + s.distance, 0) * 10) / 10,
    [monthlyScores]
  );

  const avgPace = useMemo(() => {
    const totalTime = monthlyScores.reduce((sum, s) => sum + s.time, 0);
    const totalDist = monthlyScores.reduce((sum, s) => sum + s.distance, 0);
    return totalDist > 0 ? totalTime / totalDist : 0;
  }, [monthlyScores]);

  const trainingCount = records.filter((r) => r.userId === currentUser.id).length;

  const monthlyAgg = useMemo(() => {
    const monthMap = new Map<string, { distance: number; time: number }>();
    for (const s of userScores) {
      const month = s.date.slice(0, 7);
      const existing = monthMap.get(month) ?? { distance: 0, time: 0 };
      existing.distance += s.distance;
      existing.time += s.time;
      monthMap.set(month, existing);
    }
    return Array.from(monthMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month: month.slice(5),
        distance: Math.round(data.distance * 10) / 10,
        pace: data.distance > 0 ? Math.round((data.time / data.distance) * 100) / 100 : 0,
      }));
  }, [userScores]);

  return (
    <div className="page-content">
      <Header title="数据" />

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: '本月跑量', value: `${monthlyDistance}`, unit: 'km' },
          { label: '平均配速', value: formatMinPace(avgPace), unit: '/km' },
          { label: '训练次数', value: `${trainingCount}`, unit: '次' },
        ].map((stat) => (
          <div key={stat.label} className="brand-card text-center">
            <div className="text-2xl font-display font-bold text-white">{stat.value}</div>
            <div className="text-xs text-brand-gray mt-1">
              {stat.label}
              <span className="text-brand-cyan ml-0.5">{stat.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h2 className="section-title mb-3">跑量趋势</h2>
        <div className="brand-card">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyAgg}>
              <defs>
                <linearGradient id="distGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#22D3EE" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={{ stroke: '#334155' }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={{ stroke: '#334155' }} />
              <Tooltip
                contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 12, color: '#fff' }}
                labelStyle={{ color: '#94A3B8' }}
              />
              <Area type="monotone" dataKey="distance" stroke="#22D3EE" fill="url(#distGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="section-title mb-3">配速趋势</h2>
        <div className="brand-card">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyAgg}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={{ stroke: '#334155' }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={{ stroke: '#334155' }} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 12, color: '#fff' }}
                labelStyle={{ color: '#94A3B8' }}
              />
              <Line type="monotone" dataKey="pace" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h2 className="section-title mb-3">快捷入口</h2>
        <div className="grid grid-cols-5 gap-2">
          {quickLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="brand-card flex flex-col items-center gap-2 py-4 hover:scale-105 transition-transform"
            >
              <link.icon size={24} className={link.color} />
              <span className="text-xs text-brand-gray-light">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
