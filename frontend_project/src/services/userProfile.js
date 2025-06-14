import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';

export async function createUserProfile(userId, profile) {
  // profile: { email, nickname }
  await setDoc(doc(db, 'users', userId), profile);
}

export async function getUserProfile(userId) {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
}
