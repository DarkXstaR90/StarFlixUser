import React, { useState } from 'react';
import { Mail, Lock, User, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'signin' }) => {
  const { signIn, register, signInAsGuest } = useAuth();

  const [mode, setMode] = useState<'signin' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        await signIn(email, password);
        onClose();
      } else {
        if (!name.trim()) throw new Error('Please enter your name');
        await register(email, password, name);
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      await signInAsGuest();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to connect as guest');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'signin' ? 'Sign In to StreamFlix' : 'Create Your Account'}
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {/* Instant Access Button */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#00E5A8]/10 via-[#14B8FF]/10 to-transparent border border-[#00E5A8]/20 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#00E5A8]">
              <Sparkles className="w-3.5 h-3.5" /> Instant Guest Access
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Browse & stream real content immediately with 1 click.
            </p>
          </div>
          <button
            type="button"
            disabled={loading}
            onClick={handleGuestLogin}
            className="px-3.5 py-1.5 rounded-xl bg-[#00E5A8] hover:bg-[#00E5A8]/90 text-black text-xs font-bold whitespace-nowrap shadow-md shadow-[#00E5A8]/20 transition-all cursor-pointer"
          >
            Enter Now
          </button>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink mx-4 text-[10px] text-slate-500 uppercase tracking-widest font-mono">
            Or with your Firebase account
          </span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Hunter"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#08111A] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#00E5A8]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#08111A] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#00E5A8]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#08111A] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#00E5A8]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00E5A8] to-[#14B8FF] text-black font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity shadow-lg shadow-[#00E5A8]/20 flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center pt-2 border-t border-white/5 text-xs text-slate-400">
          {mode === 'signin' ? (
            <p>
              New here?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-[#00E5A8] font-semibold hover:underline cursor-pointer"
              >
                Create an account
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-[#00E5A8] font-semibold hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};
