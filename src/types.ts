export interface User {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  branch: string;
  role: 'student' | 'admin';
  points: number;
  completedProblems: string[]; // array of problem IDs
  notes: Array<{ id: string; title: string; content: string; updatedAt: string }>;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'contest' | 'workshop' | 'general' | 'achievement';
  date: string;
  author: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  category: 'Resource' | 'Playlist' | 'PDF' | 'Template';
  tags: string[];
  link: string;
  author: string;
  likes: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  rollNumber: string;
  branch: string;
  points: number;
  solvedCount: number;
  rank?: number;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  platform: string;
  link: string;
  youtubeId?: string; // Optional Striver/Video tutorial link
}

export interface UpcomingContest {
  id: string;
  title: string;
  platform: 'Codeforces' | 'CodeChef' | 'LeetCode' | 'AtCoder';
  startTime: string; // ISO string or text
  duration: string;
  link: string;
}
