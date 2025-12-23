
import React from 'react';
import { Complaint, ComplaintStatus, Priority, UserRole, User } from '../types';

interface ComplaintListProps {
  complaints: Complaint[];
  currentUser: User;
  onUpdateStatus: (id: string, status: ComplaintStatus) => void;
}

const ComplaintList: React.FC<ComplaintListProps> = ({ complaints, currentUser, onUpdateStatus }) => {
  const isPrivileged = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.SUPPORT;

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.CRITICAL: return 'bg-red-100 text-red-800 border-red-200';
      case Priority.HIGH: return 'bg-orange-100 text-orange-800 border-orange-200';
      case Priority.MEDIUM: return 'bg-amber-100 text-amber-800 border-amber-200';
      case Priority.LOW: return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusColor = (status: ComplaintStatus) => {
    switch (status) {
      case ComplaintStatus.RESOLVED: return 'bg-emerald-100 text-emerald-800';
      case ComplaintStatus.IN_PROGRESS: return 'bg-amber-100 text-amber-800';
      case ComplaintStatus.REJECTED: return 'bg-red-100 text-red-800';
      case ComplaintStatus.PENDING: return 'bg-blue-100 text-blue-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Complaint</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Details</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {complaints.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  No complaints found.
                </td>
              </tr>
            ) : (
              complaints.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition duration-150">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{c.title}</div>
                    <div className="text-xs text-slate-400">ID: {c.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-700">{c.userName}</div>
                    <div className="text-xs text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 inline-block mb-1">{c.category}</div>
                    <div className="text-xs text-slate-500 truncate max-w-[200px]">{c.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getPriorityColor(c.priority)}`}>
                      {c.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(c.status)}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {isPrivileged && (
                      <select
                        className="text-xs border rounded-lg p-1 bg-white outline-none focus:ring-1 focus:ring-indigo-500"
                        value={c.status}
                        onChange={(e) => onUpdateStatus(c.id, e.target.value as ComplaintStatus)}
                      >
                        {Object.values(ComplaintStatus).map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    )}
                    {!isPrivileged && (
                      <button className="text-indigo-600 hover:text-indigo-800 font-bold text-xs">View details</button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComplaintList;
