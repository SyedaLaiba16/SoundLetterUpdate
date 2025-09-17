import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Dimensions,
} from "react-native";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import ConfettiCannon from "react-native-confetti-cannon";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const COLORS = ["#1961b4ff", "#F06292", "#9575CD", "#4FC3F7", "#81C784", "#FFD54F"];

// All available sounds
const sounds = {
  A: require("../../assets/sound/a.m4a"),
  B: require("../../assets/sound/b.m4a"),
  C: require("../../assets/sound/c.m4a"),
  D: require("../../assets/sound/d.m4a"),
  E: require("../../assets/sound/e.m4a"),
  F: require("../../assets/sound/f.m4a"),
  G: require("../../assets/sound/g.m4a"),
  H: require("../../assets/sound/h.m4a"),
  I: require("../../assets/sound/i.m4a"),
  J: require("../../assets/sound/j.m4a"),
  K: require("../../assets/sound/k.mp3"),
  L: require("../../assets/sound/l.m4a"),
  M: require("../../assets/sound/m.m4a"),
  N: require("../../assets/sound/n.m4a"),
  O: require("../../assets/sound/o.m4a"),
  P: require("../../assets/sound/p.m4a"),
  Q: require("../../assets/sound/qu.m4a"),
  R: require("../../assets/sound/r.m4a"),
  S: require("../../assets/sound/s.m4a"),
  T: require("../../assets/sound/t.m4a"),
  U: require("../../assets/sound/u.m4a"),
  V: require("../../assets/sound/v.m4a"),
  W: require("../../assets/sound/w.m4a"),
  X: require("../../assets/sound/x.m4a"),
  Y: require("../../assets/sound/y.m4a"),
  Z: require("../../assets/sound/z.m4a"),
};

// Letter configurations with their respective balloon sets
const letterConfigs = {
  A: {
    balloons: [
      { id: 1, text: "A" },
      { id: 2, text: "K" },
      { id: 3, text: "D" },
      { id: 4, text: "A" },
      { id: 5, text: "A" },
      { id: 6, text: "A" },
      { id: 7, text: "A" },
      
    ]
  },
  D: {
    balloons: [
      { id: 1, text: "D" },
      { id: 2, text: "O" },
      { id: 3, text: "D" },
      { id: 4, text: "A" },
      { id: 5, text: "D" },
      { id: 6, text: "Q" },
      { id: 7, text: "A" },
      { id: 8, text: "D" },
      { id: 9, text: "O" },
      { id: 10, text:"O"},
    ]
  },
  E: {
    balloons: [
      { id: 1, text: "E" },
      { id: 2, text: "F" },
      { id: 3, text: "E" },
      { id: 4, text: "A" },
      { id: 5, text: "E" },
      { id: 6, text: "F" },
      { id: 7, text: "E" },
      { id: 8, text: "A" },
      { id: 9, text: "E" },
      { id: 10, text: "E" },
    ]
  },
  H: {
    balloons: [
      { id: 1, text: "H" },
      { id: 2, text: "B" },
      { id: 3, text: "H" },
      { id: 4, text: "E" },
      { id: 5, text: "H" },
      { id: 6, text: "H" },
      { id: 7, text: "I" },
      { id: 8, text: "E" },
      { id: 9, text: "H" },
    ]
  },
   I: {
    balloons: [
      { id: 1, text: "I" },
      { id: 2, text: "T" },
      { id: 3, text: "F" },
      { id: 4, text: "I" },
      { id: 5, text: "I" },
      { id: 6, text: "L" },
      { id: 7, text: "I" },
      { id: 8, text: "I" },
      { id: 9, text: "I" },
    ]
  },
  J: {
    balloons: [
    { id: 1, text: "T" },
    { id: 2, text: "J" },
    { id: 3, text: "J" },
    { id: 4, text: "J" },
    { id: 5, text: "L" },
    { id: 6, text: "J" },
    { id: 7, text: "I" },
    { id: 8, text: "G" },
    { id: 9, text: "J" },
    ]
  },
  L: {
    balloons: [
    { id: 1, text: "L" },
    { id: 2, text: "T" },
    { id: 3, text: "L" },
    { id: 4, text: "I" },
    { id: 5, text: "T" },
    { id: 6, text: "L" },
    { id: 7, text: "I" },
    { id: 8, text: "I" },
    { id: 9, text: "L" },
    ]
  },
  O: {
    balloons: [
    { id: 1, text: "D" },
    { id: 2, text: "O" },
    { id: 3, text: "D" },
    { id: 4, text: "O" },
    { id: 5, text: "D" },
    { id: 6, text: "O" },
    { id: 7, text: "D" },
    { id: 8, text: "O" },
    { id: 9, text: "O" },
    ]
  },
  X: {
    balloons: [
      { id: 1, text: "X" },
      { id: 2, text: "K" },
      { id: 3, text: "K" },
      { id: 4, text: "X" },
      { id: 5, text: "X" },
      { id: 6, text: "K" },
      { id: 7, text: "X" },
      { id: 8, text: "K" },
      { id: 9, text: "X" },
    ]
  }
};

export default function BalloonGame({ route, onComplete, onBack }) {
  const { targetLetter } = route.params || { targetLetter: "A" };
  const [balloons, setBalloons] = useState(letterConfigs[targetLetter].balloons);
  const [confetti, setConfetti] = useState(false);
  const [showGreat, setShowGreat] = useState(false);
  const [score, setScore] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [showCorrectFeedback, setShowCorrectFeedback] = useState(false);

  // Calculate total target letter balloons
  useEffect(() => {
    const initialTargetBalloons = letterConfigs[targetLetter].balloons.filter(
      b => b.text === targetLetter
    ).length;
    setTotalCorrect(initialTargetBalloons);
  }, [targetLetter]);

  const animations = useRef(
    balloons.reduce((acc, b) => {
      acc[b.id] = {
        translateY: new Animated.Value(0),
        opacity: new Animated.Value(1),
        scale: new Animated.Value(1),
      };
      return acc;
    }, {})
  ).current;

  // 🔊 Speak task instruction
  useEffect(() => {
    Speech.speak(`Pop the letter ${targetLetter}`);
    return () => Speech.stop();
  }, [targetLetter]);

  // 🎈 Balloon floating animation
  useEffect(() => {
    balloons.forEach((b) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animations[b.id].translateY, {
            toValue: -height * 0.35,
            duration: 5000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(animations[b.id].translateY, {
            toValue: -height * 0.25,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(animations[b.id].translateY, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, [balloons]);

  // 🔊 Play letter sound
  const playSound = async (letter) => {
    try {
      const file = sounds[letter];
      if (!file) return;
      const { sound } = await Audio.Sound.createAsync(file);
      await sound.playAsync();
      setTimeout(() => sound.unloadAsync(), 800);
    } catch (e) {
      console.log("Sound error:", e);
    }
  };

  // 🎯 Balloon click handler
  const popBalloon = (id, text) => {
    playSound(text);
    if (text === targetLetter) {
      // Correct pop - add points and show feedback
      setScore(prevScore => prevScore + 10);
      
      // Show correct feedback
      setShowCorrectFeedback(true);
      Speech.speak(`Correct! That's the letter ${targetLetter}`);
      
      // Hide feedback after 1.5 seconds
      setTimeout(() => {
        setShowCorrectFeedback(false);
      }, 1500);
      
      Animated.parallel([
        Animated.timing(animations[id].scale, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(animations[id].opacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setBalloons((prev) => prev.filter((b) => b.id !== id));
      });
    } else {
      // Wrong pop - show alert with reason
      const wrongReasons = {
        A: `This is letter A, but you need to find letter ${targetLetter}. Try again!`,
        B: `This is letter B, but you need to find letter ${targetLetter}. Try again!`,
        C: `This is letter C, but you need to find letter ${targetLetter}. Try again!`,
        D: `This is letter D, but you need to find letter ${targetLetter}. Try again!`,
        E: `This is letter E, but you need to find letter ${targetLetter}. Try again!`,
        F: `This is letter F, but you need to find letter ${targetLetter}. Try again!`,
        G: `This is letter G, but you need to find letter ${targetLetter}. Try again!`,
        H: `This is letter H, but you need to find letter ${targetLetter}. Try again!`,
        I: `This is letter I, but you need to find letter ${targetLetter}. Try again!`,
        J: `This is letter J, but you need to find letter ${targetLetter}. Try again!`,
        K: `This is letter K, but you need to find letter ${targetLetter}. Try again!`,
        L: `This is letter L, but you need to find letter ${targetLetter}. Try again!`,
        M: `This is letter M, but you need to find letter ${targetLetter}. Try again!`,
        N: `This is letter N, but you need to find letter ${targetLetter}. Try again!`,
        O: `This is letter O, but you need to find letter ${targetLetter}. Try again!`,
        P: `This is letter P, but you need to find letter ${targetLetter}. Try again!`,
        Q: `This is letter Q, but you need to find letter ${targetLetter}. Try again!`,
        R: `This is letter R, but you need to find letter ${targetLetter}. Try again!`,
        S: `This is letter S, but you need to find letter ${targetLetter}. Try again!`,
        T: `This is letter T, but you need to find letter ${targetLetter}. Try again!`,
        U: `This is letter U, but you need to find letter ${targetLetter}. Try again!`,
        V: `This is letter V, but you need to find letter ${targetLetter}. Try again!`,
        W: `This is letter W, but you need to find letter ${targetLetter}. Try again!`,
        X: `This is letter X, but you need to find letter ${targetLetter}. Try again!`,
        Y: `This is letter Y, but you need to find letter ${targetLetter}. Try again!`,
        Z: `This is letter Z, but you need to find letter ${targetLetter}. Try again!`
      };
      
      const reason = wrongReasons[text] || `This is not the correct letter. Find letter ${targetLetter}. Try again!`;
      
      // Show alert and speak the reason
      Alert.alert("❌ Incorrect", reason);
      Speech.speak(reason);
    }
  };

  // ✅ Completion check
  useEffect(() => {
    if (balloons.length === 0) return;
    const remaining = balloons.filter((b) => b.text === targetLetter);
    if (remaining.length === 0) {
      setConfetti(true);
      setShowGreat(true);
      
      // Bonus points for completing the game
      const finalScore = score + 50;
      setScore(finalScore);
      
      Speech.speak(`Great job! You found all the ${targetLetter} letters and scored ${finalScore} points!`);
      setTimeout(() => {
        setShowGreat(false);
        if (onComplete) onComplete();
      }, 3000);
    }
  }, [balloons]);

  return (
    <View style={styles.container}>
      {/* 🔙 Back button + Title */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Pop the Letter "{targetLetter}"</Text>
        
        {/* Score Display */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>Score: {score}</Text>
          <Text style={styles.progressText}>
            {totalCorrect - balloons.filter(b => b.text === targetLetter).length}/{totalCorrect}
          </Text>
        </View>
      </View>

      {/* 🎈 Balloons */}
      <View style={styles.balloonContainer}>
        {balloons.map((balloon, index) => (
          <Animated.View
            key={balloon.id}
            style={{
              transform: [
                { translateY: animations[balloon.id].translateY },
                { scale: animations[balloon.id].scale },
              ],
              opacity: animations[balloon.id].opacity,
            }}
          >
            <TouchableOpacity
              style={[
                styles.balloon,
                { 
                  backgroundColor: COLORS[index % COLORS.length]
                },
              ]}
              onPress={() => popBalloon(balloon.id, balloon.text)}
              activeOpacity={0.8}
            >
              <Text style={styles.balloonText}>{balloon.text}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      {/* ✅ Correct feedback */}
      {showCorrectFeedback && (
        <View style={styles.correctFeedback}>
          <Text style={styles.correctText}>✅ Correct! That's {targetLetter}</Text>
        </View>
      )}

      {/* 🎉 Confetti & Success banner */}
      {confetti && (
        <ConfettiCannon
          count={220}
          origin={{ x: width / 2, y: -20 }}
          fadeOut
          autoStart
          explosionSpeed={300}
        />
      )}
      {showGreat && (
        <View style={styles.overlay}>
          <View style={styles.banner}>
            <Text style={styles.bannerText}>🎉 Great Job! 🎉</Text>
            <Text style={styles.scoreSummary}>You scored {score} points!</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 20,
    width: "100%",
  },
  backBtn: {
    marginRight: 10,
    padding: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333333",
    flexShrink: 1,
    flex: 1,
  },
  scoreContainer: {
    alignItems: "flex-end",
  },
  scoreText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2196F3",
  },
  progressText: {
    fontSize: 14,
    color: "#666",
  },
  balloonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 10,
  },
  balloon: {
    width: width * 0.2,
    height: width * 0.25,
    borderRadius: width * 0.15,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#911414b9",
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  balloonText: { fontSize: 32, fontWeight: "bold", color: "white" },
  // Correct feedback styles
  correctFeedback: {
    position: "absolute",
    top: "40%",
    backgroundColor: "rgba(76, 175, 80, 0.9)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 100,
  },
  correctText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  banner: {
    paddingVertical: 18,
    paddingHorizontal: 30,
    backgroundColor: "white",
    borderRadius: 16,
    elevation: 8,
    alignItems: "center",
  },
  bannerText: { fontSize: 26, fontWeight: "800", color: "#4682B4", marginBottom: 5 },
  scoreSummary: { fontSize: 18, color: "#666" },
});