// firebaseHelper.js - Complete Firebase helper functions
import { 
  doc, 
  setDoc, 
  serverTimestamp, 
  getDoc,
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy,
  updateDoc,
  limit,
  deleteDoc // Added missing import
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { getAuth } from "firebase/auth";

// ✅ Export the Firestore functions
export { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, limit };

// ✅ Log or update user progress with the actual logged-in user
export const logUserProgress = async (module, level, data) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.warn("No user is logged in - progress not saved");
      return false;
    }

    const userId = user.uid;
    const userRef = doc(db, "userProgress", userId);
    
    // Get existing data first
    const docSnap = await getDoc(userRef);
    const existingData = docSnap.exists() ? docSnap.data() : {};
    
    // Update only the specific module data
    const updatedData = {
      ...existingData,
      [module]: {
        ...existingData[module],
        [level]: {
          ...data,
          timestamp: serverTimestamp(),
        }
      },
      userId,
      lastUpdated: serverTimestamp()
    };

    await setDoc(userRef, updatedData);
    console.log("Progress logged:", { userId, module, level, ...data });
    return true;
  } catch (error) {
    console.error("Error logging progress:", error);
    return false;
  }
};

// ✅ Store score for any game/module
export const storeGameScore = async (module, level, scoreData) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.warn("No user is logged in - score not saved");
      return false;
    }

    const userId = user.uid;
    
    // Add to scores collection
    const scoresCollection = collection(db, "scores"); // Fixed collection reference
    await addDoc(scoresCollection, {
      userId,
      module,
      level,
      ...scoreData,
      timestamp: serverTimestamp(),
    });

    // Also update user progress
    await logUserProgress(module, level, {
      lastScore: scoreData.score,
      totalQuestions: scoreData.totalQuestions,
      percentage: Math.round((scoreData.score / scoreData.totalQuestions) * 100),
      completed: scoreData.score === scoreData.totalQuestions,
      lastPlayed: serverTimestamp()
    });

    console.log("Score stored:", { userId, module, level, ...scoreData });
    return true;
  } catch (error) {
    console.error("Error storing score:", error);
    return false;
  }
};

// ✅ Get user progress for a specific module or all modules
export const getUserProgress = async (module = null, level = null) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.warn("No user is logged in");
      return null;
    }

    const userId = user.uid;
    const userRef = doc(db, "userProgress", userId);
    
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      
      if (module && level) {
        return data[module]?.[level] || null;
      } else if (module) {
        return data[module] || null;
      } else {
        return data;
      }
    } else {
      console.log("No progress data found for user");
      return null;
    }
  } catch (error) {
    console.error("Error getting user progress:", error);
    return null;
  }
};

// ✅ Get user scores with optional filtering
export const getUserScores = async (module = null, level = null, limitCount = 10) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.warn("No user is logged in");
      return [];
    }

    const userId = user.uid;
    let scoresQuery;
    
    if (module && level) {
      scoresQuery = query(
        collection(db, "scores"),
        where("userId", "==", userId),
        where("module", "==", module),
        where("level", "==", level),
        orderBy("timestamp", "desc"),
        limit(limitCount)
      );
    } else if (module) {
      scoresQuery = query(
        collection(db, "scores"),
        where("userId", "==", userId),
        where("module", "==", module),
        orderBy("timestamp", "desc"),
        limit(limitCount)
      );
    } else {
      scoresQuery = query(
        collection(db, "scores"),
        where("userId", "==", userId),
        orderBy("timestamp", "desc"),
        limit(limitCount)
      );
    }

    const querySnapshot = await getDocs(scoresQuery);
    const scores = [];
    
    querySnapshot.forEach((doc) => {
      scores.push({ id: doc.id, ...doc.data() });
    });
    
    return scores;
  } catch (error) {
    console.error("Error getting user scores:", error);
    return [];
  }
};

// ✅ Get overall user statistics
export const getUserStats = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.warn("No user is logged in");
      return null;
    }

    const userId = user.uid;
    
    // Get all scores for the user
    const scoresCollection = collection(db, "scores");
    const scoresQuery = query(
      scoresCollection,
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );
    
    const querySnapshot = await getDocs(scoresQuery);
    const scores = [];
    
    querySnapshot.forEach((doc) => {
      scores.push({ id: doc.id, ...doc.data() });
    });
    
    // Calculate statistics
    const totalGames = scores.length;
    const totalCorrect = scores.reduce((sum, score) => sum + (score.score || 0), 0);
    const totalQuestions = scores.reduce((sum, score) => sum + (score.totalQuestions || 0), 0);
    const overallPercentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    
    // Get modules played
    const modulesPlayed = [...new Set(scores.map(score => score.module))];
    
    return {
      totalGames,
      totalCorrect,
      totalQuestions,
      overallPercentage,
      modulesPlayed,
      lastPlayed: scores.length > 0 ? scores[0].timestamp : null
    };
  } catch (error) {
    console.error("Error getting user stats:", error);
    return null;
  }
};

// ✅ Get leaderboard data for a specific module
export const getLeaderboard = async (module = null, limitCount = 10) => {
  try {
    const scoresCollection = collection(db, "scores");
    let leaderboardQuery;
    
    if (module) {
      leaderboardQuery = query(
        scoresCollection,
        where("module", "==", module),
        orderBy("percentage", "desc"),
        limit(limitCount)
      );
    } else {
      leaderboardQuery = query(
        scoresCollection,
        orderBy("percentage", "desc"),
        limit(limitCount)
      );
    }

    const querySnapshot = await getDocs(leaderboardQuery);
    const leaderboard = [];
    
    querySnapshot.forEach((doc) => {
      leaderboard.push({ id: doc.id, ...doc.data() });
    });
    
    return leaderboard;
  } catch (error) {
    console.error("Error getting leaderboard:", error);
    return [];
  }
};

// ✅ Check if user exists in database
export const checkUserExists = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);
    
    return docSnap.exists();
  } catch (error) {
    console.error("Error checking user existence:", error);
    return false;
  }
};

// ✅ Create or update user profile
export const updateUserProfile = async (profileData) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.warn("No user is logged in");
      return false;
    }

    const userId = user.uid;
    const userRef = doc(db, "users", userId);
    
    await setDoc(userRef, {
      ...profileData,
      userId,
      lastUpdated: serverTimestamp()
    }, { merge: true });

    console.log("User profile updated:", { userId, ...profileData });
    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    return false;
  }
};

// ✅ Get user profile
export const getUserProfile = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.warn("No user is logged in");
      return null;
    }

    const userId = user.uid;
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("No user profile found");
      return null;
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
};

// ✅ Get module completion status
export const getModuleCompletion = async (module) => {
  try {
    const progress = await getUserProgress(module);
    
    if (!progress) {
      return {
        completed: 0,
        total: 0,
        percentage: 0
      };
    }
    
    const levels = Object.keys(progress);
    const completedLevels = levels.filter(level => progress[level].completed);
    
    return {
      completed: completedLevels.length,
      total: levels.length,
      percentage: Math.round((completedLevels.length / levels.length) * 100)
    };
  } catch (error) {
    console.error("Error getting module completion:", error);
    return {
      completed: 0,
      total: 0,
      percentage: 0
    };
  }
};

// ✅ Get recent activity for a user
export const getRecentActivity = async (limitCount = 10) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.warn("No user is logged in");
      return [];
    }

    const userId = user.uid;
    const scoresCollection = collection(db, "scores");
    const activityQuery = query(
      scoresCollection,
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(activityQuery);
    const activities = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      activities.push({
        id: doc.id,
        module: data.module,
        level: data.level,
        score: data.score,
        total: data.totalQuestions,
        percentage: Math.round((data.score / data.totalQuestions) * 100),
        timestamp: data.timestamp
      });
    });
    
    return activities;
  } catch (error) {
    console.error("Error getting recent activity:", error);
    return [];
  }
};

// ✅ Reset user progress (for testing or account management)
export const resetUserProgress = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.warn("No user is logged in");
      return false;
    }

    const userId = user.uid;
    
    // Delete user progress
    const userProgressRef = doc(db, "userProgress", userId);
    await setDoc(userProgressRef, {});
    
    // Delete user scores
    const scoresCollection = collection(db, "scores");
    const scoresQuery = query(
      scoresCollection,
      where("userId", "==", userId)
    );
    
    const querySnapshot = await getDocs(scoresQuery);
    const deletePromises = [];
    
    querySnapshot.forEach((doc) => {
      deletePromises.push(deleteDoc(doc.ref));
    });
    
    await Promise.all(deletePromises);
    
    console.log("User progress reset:", userId);
    return true;
  } catch (error) {
    console.error("Error resetting user progress:", error);
    return false;
  }
};

// ✅ Get user's best score for a specific module and level
export const getBestScore = async (module, level) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.warn("No user is logged in");
      return null;
    }

    const userId = user.uid;
    const scoresCollection = collection(db, "scores");
    const bestScoreQuery = query(
      scoresCollection,
      where("userId", "==", userId),
      where("module", "==", module),
      where("level", "==", level),
      orderBy("percentage", "desc"),
      limit(1)
    );

    const querySnapshot = await getDocs(bestScoreQuery);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const bestScore = querySnapshot.docs[0].data();
    return {
      score: bestScore.score,
      totalQuestions: bestScore.totalQuestions,
      percentage: bestScore.percentage,
      timestamp: bestScore.timestamp
    };
  } catch (error) {
    console.error("Error getting best score:", error);
    return null;
  }
};