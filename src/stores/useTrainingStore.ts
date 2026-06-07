import { create } from 'zustand';
import type { TrainingPlan, TrainingRecord } from '@/mock/training';
import { trainingPlans, trainingRecords } from '@/mock/training';

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
    const records = get().records.filter((r) => r.planId === planId);
    if (records.length === 0) return 0;
    const checkedInCount = records.filter((r) => r.checkedIn).length;
    return Math.round((checkedInCount / records.length) * 100);
  },
}));
