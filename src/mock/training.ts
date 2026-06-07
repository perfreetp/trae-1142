export interface TrainingPlan {
  id: string;
  title: string;
  date: string;
  type: 'easy' | 'interval' | 'long' | 'tempo' | 'recovery' | 'speed' | 'fartlek';
  targetDistance: number;
  targetPace: number;
  warmup: string;
  mainSession: string;
  cooldown: string;
  heartRateZone: string;
  targetGroup: string;
  description: string;
}

export interface TrainingRecord {
  id: string;
  userId: string;
  planId: string;
  date: string;
  distance: number;
  duration: number;
  pace: number;
  avgHR: number;
  heartRateZones: { z1: number; z2: number; z3: number; z4: number; z5: number };
  fatigue: number;
  note: string;
  checkedIn: boolean;
  completed: boolean;
}

export const trainingPlans: TrainingPlan[] = [
  {
    id: 'p1', title: '恢复跑', date: '2026-06-08', type: 'recovery',
    targetDistance: 5, targetPace: 390, warmup: '动态拉伸5分钟',
    mainSession: '5公里慢跑，配速6:30-7:00', cooldown: '静态拉伸10分钟',
    heartRateZone: 'Z1-Z2', targetGroup: '全队', description: '保持轻松配速，心率控制在140以下',
  },
  {
    id: 'p2', title: '间歇训练', date: '2026-06-09', type: 'interval',
    targetDistance: 8, targetPace: 330, warmup: '慢跑2公里热身',
    mainSession: '400m快跑(配速5:30) + 200m慢跑，共8组', cooldown: '慢跑1公里放松',
    heartRateZone: 'Z4-Z5', targetGroup: '竞速组', description: '高强度间歇，提升最大摄氧量',
  },
  {
    id: 'p3', title: '长距离慢跑', date: '2026-06-10', type: 'long',
    targetDistance: 15, targetPace: 375, warmup: '动态拉伸+慢跑1公里',
    mainSession: '15公里匀速长跑，配速6:15-6:30', cooldown: '步行1公里+拉伸15分钟',
    heartRateZone: 'Z2-Z3', targetGroup: '全队', description: '匀速长跑，锻炼耐力基础',
  },
  {
    id: 'p4', title: '节奏跑', date: '2026-06-11', type: 'tempo',
    targetDistance: 10, targetPace: 345, warmup: '慢跑2公里+加速跑2组',
    mainSession: '6公里节奏跑(配速5:45-5:50)+2公里放松', cooldown: '拉伸10分钟',
    heartRateZone: 'Z3-Z4', targetGroup: '竞速组', description: '以比赛配速80%持续跑',
  },
  {
    id: 'p5', title: '轻松跑', date: '2026-06-12', type: 'easy',
    targetDistance: 6, targetPace: 390, warmup: '动态拉伸5分钟',
    mainSession: '6公里轻松跑，配速6:30-7:00', cooldown: '拉伸10分钟+泡沫轴放松',
    heartRateZone: 'Z1-Z2', targetGroup: '全队', description: '放松恢复，注意拉伸',
  },
  {
    id: 'p6', title: '速度训练', date: '2026-06-13', type: 'speed',
    targetDistance: 7, targetPace: 315, warmup: '慢跑2公里+4组跨步跑',
    mainSession: '1000m重复跑×5组(配速5:15)，组间休息2分钟', cooldown: '慢跑1公里+拉伸',
    heartRateZone: 'Z4-Z5', targetGroup: '竞速组', description: '速度耐力训练，提升跑步经济性',
  },
  {
    id: 'p7', title: '团体长跑', date: '2026-06-14', type: 'fartlek',
    targetDistance: 12, targetPace: 360, warmup: '集体慢跑2公里',
    mainSession: '10公里法特莱克跑：2分钟快+1分钟慢交替', cooldown: '集体拉伸15分钟',
    heartRateZone: 'Z2-Z4', targetGroup: '全队', description: '团队跑步，变速跑增加趣味',
  },
];

export const trainingRecords: TrainingRecord[] = [
  {
    id: 'r1', userId: 'm1', planId: 'p1', date: '2026-06-08', distance: 5.2, duration: 33,
    pace: 385, avgHR: 132, heartRateZones: { z1: 45, z2: 35, z3: 15, z4: 5, z5: 0 },
    fatigue: 3, note: '状态不错，跑完很轻松', checkedIn: true, completed: true,
  },
  {
    id: 'r2', userId: 'm2', planId: 'p1', date: '2026-06-08', distance: 5.0, duration: 35,
    pace: 420, avgHR: 128, heartRateZones: { z1: 50, z2: 30, z3: 15, z4: 5, z5: 0 },
    fatigue: 2, note: '', checkedIn: true, completed: true,
  },
  {
    id: 'r3', userId: 'm3', planId: 'p1', date: '2026-06-08', distance: 4.8, duration: 31,
    pace: 390, avgHR: 135, heartRateZones: { z1: 40, z2: 35, z3: 20, z4: 5, z5: 0 },
    fatigue: 4, note: '左膝微感不适', checkedIn: false, completed: true,
  },
  {
    id: 'r4', userId: 'm1', planId: 'p2', date: '2026-06-09', distance: 7.5, duration: 44,
    pace: 352, avgHR: 158, heartRateZones: { z1: 5, z2: 10, z3: 20, z4: 40, z5: 25 },
    fatigue: 7, note: '间歇组数太多，最后两组力竭', checkedIn: true, completed: true,
  },
  {
    id: 'r5', userId: 'm4', planId: 'p2', date: '2026-06-09', distance: 8.0, duration: 46,
    pace: 345, avgHR: 162, heartRateZones: { z1: 5, z2: 10, z3: 15, z4: 45, z5: 25 },
    fatigue: 8, note: '强度很大，但完成了全部组数', checkedIn: true, completed: true,
  },
  {
    id: 'r6', userId: 'm2', planId: 'p3', date: '2026-06-10', distance: 14.5, duration: 88,
    pace: 366, avgHR: 145, heartRateZones: { z1: 15, z2: 45, z3: 30, z4: 10, z5: 0 },
    fatigue: 6, note: '后半程配速略有下降', checkedIn: true, completed: true,
  },
  {
    id: 'r7', userId: 'm3', planId: 'p3', date: '2026-06-10', distance: 15.2, duration: 92,
    pace: 364, avgHR: 148, heartRateZones: { z1: 10, z2: 40, z3: 35, z4: 15, z5: 0 },
    fatigue: 7, note: '顺利完成，最后3公里有点吃力', checkedIn: true, completed: true,
  },
  {
    id: 'r8', userId: 'm5', planId: 'p1', date: '2026-06-08', distance: 4.5, duration: 30,
    pace: 400, avgHR: 130, heartRateZones: { z1: 50, z2: 35, z3: 10, z4: 5, z5: 0 },
    fatigue: 2, note: '恢复跑感觉很好', checkedIn: true, completed: true,
  },
  {
    id: 'r9', userId: 'm1', planId: 'p5', date: '2026-06-12', distance: 6.0, duration: 38,
    pace: 383, avgHR: 135, heartRateZones: { z1: 40, z2: 40, z3: 15, z4: 5, z5: 0 },
    fatigue: 3, note: '轻松跑完成', checkedIn: true, completed: true,
  },
  {
    id: 'r10', userId: 'm4', planId: 'p5', date: '2026-06-12', distance: 5.8, duration: 40,
    pace: 414, avgHR: 138, heartRateZones: { z1: 45, z2: 35, z3: 15, z4: 5, z5: 0 },
    fatigue: 4, note: '', checkedIn: false, completed: true,
  },
];
