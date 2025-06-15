import { defineStore } from 'pinia';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { getUserProfile } from '@/services/userProfile';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    userProfile: null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user && state.user.emailVerified,
    currentUser: (state) => state.user,
    currentUserProfile: (state) => state.userProfile
  },

  actions: {
    async init() {
      return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
          if (user && user.emailVerified) {
            this.user = user;
            this.userProfile = await getUserProfile(user.uid);
            resolve(user);
          } else {
            this.user = null;
            this.userProfile = null;
            resolve(null);
          }
        });
      });
    },

    async register(email, password) {
      this.loading = true;
      this.error = null;
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        return userCredential.user;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async login(email, password) {
      this.loading = true;
      this.error = null;
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified) {
          await signOut(auth);
          this.user = null;
          this.userProfile = null;
          throw { code: 'auth/email-not-verified', message: 'Подтвердите email для входа.' };
        }
        this.user = userCredential.user;
        this.userProfile = await getUserProfile(userCredential.user.uid);
        return userCredential.user;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async loginWithGoogle() {
      this.loading = true;
      this.error = null;
      try {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        this.user = userCredential.user;
        this.userProfile = await getUserProfile(userCredential.user.uid);
        return userCredential.user;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      this.loading = true;
      this.error = null;
      try {
        await signOut(auth);
        this.user = null;
        this.userProfile = null;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async checkEmailVerified() {
      if (!auth.currentUser) return false;
      await auth.currentUser.reload();
      this.user = auth.currentUser;
      return auth.currentUser.emailVerified;
    },

    async resendVerificationEmail() {
      try {
        await sendEmailVerification(auth.currentUser);
      } catch (error) {
        this.error = error.message;
        throw error;
      }
    },

    async changePassword(oldPassword, newPassword) {
      this.loading = true;
      this.error = null;
      try {
        const user = auth.currentUser;
        if (!user) {
          throw new Error('No user is currently signed in');
        }

        // Reauthenticate user before changing password
        const credential = EmailAuthProvider.credential(user.email, oldPassword);
        await reauthenticateWithCredential(user, credential);

        // Change password
        await updatePassword(user, newPassword);
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});
