import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { toast } from 'react-toastify';
import {
  FiArrowRight, FiMapPin, FiUsers, FiZap, FiHeart,
  FiCompass, FiHash, FiUser, FiSunrise, FiExternalLink, FiClock, FiTrash2, FiCheck, FiX,
  FiMessageSquare, FiImage, FiBookOpen
} from 'react-icons/fi';
import { outingPlanService } from '../services/outingPlanService';
import { roomService } from '../services/roomService';
import { chatService } from '../services/chatService';
import { memoryService } from '../services/memoryService';
import Logo from '../components/layout/Logo';
import { handleAvatarError } from '../utils/avatarHelper';

// ─── Logged-OUT landing page ────────────────────────────────────
const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = [];
    const particleCount = 40;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6, 182, 212, ${p.alpha})`; // Cyan accent color
        ctx.fill();
      });

      // Draw lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[i].x - dx, particles[i].y - dy);
            ctx.strokeStyle = `rgba(59, 130, 246, ${(1 - dist / 100) * 0.08})`; // Blue color lines
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-60 z-0" />;
};

const GuestHome = () => {
  const [cycleIndex, setCycleIndex] = useState(0);
  const [fadeState, setFadeState] = useState('fade-in');
  const cycleTexts = ['cozy cafes ☕', 'game lobbies 🎮', 'sunset viewpoints 🌅', 'sandy beaches 🌊', 'movie lounges 🎬', 'study lounges 📚'];

  useEffect(() => {
    const timer = setInterval(() => {
      setFadeState('fade-out');
      setTimeout(() => {
        setCycleIndex((prev) => (prev + 1) % cycleTexts.length);
        setFadeState('fade-in');
      }, 300);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const [mockPins, setMockPins] = useState([
    { x: 30, y: 35, name: 'Amit (P1)' },
    { x: 75, y: 40, name: 'Priya (P2)' },
    { x: 50, y: 75, name: 'Rahul (P3)' }
  ]);
  const [sandboxCategory, setSandboxCategory] = useState('cafe');

  const midpoint = mockPins.length > 0 
    ? {
        x: Math.round(mockPins.reduce((sum, p) => sum + p.x, 0) / mockPins.length),
        y: Math.round(mockPins.reduce((sum, p) => sum + p.y, 0) / mockPins.length)
      }
    : null;

  const features = [
    {
      icon: <FiCompass className="text-neon-teal" size={24} />,
      title: '1. Explore Places (Public)',
      desc: 'No account needed! Discover nearby cafes, parks, and hidden spots using instant location filtering.',
    },
    {
      icon: <FiUsers className="text-accent-400" size={24} />,
      title: '2. Live Squad Rooms',
      desc: 'Create rooms, share 6-digit codes, & invite friends to decide hangout plans together in real time.',
    },
    {
      icon: <FiMapPin className="text-neon-yellow" size={24} />,
      title: '3. Squad Midpoint Finder',
      desc: 'Automatically compute the central meeting spot for all friends so no one travels unfairly far.',
    },
    {
      icon: <FiMessageSquare className="text-accent-300" size={24} />,
      title: '4. Direct Chats & DMs',
      desc: 'Search friends by username, send chat requests, and message privately in real-time.',
    },
    {
      icon: <FiHeart className="text-accent-500" size={24} />,
      title: '5. Saved Favorites & Outings',
      desc: 'Bookmark top spots, plan upcoming hangouts, and capture shared squad memories.',
    },
  ];

  return (
    <div className="min-h-screen bg-dark-900 bg-grid">
      {/* Hero Header */}
      <section className="relative pt-28 pb-12 px-4 overflow-hidden">
        <ParticleBackground />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm font-medium mb-6 animate-fade-in">
            <span className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
            2 Main Pillars — Explore Publicly or Squad Up
          </div>

          <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl leading-tight mb-4 animate-slide-up">
            Stop asking.
            <br />
            <span>Start going to </span>
            <span className={`inline-block text-gradient transition-all duration-300 transform min-w-[280px] text-center sm:text-left ${fadeState === 'fade-in' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
              {cycleTexts[cycleIndex]}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-white/60 max-w-3xl mx-auto mb-10 animate-slide-up leading-relaxed" style={{ animationDelay: '0.1s' }}>
            The app that kills the "bhai kahan jaayein?" loop forever. Choose your path below: explore local spots instantly without an account, or create an account for live squad rooms, midpoint calculating, & direct chat!
          </p>

          {/* DUAL PILLAR CARDS (The 2 Main Features Highlighted) */}
          <div className="grid md:grid-cols-2 gap-8 text-left max-w-5xl mx-auto mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            
            {/* PILLAR 1: EXPLORE PLACES */}
            <div className="glass-card p-8 border-cyan-500/30 hover:border-cyan-400/60 shadow-glow-teal/20 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    📍
                  </div>
                  <div className="px-3.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-bold uppercase tracking-wider">
                    ⚡ No Account Needed
                  </div>
                </div>

                <h2 className="font-display font-bold text-2xl text-white mb-2 flex items-center gap-2">
                  Explore Nearby Places
                </h2>
                <p className="text-white/60 text-sm leading-relaxed mb-6">
                  Out right now and need a quick spot? Instantly search nearby cafes, scenic viewpoints, restaurants, and study spots around your current location without logging in.
                </p>

                <div className="space-y-2.5 mb-8">
                  {[
                    '📍 Instant GPS location-based venue search',
                    '☕ Filter by Cafes, Sunsets, Food & Study spots',
                    '💰 Filter by distance radius & budget',
                    '🗺️ Direct Google Maps navigation & ratings'
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-white/80">
                      <div className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-bold">✓</div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link to="/explore" className="btn-primary !bg-gradient-to-r !from-cyan-500 !to-blue-600 hover:!from-cyan-400 hover:!to-blue-500 text-white font-bold text-base !py-3.5 flex items-center justify-center gap-2 w-full group">
                <FiCompass size={20} />
                Explore Places Now
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
              </Link>
            </div>

            {/* PILLAR 2: SQUAD HUB (CREATE ACCOUNT / SIGN IN) */}
            <div className="glass-card p-8 border-primary-500/30 hover:border-primary-400/60 shadow-glow-purple/20 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    🏠
                  </div>
                  <div className="px-3.5 py-1 rounded-full bg-primary-500/20 border border-primary-400/40 text-primary-300 text-xs font-bold uppercase tracking-wider">
                    👥 Squad Hub — Account Required
                  </div>
                </div>

                <h2 className="font-display font-bold text-2xl text-white mb-2 flex items-center gap-2">
                  Rooms, Midpoint & Direct DMs
                </h2>
                <p className="text-white/60 text-sm leading-relaxed mb-6">
                  Hanging out with your squad? Create a room with a 6-digit code to vote on spots, calculate your squad's exact central midpoint, sync games/movies, and direct message friends.
                </p>

                <div className="space-y-2.5 mb-8">
                  {[
                    '🎯 Squad Midpoint Calculator (fair center meeting spot)',
                    '🔑 Live Room Lobbies (6-digit shareable codes)',
                    '💬 Direct Messaging (1-on-1 private DMs & friend requests)',
                    '🎬 Live Game & Movie Lounge voting with room members'
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-white/80">
                      <div className="w-4 h-4 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center text-[10px] font-bold">✓</div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Link to="/register" className="btn-primary font-bold text-base !py-3.5 flex-1 flex items-center justify-center gap-2 text-center">
                  <FiUsers size={18} />
                  Create Account
                </Link>
                <Link to="/login" className="btn-secondary font-bold text-base !py-3.5 flex-1 flex items-center justify-center gap-2 text-center">
                  <FiUser size={18} />
                  Log In
                </Link>
              </div>
            </div>

          </div>

          <div className="flex items-center justify-center gap-4">
            <Link to="/guide" className="btn-secondary text-sm !px-6 !py-2.5 flex items-center gap-2 border-amber-500/30 text-amber-300 hover:bg-amber-500/10">
              <FiBookOpen size={18} />
              Read Full User Guide
            </Link>
          </div>

        </div>
      </section>

      {/* FEATURE HIGHLIGHT: SQUAD MIDPOINT CALCULATOR DEMO */}
      <section className="py-16 px-4 relative z-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-3">
              🎯 Interactive Squad Tool
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-3">
              Squad Midpoint Calculator
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto text-sm sm:text-base">
              Ever had friends traveling from different corners of the city? Click anywhere on the map grid below to drop your squad members' locations and calculate the fair central meeting spot!
            </p>
          </div>

          {/* Sandbox Calculator Card */}
          <div className="glass-card p-6 sm:p-8 border border-primary-500/20 shadow-glow-purple">
            <div className="flex flex-col md:flex-row gap-8">
              
              {/* Grid Map Canvas */}
              <div className="flex-1 flex flex-col items-center">
                <div className="flex justify-between items-center w-full mb-3">
                  <div className="text-left">
                    <h3 className="text-sm font-display font-bold text-white flex items-center gap-2">
                      📍 Squad Location Grid
                    </h3>
                    <p className="text-[11px] text-white/40">Click on the grid to add friend pins</p>
                  </div>
                  <button
                    onClick={() => setMockPins([])}
                    className="text-[11px] text-red-400 hover:text-red-300 px-2.5 py-1 rounded bg-red-500/10 hover:bg-red-500/20 transition-all font-semibold cursor-pointer"
                  >
                    Clear Pins
                  </button>
                </div>
                
                {/* Visual Grid Box */}
                <div
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
                    const names = ['Amit', 'Priya', 'Rahul', 'Zara', 'Sneha', 'Kabir', 'Rohan'];
                    const name = names[mockPins.length % names.length] + ` (P${mockPins.length + 1})`;
                    setMockPins([...mockPins, { x, y, name }]);
                  }}
                  className="relative w-full aspect-square max-w-[320px] bg-dark-950 border border-white/10 rounded-2xl cursor-crosshair overflow-hidden group select-none shadow-inner"
                  style={{
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}
                >
                  {/* Grid Ambient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-cyan-500/5 pointer-events-none" />

                  {/* Render Pins */}
                  {mockPins.map((p, idx) => (
                    <div
                      key={idx}
                      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-scale-in pointer-events-none"
                      style={{ left: `${p.x}%`, top: `${p.y}%` }}
                    >
                      <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center text-[10px] font-bold text-white border border-white/30 shadow-glow-purple-sm">
                        {p.name[0]}
                      </div>
                      <span className="text-[9px] bg-dark-900/90 text-white/80 px-1.5 py-0.5 rounded mt-0.5 whitespace-nowrap font-mono">{p.name}</span>
                    </div>
                  ))}

                  {/* Render Midpoint Centroid */}
                  {midpoint && (
                    <div
                      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-pulse pointer-events-none z-10"
                      style={{ left: `${midpoint.x}%`, top: `${midpoint.y}%` }}
                    >
                      <div className="w-7 h-7 rounded-full bg-cyan-400 flex items-center justify-center text-sm text-dark-950 border-2 border-white shadow-[0_0_20px_#06b6d4]">
                        🎯
                      </div>
                      <span className="text-[10px] bg-cyan-400 text-dark-950 px-2 py-0.5 rounded font-extrabold mt-0.5 whitespace-nowrap shadow-md uppercase tracking-wider">
                        Midpoint
                      </span>
                    </div>
                  )}

                  {mockPins.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-center p-4 pointer-events-none">
                      <p className="text-xs text-white/30">Click anywhere inside the box to drop friend pins and test the midpoint calculation!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Control Panel / Suggestions */}
              <div className="flex-1 flex flex-col justify-between text-left">
                <div>
                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">Category Filter</h4>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {[
                      { id: 'cafe', label: '☕ Cafes' },
                      { id: 'nature', label: '🌅 Viewpoints' },
                      { id: 'entertainment', label: '🎮 Play' },
                      { id: 'food', label: '🍕 Food' }
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSandboxCategory(cat.id)}
                        className={`text-xs font-semibold px-3 py-2 rounded-xl border text-center transition-all cursor-pointer bg-white/3
                          ${sandboxCategory === cat.id ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300' : 'border-white/5 text-white/60'}`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">Venues Found Near Midpoint</h4>
                  <div className="space-y-2">
                    {mockPins.length === 0 ? (
                      <div className="p-4 rounded-xl border border-white/5 bg-white/3 text-center text-xs text-white/40">
                        Drop pins on the left grid to calculate central venues!
                      </div>
                    ) : (
                      (sandboxCategory === 'cafe' ? [
                        { name: "The Caffeine Centroid ☕", rating: "4.8 ⭐", dist: "0.2 km from midpoint" },
                        { name: "Vibe & Brew Espresso 🥛", rating: "4.6 ⭐", dist: "0.5 km from midpoint" },
                        { name: "Books & Chai Lounge 🍵", rating: "4.7 ⭐", dist: "0.8 km from midpoint" }
                      ] : sandboxCategory === 'nature' ? [
                        { name: "Skyline Overlook Peak 🌅", rating: "4.9 ⭐", dist: "0.4 km from midpoint" },
                        { name: "Blue Lagoon Lakeside 🌊", rating: "4.8 ⭐", dist: "0.9 km from midpoint" },
                        { name: "Central Canopy Gardens 🌳", rating: "4.5 ⭐", dist: "1.1 km from midpoint" }
                      ] : sandboxCategory === 'entertainment' ? [
                        { name: "Pixel Bowling & Retro Arcade 🎳", rating: "4.7 ⭐", dist: "0.3 km from midpoint" },
                        { name: "Galaxy Cinema Multiplex 🍿", rating: "4.5 ⭐", dist: "0.7 km from midpoint" },
                        { name: "Active Squad Game Lounge 🎮", rating: "4.8 ⭐", dist: "1.2 km from midpoint" }
                      ] : [
                        { name: "Slice of Heaven Pizza 🍕", rating: "4.8 ⭐", dist: "0.2 km from midpoint" },
                        { name: "Gridline Gourmet Burgers 🍔", rating: "4.6 ⭐", dist: "0.6 km from midpoint" },
                        { name: "Neon Cantina Tacos & Grill 🌮", rating: "4.7 ⭐", dist: "0.8 km from midpoint" }
                      ]).map((place, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl border border-white/5 bg-white/3 hover:bg-white/5 transition-all flex items-center justify-between text-xs">
                          <div>
                            <p className="font-semibold text-white">{place.name}</p>
                            <p className="text-[10px] text-white/40 mt-0.5">📍 {place.dist}</p>
                          </div>
                          <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded font-mono text-cyan-300 font-semibold">{place.rating}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40 font-mono">
                  <span>Squad Pins: {mockPins.length}</span>
                  {midpoint ? (
                    <span className="text-cyan-300 font-bold">Midpoint: {midpoint.x}% X, {midpoint.y}% Y</span>
                  ) : (
                    <span>Click grid to calculate</span>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

// ─── Logged-IN dashboard ────────────────────────────────────────
const UserHome = ({ user }) => {
  const navigate = useNavigate();
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' :
    hour < 17 ? 'Good afternoon' :
    'Good evening';
  const greetingEmoji = hour < 12 ? '🌅' : hour < 17 ? '☀️' : '🌙';

  const [plans, setPlans] = useState([]);
  const [activeRooms, setActiveRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadDMsCount, setUnreadDMsCount] = useState(0);

  const { socket } = useSocket();

  const handleRejoinRoom = async (roomId) => {
    try {
      await roomService.rejoinRoom(roomId);
      toast.success('Rejoined lobby successfully! 🎉');
      navigate(`/room/${roomId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to rejoin room');
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [plansData, roomsData, unreadData] = await Promise.all([
          outingPlanService.getMyPlans(),
          roomService.getMyRooms(),
          chatService.getUnreadCount(),
        ]);
        setPlans(plansData || []);
        setActiveRooms(roomsData || []);
        setUnreadDMsCount(unreadData.unreadCount || 0);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (!socket || !user?._id) return;

    const unreadUpdateEvent = `unread-count-updated-${user._id}`;
    const dmEvent = `direct-message-${user._id}`;

    const handleUnreadUpdate = async () => {
      try {
        const countData = await chatService.getUnreadCount();
        setUnreadDMsCount(countData.unreadCount || 0);
      } catch (err) {
        console.error('Failed to update unread count:', err);
      }
    };

    socket.on(unreadUpdateEvent, handleUnreadUpdate);
    socket.on(dmEvent, handleUnreadUpdate);

    return () => {
      socket.off(unreadUpdateEvent, handleUnreadUpdate);
      socket.off(dmEvent, handleUnreadUpdate);
    };
  }, [socket, user?._id]);

  const getCountdownString = (dateTimeString) => {
    const diff = new Date(dateTimeString) - new Date();
    if (diff <= 0) return 'Happening now!';
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `Starts in ${days}d ${hours % 24}h`;
    } else if (hours > 0) {
      return `Starts in ${hours}h ${minutes % 60}m`;
    } else {
      return `Starts in ${minutes}m`;
    }
  };

  const handleCancelPlan = async (planId) => {
    if (!window.confirm("Are you sure you want to cancel this outing plan? This will notify all room participants.")) return;
    try {
      await outingPlanService.deletePlan(planId);
      toast.success("Outing plan cancelled successfully");
      setPlans((prev) => prev.filter((p) => p._id !== planId));
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to cancel outing plan";
      toast.error(`Failed to cancel outing plan: ${errorMsg}`);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 bg-grid pt-24 pb-16 px-4">
      {/* Ambient Glows */}
      <div className="fixed top-20 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-40 right-1/4 w-96 h-96 bg-neon-teal/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 space-y-10">

        {/* Dynamic Welcome Hero Panel */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl animate-fade-in">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            
            {/* User Profile */}
            <div className="flex items-center gap-5">
              <div className="relative group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary-500 via-accent-500 to-neon-teal p-1 shadow-glow-purple flex-shrink-0">
                  <div className="w-full h-full rounded-full bg-dark-800 flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        onError={(e) => handleAvatarError(e, user?.username)}
                      />
                    ) : (
                      <FiUser size={30} className="text-white/40" />
                    )}
                  </div>
                </div>
                <span className="absolute bottom-1 right-1 w-4 h-4 bg-neon-green border-2 border-dark-900 rounded-full" title="Online" />
              </div>

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-xs font-bold mb-2">
                  <span>{greetingEmoji} {greeting}</span>
                  <span>·</span>
                  <span className="text-neon-teal font-extrabold">Where To? Dashboard</span>
                </div>
                <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-white">
                  Welcome back, <span className="text-gradient">{user?.username || 'Explorer'}</span>! 👋
                </h1>
                <p className="text-white/50 text-sm mt-1">
                  Discover places solo, or jump into live squad rooms & DMs.
                </p>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <Link
                to="/explore"
                className="btn-primary py-3 px-5 rounded-2xl text-sm font-bold shadow-glow-purple flex items-center gap-2 group cursor-pointer"
              >
                <FiCompass size={18} />
                <span>Explore Spots</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Unread DMs Alert Banner */}
        {!loading && unreadDMsCount > 0 && (
          <div className="animate-slide-up">
            <div className="bg-gradient-to-r from-primary-500/20 via-accent-500/20 to-purple-500/10 border border-primary-500/30 p-4 sm:p-5 rounded-2xl flex items-center justify-between gap-4 shadow-glow-purple-sm">
              <div className="flex items-center gap-3">
                <span className="text-2xl animate-bounce">💬</span>
                <div className="text-left">
                  <p className="text-xs text-primary-400 font-bold uppercase tracking-wider">Unread Direct Messages</p>
                  <h4 className="text-sm font-bold text-white mt-0.5">
                    You have <span className="text-neon-teal font-extrabold">{unreadDMsCount}</span> new unread chat message{unreadDMsCount !== 1 ? 's' : ''}!
                  </h4>
                </div>
              </div>
              <Link
                to="/chats"
                className="btn-primary py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 flex-shrink-0 cursor-pointer shadow-sm"
              >
                <span>View Chats</span>
                <FiArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}

        {/* ─── MAIN PILLAR 1: INSTANT PLACE EXPLORER (Public / Solo Discovery) ─── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Pillar 1 Feature</span>
              <h2 className="font-display font-bold text-2xl text-white flex items-center gap-2">
                <span>📍 Place Exploration & Favorites</span>
              </h2>
            </div>
            <Link to="/explore" className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1">
              Open Explorer <FiArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Explore Spots */}
            <Link to="/explore" className="glass-card p-6 border-cyan-500/30 hover:border-cyan-400/60 shadow-glow-teal/10 transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    🧭
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider">
                    Instant Search
                  </span>
                </div>
                <h3 className="font-display font-bold text-xl text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  Explore Nearby Places
                </h3>
                <p className="text-white/60 text-xs leading-relaxed mb-4">
                  Discover local cafes, scenic viewpoints, restaurants, and study spots with instant GPS distance, mood filters, and Google Maps ratings.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
                <span>Start Exploring</span>
                <FiArrowRight size={14} />
              </div>
            </Link>

            {/* Saved Favorite Places */}
            <Link to="/saved-places" className="glass-card p-6 border-rose-500/30 hover:border-rose-400/60 shadow-glow-pink/10 transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    ❤️
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider">
                    Your Bookmarks
                  </span>
                </div>
                <h3 className="font-display font-bold text-xl text-white mb-2 group-hover:text-rose-300 transition-colors">
                  Saved Favorite Places
                </h3>
                <p className="text-white/60 text-xs leading-relaxed mb-4">
                  Access your bookmarked spots, view coordinate tags, and launch 1-click Google Maps directions anytime.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 group-hover:translate-x-1 transition-transform">
                <span>View Saved List</span>
                <FiArrowRight size={14} />
              </div>
            </Link>
          </div>

          {/* Outing Categories Bar */}
          <div className="glass-card p-6 rounded-3xl border border-white/10 mt-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">Curated Collections</span>
                <h3 className="font-display font-bold text-lg text-white">
                  Who are you hanging out with today?
                </h3>
              </div>
              <Link to="/explore" className="text-xs text-cyan-400 hover:text-cyan-300 font-bold hidden sm:flex items-center gap-1">
                Explore All <FiArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  id: 'friends',
                  emoji: '👥',
                  title: 'Friends Squad',
                  subtitle: 'Malls, Concerts, Street Food',
                  color: 'from-teal-500/10 to-cyan-500/10 border-teal-500/30 hover:border-teal-400',
                  to: '/explore',
                },
                {
                  id: 'couples',
                  emoji: '❤️',
                  title: 'Couples Romantic',
                  subtitle: 'Beaches, Cozy Cafes, Sunsets',
                  color: 'from-pink-500/10 to-rose-500/10 border-pink-500/30 hover:border-pink-400',
                  to: '/explore',
                },
                {
                  id: 'family',
                  emoji: '👨‍👩‍👧‍👦',
                  title: 'Family Outings',
                  subtitle: 'Theme Parks, Zoos, Picnic Lawns',
                  color: 'from-amber-500/10 to-yellow-500/10 border-amber-500/30 hover:border-amber-400',
                  to: '/explore',
                },
              ].map((cat) => (
                <Link
                  key={cat.id}
                  to={cat.to}
                  className={`p-4 rounded-2xl border bg-gradient-to-br ${cat.color} transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between cursor-pointer`}
                >
                  <div>
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{cat.emoji}</div>
                    <h4 className="font-display font-bold text-white text-base mb-0.5">{cat.title}</h4>
                    <p className="text-white/50 text-[11px] leading-relaxed">{cat.subtitle}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
                    <span>Browse Category</span>
                    <FiArrowRight size={12} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ─── MAIN PILLAR 2: SQUAD COLLABORATION & SOCIAL (Rooms & DMs) ─── */}
        <div className="space-y-4 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary-400">Pillar 2 Feature</span>
              <h2 className="font-display font-bold text-2xl text-white flex items-center gap-2">
                <span>👥 Squad Hangout Rooms & Direct DMs</span>
              </h2>
            </div>
            <div className="flex gap-3">
              <Link to="/create-room" className="text-xs text-primary-400 hover:text-primary-300 font-bold flex items-center gap-1">
                Create Room <FiArrowRight size={14} />
              </Link>
              <Link to="/messages" className="text-xs text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1">
                Direct DMs <FiArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Create Room */}
            <Link to="/create-room" className="glass-card p-6 border-primary-500/30 hover:border-primary-400/60 shadow-glow-purple/10 transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    🏠
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-primary-500/20 text-primary-300 text-[10px] font-bold uppercase tracking-wider">
                    Real-time
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-primary-300 transition-colors">
                  Create Hangout Room
                </h3>
                <p className="text-white/60 text-xs leading-relaxed mb-4">
                  Start a room, generate a 6-digit code, compute squad midpoint, & vote on games & movies.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary-400 group-hover:translate-x-1 transition-transform">
                <span>Create Room</span>
                <FiArrowRight size={14} />
              </div>
            </Link>

            {/* Join Room */}
            <Link to="/join-room" className="glass-card p-6 border-indigo-500/30 hover:border-indigo-400/60 shadow-glow-cyan/10 transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    🔑
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                    Use Code
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-indigo-300 transition-colors">
                  Join with Room Code
                </h3>
                <p className="text-white/60 text-xs leading-relaxed mb-4">
                  Enter a 6-digit code or browse active public lobbies to join your squad's live session.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 group-hover:translate-x-1 transition-transform">
                <span>Join Lobby</span>
                <FiArrowRight size={14} />
              </div>
            </Link>

            {/* Direct DMs */}
            <Link to="/messages" className="glass-card p-6 border-teal-500/30 hover:border-teal-400/60 shadow-glow-teal/10 transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    💬
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold uppercase tracking-wider">
                    Private Chat
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-teal-300 transition-colors">
                  Direct Chats & DMs
                </h3>
                <p className="text-white/60 text-xs leading-relaxed mb-4">
                  Search friends by handle, send chat requests, and message privately in real-time.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-teal-400 group-hover:translate-x-1 transition-transform">
                <span>Open Chats</span>
                <FiArrowRight size={14} />
              </div>
            </Link>
          </div>
        </div>

        {/* Dashboard Grid: Active Lobbies & Upcoming Outings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start pt-4 border-t border-white/5">
          
          {/* Active & Recent Lobbies */}
          <div className="glass-card p-6 rounded-3xl border border-white/10 animate-slide-up h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                  <span>🏠</span> Your Active & Recent Lobbies
                </h3>
                <span className="text-[11px] text-white/40 font-medium">1-Click Rejoin</span>
              </div>

              {loading ? (
                <div className="flex justify-center py-6">
                  <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : activeRooms.length === 0 ? (
                <div className="text-center py-8 px-4 bg-dark-800/80 rounded-2xl border border-white/10 shadow-sm">
                  <span className="text-3xl block mb-2">🎮</span>
                  <p className="text-white text-sm font-bold mb-1">No active lobbies yet</p>
                  <p className="text-white/50 text-xs mb-4 font-medium">Create a room or join your friends with a 6-digit code!</p>
                  <Link to="/create-room" className="btn-primary py-2 px-4 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm">
                    <span>Create Room</span>
                    <FiArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeRooms.slice(0, 3).map((room) => {
                    const isMember = room.isCurrentMember !== false;

                    return (
                      <div key={room._id} className="p-4 rounded-2xl border border-white/10 bg-dark-800/80 hover:border-primary-500/40 transition-all duration-300 flex items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-display font-bold text-white text-sm truncate">
                              {room.name}
                            </h4>
                            {isMember ? (
                              <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">Recently Left</span>
                            )}
                          </div>
                          {room.purpose && (
                            <p className="text-primary-300 text-xs font-semibold truncate mb-1">
                              🎯 {room.purpose}
                            </p>
                          )}
                          <p className="text-white/40 text-[11px]">
                            Code: <span className="font-mono font-bold text-primary-500">{room.code}</span> · {room.members?.length || 1} member{room.members?.length !== 1 ? 's' : ''}
                          </p>
                        </div>

                        {isMember ? (
                          <Link
                            to={`/room/${room._id}`}
                            className="btn-primary py-2 px-3.5 rounded-xl text-xs font-bold flex-shrink-0 cursor-pointer"
                          >
                            Enter
                          </Link>
                        ) : (
                          <button
                            onClick={() => handleRejoinRoom(room._id)}
                            className="bg-accent-500/20 border border-accent-500/30 text-accent-300 hover:bg-accent-500/30 py-2 px-3.5 rounded-xl text-xs font-bold flex-shrink-0 transition-all cursor-pointer"
                          >
                            Rejoin ↻
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Outings */}
          <div className="glass-card p-6 rounded-3xl border border-white/10 animate-slide-up h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                  <span>📅</span> Upcoming Outings
                </h3>
                <span className="text-[11px] text-white/40 font-medium">Scheduled Plans</span>
              </div>

              {loading ? (
                <div className="flex justify-center py-6">
                  <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : plans.length === 0 ? (
                <div className="text-center py-8 px-4 bg-dark-800/80 rounded-2xl border border-white/10 shadow-sm">
                  <span className="text-3xl block mb-2">🏖️</span>
                  <p className="text-white text-sm font-bold mb-1">No scheduled outings yet</p>
                  <p className="text-white/50 text-xs mb-4 font-medium">Propose a spot in an active hangout room lounge!</p>
                  <Link to="/explore" className="btn-secondary py-2 px-4 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm">
                    <span>Explore Spots</span>
                    <FiArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {plans.slice(0, 3).map((plan) => (
                    <div key={plan._id} className="p-4 rounded-2xl border border-white/10 bg-dark-800/80 hover:border-emerald-500/40 transition-all duration-300">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Confirmed</span>
                          <h4 className="font-display font-bold text-white text-sm mt-1 truncate">
                            {plan.placeName}
                          </h4>
                        </div>
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <FiClock size={12} className="animate-pulse" />
                          {getCountdownString(plan.dateTime)}
                        </span>
                      </div>

                      {plan.address && (
                        <p className="text-white/50 text-xs truncate mb-2">
                          📍 {plan.address}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                        <span className="text-white/40 font-medium">
                          ⏰ {new Date(plan.dateTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </span>

                        <div className="flex items-center gap-2">
                          {(plan.creator === user?._id || plan.creator?._id === user?._id) && (
                            <button
                              onClick={() => handleCancelPlan(plan._id)}
                              className="text-red-500 hover:text-red-400 text-[11px] font-bold cursor-pointer"
                            >
                              Cancel
                            </button>
                          )}
                          {plan.mapsLink && (
                            <a
                              href={plan.mapsLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-400 hover:underline font-bold flex items-center gap-1 text-xs"
                            >
                              Directions <FiExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

// ─── Root: switch between Guest and User views ───────────────────
const Home = () => {
  const { isAuthenticated, user } = useAuth();
  return isAuthenticated ? <UserHome user={user} /> : <GuestHome />;
};

export default Home;
