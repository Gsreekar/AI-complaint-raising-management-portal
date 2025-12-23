
import React, { useState, useEffect } from 'react';
import { User, Complaint, ComplaintStatus, UserRole, Priority } from './types';
import { INITIAL_COMPLAINTS, MOCK_USERS } from './constants';
import ComplaintForm from './components/ComplaintForm';
import ComplaintList from './components/ComplaintList';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'submit' | 'list'>('submit');

  // Simple auto-login for demo purposes
  useEffect(() => {
    setCurrentUser(MOCK_USERS[1]); // Default to Admin for full visibility
  }, []);

  const handleAddComplaint = (complaint: Complaint) => {
    setComplaints([complaint, ...complaints]);
    setActiveTab('list');
  };

  const handleUpdateStatus = (id: string, status: ComplaintStatus) => {
    setComplaints(complaints.map(c => c.id === id ? { ...c, status } : c));
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchUser = (role: UserRole) => {
    const user = MOCK_USERS.find(u => u.role === role);
    if (user) setCurrentUser(user);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <h1 className="text-3xl font-black text-indigo-600 mb-2">AI CMS</h1>
          <p className="text-slate-500 mb-8">Intelligent Complaint Management</p>
          <div className="space-y-4">
            <p className="text-sm font-medium text-slate-700">Select persona to enter</p>
            <button 
              onClick={() => switchUser(UserRole.ADMIN)}
              className="w-full py-3 px-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition"
            >
              Log in as Admin
            </button>
            <button 
              onClick={() => switchUser(UserRole.SUPPORT)}
              className="w-full py-3 px-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition"
            >
              Log in as Support
            </button>
            <button 
              onClick={() => switchUser(UserRole.USER)}
              className="w-full py-3 px-4 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition"
            >
              Log in as Citizen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-100 flex-shrink-0">
        <div className="p-6 border-b border-slate-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black">AI</span>
            </div>
            <h1 className="text-xl font-bold text-slate-800">CMS Portal</h1>
          </div>
          <div className="mt-4 p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500">Logged in as</p>
            <p className="text-sm font-bold text-slate-800">{currentUser.name}</p>
            <p className="text-[10px] text-indigo-600 uppercase tracking-widest font-bold">{currentUser.role}</p>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('submit')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${activeTab === 'submit' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            <span>New Complaint</span>
          </button>
          <button 
            onClick={() => setActiveTab('list')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${activeTab === 'list' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            <span>All Complaints</span>
          </button>
        </nav>

        <div className="absolute bottom-4 left-0 w-full p-4">
          <button 
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-800">
              {activeTab === 'dashboard' && 'Operations Overview'}
              {activeTab === 'submit' && 'Submit New Ticket'}
              {activeTab === 'list' && 'Complaint Register'}
            </h2>
            <p className="text-slate-500 text-sm">Automated tracking & resolution platform</p>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            </button>
          </div>
        </header>

        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' && <Dashboard complaints={complaints} />}
          {activeTab === 'submit' && <ComplaintForm currentUser={currentUser} onComplaintAdded={handleAddComplaint} />}
          {activeTab === 'list' && (
            <ComplaintList 
              complaints={complaints} 
              currentUser={currentUser} 
              onUpdateStatus={handleUpdateStatus} 
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
