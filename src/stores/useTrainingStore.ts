import { create } from 'zustand';
import type { TrainingPlan, TrainingRecord } from '@/mock/training';
import { trainingPlans, trainingRecords } from '@/mock/training';
import { users } from '@/mock/users';

interface TrainingState {
  plans: TrainingPlan[];
  records: TrainingRecord[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  addPlan: (plan: TrainingPlan) => void;
  addRecord: (record: TrainingRecord) => void;
  checkIn: (recordId: string) => void;
  getPlansByDate: (date: string) => TrainingPlan[];
  getRecordsByUser: (userId: string) => TrainingRecord[];
  getRecordByDate: (userId: string, date: string) => TrainingRecord | undefined;
  getCompletionRate: (planId: string) => number;
  getCompletionDetails: (planId: string) => { userId: string; name: string; checkedIn: boolean }[];
}

export const useTrainingStore = create<TrainingState>((set, get) => ({
  plans: trainingPlans,
  records: trainingRecords,
  selectedDate: '2026-06-08',
  setSelectedDate: (date) => set({ selectedDate: date }),
  addPlan: (plan) =>
    set((state) => ({ plans: [...state.plans, plan] })),
  addRecord: (record) =>
    set((state) => ({ records: [...state.records, record] })),
  checkIn: (recordId) =>
    set((state) => ({
      records: state.records.map((r) =>
        r.id === recordId ? { ...r, checkedIn: true } : r
      ),
    })),
  getPlansByDate: (date) => get().plans.filter((p) => p.date === date),
  getRecordsByUser: (userId) => get().records.filter((r) => r.userId === userId),
  getRecordByDate: (userId, date) =>
    get().records.find((r) => r.userId === userId && r.date === date),
  getCompletionRate: (planId) => {
    const members = users.filter((u) => u.role === 'member');
    if (members.length === 0) return 0;
    const records = get().records.filter((r) => r.planId === planId && r.checkedIn);
    return Math.round((records.length / members.length) * 100);
  },
  getCompletionDetails: (planId) => {
    const members = users.filter((u) => u.role === 'member');
    const records = get().records.filter((r) => r.planId === planId);
    const recordMap = new Map(records.map((r) => [r.userId, r.checkedIn]));
    return members.map((u) => ({
      userId: u.id,
      name: u.name,
      checkedIn: recordMap.get(u.id) ?? false,
    }));
  },
}));
