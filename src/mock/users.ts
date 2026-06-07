export interface User {
  id: string;
  name: string;
  role: 'coach' | 'member';
  groupId: string;
  avatar: string;
}

export const users: User[] = [
  { id: 'c1', name: '王教练', role: 'coach', groupId: 'g1', avatar: '' },
  { id: 'm1', name: '张三', role: 'member', groupId: 'g1', avatar: '' },
  { id: 'm2', name: '李四', role: 'member', groupId: 'g1', avatar: '' },
  { id: 'm3', name: '王五', role: 'member', groupId: 'g2', avatar: '' },
  { id: 'm4', name: '赵六', role: 'member', groupId: 'g2', avatar: '' },
  { id: 'm5', name: '孙七', role: 'member', groupId: 'g2', avatar: '' },
];
