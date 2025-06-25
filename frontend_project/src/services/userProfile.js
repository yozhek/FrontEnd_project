import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
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

export async function updateUserScore(userId, delta) {
  const userRef = doc(db, 'users', userId)
  const userSnap = await getDoc(userRef)
  let currentScore = 0
  if (userSnap.exists()) {
    const data = userSnap.data()
    currentScore = typeof data.score === 'number' ? data.score : 0
  }
  let newScore = currentScore + delta
  if (newScore < 0) newScore = 0
  await updateDoc(userRef, { score: newScore })
}
