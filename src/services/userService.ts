import { ref, onValue, set, remove, update, get } from 'firebase/database';
import { database, ADMIN_UID } from './firebase';
import { UserProfile, UserHistoryItem } from '../types';

export class UserService {
  private unsubProfile: (() => void) | null = null;
  private unsubMyList: (() => void) | null = null;
  private unsubHistory: (() => void) | null = null;

  public subscribeUserData(
    uid: string,
    onData: (data: {
      profile: Partial<UserProfile> | null;
      myList: Record<string, boolean | number>;
      history: UserHistoryItem[];
    }) => void
  ): () => void {
    if (!database || !uid) {
      return () => {};
    }

    let currentProfile: Partial<UserProfile> | null = null;
    let currentMyList: Record<string, boolean | number> = {};
    let currentHistory: UserHistoryItem[] = [];

    const emit = () => {
      onData({
        profile: currentProfile,
        myList: currentMyList,
        history: currentHistory
      });
    };

    // 1. Listen to user profile
    const userRef = ref(database, `users/${uid}`);
    this.unsubProfile = onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        currentProfile = {
          uid,
          email: val.email || '',
          name: val.name || '',
          avatar: val.avatar || '',
          createdAt: val.createdAt || Date.now(),
          isAdmin: uid === ADMIN_UID,
          subscription: val.subscription,
          planId: val.planId,
          planName: val.planName,
          subscriptionExpires: val.subscriptionExpires,
          isBanned: val.isBanned
        };
      } else {
        currentProfile = null;
      }
      emit();
    });

    // 2. Listen to myList
    const myListRef = ref(database, `users/${uid}/myList`);
    this.unsubMyList = onValue(myListRef, (snapshot) => {
      currentMyList = snapshot.exists() ? (snapshot.val() as Record<string, boolean | number>) : {};
      emit();
    });

    // 3. Listen to history
    const historyRef = ref(database, `users/${uid}/history`);
    this.unsubHistory = onValue(historyRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        currentHistory = Object.keys(val)
          .map((id) => ({
            id,
            contentId: val[id]?.contentId || id,
            seriesId: val[id]?.seriesId,
            episodeId: val[id]?.episodeId,
            episodeNumber: val[id]?.episodeNumber,
            title: val[id]?.title || '',
            poster: val[id]?.poster || '',
            positionSeconds: Number(val[id]?.positionSeconds) || 0,
            durationSeconds: Number(val[id]?.durationSeconds) || 0,
            timestamp: Number(val[id]?.timestamp) || Date.now()
          }))
          .sort((a, b) => b.timestamp - a.timestamp);
      } else {
        currentHistory = [];
      }
      emit();
    });

    return () => {
      if (this.unsubProfile) this.unsubProfile();
      if (this.unsubMyList) this.unsubMyList();
      if (this.unsubHistory) this.unsubHistory();
    };
  }

  public async toggleMyList(uid: string, contentId: string, currentInList: boolean): Promise<boolean> {
    if (!database || !uid) return false;
    const targetRef = ref(database, `users/${uid}/myList/${contentId}`);
    if (currentInList) {
      await remove(targetRef);
      return false;
    } else {
      await set(targetRef, Date.now());
      return true;
    }
  }

  public async updateWatchProgress(uid: string, item: Omit<UserHistoryItem, 'id' | 'timestamp'>): Promise<void> {
    if (!database || !uid) return;
    const historyId = item.contentId;
    const targetRef = ref(database, `users/${uid}/history/${historyId}`);
    await set(targetRef, {
      ...item,
      id: historyId,
      timestamp: Date.now()
    });
  }

  public async clearHistory(uid: string): Promise<void> {
    if (!database || !uid) return;
    await remove(ref(database, `users/${uid}/history`));
  }

  public async redeemPromoCode(uid: string, code: string): Promise<{ success: boolean; message: string }> {
    if (!database || !uid) return { success: false, message: 'Not connected' };
    const cleanCode = code.trim().toUpperCase();

    try {
      const codeRef = ref(database, `redeemCodes/${cleanCode}`);
      const snap = await get(codeRef);
      if (!snap.exists()) {
        return { success: false, message: 'Invalid redeem code' };
      }

      const codeData = snap.val();
      if (codeData.used === true || codeData.status === 'used') {
        return { success: false, message: 'This code has already been redeemed' };
      }

      // Mark code as used according to security rule:
      // data.exists() && data.child('used').val() != true && newData.child('used').val() == true && newData.child('usedBy').val() == auth.uid && newData.child('status').val() == 'used'
      await update(codeRef, {
        used: true,
        usedBy: uid,
        status: 'used',
        redeemedAt: Date.now()
      });

      // Update user subscription
      const planName = codeData.planName || 'VIP Access';
      const durationDays = codeData.durationDays || 30;
      const expires = Date.now() + durationDays * 24 * 60 * 60 * 1000;

      await update(ref(database, `users/${uid}`), {
        subscription: 'active',
        planId: codeData.planId || 'vip',
        planName,
        subscriptionExpires: expires,
        redeemCode: cleanCode,
        redeemedAt: Date.now()
      });

      return { success: true, message: `Successfully redeemed ${planName} for ${durationDays} days!` };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to redeem code' };
    }
  }

  public async createPaymentRecord(params: {
    userId: string;
    userEmail: string;
    planId: string;
    planName: string;
    amount: number;
  }): Promise<{ success: boolean; paymentId: string }> {
    if (!database) throw new Error('Database not connected');
    const paymentId = 'pay-' + Math.random().toString(36).substring(2, 10);
    const paymentData = {
      id: paymentId,
      userId: params.userId,
      userEmail: params.userEmail,
      planId: params.planId,
      planName: params.planName,
      amount: params.amount,
      status: 'pending',
      timestamp: Date.now()
    };

    await set(ref(database, `payments/${paymentId}`), paymentData);
    return { success: true, paymentId };
  }
}

export const userService = new UserService();
