import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { ref, set, get, update } from 'firebase/database';
import { auth, database, ADMIN_UID } from './firebase';
import { UserProfile } from '../types';

export class AuthService {
  public subscribe(onUser: (user: UserProfile | null) => void): () => void {
    if (!auth) {
      onUser(null);
      return () => {};
    }

    return onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (!fbUser) {
        onUser(null);
        return;
      }

      const isAdmin = fbUser.uid === ADMIN_UID;

      // Read extra user properties if available
      let profile: UserProfile = {
        uid: fbUser.uid,
        email: fbUser.email || '',
        name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
        avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${fbUser.uid}`,
        createdAt: Date.now(),
        isAdmin
      };

      if (database) {
        try {
          const snap = await get(ref(database, `users/${fbUser.uid}`));
          if (snap.exists()) {
            const data = snap.val();
            profile = {
              ...profile,
              name: data.name || profile.name,
              avatar: data.avatar || profile.avatar,
              createdAt: data.createdAt || profile.createdAt,
              subscription: data.subscription,
              planId: data.planId,
              planName: data.planName,
              subscriptionExpires: data.subscriptionExpires,
              isBanned: data.isBanned
            };
          } else {
            // First time login, initialize user properties matching child write rules
            const uid = fbUser.uid;
            const now = Date.now();
            await Promise.allSettled([
              set(ref(database, `users/${uid}/email`), fbUser.email || ''),
              set(ref(database, `users/${uid}/name`), profile.name),
              set(ref(database, `users/${uid}/avatar`), profile.avatar),
              set(ref(database, `users/${uid}/createdAt`), now)
            ]);
          }
        } catch {
          // If read rules fail or still provisioning
        }
      }

      onUser(profile);
    });
  }

  public async signIn(email: string, pass: string): Promise<UserProfile> {
    if (!auth) throw new Error('Firebase Auth is not available');
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
    return {
      uid: cred.user.uid,
      email: cred.user.email || '',
      name: cred.user.displayName || cred.user.email?.split('@')[0] || 'User',
      avatar: cred.user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${cred.user.uid}`,
      createdAt: Date.now(),
      isAdmin: cred.user.uid === ADMIN_UID
    };
  }

  public async register(email: string, pass: string, name: string): Promise<UserProfile> {
    if (!auth) throw new Error('Firebase Auth is not available');
    const cleanEmail = email.trim();
    const cleanName = name.trim() || cleanEmail.split('@')[0];
    const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);

    const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${cred.user.uid}`;

    await updateProfile(cred.user, {
      displayName: cleanName,
      photoURL: avatarUrl
    });

    if (database) {
      const uid = cred.user.uid;
      const now = Date.now();
      await Promise.allSettled([
        set(ref(database, `users/${uid}/email`), cleanEmail),
        set(ref(database, `users/${uid}/name`), cleanName),
        set(ref(database, `users/${uid}/avatar`), avatarUrl),
        set(ref(database, `users/${uid}/createdAt`), now)
      ]);
    }

    return {
      uid: cred.user.uid,
      email: cleanEmail,
      name: cleanName,
      avatar: avatarUrl,
      createdAt: Date.now(),
      isAdmin: cred.user.uid === ADMIN_UID
    };
  }

  public async signInAsGuest(): Promise<UserProfile> {
    const visitorKey = 'aniflix_guest_email';
    let visitorEmail = typeof window !== 'undefined' ? localStorage.getItem(visitorKey) : null;
    const guestPass = 'GuestPass2026!';

    if (visitorEmail) {
      try {
        return await this.signIn(visitorEmail, guestPass);
      } catch {
        if (typeof window !== 'undefined') localStorage.removeItem(visitorKey);
      }
    }

    const rand = Math.random().toString(36).substring(2, 9);
    const newVisitorEmail = `visitor_${rand}@aniflix.live`;
    try {
      const user = await this.register(newVisitorEmail, guestPass, 'Guest Visitor');
      if (typeof window !== 'undefined') localStorage.setItem(visitorKey, newVisitorEmail);
      return user;
    } catch {
      return await this.signIn(newVisitorEmail, guestPass);
    }
  }

  public async signOut(): Promise<void> {
    if (auth) {
      await fbSignOut(auth);
    }
  }
}

export const authService = new AuthService();
