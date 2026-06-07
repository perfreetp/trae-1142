import { useState } from 'react';
import { Send } from 'lucide-react';
import Header from '@/components/Header';
import { useTeamStore, useUserStore } from '@/stores';
import { cn } from '@/lib/utils';

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  pending: { label: '待审批', cls: 'bg-yellow-500/20 text-yellow-500' },
  approved: { label: '已通过', cls: 'bg-brand-green/20 text-brand-green' },
  rejected: { label: '已拒绝', cls: 'bg-brand-red/20 text-brand-red' },
};

export default function Leave() {
  const { leaveRequests, addLeaveRequest, approveLeave, rejectLeave, users } = useTeamStore();
  const { currentUser, role } = useUserStore();
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');

  const myRequests = leaveRequests.filter((r) => r.userId === currentUser.id);
  const pendingAll = leaveRequests.filter((r) => r.status === 'pending');
  const isCoach = role === 'coach';

  const handleSubmit = () => {
    if (!date || !reason.trim()) return;
    addLeaveRequest({
      id: `l${Date.now()}`,
      userId: currentUser.id,
      date,
      reason: reason.trim(),
      status: 'pending',
    });
    setDate('');
    setReason('');
  };

  return (
    <div>
      <Header title="请假报备" showBack />

      <div className="page-content space-y-6">
        <section className="brand-card space-y-4">
          <h2 className="section-title text-base">提交请假</h2>
          <div>
            <label className="text-brand-gray text-xs mb-1 block">请假日期</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="brand-input w-full"
            />
          </div>
          <div>
            <label className="text-brand-gray text-xs mb-1 block">请假原因</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="请输入请假原因"
              rows={3}
              className="brand-input w-full resize-none"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={!date || !reason.trim()}
            className={cn(
              'brand-btn w-full flex items-center justify-center gap-2',
              (!date || !reason.trim()) && 'opacity-50 cursor-not-allowed'
            )}
          >
            <Send size={16} />
            提交请假
          </button>
        </section>

        <section>
          <h2 className="section-title mb-3">我的请假记录</h2>
          <div className="space-y-3">
            {myRequests.length === 0 && (
              <p className="text-brand-gray text-sm text-center py-4">暂无请假记录</p>
            )}
            {myRequests.map((req) => (
              <div key={req.id} className="brand-card flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold">{req.date}</p>
                  <p className="text-brand-gray text-xs truncate">{req.reason}</p>
                </div>
                <span
                  className={cn(
                    'text-xs px-2.5 py-1 rounded-full font-semibold whitespace-nowrap ml-3',
                    STATUS_MAP[req.status].cls
                  )}
                >
                  {STATUS_MAP[req.status].label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {isCoach && pendingAll.length > 0 && (
          <section>
            <h2 className="section-title mb-3 text-brand-orange">待审批申请</h2>
            <div className="space-y-3">
              {pendingAll.map((req) => {
                const user = users.find((u) => u.id === req.userId);
                return (
                  <div key={req.id} className="brand-card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm font-semibold">{user?.name ?? req.userId}</span>
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
