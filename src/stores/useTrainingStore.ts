import { create } from 'zustand';
import type { TrainingPlan, TrainingRecord } from '@/mock/training';
import { trainingPlans, trainingRecords } from '@/mock/training';
import { users } from '@/mock/users';

interface CompletionDetail {
  userId: string;
  name: string;
  checkedIn: boolean;
  completed: boolean;
  distance: number;
  duration: number;
  pace: number;
  avgHR: number;
  fatigue: number;
}

interface TrainingState {
  plans: TrainingPlan[];
  records: TrainingRecord[];
  selectedDate: string;
  selectedPlanId: string | null;
  setSelectedDate: (date: string) => void;
  setSelectedPlanId: (planId: string | null) => void;
  addPlan: (plan: TrainingPlan) => void;
  addRecord: (record: TrainingRecord) => void;
  updateRecord: (recordId: string, updates: Partial<TrainingRecord>) => void;
  upsertRecord: (record: TrainingRecord) => void;
  checkIn: (recordId: string) => void;
  getPlansByDate: (date: string) => TrainingPlan[];
  getRecordsByUser: (userId: string) => TrainingRecord[];
  getRecordByDate: (userId: string, date: string) => TrainingRecord | undefined;
  getRecordByPlanAndUser: (planId: string, userId: string) => TrainingRecord | undefined;
  getCompletionRate: (planId: string) => number;
  getRecordSubmissionRate: (planId: string) => number;
  getCompletionDetails: (planId: string) => CompletionDetail[];
}

export const useTrainingStore = create<TrainingState>((set, get) => ({
  plans: trainingPlans,
  records: trainingRecords,
  selectedDate: '2026-06-08',
  selectedPlanId: 'p1',
  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedPlanId: (planId) => set({ selectedPlanId: planId }),
  addPlan: (plan) =>
    set((state) => ({ plans: [...state.plans, plan] })),
  addRecord: (record) =>
    set((state) => ({ records: [...state.records, record] })),
  updateRecord: (recordId, updates) =>
    set((state) => ({
      records: state.records.map((r) =>
        r.id === recordId ? { ...r, ...updates } : r
      ),
    })),
  upsertRecord: (record) => {
    const existing = get().records.find(
      (r) => r.userId === record.userId && r.planId === record.planId
    );
    if (existing) {
      set((state) => ({
        records: state.records.map((r) =>
          r.id === existing.id
            ? {
                ...existing,
                ...record,
                id: existing.id,
                checkedIn: existing.checkedIn || record.checkedIn,
                completed: existing.completed || record.completed,
              }
            : r
        ),
      }));
    } else {
      set((state) => ({ records: [...state.records, record] }));
    }
  },
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
  getRecordByPlanAndUser: (planId, userId) =>
    get().records.find((r) => r.planId === planId && r.userId === userId),
  getCompletionRate: (planId) => {
    const members = users.filter((u) => u.role === 'member');
    if (members.length === 0) return 0;
    const records = get().records.filter((r) => r.planId === planId && r.checkedIn);
    return Math.round((records.length / members.length) * 100);
  },
  getRecordSubmissionRate: (planId) => {
    const members = users.filter((u) => u.role === 'member');
    if (members.length === 0) return 0;
    const records = get().records.filter((r) => r.planId === planId && r.completed);
    return Math.round((records.length / members.length) * 100);
  },
  getCompletionDetails: (planId) => {
    const members = users.filter((u) => u.role === 'member');
    const records = get().records.filter((r) => r.planId === planId);
    const recordMap = new Map(records.map((r) => [r.userId, r]));
    return members.map((u) => {
      const rec = recordMap.get(u.id);
      return {
        userId: u.id,
        name: u.name,
        checkedIn: rec?.checkedIn ?? false,
        completed: rec?.completed ?? false,
        distance: rec?.distance ?? 0,
        duration: rec?.duration ?? 0,
        pace: rec?.pace ?? 0,
        avgHR: rec?.avgHR ?? 0,
        fatigue: rec?.fatigue ?? 0,
      };
    });
  },
}));
