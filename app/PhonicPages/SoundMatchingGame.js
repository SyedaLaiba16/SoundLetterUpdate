// app/phonics_page/SoundMatchingGame.js
import { View, Text, StyleSheet, Pressable, Image, Vibration } from "react-native";
import { Audio } from "expo-av";
import React, { useState, useEffect } from "react";
import * as Speech from "expo-speech";
import { Ionicons } from "@expo/vector-icons";

// All questions for each letter 
const letterQuestions = { B: [ { letter: "B", sound: require("../../assets/sound/b.m4a"), correctAnswers: [{ label: "Ball", image: require("../../assets/images/myimages/ball.jpg") }], options: [ { label: "Ball", image: require("../../assets/images/myimages/ball.jpg") }, { label: "Fish", image: require("../../assets/images/myimages/fish.jpg") }, { label: "Tree", image: require("../../assets/images/myimages/tree.png") }, ], }, { letter: "B", sound: require("../../assets/sound/b.m4a"), correctAnswers: [{ label: "Bat", image: require("../../assets/images/myimages/bat.png") }], options: [ { label: "Bat", image: require("../../assets/images/myimages/bat.png") }, { label: "Dog", image: require("../../assets/images/myimages/dog.png") }, { label: "Cup", image: require("../../assets/images/myimages/cup.jpg") }, ], }, { letter: "B", sound: require("../../assets/sound/b.m4a"), correctAnswers: [{ label: "Bag", image: require("../../assets/images/myimages/bag.jpg") }], options: [ { label: "Bag", image: require("../../assets/images/myimages/bag.jpg") }, { label: "Car", image: require("../../assets/images/myimages/car.png") }, { label: "Pen", image: require("../../assets/images/myimages/pen.png") }, ], }, ], C: [ { letter: "C", sound: require("../../assets/sound/c.m4a"), correctAnswers: [{ label: "Cat", image: require("../../assets/images/myimages/cat.png") }], options: [ { label: "Cat", image: require("../../assets/images/myimages/cat.png") }, { label: "Ball", image: require("../../assets/images/myimages/ball.jpg") }, { label: "Fish", image: require("../../assets/images/myimages/fish.jpg") }, ], }, { letter: "C", sound: require("../../assets/sound/c.m4a"), correctAnswers: [{ label: "Car", image: require("../../assets/images/myimages/car.png") }], options: [ { label: "Car", image: require("../../assets/images/myimages/car.png") }, { label: "Pen", image: require("../../assets/images/myimages/pen.png") }, { label: "Tree", image: require("../../assets/images/myimages/tree.png") }, ], }, { letter: "C", sound: require("../../assets/sound/c.m4a"), correctAnswers: [{ label: "Cup", image: require("../../assets/images/myimages/cup.jpg") }], options: [ { label: "Cup", image: require("../../assets/images/myimages/cup.jpg") }, { label: "Nose", image: require("../../assets/images/myimages/nose.jpg") }, { label: "Dog", image: require("../../assets/images/myimages/dog.png") }, ], }, ], M: [ { letter: "M", sound: require("../../assets/sound/m.m4a"), correctAnswers: [{ label: "Mango", image: require("../../assets/images/myimages/mango.jpg") }], options: [ { label: "Mango", image: require("../../assets/images/myimages/mango.jpg") }, { label: "Nose", image: require("../../assets/images/myimages/nose.jpg") }, { label: "Dog", image: require("../../assets/images/myimages/dog.png") }, ], }, { letter: "M", sound: require("../../assets/sound/m.m4a"), correctAnswers: [{ label: "Monkey", image: require("../../assets/images/myimages/monkey.jpg") }], options: [ { label: "Monkey", image: require("../../assets/images/myimages/monkey.jpg") }, { label: "Pen", image: require("../../assets/images/myimages/pen.png") }, { label: "Car", image: require("../../assets/images/myimages/car.png") }, ], }, { letter: "M", sound: require("../../assets/sound/m.m4a"), correctAnswers: [{ label: "Moon", image: require("../../assets/images/myimages/moon.jpg") }], options: [ { label: "Moon", image: require("../../assets/images/myimages/moon.jpg") }, { label: "Tree", image: require("../../assets/images/myimages/tree.png") }, { label: "Fish", image: require("../../assets/images/myimages/fish.jpg") }, ], }, ], W: [ { letter: "W", sound: require("../../assets/sound/w.m4a"), correctAnswers: [{ label: "Watch", image: require("../../assets/images/myimages/watch.png") }], options: [ { label: "Watch", image: require("../../assets/images/myimages/watch.png") }, { label: "Ball", image: require("../../assets/images/myimages/ball.jpg") }, { label: "Cat", image: require("../../assets/images/myimages/cat.png") }, ], }, { letter: "W", sound: require("../../assets/sound/w.m4a"), correctAnswers: [{ label: "Window", image: require("../../assets/images/myimages/window.jpg") }], options: [ { label: "Window", image: require("../../assets/images/myimages/window.jpg") }, { label: "Dog", image: require("../../assets/images/myimages/dog.png") }, { label: "Kite", image: require("../../assets/images/myimages/kite.jpg") }, ], }, { letter: "W", sound: require("../../assets/sound/w.m4a"), correctAnswers: [{ label: "Water", image: require("../../assets/images/myimages/water.jpg") }], options: [ { label: "Water", image: require("../../assets/images/myimages/water.jpg") }, { label: "Tree", image: require("../../assets/images/myimages/tree.png") }, { label: "Car", image: require("../../assets/images/myimages/car.png") }, ], }, ], P:[ { letter: "P", sound: require("../../assets/sound/p.m4a"), correctAnswers: [{ label: "Pen", image: require("../../assets/images/myimages/pen.png") }], options: [ { label: "Pen", image: require("../../assets/images/myimages/pen.png") }, { label: "Car", image: require("../../assets/images/myimages/car.png") }, { label: "Dog", image: require("../../assets/images/myimages/dog.png") }, ], }, { letter: "P", sound: require("../../assets/sound/p.m4a"), correctAnswers: [{ label: "Pin", image: require("../../assets/images/myimages/pin.png") }], options: [ { label: "Pin", image: require("../../assets/images/myimages/pin.png") }, { label: "Fan", image: require("../../assets/images/myimages/fan.png") }, { label: "Cat", image: require("../../assets/images/myimages/cat.png") }, ], }, { letter: "P", sound: require("../../assets/sound/p.m4a"), correctAnswers: [{ label: "Parrot", image: require("../../assets/images/myimages/parrot.jpg") }], options: [ { label: "Parrot", image: require("../../assets/images/myimages/parrot.jpg") }, { label: "Ball", image: require("../../assets/images/myimages/ball.jpg") }, { label: "Tree", image: require("../../assets/images/myimages/tree.png") }, ], }, ], S:[ { letter: "S", sound: require("../../assets/sound/s.m4a"), correctAnswers: [{ label: "Sun", image: require("../../assets/images/myimages/sun.png") }], options: [ { label: "Sun", image: require("../../assets/images/myimages/sun.png") }, { label: "Ball", image: require("../../assets/images/myimages/ball.jpg") }, { label: "Cat", image: require("../../assets/images/myimages/cat.png") }, ], }, { letter: "S", sound: require("../../assets/sound/s.m4a"), correctAnswers: [{ label: "Snake", image: require("../../assets/images/myimages/snake.png") }], options: [ { label: "Snake", image: require("../../assets/images/myimages/snake.png") }, { label: "Dog", image: require("../../assets/images/myimages/dog.png") }, { label: "Kite", image: require("../../assets/images/myimages/kite.jpg") }, ], }, { letter: "S", sound: require("../../assets/sound/s.m4a"), correctAnswers: [{ label: "Star", image: require("../../assets/images/myimages/star.png") }], options: [ { label: "Star", image: require("../../assets/images/myimages/star.png") }, { label: "Tree", image: require("../../assets/images/myimages/tree.png") }, { label: "Car", image: require("../../assets/images/myimages/car.png") }, ], }, ], U: [ { letter: "U", sound: require("../../assets/sound/u.m4a"), correctAnswers: [{ label: "Umbrella", image: require("../../assets/images/myimages/umbrella.jpg") }], options: [ { label: "Umbrella", image: require("../../assets/images/myimages/umbrella.jpg") }, { label: "Dog", image: require("../../assets/images/myimages/dog.png") }, { label: "Tree", image: require("../../assets/images/myimages/tree.png") }, ], }, { letter: "U", sound: require("../../assets/sound/u.m4a"), correctAnswers: [{ label: "Up", image: require("../../assets/images/myimages/up.jpg") }], options: [ { label: "Up", image: require("../../assets/images/myimages/up.jpg") }, { label: "Ball", image: require("../../assets/images/myimages/ball.jpg") }, { label: "Fish", image: require("../../assets/images/myimages/fish.jpg") }, ], }, { letter: "U", sound: require("../../assets/sound/u.m4a"), correctAnswers: [{ label: "Uncle", image: require("../../assets/images/myimages/uncle.jpg") }], options: [ { label: "Uncle", image: require("../../assets/images/myimages/uncle.jpg") }, { label: "Cat", image: require("../../assets/images/myimages/cat.png") }, { label: "Car", image: require("../../assets/images/myimages/car.png") }, ], }, ], Z:[ { letter: "Z", sound: require("../../assets/sound/z.m4a"), correctAnswers: [{ label: "Zebra", image: require("../../assets/images/myimages/zebra.jpg") }], options: [ { label: "Zebra", image: require("../../assets/images/myimages/zebra.jpg") }, { label: "Ball", image: require("../../assets/images/myimages/ball.jpg") }, { label: "Cat", image: require("../../assets/images/myimages/cat.png") }, ], }, { letter: "Z", sound: require("../../assets/sound/z.m4a"), correctAnswers: [{ label: "Zip", image: require("../../assets/images/myimages/zip.jpg") }], options: [ { label: "Zip", image: require("../../assets/images/myimages/zip.jpg") }, { label: "Dog", image: require("../../assets/images/myimages/dog.png") }, { label: "Kite", image: require("../../assets/images/myimages/kite.jpg") }, ], }, { letter: "Z", sound: require("../../assets/sound/z.m4a"), correctAnswers: [{ label: "Zoo", image: require("../../assets/images/myimages/zoo.jpg") }], options: [ { label: "Zoo", image: require("../../assets/images/myimages/zoo.jpg") }, { label: "Tree", image: require("../../assets/images/myimages/tree.png") }, { label: "Car", image: require("../../assets/images/myimages/car.png") }, ], }, ], };
const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

export default function SoundMatchingGame({ route, onBack, onComplete }) {
  const { targetLetter } = route.params || { targetLetter: "B" };
  const [sound, setSound] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [triesLeft, setTriesLeft] = useState(2);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const [score, setScore] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const currentQuestion = questions[questionIndex];

  useEffect(() => {
    const letterQ = letterQuestions[targetLetter] || letterQuestions["B"];
    const randomized = shuffleArray(letterQ).map((q) => ({
      ...q,
      options: shuffleArray(q.options),
    }));
    setQuestions(randomized);
  }, [targetLetter]);

  useEffect(() => {
    if (currentQuestion) {
      playLetterSound();
      setTriesLeft(2);
      setSelectedOption(null);
      setIsCorrect(null);
      setFeedbackMessage(null);
    }
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, [questionIndex, currentQuestion]);

  const playLetterSound = async () => {
    if (!currentQuestion) return;
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: soundObj } = await Audio.Sound.createAsync(currentQuestion.sound);
      setSound(soundObj);
      await soundObj.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const speakWord = (word) => {
    Speech.speak(word, { language: "en-US", pitch: 1.0, rate: 0.9 });
  };

  const handleOptionPress = (selectedLabel) => {
    const correct = currentQuestion.correctAnswers.some((ans) => ans.label === selectedLabel);

    setSelectedOption(selectedLabel);
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 1);
      Speech.speak("Correct!", { language: "en-US" });
      setFeedbackMessage("✅ Correct!");

      setTimeout(() => {
        setFeedbackMessage(null);
        if (questionIndex + 1 < questions.length) {
          setQuestionIndex(questionIndex + 1);
        } else {
          Speech.speak("Great job! You finished.", { language: "en-US" });
          setFeedbackMessage(`🎉 Final Score: ${score + 1}`);
          setTimeout(() => {
            setFeedbackMessage(null);
            onComplete && onComplete();
          }, 2000);
        }
      }, 1200);
    } else {
  Vibration.vibrate(400);
  setFeedbackMessage(`❌ Wrong! This is ${selectedLabel}`);

  // ✅ Ek hi flow: Wrong! + sentence + letter sound file
  Speech.speak(`Wrong! This is ${selectedLabel}, not a word starting with`, {
    language: "en-US",
    pitch: 1.0,
    rate: 0.9,
    onDone: async () => {
      try {
        const { sound: letterSound } = await Audio.Sound.createAsync(currentQuestion.sound);
        await letterSound.playAsync();
        setTimeout(() => letterSound.unloadAsync(), 1200);
      } catch (e) {
        console.log("❌ Error playing letter sound:", e);
      }
    },
  });

  setTimeout(() => {
    setFeedbackMessage(null);
    if (triesLeft > 1) {
      setTriesLeft(triesLeft - 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      if (questionIndex + 1 < questions.length) {
        setQuestionIndex(questionIndex + 1);
      } else {
        setFeedbackMessage(`❌ Final Score: ${score}`);
        setTimeout(() => {
          setFeedbackMessage(null);
          onComplete && onComplete();
        }, 2000);
      }
    }
  }, 1500);
}

  };

  if (!currentQuestion) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Loading questions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#333333" />
        </Pressable>
        <Text style={styles.heading}>Sound Matching - Letter {targetLetter}</Text>
      </View>

      <Text style={styles.tries}>Tries left: {triesLeft}</Text>
      <Text style={styles.tries}>Score: {score}</Text>

      <Pressable style={styles.soundButton} onPress={playLetterSound}>
        <Text style={styles.soundButtonText}>🔊 Play Letter Sound</Text>
      </Pressable>

      <View style={styles.optionsRow}>
        {currentQuestion.options.map((item, idx) => {
          const isSelected = selectedOption === item.label;
          let buttonStyle = styles.selectButton;
          let textStyle = styles.selectText;

          if (isSelected) {
            buttonStyle = isCorrect ? styles.correctButton : styles.wrongButton;
            textStyle = isCorrect ? styles.correctText : styles.wrongText;
          }

          return (
            <View key={idx} style={styles.option}>
              <Image source={item.image} style={styles.image} />
              <Pressable style={styles.micButton} onPress={() => speakWord(item.label)}>
                <Text style={styles.micText}>🎤 Hear Word</Text>
              </Pressable>
              <Pressable
                style={buttonStyle}
                onPress={() => handleOptionPress(item.label)}
                disabled={selectedOption !== null}
              >
                <Text style={textStyle}>Select</Text>
              </Pressable>
            </View>
          );
        })}
      </View>

      {/* ✅ Custom Feedback Box */}
      {feedbackMessage && (
        <View
          style={[
            styles.feedbackBox,
            isCorrect ? styles.correctFeedback : styles.wrongFeedback,
          ]}
        >
          <Text style={styles.feedbackText}>{feedbackMessage}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  backButton: { marginRight: 10 },
  heading: { fontSize: 22, fontWeight: "bold", color: "#333333" },
  tries: { fontSize: 18, textAlign: "center", marginBottom: 15, color: "#F28A8A" },
  soundButton: {
    backgroundColor: "#87CEEB",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  soundButtonText: { fontSize: 18, fontWeight: "bold", color: "#333333" },
  optionsRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around", marginTop: 10 },
  option: { alignItems: "center", marginVertical: 10, width: 120 },
  image: { width: 90, height: 90, borderRadius: 10, marginBottom: 8 },
  micButton: {
    backgroundColor: "#87CEEB",
    padding: 6,
    borderRadius: 6,
    marginBottom: 6,
    width: "100%",
    alignItems: "center",
  },
  micText: { color: "#333333", fontWeight: "bold", fontSize: 14 },
  selectButton: {
    backgroundColor: "#87CEEB",
    padding: 6,
    borderRadius: 6,
    width: "100%",
    alignItems: "center",
  },
  selectText: { color: "#333333", fontSize: 14, fontWeight: "bold" },
  correctButton: { backgroundColor: "#98FB98", padding: 6, borderRadius: 6, width: "100%", alignItems: "center" },
  correctText: { color: "#333333", fontSize: 14, fontWeight: "bold" },
  wrongButton: { backgroundColor: "#F28A8A", padding: 6, borderRadius: 6, width: "100%", alignItems: "center" },
  wrongText: { color: "#fff", fontSize: 14, fontWeight: "bold" },

  // ✅ Feedback styling
  feedbackBox: {
    position: "absolute",
    top: "40%",
    alignSelf: "center",
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 20,
    zIndex: 100,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  feedbackText: { fontSize: 20, fontWeight: "bold", color: "#fff", textAlign: "center" },
  correctFeedback: { backgroundColor: "rgba(76, 175, 80, 0.9)" }, // Green
  wrongFeedback: { backgroundColor: "rgba(244, 67, 54, 0.9)" },   // Red
});
