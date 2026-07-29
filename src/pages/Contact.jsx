import { useState, useEffect } from 'react';
import { FiMessageSquare, FiSend, FiStar, FiCheckCircle, FiHeart, FiSmile, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import { FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter, FaReddit } from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';
import feedbackService from '../services/feedbackService';
import { toast } from 'react-toastify';

const categories = [
  { id: 'General Feedback', label: '⭐ General Feedback', color: 'border-primary-500/30 bg-primary-500/10 text-primary-300' },
  { id: 'Feature Request', label: '💡 Feature Request', color: 'border-amber-500/30 bg-amber-500/10 text-amber-300' },
  { id: 'Bug Report', label: '🐛 Bug Report', color: 'border-red-500/30 bg-red-500/10 text-red-300' },
  { id: 'Spot Suggestion', label: '📍 Spot Suggestion', color: 'border-teal-500/30 bg-teal-500/10 text-teal-300' },
  { id: 'Other', label: '💬 Other', color: 'border-purple-500/30 bg-purple-500/10 text-purple-300' },
];

const socialHandles = [
  { name: 'GitHub', url: 'https://github.com/aartisingh07', icon: <FaGithub size={18} />, label: '@aartisingh07', color: 'hover:text-purple-400' },
  { name: 'Instagram', url: 'https://www.instagram.com/sturartii.x_', icon: <FaInstagram size={18} />, label: '@sturartii.x_', color: 'hover:text-pink-400' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/aarti-singh-555ab827b/', icon: <FaLinkedinIn size={18} />, label: 'Aarti Singh', color: 'hover:text-blue-400' },
  { name: 'X', url: 'https://x.com/sturartii_x', icon: <FaXTwitter size={18} />, label: '@sturartii_x', color: 'hover:text-white' },
  { name: 'Reddit', url: 'https://www.reddit.com/user/ZealousidealOne1484/', icon: <FaReddit size={18} />, label: 'ZealousidealOne1484', color: 'hover:text-orange-500' },
];

const Contact = () => {
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

  return (
    <div className="min-h-screen bg-dark-900 bg-grid pt-24 pb-16 px-4">
      {/* Background Ambient Glows */}
      <div className="fixed top-20 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-40 right-1/4 w-96 h-96 bg-neon-teal/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 space-y-8 animate-fade-in">
        
        {/* Header Hero */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-xs font-bold">
            <FiMessageSquare size={14} />
            <span>We'd Love to Hear From You</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-slate-900 dark:text-white">
            Contact & <span className="text-gradient">Feedback</span>
          </h1>
          <p className="text-slate-600 dark:text-white/60 text-sm leading-relaxed">
            Have a question, feature request, bug report, or new outing spot recommendation? Send us a message below or reach out on social media!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* Left Column: Social Handles & Quick Info */}
          <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-6">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-1">
                Get in Touch 📬
              </h3>
              <p className="text-slate-600 dark:text-white/50 text-xs leading-relaxed">
                Connect directly with the developer or follow updates across our social channels.
              </p>
            </div>

            <div className="space-y-3">
              {socialHandles.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-between p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/80 transition-all duration-300 hover:-translate-y-0.5 ${s.color} group`}
                >
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-slate-200 dark:bg-white/5 text-slate-800 dark:text-white group-hover:scale-110 transition-transform">
                      {s.icon}
                    </span>
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{s.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-white/40">{s.label}</p>
                    </div>
                  </div>
                  <span className="text-xs text-primary-400 group-hover:translate-x-1 transition-transform font-bold">→</span>
                </a>
              ))}
            </div>
          </div>

          {/* Right Column: Feedback Form */}
          <div className="md:col-span-2 glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 relative overflow-hidden">
            {submitted ? (
              <div className="py-12 text-center animate-scale-in space-y-4">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto text-4xl shadow-glow-green-sm">
                  <FiCheckCircle />
                </div>
                <h3 className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">
                  Feedback Received! 🎉
                </h3>
                <p className="text-slate-600 dark:text-white/60 text-sm max-w-md mx-auto leading-relaxed">
                  Thank you for helping us improve <strong className="text-gradient">Where To?</strong>. We appreciate your input!
                </p>
                <button
                  onClick={() => { setSubmitted(false); setMessage(''); }}
                  className="btn-primary py-3 px-8 rounded-2xl text-xs font-bold shadow-glow-purple cursor-pointer mt-4"
                >
                  Send Another Response
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-1">
                    Send a Direct Message
                  </h3>
                  <p className="text-slate-500 dark:text-white/40 text-xs">
                    Choose a feedback topic and share your thoughts.
                  </p>
                </div>

                {/* Category Chips */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/40 mb-2">
                    Topic Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
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
                  <div className="flex items-center gap-2 pt-1">
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

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-white/60 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-primary-500"
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
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-slate-600 dark:text-white/60">
                      Message / Feedback Details *
                    </label>
                    <span className="text-[10px] text-slate-400 dark:text-white/30 font-medium">
                      {message.length} / 2000
                    </span>
                  </div>
                  <textarea
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={2000}
                    placeholder="Describe your feedback, request, or spot idea in detail..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-primary-500 leading-relaxed resize-none"
                    required
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-primary py-3.5 rounded-2xl text-xs font-bold shadow-glow-purple flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <FiSend size={16} />
                      <span>Submit Feedback</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
