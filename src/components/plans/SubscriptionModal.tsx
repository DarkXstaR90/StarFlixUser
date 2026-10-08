import React, { useState } from 'react';
import { Crown, Check, Tag, ArrowRight, ShieldCheck, Sparkles, X } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useContent } from '../../context/ContentContext';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { useToast } from '../../context/ToastContext';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  const { subscriptionPlans } = useContent();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [promoCode, setPromoCode] = useState('');
  const [redeeming, setRedeeming] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const activePlans = subscriptionPlans.filter((p) => p.active !== false);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast('Please sign in first to redeem a code', 'error');
      return;
    }
    if (!promoCode.trim()) return;

    setRedeeming(true);
    try {
      const res = await userService.redeemPromoCode(currentUser.uid, promoCode.trim());
      if (res.success) {
        showToast(res.message, 'success');
        setPromoCode('');
        onClose();
      } else {
        showToast(res.message, 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to redeem code', 'error');
    } finally {
      setRedeeming(false);
    }
  };

  const handleSelectPlan = async (plan: (typeof subscriptionPlans)[0]) => {
    if (!currentUser) {
      showToast('Please sign in to subscribe', 'error');
      return;
    }
    try {
      showToast(`Initiating checkout for ${plan.name} plan ($${plan.price})...`, 'info');
      await userService.createPaymentRecord({
        userId: currentUser.uid,
        userEmail: currentUser.email,
        planId: plan.id,
        planName: plan.name,
        amount: plan.price
      });
      showToast('Payment request created! Support will activate your plan shortly.', 'success');
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Failed to request payment', 'error');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="StreamFlix Premium VIP"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#00E5A8]/10 to-transparent border border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Unlock Full VIP Library</h4>
              <p className="text-xs text-slate-400">Ad-free high-definition streaming on all devices.</p>
            </div>
          </div>
          {currentUser?.subscription === 'active' && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#00E5A8] text-black">
              ACTIVE VIP
            </span>
          )}
        </div>

        {/* Subscription Plans Grid */}
        <div className="space-y-3">
          <h5 className="font-bold text-xs uppercase tracking-wider text-slate-300">
            Available Membership Plans
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {activePlans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  selectedPlanId === plan.id
                    ? 'bg-[#0D1722] border-[#00E5A8] shadow-lg shadow-[#00E5A8]/10'
                    : 'bg-[#08111A] border-white/5 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-base text-white">{plan.name}</span>
                    <span className="font-mono font-black text-xl text-[#00E5A8]">${plan.price}</span>
                  </div>

                  <p className="text-xs text-slate-400 mt-1">
                    Valid for {plan.durationDays} days {plan.adFree ? '• Ad-Free' : ''}
                  </p>

                  {plan.description && (
                    <p className="text-[11px] text-slate-300 mt-2 line-clamp-2">
                      {plan.description}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectPlan(plan);
                  }}
                  className="mt-4 w-full py-2 rounded-xl bg-white/5 hover:bg-[#00E5A8] hover:text-black text-xs font-bold text-slate-200 transition-all cursor-pointer"
                >
                  Choose {plan.name}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Promo / Redeem Code Input */}
        <div className="p-4 rounded-2xl bg-[#08111A] border border-white/5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Tag className="w-4 h-4 text-[#00E5A8]" />
            <span>Have a VIP Promo or Voucher Code?</span>
          </div>

          <form onSubmit={handleRedeem} className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="ENTER-PROMO-CODE"
              className="flex-1 px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-600 text-xs font-mono uppercase focus:outline-none focus:border-[#00E5A8]"
            />
            <button
              type="submit"
              disabled={redeeming || !promoCode.trim()}
              className="px-4 py-2 rounded-xl bg-[#00E5A8] hover:bg-[#00E5A8]/90 disabled:opacity-50 text-black text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap"
            >
              {redeeming ? 'Checking...' : 'Redeem'}
            </button>
          </form>
        </div>
      </div>
    </Modal>
  );
};
