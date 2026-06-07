import { create } from 'zustand';
import type { User } from '@/mock/users';
import { users } from '@/mock/users';

interface UserState {
  currentUser: User;
  users: User[];
  role: 'coach' | 'member';
  switchRole: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: users.find((u) => u.id === 'm1')!,
  users,
  role: 'member',
  switchRole: () =>
    set((state) => {
      const newRole = state.role === 'coach' ? 'member' : 'coach';
      const newUser = state.users.find((u) => u.role === newRole)!;
      return { role: newRole, currentUser: newUser };
    }),
}));
