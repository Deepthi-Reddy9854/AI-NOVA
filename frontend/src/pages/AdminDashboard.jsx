import React, { useState, useEffect } from 'react';
import { adminAPI, careerAPI } from '../services/api';
import NotificationToast from '../components/NotificationToast';
import {
  ShieldCheck,
  Users,
  Briefcase,
  BrainCircuit,
  Plus,
  Trash2,
  Edit3,
  X,
  Loader2,
  Sparkles,
  BarChart3
} from 'lucide-react';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [careers, setCareers] = useState([]);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('careers');

  // Modal State for Add/Edit Career
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Engineering',
    description: '',
    requiredSkills: '',
    difficulty: 'Intermediate',
    requiredTechnologies: '',
    possibleJobRoles: '',
    averageSalary: '₹9,00,000 - ₹22,00,000 / year',
    growthRate: 'High (22% growth)'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, studRes, carRes] = await Promise.all([
        adminAPI.getStats().catch(() => ({ data: { stats: null } })),
        adminAPI.getAllStudents().catch(() => ({ data: { students: [] } })),
        careerAPI.getCareers({}).catch(() => ({ data: { careers: [] } }))
      ]);

      if (statsRes.data?.stats) setStats(statsRes.data.stats);
      if (studRes.data?.students) setStudents(studRes.data.students);
      if (carRes.data?.careers) setCareers(carRes.data.careers);
    } catch (err) {
      console.error('Failed to load admin panel data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (career = null) => {
    if (career) {
      setEditingId(career._id);
      setFormData({
        title: career.title,
        category: career.category,
        description: career.description,
        requiredSkills: (career.requiredSkills || []).join(', '),
        difficulty: career.difficulty || 'Intermediate',
        requiredTechnologies: (career.requiredTechnologies || []).join(', '),
        possibleJobRoles: (career.possibleJobRoles || []).join(', '),
        averageSalary: career.averageSalary,
        growthRate: career.growthRate
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        category: 'Engineering',
        description: '',
        requiredSkills: 'Python, SQL, React.js',
        difficulty: 'Intermediate',
        requiredTechnologies: 'React.js, Node.js, Express',
        possibleJobRoles: 'Software Developer, Lead Engineer',
        averageSalary: '₹9,00,000 - ₹22,00,000 / year',
        growthRate: 'High (22% growth)'
      });
    }
    setShowModal(true);
  };

  const handleSaveCareer = async (e) => {
    e.preventDefault();
    setToast(null);

    const payload = {
      ...formData,
      requiredSkills: formData.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
      requiredTechnologies: formData.requiredTechnologies.split(',').map((s) => s.trim()).filter(Boolean),
      possibleJobRoles: formData.possibleJobRoles.split(',').map((s) => s.trim()).filter(Boolean)
    };

    try {
      if (editingId) {
        await careerAPI.updateCareer(editingId, payload);
        setToast({ type: 'success', message: 'Career updated successfully!' });
      } else {
        await careerAPI.createCareer(payload);
        setToast({ type: 'success', message: 'New career domain created!' });
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to save career.' });
    }
  };

  const handleDeleteCareer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this career track?')) return;
    try {
      await careerAPI.deleteCareer(id);
      setToast({ type: 'success', message: 'Career removed successfully.' });
      loadData();
    } catch (err) {
      setToast({ type: 'error', message: 'Error removing career.' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Nova AI Admin Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage career taxonomies, view registered student profiles, and monitor recommendation engine statistics
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-extrabold text-xs shadow-glow flex items-center space-x-2 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Career Track</span>
        </button>
      </div>

      <NotificationToast
        type={toast?.type}
        message={toast?.message}
        onClose={() => setToast(null)}
      />

      {/* Top 3 Admin Statistic Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Total Students</p>
            <h3 className="text-3xl font-extrabold text-white mt-1">{stats?.totalStudents || students.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Active Careers</p>
            <h3 className="text-3xl font-extrabold text-white mt-1">{stats?.totalCareers || careers.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">AI Recommendations Generated</p>
            <h3 className="text-3xl font-extrabold text-amber-400 mt-1">{stats?.totalRecommendations || 18}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
            <BrainCircuit className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Manage Careers / View Students) */}
      <div className="flex space-x-3 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('careers')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'careers'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Manage Career Domain Records ({careers.length})
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'students'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Registered Student Profiles ({students.length})
        </button>
      </div>

      {/* TAB 1: Careers Management Table */}
      {activeTab === 'careers' && (
        <div className="glass-card p-6 rounded-3xl border border-slate-800 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Career Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Difficulty</th>
                <th className="py-3 px-4">Average Salary</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {careers.map((career) => (
                <tr key={career._id} className="hover:bg-slate-900/40">
                  <td className="py-3.5 px-4 font-bold text-white">{career.title}</td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-cyan-300">{career.category}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                      {career.difficulty}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs font-bold text-emerald-400">{career.averageSalary}</td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenModal(career)}
                      className="p-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 transition-colors"
                      title="Edit Career"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCareer(career._id)}
                      className="p-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 transition-colors"
                      title="Delete Career"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: Students List */}
      {activeTab === 'students' && (
        <div className="glass-card p-6 rounded-3xl border border-slate-800 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Email Address</th>
                <th className="py-3 px-4">College</th>
                <th className="py-3 px-4">Branch / Degree</th>
                <th className="py-3 px-4">Graduation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {students.map((student) => (
                <tr key={student._id} className="hover:bg-slate-900/40">
                  <td className="py-3.5 px-4 font-bold text-white">{student.fullName}</td>
                  <td className="py-3.5 px-4 text-xs text-slate-300">{student.email}</td>
                  <td className="py-3.5 px-4 text-xs text-slate-300">{student.college || 'State University'}</td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-cyan-300">{student.course}</td>
                  <td className="py-3.5 px-4 text-xs font-bold text-slate-400">{student.graduationYear}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Career Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-xl w-full p-6 rounded-3xl border border-slate-800 max-h-[90vh] overflow-y-auto space-y-4 relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                {editingId ? 'Edit Career Track' : 'Create New Career Domain'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCareer} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Career Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Data & Analytics">Data & Analytics</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Security">Security</option>
                    <option value="Design & Product">Design & Product</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Description</label>
                <textarea
                  required
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Required Skills (Comma-separated)</label>
                <input
                  type="text"
                  required
                  value={formData.requiredSkills}
                  onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-glow"
                >
                  Save Career Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
