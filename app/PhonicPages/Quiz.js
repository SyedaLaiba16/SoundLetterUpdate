import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator, ScrollView } from "react-native";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";

// Firebase imports
import { 
  storeGameScore, 
  logUserProgress,
  getUserProgress,
  getUserStats 
} from "../firebase/firebaseHelper";

const letterData = [
  { letter: "A", sound: require("../../assets/sound/a.m4a"), word: "Apple" },
  { letter: "B", sound: require("../../assets/sound/b.m4a"), word: "Ball" },
  { letter: "C", sound: require("../../assets/sound/c.m4a"), word: "Cat" },
  { letter: "D", sound: require("../../assets/sound/d.m4a"), word: "Dog" },
  { letter: "E", sound: require("../../assets/sound/e.m4a"), word: "Egg" },
  { letter: "F", sound: require("../../assets/sound/f.m4a"), word: "Fish" },
  { letter: "G", sound: require("../../assets/sound/g.m4a"), word: "Goat" },
  { letter: "H", sound: require("../../assets/sound/h.m4a"), word: "Hat" },
  { letter: "I", sound: require("../../assets/sound/i.m4a"), word: "Igloo" },
  { letter: "J", sound: require("../../assets/sound/j.m4a"), word: "Jug" },
  { letter: "K", sound: require("../../assets/sound/k.mp3"), word: "Kite" },
  { letter: "L", sound: require("../../assets/sound/l.m4a"), word: "Lion" },
  { letter: "M", sound: require("../../assets/sound/m.m4a"), word: "Moon" },
  { letter: "N", sound: require("../../assets/sound/n.m4a"), word: "Nest" },
  { letter: "O", sound: require("../../assets/sound/o.m4a"), word: "Orange" },
  { letter: "P", sound: require("../../assets/sound/p.m4a"), word: "Pen" },
  { letter: "Q", sound: require("../../assets/sound/qu.m4a"), word: "Queen" },
  { letter: "R", sound: require("../../assets/sound/r.m4a"), word: "Rat" },
  { letter: "S", sound: require("../../assets/sound/s.m4a"), word: "Sun" },
  { letter: "T", sound: require("../../assets/sound/t.m4a"), word: "Tap" },
  { letter: "U", sound: require("../../assets/sound/u.m4a"), word: "Umbrella" },
  { letter: "V", sound: require("../../assets/sound/v.m4a"), word: "Van" },
  { letter: "W", sound: require("../../assets/sound/w.m4a"), word: "Web" },
  { letter: "X", sound: require("../../assets/sound/x.m4a"), word: "Box" },
  { letter: "Y", sound: require("../../assets/sound/y.m4a"), word: "Yak" },
  { letter: "Z", sound: require("../../assets/sound/z.m4a"), word: "Zip" },
];

const QUESTION_TYPES = {
  LETTER_SOUND: "LETTER_SOUND",
  WORD_MATCH: "WORD_MATCH",
};

const QUESTIONS_PER_QUIZ = 5; // Reduced for testing, change back to 15 for production

export default function PhonicsQuiz({ onBack, userId, level }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [sound, setSound] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [userSelections, setUserSelections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [savingProgress, setSavingProgress] = useState(false);
  const [userProgress, setUserProgress] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [showProgress, setShowProgress] = useState(false);

  // Clean up audio resources
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync().catch(error => 
          console.log("Audio cleanup error:", error)
        );
      }
    };
  }, [sound]);

  // Generate questions on component mount and load user progress
  useEffect(() => {
    generateQuestions();
    loadUserProgress();
  }, []);

  const loadUserProgress = async () => {
    try {
      const progressData = await getUserProgress("phonics", level || "beginner");
      const statsData = await getUserStats();
      
      setUserProgress(progressData);
      setUserStats(statsData);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const generateQuestions = useCallback(() => {
    try {
      setIsLoading(true);
      const shuffledLetters = [...letterData]
        .sort(() => Math.random() - 0.5)
        .slice(0, QUESTIONS_PER_QUIZ);

      const generatedQuestions = shuffledLetters.map((letter) => {
        const type =
          Object.values(QUESTION_TYPES)[
            Math.floor(Math.random() * Object.values(QUESTION_TYPES).length)
          ];

        let question;
        let options = [];
        let correctAnswer;

        switch (type) {
          case QUESTION_TYPES.LETTER_SOUND:
            question = `Which letter makes this sound?`;
            correctAnswer = letter.letter;
            options = [
              correctAnswer,
              ...getRandomLetters(3, correctAnswer),
            ].sort(() => Math.random() - 0.5);
            break;

          case QUESTION_TYPES.WORD_MATCH:
            question = `Which word begins with the letter ${letter.letter}?`;
            correctAnswer = letter.word;
            options = [
              correctAnswer,
              ...getRandomWords(3, correctAnswer),
            ].sort(() => Math.random() - 0.5);
            break;
        }

        return {
          type,
          letter: letter.letter,
          sound: letter.sound,
          question,
          options,
          correctAnswer,
        };
      });

      setQuestions(generatedQuestions);
      setIsLoading(false);
    } catch (error) {
      setError("Failed to generate questions");
      setIsLoading(false);
      console.error("Question generation error:", error);
    }
  }, []);

  const getRandomLetters = (count, exclude) => {
    const availableLetters = letterData
      .map((l) => l.letter)
      .filter((l) => l !== exclude);
    return [...availableLetters].sort(() => Math.random() - 0.5).slice(0, count);
  };

  const getRandomWords = (count, exclude) => {
    const availableWords = letterData
      .map((l) => l.word)
      .filter((w) => w !== exclude);
    return [...availableWords].sort(() => Math.random() - 0.5).slice(0, count);
  };

  const playSound = async (soundFile) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync(soundFile);
      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
      setError("Could not play the sound");
    }
  };

  const saveUserProgress = async (finalScore, total) => {
    try {
      setSavingProgress(true);
      const percentage = Math.round((finalScore / total) * 100);
      
      // Save to scores collection
      const scoreSuccess = await storeGameScore(
        "phonics", 
        level || "beginner", 
        {
          score: finalScore,
          totalQuestions: total,
          percentage: percentage
        }
      );
      
      // Also update user progress
      const progressSuccess = await logUserProgress(
        "phonics", 
        level || "beginner", 
        {
          score: finalScore,
          totalQuestions: total,
          percentage: percentage,
          completed: percentage >= 70,
          lastPlayed: new Date().toISOString()
        }
      );
      
      if (scoreSuccess && progressSuccess) {
        console.log("✅ Progress saved successfully!");
        // Reload progress data to show updated stats
        await loadUserProgress();
      } else {
        console.warn("Progress saving had some issues");
      }
      
      setQuizCompleted(true);
    } catch (error) {
      console.error("❌ Error saving progress:", error);
      setError("Failed to save progress, but your score is: " + finalScore + "/" + total);
    } finally {
      setSavingProgress(false);
    }
  };

  const checkAnswer = (selectedAnswer) => {
    setSelectedOption(selectedAnswer);
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    // Record user selection
    const selectionData = {
      letter: currentQuestion.letter,
      word: currentQuestion.type === QUESTION_TYPES.WORD_MATCH ? currentQuestion.correctAnswer : null,
      correct: isCorrect,
      selected: selectedAnswer,
      timestamp: new Date().toISOString()
    };
    
    setUserSelections(prev => [...prev, selectionData]);

    // Update score if correct
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);
    
    setFeedback(isCorrect ? "✅ Correct!" : "❌ Wrong!");
    Speech.speak(isCorrect ? "Correct!" : "Wrong!", { rate: 0.9 });

    setTimeout(() => {
      setSelectedOption(null);
      setFeedback(null);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        saveUserProgress(newScore, questions.length);
      }
    }, 1500);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setFeedback(null);
    setUserSelections([]);
    setQuizCompleted(false);
    setShowProgress(false);
    generateQuestions();
  };

  const ProgressDisplay = () => {
    if (!userProgress && !userStats) return null;

    return (
      <View style={styles.progressContainer}>
        {userProgress ? (
          <>
            <Text style={styles.progressTitle}>Your Progress in This Level</Text>
            <View style={styles.progressItem}>
              <Text style={styles.progressText}>Last Score: {userProgress.lastScore || 0}/{userProgress.totalQuestions || 0}</Text>
              <Text style={styles.progressText}>Percentage: {userProgress.percentage || 0}%</Text>
              <Text style={styles.progressText}>Completed: {userProgress.completed ? '✅ Yes' : '❌ No'}</Text>
            </View>
          </>
        ) : (
          <Text style={styles.progressText}>No progress data found. Complete a quiz to see your progress!</Text>
        )}
        
        {userStats && (
          <>
            <Text style={styles.progressTitle}>Overall Statistics</Text>
            <View style={styles.progressItem}>
              <Text style={styles.progressText}>Total Games: {userStats.totalGames}</Text>
              <Text style={styles.progressText}>Correct Answers: {userStats.totalCorrect}/{userStats.totalQuestions}</Text>
              <Text style={styles.progressText}>Overall Percentage: {userStats.overallPercentage}%</Text>
            </View>
          </>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Preparing your quiz...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.button} onPress={generateQuestions}>
          <Text style={styles.buttonText}>Try Again</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.secondaryButton]} onPress={onBack}>
          <Text style={styles.buttonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <ScrollView contentContainerStyle={[styles.container, styles.center]}>
        <Text style={styles.resultTitle}>Quiz Completed!</Text>
        
        <View style={styles.scoreCircle}>
          <Text style={styles.scorePercentage}>{percentage}%</Text>
          <Text style={styles.scoreText}>{score}/{questions.length} Correct</Text>
        </View>
        
        <View style={styles.resultDetail}>
          <Text style={styles.resultText}>
            {percentage >= 70 ? "🎉 Great job! You passed!" : "Keep practicing, you'll get better!"}
          </Text>
        </View>

        <Pressable 
          style={[styles.button, styles.toggleButton]} 
          onPress={() => setShowProgress(!showProgress)}
        >
          <Text style={styles.buttonText}>
            {showProgress ? "Hide Progress" : "Show My Progress"}
          </Text>
        </Pressable>

        {showProgress && <ProgressDisplay />}
        
        <View style={styles.buttonGroup}>
          <Pressable 
            style={[styles.button, savingProgress && styles.disabledButton]} 
            onPress={restartQuiz}
            disabled={savingProgress}
          >
            <Text style={styles.buttonText}>
              {savingProgress ? "Saving..." : "Try Again"}
            </Text>
          </Pressable>
          
          <Pressable 
            style={[styles.button, styles.secondaryButton]} 
            onPress={onBack}
            disabled={savingProgress}
          >
            <Text style={styles.buttonText}>Back to Levels</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text>No questions available. Please try again.</Text>
        <Pressable style={styles.button} onPress={generateQuestions}>
          <Text style={styles.buttonText}>Try Again</Text>
        </Pressable>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.score}>
        Score: {score}/{questions.length}
      </Text>
      <Text style={styles.questionNumber}>
        Question {currentQuestionIndex + 1} of {questions.length}
      </Text>

      <Text style={styles.question}>{currentQuestion.question}</Text>

      {currentQuestion.type === QUESTION_TYPES.LETTER_SOUND && (
        <Pressable
          style={styles.soundButton}
          onPress={() => playSound(currentQuestion.sound)}
        >
          <Text style={styles.soundButtonText}>🔊 Play Sound</Text>
        </Pressable>
      )}

      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedOption === option;
          let buttonStyle = styles.optionButton;
          
          if (isSelected) {
            buttonStyle = option === currentQuestion.correctAnswer 
              ? styles.correctOption 
              : styles.incorrectOption;
          }
          
          return (
            <Pressable
              key={index}
              style={buttonStyle}
              onPress={() => checkAnswer(option)}
              disabled={!!selectedOption}
            >
              <Text style={styles.optionText}>{option}</Text>
            </Pressable>
          );
        })}
      </View>

      {feedback && (
        <Text style={[
          styles.feedback, 
          feedback.includes("✅") ? styles.correctFeedback : styles.incorrectFeedback
        ]}>
          {feedback}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#f5f5f5" 
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  score: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 10,
  },
  questionNumber: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  question: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  soundButton: {
    backgroundColor: "#ffcc00",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  soundButtonText: { 
    fontSize: 18, 
    fontWeight: "bold" 
  },
  optionsContainer: { 
    marginTop: 20 
  },
  optionButton: {
    backgroundColor: "#e0e0e0",
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: "center",
  },
  correctOption: {
    backgroundColor: "#4CAF50",
  },
  incorrectOption: {
    backgroundColor: "#F44336",
  },
  optionText: { 
    fontSize: 18,
    color: "#000"
  },
  feedback: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    padding: 10,
    borderRadius: 8,
  },
  correctFeedback: {
    backgroundColor: "#E8F5E9",
    color: "#2E7D32",
  },
  incorrectFeedback: {
    backgroundColor: "#FFEBEE",
    color: "#C62828",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginBottom: 20,
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    minWidth: 150,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
  },
  toggleButton: {
    backgroundColor: '#28a745',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  buttonGroup: {
    marginTop: 20,
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  scoreCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  scorePercentage: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  scoreText: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
  },
  resultDetail: {
    marginBottom: 30,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#555',
  },
  progressContainer: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginVertical: 10,
    width: '100%',
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  progressItem: {
    marginBottom: 15,
  },
  progressText: {
    fontSize: 16,
    marginBottom: 5,
  },
});