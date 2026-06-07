import Header from '@/components/Header';

export default function ProfileAbout() {
  return (
    <div className="page-content">
      <Header title="关于" showBack />

      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-brand flex items-center justify-center mb-3 shadow-glow">
          <span className="text-2xl font-display font-bold text-white">体</span>
        </div>
        <h2 className="text-xl font-display font-bold text-white">智慧体育</h2>
        <p className="text-xs text-brand-gray mt-1">版本 1.0.0</p>
      </div>

      <div className="brand-card mb-4">
        <h3 className="section-title text-sm mb-2">应用介绍</h3>
        <p className="text-sm text-brand-gray leading-relaxed">
          智慧体育是一款面向业余跑团的综合训练管理平台，帮助教练高效发布训练计划、跟踪队员完成情况，帮助队员科学执行训练、记录数据、查看趋势。
        </p>
      </div>

      <div className="brand-card mb-4">
        <h3 className="section-title text-sm mb-3">功能特性</h3>
        <div className="space-y-2">
          {[
            '训练日历与课表推送',
            '配速记录与心率区间分析',
            '疲劳自评与打卡签到',
            '分组管理与队内排名',
            '路线收藏与难度标注',
            '个人目标与成绩趋势',
            '装备寿命与伤病提醒',
            '赛前测评与活动报名',
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-2 text-sm text-brand-gray-light">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan shrink-0" />
              {feature}
            </div>
          ))}
        </div>
      </div>

      <div className="brand-card">
        <h3 className="section-title text-sm mb-2">技术信息</h3>
        <div className="space-y-1.5 text-xs text-brand-gray">
          <div className="flex justify-between">
            <span>框架</span>
            <span className="text-brand-gray-light">React 18 + TypeScript</span>
          </div>
          <div className="flex justify-between">
            <span>构建</span>
            <span className="text-brand-gray-light">Vite</span>
          </div>
          <div className="flex justify-between">
            <span>样式</span>
            <span className="text-brand-gray-light">TailwindCSS</span>
          </div>
          <div className="flex justify-between">
            <span>状态管理</span>
            <span className="text-brand-gray-light">Zustand</span>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-brand-gray/50 mt-8">© 2026 智慧体育团队</p>
    </div>
  );
}
