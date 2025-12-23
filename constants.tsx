
import React from 'react';
import { Complaint, ComplaintStatus, Priority, UserRole, User } from './types';

export const MOCK_USERS: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: UserRole.USER },
  { id: '2', name: 'Admin Jane', email: 'admin@system.com', role: UserRole.ADMIN },
  { id: '3', name: 'Support Bob', email: 'bob@support.com', role: UserRole.SUPPORT, department: 'IT Hardware' }
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'c1',
    userId: '1',
    userName: 'John Doe',
    title: 'Monitor flickering',
    description: 'My secondary monitor keeps flickering and turning off randomly.',
    category: 'Hardware',
    priority: Priority.MEDIUM,
    status: ComplaintStatus.PENDING,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    assignedDepartment: 'IT Hardware',
    aiReasoning: 'Detected hardware issue based on monitor behavior.'
  },
  {
    id: 'c2',
    userId: '1',
    userName: 'John Doe',
    title: 'VPN connection failing',
    description: 'Cannot connect to the corporate VPN from home.',
    category: 'Network',
    priority: Priority.HIGH,
    status: ComplaintStatus.IN_PROGRESS,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    assignedDepartment: 'Network Infrastructure',
    aiReasoning: 'Critical connectivity issue affecting remote work.'
  }
];

export const DEPARTMENTS = [
  'IT Hardware',
  'Software Development',
  'Network Infrastructure',
  'Human Resources',
  'Finance',
  'Facilities Management'
];
