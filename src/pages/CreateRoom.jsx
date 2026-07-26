import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHash, FiCopy, FiCheck, FiArrowRight, FiGlobe, FiLock, FiSend, FiUsers, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { roomService } from '../services/roomService';
import { chatService } from '../services/chatService';

const CreateRoom = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(null);
  const [copied, setCopied] = useState(false);

  // Invite Friends state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [friends, setFriends] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [invitedMap, setInvitedMap] = useState({});

  const handleCreate = async () => {
    setLoading(true);
    try {
      const room = await roomService.createRoom(name, purpose, isPublic);
      setCreated(room);
      toast.success(`${isPublic ? 'Public' : 'Private'} room created! 🎉`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create room');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(created.code);
    setCopied(true);
    toast.success('Code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEnter = () => {
    navigate(`/room/${created._id}`);
  };

  const fetchFriends = async () => {
    setLoadingFriends(true);
    try {
      const list = await chatService.getAcceptedFriends();
      setFriends(list || []);
    } catch (err) {
      toast.error('Could not load chat friends');
    } finally {
      setLoadingFriends(false);
    }
  };

  const handleOpenInviteModal = () => {
    setShowInviteModal(true);
    fetchFriends();
  };

  const handleSendInvite = async (friendId, friendName) => {
    try {
      await roomService.inviteFriend(created._id, friendId);
      setInvitedMap((prev) => ({ ...prev, [friendId]: true }));
      toast.success(`Room invite sent to @${friendName} in DM! 📩`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send room invite');
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 bg-grid flex items-center justify-center px-4 pt-20 pb-12">
      {/* Glows */}
      <div className="fixed top-20 left-1/4 w-80 h-80 bg-primary-500/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-20 right-1/4 w-80 h-80 bg-accent-500/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {!created ? (
          /* Step 1 — Name + Purpose + Visibility + Create */
          <div className="glass-card p-6 sm:p-8 animate-slide-up">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🏠</div>
              <h1 className="font-display font-bold text-2xl text-white mb-1">Create a Room</h1>
              <p className="text-white/40 text-xs">
                Get a code, set room visibility, invite your squad.
              </p>
            </div>

            <div className="space-y-4 text-left">
              <div>
                <label className="block text-xs text-white/40 mb-1.5 font-medium">
                  Room name <span className="text-white/20">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Friday Night Plans"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={40}
                  className="input-field w-full text-xs"
                />
              </div>

              <div>
                <label className="block text-xs text-white/40 mb-1.5 font-medium">
                  Room Purpose / Description <span className="text-white/20">(optional)</span>
                </label>
                <textarea
                  placeholder="e.g. Planning weekend trip to Goa, chill movie night, studying for exams..."
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  maxLength={200}
                  rows={2}
                  className="input-field w-full resize-none text-xs"
                />
                <span className="block text-[9px] text-white/30 text-right mt-0.5">
                  {purpose.length} / 200 characters
                </span>
              </div>

              {/* Room Visibility Options */}
              <div>
                <label className="block text-xs text-white/40 mb-1.5 font-medium">
                  Room Visibility
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPublic(true)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isPublic
                        ? 'bg-primary-500/15 border-primary-500 text-white shadow-lg shadow-primary-500/10'
                        : 'bg-white/3 border-white/10 text-white/40 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 font-bold text-xs">
                      <FiGlobe className={isPublic ? 'text-primary-400' : 'text-white/40'} size={14} />
                      <span>Public Lobby</span>
                    </div>
                    <p className="text-[10px] opacity-70 leading-tight">Appears on Public Lobbies so anyone can request to join</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsPublic(false)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      !isPublic
                        ? 'bg-accent-500/15 border-accent-500 text-white shadow-lg shadow-accent-500/10'
                        : 'bg-white/3 border-white/10 text-white/40 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 font-bold text-xs">
                      <FiLock className={!isPublic ? 'text-accent-400' : 'text-white/40'} size={14} />
                      <span>Private Room</span>
                    </div>
                    <p className="text-[10px] opacity-70 leading-tight">Hidden from public list. Invite chat friends directly in DM</p>
                  </button>
                </div>
              </div>

              <button
                onClick={handleCreate}
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 cursor-pointer pt-3 pb-3 mt-4"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <FiHash size={18} />
                    Generate Room Code
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Step 2 — Show Code + Invite Options */
          <div className="glass-card p-6 sm:p-8 animate-slide-up text-center">
            <div className="text-5xl mb-3">🎉</div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <h2 className="font-display font-bold text-xl text-white">Room Created!</h2>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${
                created.isPublic ? 'bg-primary-500/10 text-primary-400 border-primary-500/20' : 'bg-accent-500/10 text-accent-400 border-accent-500/20'
              }`}>
                {created.isPublic ? '🌐 Public' : '🔒 Private'}
              </span>
            </div>
            <p className="text-white/40 text-xs mb-6">
              {created.isPublic ? 'Share this code or let users request from Public Lobbies' : 'Only people with the code or invited in DMs can join'}
            </p>

            {/* Room Code Display */}
            <div className="bg-dark-800 border border-primary-500/30 rounded-2xl p-5 mb-5">
              <p className="text-white/30 text-[10px] uppercase tracking-widest mb-2 font-bold">Room Code</p>
              <div className="flex items-center justify-center gap-2 mb-3">
                {created.code.split('').map((char, i) => (
                  <div
                    key={i}
                    className="w-10 h-12 rounded-xl bg-primary-500/10 border border-primary-500/30
                               flex items-center justify-center text-xl font-display font-bold text-primary-300"
                  >
                    {char}
                  </div>
                ))}
              </div>
              <p className="text-white/50 text-xs font-semibold">{created.name}</p>
              {created.purpose && (
                <p className="text-primary-300/90 text-xs italic mt-2 bg-primary-500/10 py-2 px-3 rounded-xl border border-primary-500/20 text-left">
                  🎯 <span className="font-semibold not-italic">Purpose:</span> {created.purpose}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all duration-200 text-xs font-semibold cursor-pointer
                    ${copied
                      ? 'bg-neon-green/10 border-neon-green/30 text-neon-green'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                    }`}
                >
                  {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>

                <button
                  onClick={handleOpenInviteModal}
                  className="flex-1 bg-accent-500/20 hover:bg-accent-500/30 border border-accent-500/30 text-accent-300 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all"
                >
                  <FiSend size={14} />
                  Invite Friend in DM
                </button>
              </div>

              <button
                onClick={handleEnter}
                className="btn-primary w-full flex items-center justify-center gap-2 text-xs py-3 cursor-pointer"
              >
                Enter Room Now
                <FiArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Invite Friends Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card max-w-sm w-full p-6 animate-scale-in relative text-left">
            <button
              onClick={() => setShowInviteModal(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              <FiX size={18} />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <FiUsers className="text-primary-400" size={20} />
              <h3 className="font-display font-bold text-white text-base">Invite Friends via DM</h3>
            </div>
            <p className="text-white/40 text-xs mb-4">
              Select an accepted chat friend to send them a private room invite message directly to their inbox.
            </p>

            {loadingFriends ? (
              <div className="py-8 text-center text-white/30 text-xs">
                <div className="w-6 h-6 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-2" />
                Loading your chat friends...
              </div>
            ) : friends.length === 0 ? (
              <div className="py-6 text-center text-white/30 text-xs border border-white/5 rounded-xl bg-white/3">
                <p className="mb-1">No accepted chat friends found yet.</p>
                <p className="text-[10px] text-white/20">Send chat requests to friends first in Chats or Room user cards!</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {friends.map((friend) => {
                  const isInvited = invitedMap[friend._id];

                  return (
                    <div
                      key={friend._id}
                      className="p-3 rounded-xl bg-white/3 border border-white/5 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-primary-500/20 text-primary-300 font-bold flex items-center justify-center text-xs flex-shrink-0">
                          {friend.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-display font-semibold text-white text-xs truncate">
                            {friend.name || friend.username}
                          </p>
                          <p className="text-[10px] text-white/40 truncate">@{friend.username}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSendInvite(friend._id, friend.username)}
                        disabled={isInvited}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                          isInvited
                            ? 'bg-neon-green/15 text-neon-green border border-neon-green/30 cursor-not-allowed'
                            : 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                        }`}
                      >
                        {isInvited ? (
                          <>
                            <FiCheck size={12} /> Sent
                          </>
                        ) : (
                          <>
                            <FiSend size={12} /> Send DM
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateRoom;
