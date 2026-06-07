export interface Goal {
  id: string;
  userId: string;
  type: 'distance' | 'pace' | 'frequency';
  label: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
}

export interface Equipment {
  id: string;
  name: string;
  brand: string;
  type: 'shoes' | 'watch' | 'clothing' | 'accessory';
  purchaseDate: string;
  mileage: number;
  maxMileage: number;
}

export interface Injury {
  id: string;
  userId: string;
  type: string;
  description: string;
  startDate: string;
  endDate: string;
  recoveryDays: number;
  daysPassed: number;
  status: 'active' | 'recovered';
}

export interface TeamGroup {
  id: string;
  name: string;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Activity {
  id: string;
  title: string;
  date: string;
  location: string;
  maxParticipants: number;
  participants: string[];
}

export interface Score {
  id: string;
  userId: string;
  raceName: string;
  distance: number;
  time: number;
  pace: number;
  date: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'training' | 'activity' | 'leave' | 'system';
  read: boolean;
  createdAt: string;
}

export const goals: Goal[] = [
  { id: 'gl1', userId: 'm1', type: 'distance', label: '月跑量', target: 200, current: 80.5, unit: 'km', deadline: '2026-06-30' },
  { id: 'gl2', userId: 'm1', type: 'pace', label: '目标配速', target: 5.5, current: 5.8, unit: 'min/km', deadline: '2026-07-31' },
  { id: 'gl3', userId: 'm1', type: 'frequency', label: '月训练次数', target: 20, current: 12, unit: '次', deadline: '2026-06-30' },
  { id: 'gl4', userId: 'm2', type: 'distance', label: '月跑量', target: 150, current: 55.2, unit: 'km', deadline: '2026-06-30' },
  { id: 'gl5', userId: 'm3', type: 'distance', label: '月跑量', target: 180, current: 72.0, unit: 'km', deadline: '2026-06-30' },
];

export const equipment: Equipment[] = [
  { id: 'eq1', name: 'Nike Vaporfly 3', brand: 'Nike', type: 'shoes', purchaseDate: '2026-02-15', mileage: 320, maxMileage: 800 },
  { id: 'eq2', name: 'Nike Pegasus 41', brand: 'Nike', type: 'shoes', purchaseDate: '2025-11-10', mileage: 580, maxMileage: 800 },
  { id: 'eq3', name: 'Garmin Forerunner 265', brand: 'Garmin', type: 'watch', purchaseDate: '2026-01-10', mileage: 0, maxMileage: 0 },
  { id: 'eq4', name: '速干短袖', brand: '优衣库', type: 'clothing', purchaseDate: '2026-04-01', mileage: 0, maxMileage: 0 },
  { id: 'eq5', name: 'Adidas Adizero Adios Pro', brand: 'Adidas', type: 'shoes', purchaseDate: '2026-05-01', mileage: 120, maxMileage: 600 },
];

export const injuries: Injury[] = [
  { id: 'in1', userId: 'm2', type: '足底筋膜炎', description: '晨起足跟疼痛，跑步后加重', startDate: '2026-05-20', endDate: '', recoveryDays: 42, daysPassed: 19, status: 'active' },
  { id: 'in2', userId: 'm4', type: '髂胫束综合征', description: '膝外侧疼痛，长距离跑步后明显', startDate: '2026-04-10', endDate: '2026-05-15', recoveryDays: 35, daysPassed: 59, status: 'recovered' },
  { id: 'in3', userId: 'm3', type: '跟腱炎', description: '跟腱处疼痛，晨起僵硬', startDate: '2026-06-01', endDate: '', recoveryDays: 28, daysPassed: 7, status: 'active' },
];

export const teamGroups: TeamGroup[] = [
  { id: 'g1', name: '竞速组' },
  { id: 'g2', name: '耐力组' },
];

export const leaveRequests: LeaveRequest[] = [
  { id: 'l1', userId: 'm1', date: '2026-06-13', reason: '身体不适，需要休息', status: 'pending' },
  { id: 'l2', userId: 'm3', date: '2026-06-14', reason: '出差请假', status: 'pending' },
  { id: 'l3', userId: 'm2', date: '2026-06-11', reason: '感冒恢复中', status: 'approved' },
];

export const activities: Activity[] = [
  { id: 'a1', title: '周末集体跑', date: '2026-06-14', location: '奥林匹克公园', maxParticipants: 20, participants: ['m1', 'm2', 'm4'] },
  { id: 'a2', title: '间歇训练课', date: '2026-06-15', location: '体育中心田径场', maxParticipants: 15, participants: ['m3', 'm5'] },
  { id: 'a3', title: '长距离拉练', date: '2026-06-21', location: '滨江绿道', maxParticipants: 25, participants: ['m1'] },
];

export const scores: Score[] = [
  { id: 's1', userId: 'm1', raceName: '朝阳公园晨跑赛', distance: 10, time: 58, pace: 5.8, date: '2026-06-07' },
  { id: 's2', userId: 'm1', raceName: '奥森半程测试', distance: 21.1, time: 126.6, pace: 6.0, date: '2026-05-25' },
  { id: 's3', userId: 'm1', raceName: '月度10K评测', distance: 10, time: 62, pace: 6.2, date: '2026-04-20' },
  { id: 's4', userId: 'm1', raceName: '长安街夜跑', distance: 5, time: 27.5, pace: 5.5, date: '2026-06-01' },
  { id: 's5', userId: 'm2', raceName: '朝阳公园晨跑赛', distance: 10, time: 62, pace: 6.2, date: '2026-06-07' },
  { id: 's6', userId: 'm2', raceName: '奥森周末长跑', distance: 15, time: 97.5, pace: 6.5, date: '2026-05-18' },
  { id: 's7', userId: 'm3', raceName: '朝阳公园晨跑赛', distance: 10, time: 55, pace: 5.5, date: '2026-06-07' },
  { id: 's8', userId: 'm3', raceName: '月度5K评测', distance: 5, time: 27, pace: 5.4, date: '2026-05-10' },
  { id: 's9', userId: 'm4', raceName: '奥森南园环线跑', distance: 5, time: 34, pace: 6.8, date: '2026-06-05' },
  { id: 's10', userId: 'm4', raceName: '月度10K评测', distance: 10, time: 70, pace: 7.0, date: '2026-05-15' },
  { id: 's11', userId: 'm5', raceName: '护城河慢跑', distance: 7.2, time: 46.8, pace: 6.5, date: '2026-06-03' },
  { id: 's12', userId: 'm5', raceName: '月度5K评测', distance: 5, time: 34, pace: 6.8, date: '2026-05-12' },
];

export const notifications: Notification[] = [
  { id: 'n1', title: '训练提醒', message: '明天有间歇训练，请做好准备', type: 'training', read: false, createdAt: '2026-06-08T08:00:00' },
  { id: 'n2', title: '请假审批', message: '张三提交了请假申请，请及时处理', type: 'leave', read: false, createdAt: '2026-06-08T09:30:00' },
  { id: 'n3', title: '活动通知', message: '周末集体跑报名已开始，快来报名吧！', type: 'activity', read: true, createdAt: '2026-06-07T10:00:00' },
  { id: 'n4', title: '训练完成', message: '恭喜完成今日恢复跑训练！', type: 'training', read: false, createdAt: '2026-06-08T18:00:00' },
  { id: 'n5', title: '课表推送', message: '本周训练课表已发布，请查看训练日历', type: 'training', read: false, createdAt: '2026-06-07T20:00:00' },
  { id: 'n6', title: '装备提醒', message: '您的Nike Pegasus 41已使用580公里，建议尽快更换', type: 'system', read: true, createdAt: '2026-06-06T12:00:00' },
  { id: 'n7', title: '请假审批', message: '李四的请假申请已通过', type: 'leave', read: true, createdAt: '2026-06-06T14:00:00' },
  { id: 'n8', title: '活动通知', message: '间歇训练课报名人数已达10人', type: 'activity', read: false, createdAt: '2026-06-08T15:00:00' },
];
