import { useState, useEffect } from 'react';
import { FiMessageSquare, FiStar, FiFilter, FiCheckCircle, FiTrash2, FiMail, FiRefreshCw, FiClock, FiCheck, FiInbox } from 'react-icons/fi';
import feedbackService from '../services/feedbackService';
import { toast } from 'react-toastify';
import { handleAvatarError } from '../utils/avatarHelper';

const categoryBadges = {
  'General Feedback': 'bg-primary-500/10 text-primary-300 border-primary-500/20',
  'Feature Request': 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  'Bug Report': 'bg-red-500/10 text-red-300 border-red-500/20',
  'Spot Suggestion': 'bg-teal-500/10 text-teal-300 border-teal-500/20',
  'Other': 'bg-purple-500/10 text-purple-300 border-purple-500/20',
};

const statusBadges = {
  'New': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Reviewed': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'Resolved': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
};

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const data = await feedbackService.getFeedbacks();
      setFeedbacks(data || []);
    } catch (err) {
      toast.error('Failed to load admin feedback inbox');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await feedbackService.updateStatus(id, newStatus);
      setFeedbacks((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
      );
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback submission?')) return;
    try {
      await feedbackService.deleteFeedback(id);
      setFeedbacks((prev) => prev.filter((item) => item._id !== id));
      toast.success('Feedback deleted successfully');
    } catch (err) {
      toast.error('Failed to delete feedback');
    }
  };

  // Filtered List
  const filteredFeedbacks = feedbacks.filter((item) => {
    const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
    const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
    return matchesCategory && matchesStatus;
  });

  // Calculate Inbox Stats
  const totalCount = feedbacks.length;
  const avgRating =
    totalCount > 0
      ? (feedbacks.reduce((sum, f) => sum + (f.rating || 5), 0) / totalCount).toFixed(1)
      : '5.0';
  const bugCount = feedbacks.filter((f) => f.category === 'Bug Report').length;
  const spotCount = feedbacks.filter((f) => f.category === 'Spot Suggestion').length;

  return (
    <div className="min-h-screen bg-dark-900 bg-grid pt-24 pb-16 px-4">
      {/* Background Ambient Glows */}
      <div className="fixed top-20 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-40 right-1/4 w-96 h-96 bg-neon-teal/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-8 animate-fade-in">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-xs font-bold mb-2">
              <FiInbox size={14} />
              <span>Admin Feedback Inbox</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-slate-900 dark:text-white">
              User <span className="text-gradient">Feedback & Contact Messages</span>
            </h1>
            <p className="text-slate-600 dark:text-white/50 text-xs mt-1">
              Review user ratings, bug reports, feature requests, and spot suggestions in real-time.
            </p>
          </div>

          <button
            onClick={fetchFeedbacks}
            className="btn-primary py-2.5 px-4 rounded-xl text-xs font-bold shadow-glow-purple flex items-center gap-2 cursor-pointer flex-shrink-0"
          >
            <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh Inbox</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-white/10 text-center">
            <span className="text-2xl block mb-1">📬</span>
            <h4 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">{totalCount}</h4>
            <p className="text-slate-500 dark:text-white/40 text-xs font-semibold">Total Submissions</p>
          </div>
          <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-white/10 text-center">
            <span className="text-2xl block mb-1">⭐</span>
            <h4 className="font-display font-extrabold text-2xl text-amber-400">{avgRating} / 5</h4>
            <p className="text-slate-500 dark:text-white/40 text-xs font-semibold">Avg User Rating</p>
          </div>
          <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-white/10 text-center">
            <span className="text-2xl block mb-1">🐛</span>
            <h4 className="font-display font-extrabold text-2xl text-red-400">{bugCount}</h4>
            <p className="text-slate-500 dark:text-white/40 text-xs font-semibold">Bug Reports</p>
          </div>
          <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-white/10 text-center">
            <span className="text-2xl block mb-1">📍</span>
            <h4 className="font-display font-extrabold text-2xl text-teal-400">{spotCount}</h4>
            <p className="text-slate-500 dark:text-white/40 text-xs font-semibold">Spot Suggestions</p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="glass-card p-4 rounded-2xl border border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/40 mr-1 flex items-center gap-1">
              <FiFilter size={12} /> Category:
            </span>
            {['All', 'General Feedback', 'Feature Request', 'Bug Report', 'Spot Suggestion', 'Other'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-primary-500/20 border-primary-500/30 text-primary-300 font-bold'
                    : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/50 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/40">Status:</span>
            {['All', 'New', 'Reviewed', 'Resolved'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  filterStatus === st
                    ? 'bg-neon-teal/20 border-neon-teal/30 text-neon-teal font-bold'
                    : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Submissions List */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredFeedbacks.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-3xl border border-slate-200 dark:border-white/10">
            <span className="text-4xl block mb-2">📭</span>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">No Feedback Submissions Found</h3>
            <p className="text-slate-500 dark:text-white/40 text-xs mt-1">There are no messages matching your selected filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFeedbacks.map((item) => (
              <div
                key={item._id}
                className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-white/10 hover:border-primary-500/30 transition-all duration-300 space-y-4"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 p-0.5 flex-shrink-0">
                      <div className="w-full h-full rounded-full bg-dark-800 flex items-center justify-center overflow-hidden text-xs font-bold text-white">
                        {item.user?.avatar ? (
                          <img
                            src={item.user.avatar}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => handleAvatarError(e, item.name)}
                          />
                        ) : (
                          item.name?.charAt(0).toUpperCase() || 'U'
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                        <span>{item.name}</span>
                        {item.email && (
                          <a
                            href={`mailto:${item.email}`}
                            className="text-xs text-primary-400 hover:underline font-normal flex items-center gap-1"
                          >
                            <FiMail size={12} /> {item.email}
                          </a>
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-white/40 font-medium">
                        Submitted on {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${categoryBadges[item.category] || categoryBadges['General Feedback']}`}>
                      {item.category}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${statusBadges[item.status] || statusBadges['New']}`}>
                      {item.status || 'New'}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-amber-400 text-sm">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <FiStar key={i} className="fill-amber-400" size={14} />
                    ))}
                    <span className="text-xs font-bold ml-1 text-slate-600 dark:text-white/60">
                      ({item.rating || 5} / 5)
                    </span>
                  </div>
                  <p className="text-slate-800 dark:text-white/90 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap bg-slate-100/50 dark:bg-white/3 p-4 rounded-2xl border border-slate-200 dark:border-white/5 font-sans">
                    {item.message}
                  </p>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 dark:text-white/40 font-medium">Change Status:</span>
                    {['New', 'Reviewed', 'Resolved'].map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateStatus(item._id, st)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                          item.status === st
                            ? 'bg-primary-500/20 text-primary-300 border-primary-500/40 font-bold'
                            : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/40 border-slate-200 dark:border-white/10 hover:text-white'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {item.email && (
                      <a
                        href={`mailto:${item.email}?subject=Regarding your Where To? Feedback [${item.category}]&body=Hi ${item.name},\n\nThank you for reaching out to Where To!...`}
                        className="btn-secondary py-1.5 px-3 rounded-xl text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <FiMail size={12} /> Reply Email
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all cursor-pointer"
                      title="Delete Feedback"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminFeedback;
