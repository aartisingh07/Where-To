import { useState, useEffect } from 'react';
import { FiX, FiMessageSquare, FiSend, FiStar, FiCheckCircle, FiHeart, FiSmile } from 'react-icons/fi';
import { FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter, FaReddit } from 'react-icons/fa6';
import { useAuth } from '../../context/AuthContext';
import feedbackService from '../../services/feedbackService';
import { toast } from 'react-toastify';

const categories = [
  { id: 'General Feedback', label: '⭐ General Feedback', color: 'border-primary-500/30 bg-primary-500/10 text-primary-300' },
  { id: 'Feature Request', label: '💡 Feature Request', color: 'border-amber-500/30 bg-amber-500/10 text-amber-300' },
  { id: 'Bug Report', label: '🐛 Bug Report', color: 'border-red-500/30 bg-red-500/10 text-red-300' },
  { id: 'Spot Suggestion', label: '📍 Spot Suggestion', color: 'border-teal-500/30 bg-teal-500/10 text-teal-300' },
  { id: 'Other', label: '💬 Other', color: 'border-purple-500/30 bg-purple-500/10 text-purple-300' },
];

const FeedbackModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('General Feedback');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.username || '');
      setEmail(user.email || '');
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Please enter your feedback message');
      return;
    }

    setSubmitting(true);
    try {
      await feedbackService.submitFeedback({
        name: name.trim() || 'Anonymous Explorer',
        email: email.trim() || 'no-email@whereto.app',
        category,
        rating,
        message: message.trim(),
      });
      setSubmitted(true);
      toast.success('Thank you! Your feedback has been sent. ❤️');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setMessage('');
    setRating(5);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg glass-card rounded-3xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-teal/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <FiX size={18} />
        </button>

        {submitted ? (
          <div className="py-8 text-center animate-scale-in space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto text-3xl shadow-glow-green-sm">
              <FiCheckCircle />
            </div>
            <h3 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">
              Thank You! 🎉
            </h3>
            <p className="text-slate-600 dark:text-white/60 text-sm max-w-md mx-auto leading-relaxed">
              Your message has been received! We read every piece of feedback to make <strong className="text-gradient">Where To?</strong> better for everyone.
            </p>
            <button
              onClick={handleReset}
              className="btn-primary py-2.5 px-6 rounded-xl text-xs font-bold shadow-glow-purple cursor-pointer mt-4"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xl shadow-glow-purple-sm">
                <FiMessageSquare />
              </div>
              <div>
                <h2 className="font-display font-extrabold text-xl text-slate-900 dark:text-white">
                  Contact & Feedback
                </h2>
                <p className="text-slate-500 dark:text-white/40 text-xs">
                  Got a suggestion, found a bug, or want to say hi?
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category Chips */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/40 mb-2">
                  Feedback Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        category === cat.id
                          ? `${cat.color} font-bold shadow-sm scale-105`
                          : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/50 hover:bg-slate-200 dark:hover:bg-white/10'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Star Rating */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/40 mb-1">
                  How's your experience with Where To?
                </label>
                <div className="flex items-center gap-1.5 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 text-2xl transition-transform hover:scale-125 cursor-pointer bg-transparent border-none outline-none"
                    >
                      <FiStar
                        className={`${
                          (hoverRating || rating) >= star
                            ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                            : 'text-slate-300 dark:text-white/20'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-400 ml-2">
                    {rating} / 5 Stars
                  </span>
                </div>
              </div>

              {/* Name & Email inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-white/60 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-white/60 mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-600 dark:text-white/60">
                    Your Feedback / Message *
                  </label>
                  <span className="text-[10px] text-slate-400 dark:text-white/30 font-medium">
                    {message.length} / 2000
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={2000}
                  placeholder="Tell us what you love, what needs fixing, or feature ideas..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-primary-500 leading-relaxed resize-none"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary py-3 rounded-xl text-xs font-bold shadow-glow-purple flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <FiSend size={14} />
                    <span>Submit Feedback</span>
                  </>
                )}
              </button>
            </form>

            {/* Direct Social Handles Banner */}
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-white/40 font-medium">Connect directly:</span>
              <div className="flex items-center gap-2">
                <a href="https://github.com/aartisingh07" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-purple-400 transition-colors p-1"><FaGithub size={16} /></a>
                <a href="https://www.instagram.com/sturartii.x_" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-400 transition-colors p-1"><FaInstagram size={16} /></a>
                <a href="https://www.linkedin.com/in/aarti-singh-555ab827b/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors p-1"><FaLinkedinIn size={16} /></a>
                <a href="https://x.com/sturartii_x" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors p-1"><FaXTwitter size={16} /></a>
                <a href="https://www.reddit.com/user/ZealousidealOne1484/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-orange-400 transition-colors p-1"><FaReddit size={16} /></a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
