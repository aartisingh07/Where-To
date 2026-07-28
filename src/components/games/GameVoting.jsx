import { useEffect, useState } from 'react';
import { FiClock, FiThumbsUp, FiThumbsDown, FiHelpCircle, FiExternalLink, FiArrowLeft, FiAward } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { movieService } from '../../services/movieService';
import { outingPlanService } from '../../services/outingPlanService';

const PROVIDER_LOGOS = {
  'netflix': 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_N_logo.svg',
  'amazon prime video': 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png',
  'prime video': 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png',
  'disney+': 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg',
  'disney plus': 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg',
  'apple tv': 'https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg',
  'apple tv+': 'https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg',
  'hbo max': 'https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_Max_Logo.svg',
  'max': 'https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_Max_Logo.svg',
  'youtube': 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg',
  'hotstar': 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Disney%2B_Hotstar_logo.svg',
  'disney+ hotstar': 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Disney%2B_Hotstar_logo.svg',
  'jiocinema': 'https://upload.wikimedia.org/wikipedia/commons/e/e4/JioCinema_Logo.svg'
};

const getProviderLogoUrl = (provider) => {
  if (!provider) return null;
  const name = (provider.provider_name || provider.name || '').toLowerCase();
  for (const [key, url] of Object.entries(PROVIDER_LOGOS)) {
    if (name.includes(key)) return url;
  }
  return provider.logo || provider.logo_path || null;
};

const GameVoting = ({
  activeVote,
  tallies = { yes: 0, no: 0, maybe: 0 },
  userVote = null,
  onVote,
  isHost,
  onEnd,
  voteResult = null,
  onClear,
  roomId = null,
  onPlanScheduled = null,
}) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [providers, setProviders] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(false);

  // Scheduling states
  const [dateTime, setDateTime] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('');
  const [schedulingLoading, setSchedulingLoading] = useState(false);

  const item = voteResult?.item || activeVote?.item;

  const handleSchedulePlan = async () => {
    if (!dateTime || !roomId) return;
    setSchedulingLoading(true);
    try {
      const plan = await outingPlanService.createPlan({
        roomId,
        placeName: item?.name || item?.title,
        address: item?.desc || '',
        lat: item?.lat || 0,
        lng: item?.lng || 0,
        mapsLink: item?.link || '',
        dateTime: new Date(dateTime).toISOString()
      });
      setIsScheduled(true);
      setScheduledTime(plan.dateTime);
      toast.success('Hangout plan locked and scheduled! 📅');
      if (onPlanScheduled) onPlanScheduled(plan);
    } catch (err) {
      console.error('Failed to schedule plan:', err);
      toast.error(err.response?.data?.message || 'Could not schedule hangout plan');
    } finally {
      setSchedulingLoading(false);
    }
  };

  useEffect(() => {
    if (voteResult && voteResult.result === 'approved' && voteResult.item?.type === 'movie') {
      const fetchProviders = async () => {
        setLoadingProviders(true);
        try {
          const data = await movieService.getWatchProviders(voteResult.item.id);
          setProviders(data.providers || []);
        } catch (err) {
          console.error('Failed to load watch providers:', err);
        } finally {
          setLoadingProviders(false);
        }
      };
      fetchProviders();
    }
  }, [voteResult]);

  // Timer logic for active voting
  useEffect(() => {
    if (!activeVote || voteResult) return;

    const calculateTime = () => {
      const difference = activeVote.endTime - Date.now();
      return Math.max(0, Math.round(difference / 1000));
    };

    setTimeLeft(calculateTime());

    const interval = setInterval(() => {
      const current = calculateTime();
      setTimeLeft(current);
      if (current <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeVote, voteResult]);

  const totalVotes = tallies.yes + tallies.no + tallies.maybe;
  const getPercentage = (value) => {
    if (totalVotes === 0) return 0;
    return Math.round((value / totalVotes) * 100);
  };

  // 1. --- Voting Result State ---
  if (voteResult) {
    const isApproved = voteResult.result === 'approved';
    const item = voteResult.item;
    const finalTallies = voteResult.tallies || { yes: 0, no: 0, maybe: 0 };

    return (
      <div className="flex-1 flex flex-col items-center justify-start p-6 text-center max-w-2xl mx-auto w-full animate-slide-up my-auto">
        {isApproved ? (
          <div className="glass-card p-7 border-neon-green/30 shadow-glow-green w-full">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-neon-green/10 flex items-center justify-center text-neon-green">
                <FiAward size={18} />
              </div>
              <span className="text-neon-green text-sm font-extrabold uppercase tracking-widest">
                PROPOSAL PASSED!
              </span>
            </div>

            <h2 className="font-display font-black text-3xl text-slate-900 dark:text-white mb-5 leading-tight">
              {item.type === 'activity' ? `Switch to ${item.name}?` : item.type === 'outing' ? `Let's meet at ${item.name || item.title}!` : item.type === 'movie' ? `Watch ${item.name || item.title}?` : `Let's Play ${item.name || item.title}!`}
            </h2>

            {/* Watch Providers & Poster for Movie */}
            {item.type === 'movie' && (
              <div className="mb-6 bg-slate-100/80 dark:bg-dark-800/60 rounded-2xl p-5 border border-slate-200/80 dark:border-white/10 shadow-sm text-left flex flex-col sm:flex-row items-center sm:items-start gap-5">
                {item.poster && (
                  <img
                    src={item.poster}
                    alt={item.title}
                    className="w-28 h-40 object-cover rounded-xl border border-slate-200 dark:border-white/10 shadow-md flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0 w-full flex flex-col justify-between min-h-[160px]">
                  <div>
                    <p className="text-slate-800 dark:text-white/80 text-sm font-bold mb-3">Available Stream Sources:</p>
                    {loadingProviders ? (
                      <div className="py-3 flex justify-start">
                        <div className="w-5.5 h-5.5 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
                      </div>
                    ) : providers.length > 0 ? (
                      <div className="flex flex-wrap gap-3 items-center">
                        {providers.map((p, idx) => {
                          const logoUrl = getProviderLogoUrl(p);
                          return (
                            <div key={idx} className="flex items-center gap-2 bg-white dark:bg-dark-900/90 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                              {logoUrl ? (
                                <img
                                  src={logoUrl}
                                  alt={p.provider_name}
                                  className="w-5 h-5 object-contain"
                                  title={p.provider_name}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.style.display = 'none';
                                  }}
                                />
                              ) : null}
                              <span className="text-sm text-slate-900 dark:text-white font-bold">{p.provider_name}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-slate-500 dark:text-white/40 text-sm italic">No streaming providers found.</p>
                    )}
                  </div>

                  {/* Integrated Voting Summary */}
                  <div className="bg-white/80 dark:bg-dark-900/70 rounded-xl p-2.5 border border-slate-200/60 dark:border-white/5 flex items-center justify-around text-sm mt-4 font-bold">
                    <span className="text-neon-green">{finalTallies.yes} <span className="font-semibold text-slate-500 dark:text-white/40 text-xs">Yes</span></span>
                    <span className="text-slate-300 dark:text-white/10">|</span>
                    <span className="text-red-500 dark:text-red-400">{finalTallies.no} <span className="font-semibold text-slate-500 dark:text-white/40 text-xs">No</span></span>
                    <span className="text-slate-300 dark:text-white/10">|</span>
                    <span className="text-slate-700 dark:text-white/70">{finalTallies.maybe} <span className="font-semibold text-slate-500 dark:text-white/40 text-xs">Maybe</span></span>
                  </div>
                </div>
              </div>
            )}

            {/* Non-Movie Voting Summary */}
            {item.type !== 'movie' && (
              <div className="bg-slate-100/80 dark:bg-dark-800/60 rounded-2xl p-4 border border-slate-200/80 dark:border-white/10 flex justify-around mb-6 text-base shadow-sm">
                <div>
                  <span className="block text-neon-green font-bold text-lg">{finalTallies.yes}</span>
                  <span className="text-slate-500 dark:text-white/40 text-xs font-semibold">Yes</span>
                </div>
                <div className="border-r border-slate-200 dark:border-white/10" />
                <div>
                  <span className="block text-red-500 dark:text-red-400 font-bold text-lg">{finalTallies.no}</span>
                  <span className="text-slate-500 dark:text-white/40 text-xs font-semibold">No</span>
                </div>
                <div className="border-r border-slate-200 dark:border-white/10" />
                <div>
                  <span className="block text-slate-700 dark:text-white/60 font-bold text-lg">{finalTallies.maybe}</span>
                  <span className="text-slate-500 dark:text-white/40 text-xs font-semibold">Maybe</span>
                </div>
              </div>
            )}

            {/* Outing Scheduling Block */}
            {item.type === 'outing' && (
              <div className="mb-6 bg-dark-800/40 rounded-xl p-4 border border-white/5 text-left">
                <p className="text-white/40 text-xs font-semibold mb-3">📅 Meetup Scheduling</p>
                {isScheduled ? (
                  <div className="text-center py-2">
                    <span className="text-neon-green font-bold text-sm block">✓ Locked & Confirmed</span>
                    <span className="text-white/80 text-xs mt-1 block font-mono">
                      {new Date(scheduledTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>
                ) : isHost ? (
                  <div className="space-y-3">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">Select Date & Time</label>
                    <input
                      type="datetime-local"
                      value={dateTime}
                      onChange={(e) => setDateTime(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-neon-green/40 focus:bg-white/8 transition-all"
                      required
                    />
                    <button
                      onClick={handleSchedulePlan}
                      disabled={schedulingLoading || !dateTime}
                      className="w-full btn-primary py-2.5 rounded-xl font-semibold bg-gradient-to-r from-neon-green to-emerald-500 hover:from-neon-green hover:to-emerald-600 hover:shadow-glow-green text-white transition-all text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                    >
                      {schedulingLoading ? (
                        <div className="w-4.5 h-4.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : 'Confirm & Lock Plan'}
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-3 italic text-white/40 text-xs">
                    ⏳ Waiting for the host to schedule the date & time...
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {item.type !== 'activity' && (
                item.type === 'outing' ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full btn-primary flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-gradient-to-r from-neon-green to-emerald-500 hover:from-neon-green hover:to-emerald-600 hover:shadow-glow-green text-white transition-all text-sm"
                  >
                    Open Google Maps
                    <FiExternalLink size={15} />
                  </a>
                ) : item.type === 'movie' ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full btn-primary flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 hover:shadow-glow-purple text-white transition-all text-sm"
                  >
                    View Details on TMDB
                    <FiExternalLink size={15} />
                  </a>
                ) : (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full btn-primary flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-gradient-to-r from-neon-green to-emerald-500 hover:from-neon-green hover:to-emerald-600 hover:shadow-glow-green text-white transition-all text-sm"
                  >
                    Open Game
                    <FiExternalLink size={15} />
                  </a>
                )
              )}
              <button
                onClick={onClear}
                className={`w-full btn-secondary py-3 text-sm font-bold rounded-xl ${item.type === 'activity' ? 'sm:col-span-2' : ''}`}
              >
                {item.type === 'activity' ? 'Back to Room' : item.type === 'outing' ? 'Back to Outing Lounge' : item.type === 'movie' ? 'Back to Watch Lounge' : 'Back to Game Lounge'}
              </button>
            </div>
          </div>
        ) : (
          <div className="glass-card p-8 border-red-500/30 shadow-glow-red w-full">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 mx-auto mb-6">
              <FiThumbsDown size={30} />
            </div>
            <p className="text-red-400 text-xs font-bold uppercase tracking-widest mb-1">
              Proposal Failed
            </p>
            <h2 className="font-display font-bold text-2xl text-white mb-4">
              Voted Down
            </h2>
            <p className="text-white/50 text-sm mb-6">
              The group wasn't in the mood for {item.name || item.title}. Let's select something else!
            </p>

            {/* Voting summary */}
            <div className="bg-dark-800/50 rounded-xl p-4 border border-white/5 flex justify-around mb-8 text-sm">
              <div>
                <span className="block text-neon-green font-bold text-lg">{finalTallies.yes}</span>
                <span className="text-white/30 text-xs">Yes</span>
              </div>
              <div className="border-r border-white/5" />
              <div>
                <span className="block text-red-400 font-bold text-lg">{finalTallies.no}</span>
                <span className="text-white/30 text-xs">No</span>
              </div>
              <div className="border-r border-white/5" />
              <div>
                <span className="block text-white/50 font-bold text-lg">{finalTallies.maybe}</span>
                <span className="text-white/30 text-xs">Maybe</span>
              </div>
            </div>

            <button
              onClick={onClear}
              className="w-full btn-primary py-3 rounded-xl font-semibold bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all flex items-center justify-center gap-1.5"
            >
              <FiArrowLeft size={16} />
              {item.type === 'activity' ? 'Try Another Activity' : item.type === 'outing' ? 'Try Another Place' : item.type === 'movie' ? 'Try Another Movie' : 'Try Another Game'}
            </button>
          </div>
        )}
      </div>
    );
  }

  // 2. --- Active Voting State ---

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-3xl mx-auto w-full animate-slide-up">
      <div className="glass-card p-8 border-primary-500/30 w-full relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-1.5 text-xs text-white/40 font-medium">
            <FiClock className="animate-spin text-primary-400" />
            <span>Voting Closes in:</span>
            <span className="text-white font-bold font-mono text-sm ml-0.5">{timeLeft}s</span>
          </div>
          <span className="text-3xl">{item?.emoji}</span>
        </div>

        <p className="text-primary-400 text-xs font-bold uppercase tracking-widest mb-1">
          {item?.type === 'activity' ? 'Activity Proposal' : item?.type === 'outing' ? 'Outing Proposal' : 'Group Vote Proposed'}
        </p>
        <h2 className="font-display font-black text-2xl text-white mb-2 truncate">
          {item?.type === 'activity' ? `Switch to ${item?.name}?` : item?.type === 'outing' ? `Meet at ${item?.name}?` : item?.type === 'movie' ? `Watch ${item?.title}?` : `Play ${item?.name}?`}
        </h2>
        <p className="text-white/50 text-xs mb-8 leading-relaxed">
          {item?.desc}
        </p>

        {/* Voting Progress Bars */}
        <div className="space-y-4 mb-8">
          {/* YES Bar */}
          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-neon-green flex items-center gap-1">
                <FiThumbsUp size={11} /> Yes ({tallies.yes})
              </span>
              <span className="text-white/50">{getPercentage(tallies.yes)}%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-neon-green rounded-full transition-all duration-300"
                style={{ width: `${getPercentage(tallies.yes)}%` }}
              />
            </div>
          </div>

          {/* NO Bar */}
          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-red-400 flex items-center gap-1">
                <FiThumbsDown size={11} /> No ({tallies.no})
              </span>
              <span className="text-white/50">{getPercentage(tallies.no)}%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-400 rounded-full transition-all duration-300"
                style={{ width: `${getPercentage(tallies.no)}%` }}
              />
            </div>
          </div>

          {/* MAYBE Bar */}
          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-white/65 flex items-center gap-1">
                <FiHelpCircle size={11} /> Maybe ({tallies.maybe})
              </span>
              <span className="text-white/50">{getPercentage(tallies.maybe)}%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/30 rounded-full transition-all duration-300"
                style={{ width: `${getPercentage(tallies.maybe)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 mb-6">
          <button
            onClick={() => onVote('yes')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-xl border font-bold transition-all duration-200 text-xs
              ${userVote === 'yes'
                ? 'bg-neon-green/20 border-neon-green text-neon-green shadow-glow-green-sm'
                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
          >
            <FiThumbsUp size={16} className="mb-0.5" />
            Yes
          </button>

          <button
            onClick={() => onVote('no')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-xl border font-bold transition-all duration-200 text-xs
              ${userVote === 'no'
                ? 'bg-red-500/20 border-red-500 text-red-400 shadow-glow-red-sm'
                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
          >
            <FiThumbsDown size={16} className="mb-0.5" />
            No
          </button>

          <button
            onClick={() => onVote('maybe')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-xl border font-bold transition-all duration-200 text-xs
              ${userVote === 'maybe'
                ? 'bg-white/20 border-white text-white shadow-card-hover'
                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
          >
            <FiHelpCircle size={16} className="mb-0.5" />
            Maybe
          </button>
        </div>

        {/* Host controls */}
        {isHost && (
          <button
            onClick={onEnd}
            className="w-full text-center text-[10px] text-white/30 hover:text-red-400/70 py-1 transition-all uppercase tracking-widest font-bold"
          >
            Stop Vote Early
          </button>
        )}
      </div>
    </div>
  );
};

export default GameVoting;
