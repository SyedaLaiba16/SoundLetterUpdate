// app/firebase/firebaseHelper.js
import { db, auth } from "./firebaseConfig";
import {
  collection,
  addDoc,
  setDoc,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  increment,
  query,
  where,
  getDocs
} from "firebase/firestore";

/**
 * Helper: resolve UID (use provided userId or current authenticated user)
 */
const resolveUid = (userId) => {
  if (userId) return userId;
  try {
    return (auth && auth.currentUser && auth.currentUser.uid) || null;
  } catch (e) {
    return null;
  }
};

/**
 * Store game score in "LetterSoundsScores" collection
 * Params:
 *   userId: (optional) string
 *   gameType: string
 *   data: { score, totalQuestions, percentage, ... }
 */
export const storeGameScore = async (userId, gameType, data) => {
  try {
    if (!db) throw new Error("Firestore (db) is not initialized");
    const uid = resolveUid(userId);
    const payload = {
      userId: uid,
      gameType,
      ...data,
      createdAt: serverTimestamp()
    };

    await addDoc(collection(db, "LetterSoundsScores"), payload);
    return true;
  } catch (error) {
    console.error("❌ Error storing game score:", error);
    return false;
  }
};

/**
 * Log or update user progress (in "UserProgress" collection)
 * We store one doc per user+gameType, ID = `${uid}_${gameType}`
 */
export const logUserProgress = async (userId, gameType, data) => {
  try {
    if (!db) throw new Error("Firestore (db) is not initialized");
    const uid = resolveUid(userId) || "guest";
    const docId = `${uid}_${gameType}`;
    const docRef = doc(db, "userProgress", docId);
    const docSnap = await getDoc(docRef);

    const payload = {
      userId: uid,
      gameType,
      ...data,
      lastUpdated: serverTimestamp()
    };

    if (docSnap.exists()) {
      // update (merge new fields, increment attempts)
      await updateDoc(docRef, {
        ...payload,
        attempts: increment(1)
      });
    } else {
      // create new
      await setDoc(docRef, {
        ...payload,
        attempts: 1,
        createdAt: serverTimestamp()
      });
    }
    return true;
  } catch (error) {
    console.error("❌ Error logging user progress:", error);
    return false;
  }
};

/**
 * Get user progress document for the specific game
 * returns null if not found
 */
export const getUserProgress = async (userId, gameType) => {
  try {
    if (!db) throw new Error("Firestore (db) is not initialized");
    const uid = resolveUid(userId) || "guest";
    const docId = `${uid}_${gameType}`;
    const docRef = doc(db, "userProgress", docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      // map to the shape your Quiz expects (lastScore, totalQuestions, percentage, completed)
      return {
        lastScore: data.score || 0,
        totalQuestions: data.totalQuestions || 0,
        percentage: data.percentage || 0,
        completed: data.completed || false,
        attempts: data.attempts || 0,
        lastUpdated: data.lastUpdated || null
      };
    }
    return null;
  } catch (error) {
    console.error("❌ Error getting user progress:", error);
    return null;
  }
};

/**
 * Compute basic user stats by querying LetterSoundsScores for this user.
 * NOTE: this performs a client-side aggregation (fine for small datasets).
 */
export const getUserStats = async (userId) => {
  try {
    if (!db) throw new Error("Firestore (db) is not initialized");
    const uid = resolveUid(userId);
    if (!uid) {
      return { totalGames: 0, totalQuestions: 0, totalCorrect: 0, overallPercentage: 0 };
    }

    const q = query(collection(db, "LetterSoundsScores"), where("userId", "==", uid));
    const snap = await getDocs(q);

    let totalGames = 0;
    let totalQuestions = 0;
    let totalCorrect = 0;

    snap.forEach((d) => {
      totalGames += 1;
      const val = d.data();
      totalQuestions += val.totalQuestions || 0;
      totalCorrect += val.score || 0;
    });

    const overallPercentage = totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    return { totalGames, totalQuestions, totalCorrect, overallPercentage };
  } catch (error) {
    console.error("❌ Error getting user stats:", error);
    return { totalGames: 0, totalQuestions: 0, totalCorrect: 0, overallPercentage: 0 };
  }
};