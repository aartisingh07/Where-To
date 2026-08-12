import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiCompass, FiUsers, FiTv, FiGlobe,
  FiMapPin, FiMessageSquare, FiImage, FiUser, FiCheckCircle, FiHelpCircle,
  FiArrowRight, FiSearch, FiSliders, FiClock, FiShield, FiHeart,
  FiChevronDown, FiChevronUp, FiPlay, FiSliders as FiFilter, FiCheck, FiX,
  FiLock, FiStar, FiZap, FiTarget
} from 'react-icons/fi';
import { FaGithub, FaGoogle } from 'react-icons/fa6';
import Logo from '../components/layout/Logo';

const Guide = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqList = [
    {
      q: "What is Where To? and why was it created?",
      a: "Where To? is a real-time collaborative social platform designed to solve the age-old dilemma: 'Where should we go?' or 'What should we do?'. Whether you're exploring nearby places solo, planning a hangout with friends, deciding on a movie to watch, or finding a geographic midpoint to meet up, Where To? streamlines decision-making."
    },
    {
      q: "Do my friends need an account to join a room?",
      a: "Logged-in users can host rooms, save places, send direct messages, and post to the feed. Guests can join public rooms via code or browse public active lobbies. However, creating an account with Google or GitHub unlocks full features like Host Request Management, DMs, and Saved Places!"
    },
    {
      q: "How does the Midpoint Calculator in Outing Lounge work?",
      a: "Each group member submits their current location (via GPS or city search). The platform calculates the geographic center (centroid) of everyone's coordinates and finds top-rated cafes, restaurants, or parks near that central point, ensuring equal travel distance for all participants."
    },
    {
      q: "Why are password registration forms disabled?",
      a: "To prevent fake profiles, bot spam, and credential leaks, Where To? uses passwordless OAuth authentication via official Google & GitHub providers. It ensures 1-click safe logins without needing to remember extra passwords."
    },
    {
      q: "How does Host Request Management work when joining rooms?",
      a: "When a user requests to join a room, they can attach a custom note explaining why they want to tag along. The room host receives a real-time alert in their host manager panel to inspect the user's profile/note and either Accept or Decline the request."
    },
    {
      q: "Can I save places for future visits?",
      a: "Yes! Whenever you discover a spot in Explore mode or Outing lounge, click the bookmark/heart icon. All saved locations are stored in your private Saved Places dashboard with coordinate tags and 1-click Google Maps direction links."
    },
    {
      q: "How does username handle validation work?",
      a: "Your handle follows standard Instagram username rules (letters, numbers, underscores, periods, 3-30 characters). To prevent handle squatting and frequent changes, handle updates are limited to once every 30 days."
    }
  ];

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Background ambient glow */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-primary-500/10 via-accent-purple/10 to-neon-cyan/10 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto space-y-16">

        {/* ─── HERO HEADER ──────────────────────────────────────────────── */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 text-xs font-semibold tracking-wide uppercase">
            <FiHelpCircle className="animate-bounce" size={14} /> Official Platform User Guide
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight">
            Everything You Need to Know About <span className="text-gradient">Where To?</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-slate-400 font-normal leading-relaxed">
            Stop asking. Start going. Learn how to discover solo hangouts, host multiplayer rooms, decide on movies and games, and sync with your friends in real-time.
          </p>

          {/* Navigation Pills */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {[
              { id: 'all', label: '📖 All Topics' },
              { id: 'quickstart', label: '⚡ Quick Start' },
              { id: 'explore', label: '🧭 Explore Mode' },
              { id: 'rooms', label: '👥 Group Rooms' },
              { id: 'lounges', label: '🎮 Lounges' },
              { id: 'social', label: '💬 DMs & Feed' },
              { id: 'faq', label: '❓ FAQ' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white shadow-glow-purple-sm scale-105'
                    : 'glass-card text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ─── QUICK START ROADMAP (Shown when 'all' or 'quickstart') ─── */}
        {(activeTab === 'all' || activeTab === 'quickstart') && (
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary-500/20 text-primary-400">
                <FiZap size={22} />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-white">4-Step Quick Start Roadmap</h2>
                <p className="text-xs text-slate-400">Get up and running on Where To? in less than 2 minutes.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  step: "01",
                  title: "Instant Sign In",
                  icon: <FaGoogle size={20} className="text-blue-400" />,
                  desc: "Log in with 1-click via Google or GitHub OAuth. No forms or extra passwords needed."
                },
                {
                  step: "02",
                  title: "Pick Your Mode",
                  icon: <FiCompass size={20} className="text-cyan-400" />,
                  desc: "Explore spots nearby solo using mood filters, or Create a Room to bring friends along."
                },
                {
                  step: "03",
                  title: "Enter a Lounge",
                  icon: <FiTv size={20} className="text-purple-400" />,
                  desc: "Switch between Watch, Game, Study, or Outing Lounges to decide, vote, or sync."
                },
                {
                  step: "04",
                  title: "Bookmark & Go",
                  icon: <FiHeart size={20} className="text-pink-400" />,
                  desc: "Save your favorite spots to your dashboard and launch 1-click Google Maps directions."
                }
              ].map((item) => (
                <div key={item.step} className="glass-card p-5 relative overflow-hidden group hover:border-primary-500/40 transition-all">
                  <span className="absolute -top-2 -right-2 text-5xl font-display font-black text-white/5 group-hover:text-primary-500/10 transition-colors">
                    {item.step}
                  </span>
                  <div className="mb-3 p-2.5 w-fit rounded-lg bg-white/5 border border-white/10">
                    {item.icon}
                  </div>
                  <h3 className="font-display font-bold text-white text-base mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── SECTION 1: SOLO EXPLORE MODE ───────────────────────────── */}
        {(activeTab === 'all' || activeTab === 'explore') && (
          <section className="glass-card p-6 sm:p-8 space-y-6 border-cyan-500/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <FiCompass size={28} />
                </div>
                <div>
                  <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Solo Finder</span>
                  <h2 className="text-2xl font-display font-bold text-white">Explore Mode</h2>
                </div>
              </div>
              <Link to="/explore" className="btn-secondary !px-4 !py-2 text-xs flex items-center gap-2 w-fit">
                Try Explore Mode <FiArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                  <FiMapPin size={16} /> Geolocation & Radius Toggles
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Automatically detects your current browser GPS location. Switch distance ranges between <strong>Nearby (2km)</strong>, <strong>Mid-range (5km)</strong>, or <strong>Anywhere (10km)</strong>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
                  <FiFilter size={16} /> Mood & Category Selectors
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Filter places by vibe: <em>Cozy Cafes</em>, <em>Work-Friendly with WiFi</em>, <em>Late Night Hangouts</em>, <em>Sunset Views</em>, or <em>Unfiltered Landmarks</em>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                  <FiTarget size={16} /> Landmark Proximity Biasing
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Prioritizes spots near your city (Tier 1: &lt;100km, Tier 2: India-wide, Tier 3: International) and ranks exact landmark matches at the top.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ─── SECTION 2: MULTIPLAYER ROOMS & HOST CONTROLS ─────────── */}
        {(activeTab === 'all' || activeTab === 'rooms') && (
          <section className="glass-card p-6 sm:p-8 space-y-6 border-purple-500/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <FiUsers size={28} />
                </div>
                <div>
                  <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Multiplayer Lobbies</span>
                  <h2 className="text-2xl font-display font-bold text-white">Group Rooms & Host Manager</h2>
                </div>
              </div>
              <div className="flex gap-2">
                <Link to="/create-room" className="btn-primary !px-3 !py-1.5 text-xs flex items-center gap-1.5">
                  Create Room
                </Link>
                <Link to="/join-room" className="btn-secondary !px-3 !py-1.5 text-xs flex items-center gap-1.5">
                  Browse Lobbies
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-display font-semibold text-white flex items-center gap-2">
                  <FiZap className="text-amber-400" size={18} /> How Rooms Work
                </h3>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <FiCheck className="text-emerald-400 mt-0.5 flex-shrink-0" size={16} />
                    <span><strong>6-Character Room Code:</strong> Hosts create a lobby and share the code (e.g. <code>W7K9P2</code>) with friends to join instantly.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <FiCheck className="text-emerald-400 mt-0.5 flex-shrink-0" size={16} />
                    <span><strong>Public Lobbies Directory:</strong> Explore active public rooms, view current member counts, and send a join request.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <FiCheck className="text-emerald-400 mt-0.5 flex-shrink-0" size={16} />
                    <span><strong>Real-time Group Chat:</strong> Chat with members in room text chat with automatic join/leave notices and host badges.</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-display font-semibold text-white flex items-center gap-2">
                  <FiShield className="text-purple-400" size={18} /> Host Controls & Security
                </h3>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <FiCheck className="text-purple-400 mt-0.5 flex-shrink-0" size={16} />
                    <span><strong>Join Request Manager:</strong> Users submit join requests with custom notes. Hosts can review profiles and Accept or Decline.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <FiCheck className="text-purple-400 mt-0.5 flex-shrink-0" size={16} />
                    <span><strong>Instant Kicks:</strong> Hosts can hover over any member in the sidebar to kick them out instantly.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <FiCheck className="text-purple-400 mt-0.5 flex-shrink-0" size={16} />
                    <span><strong>Room Purge:</strong> When the host closes a room, all members are gracefully disconnected and redirected home.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* ─── SECTION 3: COLLABORATIVE LOUNGES ───────────────────────── */}
        {(activeTab === 'all' || activeTab === 'lounges') && (
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-pink-500/20 text-pink-400">
                <FiTv size={22} />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-white">4 Specialized Collaborative Lounges</h2>
                <p className="text-xs text-slate-400">Inside every room, hosts and members can switch between specialized interactive modes.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Watch Lounge */}
              <div className="glass-card p-6 border-pink-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-semibold flex items-center gap-1.5">
                    <FiTv size={14} /> Watch Lounge
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">TMDB API & Streaming</span>
                </div>
                <h3 className="text-base font-display font-bold text-white">Movie Decision Maker & Voting</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Browse trending TMDB movies, filter by mood, genre, and language, propose movies to the group, vote in real-time, and view direct streaming platform availability badges (Netflix, Prime Video, Disney+).
                </p>
              </div>

              {/* Game Lounge */}
              <div className="glass-card p-6 border-indigo-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold flex items-center gap-1.5">
                    🎮 Game Lounge
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Live Polling</span>
                </div>
                <h3 className="text-base font-display font-bold text-white">Browser Games & Live Polling</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Can't agree on what to play? Select from mini browser games, launch a group poll (Yes, No, Maybe progress bars), and let the host lock in the winning choice.
                </p>
              </div>

              {/* Study Lounge */}
              <div className="glass-card p-6 border-emerald-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
                    📚 Study Lounge
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Synced Pomodoro</span>
                </div>
                <h3 className="text-base font-display font-bold text-white">Pomodoro Timer & Shared Todo List</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Synchronized circular SVG countdown timer for Work (25 min) and Break (5 min) phases with audio notifications, alongside personal session todo checklists.
                </p>
              </div>

              {/* Outing Lounge */}
              <div className="glass-card p-6 border-amber-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold flex items-center gap-1.5">
                    📍 Outing Lounge
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Midpoint Centroid</span>
                </div>
                <h3 className="text-base font-display font-bold text-white">Geographic Midpoint Calculator</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Every friend submits their GPS location. The platform computes the geographical center point between all members and suggests places equal distance for everyone.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ─── SECTION 4: SOCIAL & DIRECT MESSAGES ────────────────────── */}
        {(activeTab === 'all' || activeTab === 'social') && (
          <section className="glass-card p-6 sm:p-8 space-y-6 border-blue-500/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <FiMessageSquare size={28} />
                </div>
                <div>
                  <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Social Hub</span>
                  <h2 className="text-2xl font-display font-bold text-white">Direct Messages & Community Feed</h2>
                </div>
              </div>
              <div className="flex gap-2">
                <Link to="/messages" className="btn-secondary !px-3 !py-1.5 text-xs flex items-center gap-1.5">
                  <FiMessageSquare size={14} /> DMs
                </Link>
                <Link to="/feed" className="btn-primary !px-3 !py-1.5 text-xs flex items-center gap-1.5">
                  <FiImage size={14} /> Feed
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                  💬 Private Direct Messaging
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Search for users by username, send chat requests, approve incoming connections, and exchange 1-on-1 text messages in real-time. Unread messages trigger pulsing indicators in your Navbar!
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                  📸 Community Memories Feed
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Share photos from your outings, write diary captions, like posts with pop micro-animations, read community comments, and browse the active members story bar.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ─── SECTION 5: FAQ ACCORDION ───────────────────────────────── */}
        {(activeTab === 'all' || activeTab === 'faq') && (
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                <FiHelpCircle size={22} />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-white">Frequently Asked Questions</h2>
                <p className="text-xs text-slate-400">Got questions? We've got answers.</p>
              </div>
            </div>

            <div className="space-y-3">
              {faqList.map((item, idx) => (
                <div key={idx} className="glass-card overflow-hidden transition-all border-white/10">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <span className="font-display font-semibold text-white text-sm sm:text-base">
                      {item.q}
                    </span>
                    {openFaq === idx ? (
                      <FiChevronUp size={18} className="text-primary-400 flex-shrink-0" />
                    ) : (
                      <FiChevronDown size={18} className="text-slate-400 flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 pb-5 sm:px-5 text-xs text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── CALL TO ACTION BANNER ─────────────────────────────────── */}
        <div className="glass-card p-8 sm:p-12 text-center space-y-6 bg-gradient-to-r from-primary-500/20 via-purple-500/10 to-pink-500/20 border-primary-500/30">
          <Logo className="w-12 h-12 mx-auto" />
          <h2 className="text-3xl font-display font-extrabold text-white">
            Ready to Find Your Next Favorite Spot?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Stop endlessly texting group chats. Explore spots solo or create a room to hang out with friends right now.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link to="/explore" className="btn-primary !px-6 !py-3 text-sm flex items-center gap-2">
              <FiCompass size={18} /> Start Exploring Solo
            </Link>
            <Link to="/create-room" className="btn-secondary !px-6 !py-3 text-sm flex items-center gap-2">
              <FiUsers size={18} /> Create a Room
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Guide;
