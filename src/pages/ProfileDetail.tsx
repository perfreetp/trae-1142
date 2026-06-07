import { useState } from 'react';
import Header from '@/components/Header';
import { useUserStore } from '@/stores';

export default function ProfileDetail() {
  const { currentUser } = useUserStore();
  const [name, setName] = useState(currentUser.name);
  const [height, setHeight] = useState('175');
  const [weight, setWeight] = useState('68');
  const [level, setLevel] = useState('进阶');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="page-content">
      <Header title="个人资料" showBack />

      <div className="flex flex-col items-center mb-6">
        <div className="p-[3px] rounded-full bg-gradient-brand mb-3">
          <div className="w-20 h-20 rounded-full bg-brand-card flex items-center justify-center">
            <span className="text-3xl font-display font-bold text-brand-cyan">
              {name.charAt(0)}
            </span>
          </div>
        </div>
        <p className="text-xs text-brand-gray">点击更换头像</p>
      </div>

      <div className="brand-card space-y-4">
        <div>
          <label className="text-xs text-brand-gray mb-1 block">昵称</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="brand-input w-full"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-brand-gray mb-1 block">身高 (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="brand-input w-full"
            />
          </div>
          <div>
            <label className="text-xs text-brand-gray mb-1 block">体重 (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="brand-input w-full"
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-brand-gray mb-1 block">跑步水平</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="brand-input w-full"
          >
            <option value="入门">入门</option>
            <option value="初级">初级</option>
            <option value="中级">中级</option>
            <option value="进阶">进阶</option>
            <option value="精英">精英</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-brand-gray mb-1 block">角色</label>
          <input
            type="text"
            value={currentUser.role === 'coach' ? '教练' : '队员'}
            disabled
            className="brand-input w-full opacity-50"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        className="brand-btn w-full mt-6"
      >
        {saved ? '保存成功' : '保存修改'}
      </button>
    </div>
  );
}
