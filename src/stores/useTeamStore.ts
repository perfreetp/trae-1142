import { create } from 'zustand';
import type { TeamGroup, LeaveRequest, Activity, Score } from '@/mock/data';
import type { User } from '@/mock/users';
import { teamGroups, leaveRequests, activities, scores } from '@/mock/data';
import { users } from '@/mock/users';

interface TeamState {
  groups: TeamGroup[];
  leaveRequests: LeaveRequest[];
  activities: Activity[];
  scores: Score[];
  users: User[];
  addLeaveRequest: (request: LeaveRequest) => void;
  approveLeave: (id: string) => void;
  rejectLeave: (id: string) => void;
  addActivity: (activity: Activity) => void;
  joinActivity: (activityId: string, userId: string) => void;
  addScore: (score: Score) => void;
  getMembersByGroup: (groupId: string) => User[];
  getRankingByMonthlyDistance: () => { userId: string; name: string; distance: number }[];
}

export const useTeamStore = create<TeamState>((set, get) => ({
  groups: teamGroups,
  leaveRequests,
  activities,
  scores,
  users,
  addLeaveRequest: (request) =>
    set((state) => ({ leaveRequests: [...state.leaveRequests, request] })),
  approveLeave: (id) =>
    set((state) => ({
      leaveRequests: state.leaveRequests.map((r) =>
        r.id === id ? { ...r, status: 'approved' as const } : r
      ),
    })),
  rejectLeave: (id) =>
    set((state) => ({
      leaveRequests: state.leaveRequests.map((r) =>
        r.id === id ? { ...r, status: 'rejected' as const } : r
      ),
    })),
  addActivity: (activity) =>
    set((state) => ({ activities: [...state.activities, activity] })),
  joinActivity: (activityId, userId) =>
    set((state) => ({
      activities: state.activities.map((a) =>
        a.id === activityId && !a.participants.includes(userId)
          ? { ...a, participants: [...a.participants, userId] }
          : a
      ),
    })),
  addScore: (score) =>
    set((state) => ({ scores: [...state.scores, score] })),
  getMembersByGroup: (groupId) =>
    get().users.filter((u) => u.groupId === groupId),
  getRankingByMonthlyDistance: () => {
    const currentScores = get().scores;
    const currentUsers = get().users;
    const distanceMap = new Map<string, number>();
    for (const s of currentScores) {
      distanceMap.set(s.userId, (distanceMap.get(s.userId) ?? 0) + s.distance);
    }
    return currentUsers
      .filter((u) => u.role === 'member')
      .map((u) => ({
        userId: u.id,
        name: u.name,
        distance: distanceMap.get(u.id) ?? 0,
      }))
      .sort((a, b) => b.distance - a.distance);
  },
}));
