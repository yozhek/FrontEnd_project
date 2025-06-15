import { defineStore } from 'pinia';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { createUserProfile, getUserProfile } from '@/services/userProfile';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    userProfile: null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user,
    currentUserProfile: (state) => state.userProfile
  },

  actions: {
    async init() {
      return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
          this.user = user;
          if (user) {
            this.userProfile = await getUserProfile(user.uid);
          } else {
            this.userProfile = null;
          }
          resolve(user);
        });
      });
    },

    async register(email, password, nickname, score) {
      this.loading = true;
      this.error = null;
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        this.user = userCredential.user;
        await createUserProfile(userCredential.user.uid, { email, nickname, score});
        this.userProfile = { email, nickname, score};
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
    }
  }
});
