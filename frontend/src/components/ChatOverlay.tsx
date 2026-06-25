'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { sendChatMessage } from '@/lib/api';
import {
  ChatSession,
  createSession,
  getSessions,
  getSessionMessages,
  saveMessage,
  renameSession,
  deleteSession,
} from '@/lib/chatHistoryApi';
import { useAuth } from '@/lib/auth-context';
import TypingIndicator from './TypingIndicator';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

interface ChatOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  initialInput?: string;
}

const WELCOME_MESSAGE: Message = {
  role: 'ai',
  content:
    'Selamat datang di PT ITM AI Assistant! 👋\n\nSaya siap membantu Anda dengan informasi seputar keselamatan kerja (K3), kesehatan & wellness, dan profil perusahaan.\n\nSilakan ajukan pertanyaan Anda.',
};

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ChatOverlay({ isOpen, onClose, initialInput = '' }: ChatOverlayProps) {
  const { isAuthenticated } = useAuth();

  // Session state
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Chat state
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Rename state
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const renameInputRef = useRef<HTMLInputElement>(null);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  // Toast notification
  const [toast, setToast] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Three-dot menu state
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    if (openMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openMenuId]);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // Load sessions when modal opens
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadSessions();
    }
  }, [isOpen, isAuthenticated]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      if (initialInput) {
        setInput(initialInput);
      }
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, initialInput]);

  // Escape key closes overlay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Load all sessions from backend
  const loadSessions = async () => {
    try {
      const data = await getSessions();
      setSessions(data);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  // Create a new chat session
  const handleNewChat = async () => {
    if (!isAuthenticated) return;

    try {
      const result = await createSession();
      const newSession: ChatSession = {
        id: result.sessionId,
        title: result.title,
        createdAt: result.createdAt,
        updatedAt: result.createdAt,
      };

      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(result.sessionId);
      setMessages([WELCOME_MESSAGE]);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  // Load messages from a specific session
  const handleSelectSession = async (sessionId: string) => {
    if (sessionId === activeSessionId) return;

    setActiveSessionId(sessionId);
    setIsLoadingHistory(true);

    try {
      const dbMessages = await getSessionMessages(sessionId);
      const mapped: Message[] = dbMessages.map((m) => ({
        role: m.role === 'assistant' ? 'ai' : 'user',
        content: m.content,
      }));

      // Show welcome + loaded messages (or just loaded if any exist)
      setMessages(mapped.length > 0 ? mapped : [WELCOME_MESSAGE]);
    } catch (error) {
      console.error('Failed to load messages:', error);
      setMessages([WELCOME_MESSAGE]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Handle sending a message
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    // Add user message to UI immediately
    const userMessage: Message = { role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    let currentSessionId = activeSessionId;

    try {
      // Auto-create session if none active
      if (!currentSessionId && isAuthenticated) {
        const result = await createSession();
        currentSessionId = result.sessionId;
        setActiveSessionId(result.sessionId);
        setSessions((prev) => [
          {
            id: result.sessionId,
            title: 'New Chat',
            createdAt: result.createdAt,
            updatedAt: result.createdAt,
          },
          ...prev,
        ]);
      }

      // Save user message to DB
      if (currentSessionId) {
        await saveMessage(currentSessionId, 'user', trimmed);
      }

      // Call AI
      const response = await sendChatMessage(trimmed, 'ITM-0012');
      const aiMessage: Message = { role: 'ai', content: response.reply };
      setMessages((prev) => [...prev, aiMessage]);

      // Save AI response to DB
      if (currentSessionId) {
        await saveMessage(currentSessionId, 'assistant', response.reply);
      }

      // Refresh sessions list to update ordering and title
      if (isAuthenticated) {
        loadSessions();
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      const aiMessage: Message = {
        role: 'ai',
        content: `Maaf, terjadi kesalahan: ${errorMsg}\n\nPastikan server backend berjalan di localhost:4000 dan API key telah dikonfigurasi.`,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Show toast notification
  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setToast(null), 3000);
  };

  // Rename handlers
  const startRename = (session: ChatSession) => {
    setEditingSessionId(session.id);
    setEditTitle(session.title);
    setTimeout(() => renameInputRef.current?.focus(), 50);
  };

  const confirmRename = async (sessionId: string) => {
    const trimmed = editTitle.trim();
    if (!trimmed || trimmed.length > 60) {
      setEditingSessionId(null);
      return;
    }

    // Optimistic update
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, title: trimmed } : s))
    );
    setEditingSessionId(null);

    try {
      await renameSession(sessionId, trimmed);
    } catch (error) {
      console.error('Rename failed:', error);
      // Revert on failure
      loadSessions();
    }
  };

  const cancelRename = () => {
    setEditingSessionId(null);
    setEditTitle('');
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent, sessionId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      confirmRename(sessionId);
    } else if (e.key === 'Escape') {
      cancelRename();
    }
  };

  // Delete handlers
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { id } = deleteTarget;

    try {
      await deleteSession(id);

      // Remove from local state
      setSessions((prev) => prev.filter((s) => s.id !== id));

      // If deleted session was active, reset chat
      if (activeSessionId === id) {
        setActiveSessionId(null);
        setMessages([WELCOME_MESSAGE]);
      }

      showToast('Percakapan berhasil dihapus');
    } catch (error) {
      console.error('Delete failed:', error);
      showToast('Gagal menghapus percakapan');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-xl"
            onClick={onClose}
          />

          {/* Chat Panel — widened to max-w-4xl */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-4xl h-[85vh] mx-4 flex rounded-3xl overflow-hidden shadow-2xl shadow-black/50"
            style={{ background: 'rgba(10, 8, 19, 0.95)', backdropFilter: 'blur(24px)' }}
          >
            {/* Left History Panel */}
            <div
              className="hidden sm:flex flex-col w-64 flex-shrink-0 border-r border-white/[0.08]"
              style={{ background: 'rgba(255, 255, 255, 0.02)' }}
            >
              {/* New Chat Button */}
              <div className="p-3 flex-shrink-0">
                <button
                  onClick={handleNewChat}
                  disabled={!isAuthenticated}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-heading font-medium shadow-lg shadow-purple-900/30 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  New Chat
                </button>
              </div>

              {/* Sessions List */}
              <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1">
                {sessions.length === 0 && !isLoadingHistory && (
                  <div className="px-3 py-6 text-center">
                    <p className="text-xs text-white/30">No conversations yet</p>
                    <p className="text-[10px] text-white/20 mt-1">Start a new chat to begin</p>
                  </div>
                )}

                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`relative w-full text-left px-3 py-2.5 rounded-lg transition-all duration-150 group ${
                      activeSessionId === session.id
                        ? 'bg-purple-500/20 border-l-2 border-purple-400'
                        : 'hover:bg-white/[0.05] border-l-2 border-transparent'
                    }`}
                  >
                    {editingSessionId === session.id ? (
                      /* Inline rename input */
                      <input
                        ref={renameInputRef}
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => handleRenameKeyDown(e, session.id)}
                        onBlur={() => confirmRename(session.id)}
                        maxLength={60}
                        className="w-full bg-white/[0.08] border border-violet-accent/40 rounded px-2 py-1 text-xs font-heading font-medium text-white focus:outline-none focus:border-violet-accent/60"
                      />
                    ) : (
                      /* Normal session display */
                      <button
                        onClick={() => handleSelectSession(session.id)}
                        className="w-full text-left pr-12"
                      >
                        <p className="text-xs font-heading font-medium text-white/80 truncate">
                          {session.title}
                        </p>
                        <p className="text-[10px] text-white/30 mt-0.5">
                          {formatRelativeTime(session.updatedAt)}
                        </p>
                      </button>
                    )}

                    {/* Three-dot menu button */}
                    {editingSessionId !== session.id && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2" ref={openMenuId === session.id ? menuRef : undefined}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === session.id ? null : session.id);
                          }}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                            openMenuId === session.id
                              ? 'bg-white/10'
                              : 'bg-transparent hover:bg-white/[0.08]'
                          }`}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-white/50">
                            <circle cx="12" cy="5" r="2" />
                            <circle cx="12" cy="12" r="2" />
                            <circle cx="12" cy="19" r="2" />
                          </svg>
                        </button>

                        {/* Dropdown menu */}
                        <AnimatePresence>
                          {openMenuId === session.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -4 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -4 }}
                              transition={{ duration: 0.1 }}
                              className="absolute right-0 top-full mt-1 w-36 rounded-xl overflow-hidden shadow-xl shadow-black/40 z-[55]"
                              style={{ background: 'rgba(20, 18, 35, 0.98)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)' }}
                            >
                              {/* Rename option */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuId(null);
                                  startRename(session);
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-heading font-medium text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors"
                              >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                                Rename
                              </button>
                              {/* Divider */}
                              <div className="h-px bg-white/[0.06]" />
                              {/* Delete option */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuId(null);
                                  setDeleteTarget({ id: session.id, title: session.title });
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-heading font-medium text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                              >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                </svg>
                                Delete
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Panel Footer */}
              {!isAuthenticated && (
                <div className="p-3 border-t border-white/[0.06]">
                  <p className="text-[10px] text-white/30 text-center">
                    Log in to save chat history
                  </p>
                </div>
              )}
            </div>

            {/* Right Chat Area */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Header */}
              <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-accent/10 flex items-center justify-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-violet-accent"
                    >
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-heading font-semibold text-base">PT ITM AI Assistant</h2>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] text-white/40">Online</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-xl glass flex items-center justify-center hover:bg-white/10 transition-colors"
                  aria-label="Close chat"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-white/60"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {isLoadingHistory ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-violet-accent/30 border-t-violet-accent rounded-full animate-spin" />
                      <span className="text-sm text-white/40">Loading messages...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, index) => (
                      <motion.div
                        key={`${activeSessionId}-${index}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className={`flex items-start gap-3 ${
                          msg.role === 'user' ? 'flex-row-reverse' : ''
                        }`}
                      >
                        {/* Avatar */}
                        {msg.role === 'ai' ? (
                          <div className="w-8 h-8 rounded-full bg-violet-accent/10 flex items-center justify-center text-[10px] font-bold text-violet-accent flex-shrink-0">
                            AI
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-violet-accent flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                            You
                          </div>
                        )}

                        {/* Bubble */}
                        <div
                          className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-violet-accent/80 rounded-2xl rounded-tr-sm text-white whitespace-pre-wrap'
                              : 'rounded-2xl rounded-tl-sm text-white/90'
                          }`}
                          style={
                            msg.role === 'ai'
                              ? {
                                  background: 'rgba(255, 255, 255, 0.04)',
                                  border: '1px solid rgba(255, 255, 255, 0.06)',
                                }
                              : undefined
                          }
                        >
                          {msg.role === 'ai' ? (
                            <div className="prose prose-invert prose-sm max-w-none [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:space-y-1 [&_strong]:text-violet-300 [&_code]:bg-white/[0.08] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-xs [&_code]:font-mono [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mt-3 [&_h2]:mb-2 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-2 [&_h3]:mb-1">
                              <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                          ) : (
                            msg.content
                          )}
                        </div>
                      </motion.div>
                    ))}

                    {isLoading && <TypingIndicator />}
                  </>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form
                onSubmit={handleSubmit}
                className="px-4 py-4 border-t border-white/10 flex-shrink-0"
              >
                <div className="flex items-center gap-3">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Tanyakan sesuatu..."
                    disabled={isLoading}
                    className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-accent/50 transition-colors disabled:opacity-50"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-violet-accent hover:bg-violet-500 rounded-xl px-5 py-3 text-white font-heading font-medium shadow-lg shadow-purple-900/30 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                  >
                    <span className="hidden sm:inline">Kirim</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Delete Confirmation Dialog */}
          <AnimatePresence>
            {deleteTarget && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[60] flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/50"
                  onClick={() => setDeleteTarget(null)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="relative w-full max-w-sm dashboard-card rounded-2xl p-6"
                >
                  <h3 className="text-lg font-heading font-bold text-white mb-3">
                    Hapus Percakapan?
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    Percakapan ini akan dihapus secara permanen dan tidak dapat dipulihkan. Seluruh riwayat pesan dalam sesi ini akan hilang selamanya.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setDeleteTarget(null)}
                      className="flex-1 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-sm font-heading font-medium text-white hover:bg-white/10 transition-all"
                    >
                      Batal
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="flex-1 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-sm font-heading font-medium text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-all"
                    >
                      Hapus Sekarang
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toast Notification */}
          <AnimatePresence>
            {toast && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[70] px-5 py-2.5 rounded-xl text-sm font-heading font-medium text-white shadow-lg"
                style={{ background: 'rgba(10, 8, 19, 0.95)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)' }}
              >
                {toast}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}
