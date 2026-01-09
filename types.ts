export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  college?: string;
  yearOfStudy?: string;
  interests: string[];
  skillsHave: string[];
  skillsWant: string[];
  externalProfiles: {
    github?: string;
    leetcode?: string;
    linkedin?: string;
  };
  signals: {
    type: string;
    value: number | string;
    label: string;
    verified: boolean;
  }[];
  hackathons: {
    eventName: string;
    year: string;
    role: string;
    verified: boolean;
  }[];
}

export interface Project {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  techStack: string[];
  tags: string[];
  members: string[]; // User IDs
  createdAt: string;
  stats: {
    humanTokens: number;
    aiTokens: number;
  };
}

export interface Message {
  id: string;
  projectId: string;
  userId: string; // 'ai' for AI
  content: string;
  isAiAssisted: boolean;
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  assigneeId?: string;
}

export interface Notification {
  id: string;
  recipientId: string;
  senderId: string;
  type: 'invite' | 'message';
  resourceId: string; // Project ID
  content?: string;
  isRead: boolean;
  createdAt: string;
  status?: 'pending' | 'accepted' | 'rejected'; // For invites
}

export enum ViewState {
  LANDING,
  ONBOARDING,
  DASHBOARD,
  PROJECT_DETAIL,
  FIND_COLLABORATORS,
  PROFILE,
  USER_PROFILE,
  ADMIN
}