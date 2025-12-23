
import React, { useState, useRef } from 'react';
import { User, AIAnalysis, Complaint, ComplaintStatus, Priority } from '../types';
import { analyzeComplaint } from '../services/geminiService';

interface ComplaintFormProps {
  currentUser: User;
  onComplaintAdded: (complaint: Complaint) => void;
}

const ComplaintForm: React.FC<ComplaintFormProps> = ({ currentUser, onComplaintAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiPreview, setAiPreview] = useState<AIAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!title || !description) return;
    setIsSubmitting(true);
    try {
      const analysis = await analyzeComplaint(`${title}\n\n${description}`, image || undefined);
      setAiPreview(analysis);
    } catch (error) {
      console.error('AI Analysis failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPreview) return;

    const newComplaint: Complaint = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      userName: currentUser.name,
      title,
      description,
      category: aiPreview.category,
      priority: aiPreview.priority,
      status: ComplaintStatus.PENDING,
      createdAt: new Date().toISOString(),
      imageUrl: image || undefined,
      assignedDepartment: aiPreview.assignedDepartment,
      aiReasoning: aiPreview.reasoning
    };

    onComplaintAdded(newComplaint);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setImage(null);
    setAiPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-indigo-600 p-6">
        <h2 className="text-xl font-bold text-white">File a New Complaint</h2>
        <p className="text-indigo-100 text-sm">Describe your issue and let our AI categorize it for you.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Issue Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            placeholder="Brief title of the issue"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Detailed Description</label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            placeholder="Please provide details about the problem..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Attach Image (Optional)</label>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition text-sm font-medium"
            >
              Choose File
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            {image && <span className="text-xs text-emerald-600 font-medium">Image attached</span>}
          </div>
          {image && (
            <div className="mt-2">
              <img src={image} alt="Preview" className="h-32 rounded-lg border border-slate-200 object-cover" />
            </div>
          )}
        </div>

        {!aiPreview ? (
          <button
            type="button"
            disabled={!title || !description || isSubmitting}
            onClick={handleAnalyze}
            className="w-full py-3 px-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>AI is analyzing...</span>
              </>
            ) : (
              <span>Analyze & Review</span>
            )}
          </button>
        ) : (
          <div className="p-6 bg-slate-50 rounded-xl border border-indigo-100 animate-in fade-in slide-in-from-bottom-2">
            <h3 className="font-bold text-indigo-900 mb-4 flex items-center">
              <span className="mr-2">✨</span> AI Classification Preview
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <p className="text-slate-500">Predicted Category</p>
                <p className="font-semibold text-slate-800">{aiPreview.category}</p>
              </div>
              <div>
                <p className="text-slate-500">Priority Level</p>
                <p className={`font-bold ${
                  aiPreview.priority === Priority.CRITICAL ? 'text-red-600' :
                  aiPreview.priority === Priority.HIGH ? 'text-orange-600' :
                  aiPreview.priority === Priority.MEDIUM ? 'text-amber-600' : 'text-blue-600'
                }`}>
                  {aiPreview.priority}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-slate-500">Assigned Department</p>
                <p className="font-semibold text-slate-800">{aiPreview.assignedDepartment}</p>
              </div>
              <div className="col-span-2">
                <p className="text-slate-500">AI Reasoning</p>
                <p className="italic text-slate-600">{aiPreview.reasoning}</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 py-2 px-4 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition"
              >
                Submit Complaint
              </button>
              <button
                type="button"
                onClick={() => setAiPreview(null)}
                className="py-2 px-4 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 transition"
              >
                Edit
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ComplaintForm;
