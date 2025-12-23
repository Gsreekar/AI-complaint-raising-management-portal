
export enum ComplaintStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
  REJECTED = 'Rejected'
}

export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPPORT = 'SUPPORT'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
}

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  category: string;
  priority: Priority;
  status: ComplaintStatus;
  createdAt: string;
  imageUrl?: string;
  assignedDepartment: string;
  aiReasoning: string;
}

export interface AIAnalysis {
  category: string;
  priority: Priority;
  assignedDepartment: string;
  reasoning: string;
}
