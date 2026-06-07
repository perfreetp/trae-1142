import { Link } from 'react-router-dom';
import { ChevronRight, User, Heart, Bell, Download, Info, LogOut } from 'lucide-react';
import Header from '@/components/Header';
import { useUserStore, useTrainingStore, useTeamStore } from '@/stores';

const menuItems = [
  { label: '个人资料', icon: User, path: '/profile/detail' },
  { label: '心率区间设置', icon: Heart, path: '/profile/heartrate' },
  { label: '通知偏好', icon: Bell, path: '/profile/notifications' },
  { label: '数据导出', icon: Download, path: '/profile/export' },
  { label: '关于', icon: Info, path: '/profile/about' },
];

export default function Profile() {
  const { currentUser, role, switchRole } = useUserStore();
  const records = useTrainingStore((s) => s.records);
  const scores = useTeamStore((s) => s.scores);

  const currentMonth = '2026-06';
  const monthlyDistance = scores
    .filter((s) => s.userId === currentUser.id && s.month === currentMonth)
    .reduce((sum, s) => sum + s.distance, 0);

  const trainingCount = records.filter((r) => r.userId === currentUser.id).length;

  const streakDays = 7;

  return (
    <div className="page-content">
      <Header title="个人中心" />

      <div className="flex flex-col items-center mb-8">
        <div className="p-[3px] rounded-full bg-gradient-brand mb-3">
          <div className="w-20 h-20 rounded-full bg-brand-card flex items-center justify-center">
            <span className="text-3xl font-display font-bold text-brand-cyan">
              {currentUser.name.charAt(0)}
            </span>
          </div>
        </div>
        <div className="text-white text-lg font-display font-bold">{currentUser.name}</div>
        <span className={`text-xs mt-1 px-3 py-0.5 rounded-full ${
          role === 'coach'
            ? 'bg-brand-orange/20 text-brand-orange'
            : 'bg-brand-cyan/20 text-brand-cyan'
        }`}>
          {role === 'coach' ? '教练' : '队员'}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: '本月跑量', value: `${monthlyDistance}`, unit: 'km' },
          { label: '训练次数', value: `${trainingCount}`, unit: '次' },
          { label: '连续打卡', value: `${streakDays}`, unit: '天' },
        ].map((stat) => (
          <div key={stat.label} className="brand-card text-center">
            <div className="text-xl font-display font-bold text-white">{stat.value}</div>
            <div className="text-xs text-brand-gray mt-1">
              {stat.label}
              <span className="text-brand-cyan ml-0.5">{stat.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="brand-card mb-6 flex items-center justify-between">
        <div>
          <div className="text-white font-medium">角色切换</div>
          <div className="text-xs text-brand-gray mt-0.5">
            当前：{role === 'coach' ? '教练视角' : '队员视角'}
          </div>
        </div>
        <button
          onClick={switchRole}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            role === 'coach' ? 'bg-brand-orange' : 'bg-brand-cyan'
          }`}
        >
          <div
            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
              role === 'coach' ? 'translate-x-6' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      <div className="space-y-2 mb-8">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="brand-card flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <item.icon size={18} className="text-brand-gray" />
              <span className="text-white">{item.label}</span>
            </div>
            <ChevronRight size={16} className="text-brand-gray" />
          </Link>
        ))}
      </div>

      <button className="brand-btn-outline w-full flex items-center justify-center gap-2">
        <LogOut size={16} />
        退出登录
      </button>
    </div>
  );
}
