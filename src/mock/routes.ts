export interface RouteItem {
  id: string;
  name: string;
  distance: number;
  elevation: number;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  favorited: boolean;
  tags: string[];
}

export const routes: RouteItem[] = [
  {
    id: 'rt1',
    name: '奥森南园环线',
    distance: 5.0,
    elevation: 18,
    difficulty: 'easy',
    description: '奥林匹克森林公园南园平坦环线，路面平整，适合轻松跑和恢复跑，是北京跑者最常去的经典路线。',
    favorited: true,
    tags: ['公园', '平坦', '夜间可跑'],
  },
  {
    id: 'rt2',
    name: '奥森北园山地线',
    distance: 8.5,
    elevation: 85,
    difficulty: 'medium',
    description: '奥林匹克森林公园北园山地路段，起伏较大，有多个缓坡和急坡，适合节奏跑和力量训练。',
    favorited: true,
    tags: ['公园', '起伏', '山地'],
  },
  {
    id: 'rt3',
    name: '朝阳公园湖畔线',
    distance: 3.8,
    elevation: 10,
    difficulty: 'easy',
    description: '朝阳公园内绕湖路线，风景优美，路面平坦，适合初学者和轻松跑，春夏季节绿树成荫。',
    favorited: false,
    tags: ['公园', '湖景', '平坦'],
  },
  {
    id: 'rt4',
    name: '玉渊潭-长安街线',
    distance: 10.2,
    elevation: 35,
    difficulty: 'medium',
    description: '从玉渊潭公园出发沿长安街到建国门，途经多个地标建筑，适合长距离训练，注意避让行人。',
    favorited: false,
    tags: ['城市', '地标', '长距离'],
  },
  {
    id: 'rt5',
    name: '香山防火道爬坡线',
    distance: 6.5,
    elevation: 210,
    difficulty: 'hard',
    description: '香山公园防火道持续爬坡路线，海拔爬升超过200米，对腿部力量和心肺能力要求高，适合进阶跑者训练。',
    favorited: true,
    tags: ['山地', '爬坡', '高强度'],
  },
  {
    id: 'rt6',
    name: '护城河滨河步道',
    distance: 7.2,
    elevation: 12,
    difficulty: 'easy',
    description: '沿北京护城河的滨河步道，路面平坦宽敞，沿途有休息设施，适合中等距离轻松跑和周末长跑。',
    favorited: false,
    tags: ['河景', '平坦', '步道'],
  },
];
