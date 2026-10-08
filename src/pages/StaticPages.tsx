import React from 'react';
import { ShieldCheck, Info, HelpCircle, FileText, ArrowLeft } from 'lucide-react';

interface StaticPageProps {
  type: 'about' | 'help' | 'terms' | 'privacy' | 'dmca';
  onBack: () => void;
}

export const StaticPage: React.FC<StaticPageProps> = ({ type, onBack }) => {
  const getContent = () => {
    switch (type) {
      case 'about':
        return {
          title: 'About StreamFlix',
          icon: <Info className="w-6 h-6 text-[#00E5A8]" />,
          body: (
            <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
              <p>
                <strong>StreamFlix</strong> is a real-time streaming platform directly connected to Firebase Realtime Database.
              </p>
              <p>
                Engineered with React, TypeScript, Tailwind CSS, and Firebase Realtime Database with live WebSocket synchronization for series, movies, streaming episodes, and user watchlists.
              </p>
            </div>
          )
        };
      case 'help':
        return {
          title: 'Help & FAQ',
          icon: <HelpCircle className="w-6 h-6 text-[#14B8FF]" />,
          body: (
            <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
              <h4 className="font-bold text-white text-base">How does real-time streaming work?</h4>
              <p>
                All series, movies, and episodes are streamed directly from high-speed content delivery networks with real-time watch progress synced to your personal Firebase account.
              </p>
            </div>
          )
        };
      case 'terms':
        return {
          title: 'Terms of Service',
          icon: <FileText className="w-6 h-6 text-[#00E5A8]" />,
          body: (
            <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
              <p>By accessing StreamFlix, you agree to comply with our community terms and acceptable usage policies.</p>
            </div>
          )
        };
      case 'privacy':
        return {
          title: 'Privacy Policy',
          icon: <ShieldCheck className="w-6 h-6 text-[#00E5A8]" />,
          body: (
            <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
              <p>Your privacy and account data are secured via Firebase Authentication and Realtime Database rules.</p>
            </div>
          )
        };
      case 'dmca':
      default:
        return {
          title: 'DMCA & Copyright Compliance',
          icon: <ShieldCheck className="w-6 h-6 text-rose-500" />,
          body: (
            <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
              <p>StreamFlix adheres strictly to intellectual property regulations.</p>
            </div>
          )
        };
    }
  };

  const { title, icon, body } = getContent();

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Browse</span>
      </button>

      <div className="p-8 sm:p-10 rounded-3xl bg-[#08111A] border border-white/5 space-y-6 shadow-xl">
        <div className="flex items-center gap-3 pb-6 border-b border-white/5">
          <div className="p-3 rounded-2xl bg-white/5">{icon}</div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white">{title}</h1>
        </div>
        {body}
      </div>
    </div>
  );
};
