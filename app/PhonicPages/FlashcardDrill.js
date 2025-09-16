// app/phonics_page/FlashcardDrill.js
import { View, Text, StyleSheet, Pressable, Image, Alert } from "react-native";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

// All quiz data for each letter
const letterQuizData = {
  F: [
    {
      type: "sound",
      question: "Which sound is this?",
      answer: "F",
      options: ["F", "S", "T", "K"],
      sound: require("../../assets/sound/f.m4a"),
    },
    {
      type: "image",
      question: "Select the word with F sound",
      answer: "Fish",
      options: ["Fish", "Dog", "Laugh", "Sun"],
      sound: require("../../assets/sound/f.m4a"),
    },
    {
      type: "image",
      question: "Which word starts with F?",
      answer: "Fan",
      options: ["Fan", "Ball", "Tree", "Cup"],
      sound: require("../../assets/sound/f.m4a"),
    },
    {
      type: "image",
      question: "Tap the word that has F sound",
      answer: "Frog",
      options: ["Frog", "Apple", "Car", "Sun"],
      sound: require("../../assets/sound/f.m4a"),
    },
  ],
  G: [
    {
      type: "sound",
      question: "Which sound is this?",
      answer: "G",
      options: ["G", "C", "K", "D"],
      sound: require("../../assets/sound/g.m4a"),
    },
    {
      type: "image",
      question: "Select the word with G sound",
      answer: "Goat",
      options: ["Goat", "Sun", "Fish", "Ball"],
      sound: require("../../assets/sound/g.m4a"),
    },
    {
      type: "image",
      question: "Which word starts with G?",
      answer: "Grapes",
      options: ["Grapes", "Apple", "Jug", "Fan"],
      sound: require("../../assets/sound/g.m4a"),
    },
    {
      type: "image",
      question: "Tap the word that has G sound",
      answer: "Girl",
      options: ["Girl", "Dog", "Car", "Leaf"],
      sound: require("../../assets/sound/g.m4a"),
    },
  ],
  K: [
    {
      type: "sound",
      question: "Which sound is this?",
      answer: "K",
      options: ["K", "C", "T", "P"],
      sound: require("../../assets/sound/k.mp3"),
    },
    {
      type: "image",
      question: "Select the word with K sound",
      answer: "Kite",
      options: ["Kite", "Sun", "Dog", "Fan"],
      sound: require("../../assets/sound/k.mp3"),
    },
    {
      type: "image",
      question: "Which word starts with K?",
      answer: "King",
      options: ["King", "Apple", "Tree", "Cup"],
      sound: require("../../assets/sound/k.mp3"),
    },
    {
      type: "image",
      question: "Tap the word that has K sound",
      answer: "Key",
      options: ["Key", "Ball", "Fish", "Leaf"],
      sound: require("../../assets/sound/k.mp3"),
    },
  ],
  N: [
  {
    type: "sound",
    question: "Which sound is this?",
    answer: "N",
    options: ["N", "M", "T", "K"],
    sound: require("../../assets/sound/n.m4a"),
  },
  {
    type: "image",
    question: "Select the word with N sound",
    answer: "Nest",
    options: ["Nest", "Dog", "Fan", "Car"],
    sound: require("../../assets/sound/n.m4a"),
  },
  {
    type: "image",
    question: "Which word starts with N?",
    answer: "Nose",
    options: ["Nose", "Ball", "Tree", "Cup"],
    sound: require("../../assets/sound/n.m4a"),
  },
  {
    type: "image",
    question: "Tap the word that has N sound",
    answer: "Net",
    options: ["Net", "Apple", "Fish", "Sun"],
    sound: require("../../assets/sound/n.m4a"),
  },
],
  Q:[
  {
    type: "sound",
    question: "Which sound is this?",
    answer: "Q",
    options: ["Q", "R", "T", "P"],
    sound: require("../../assets/sound/qu.m4a"),
  },
  {
    type: "image",
    question: "Select the word with Q sound",
    answer: "Queen",
    options: ["Queen", "Dog", "Car", "Ball"],
    sound: require("../../assets/sound/qu.m4a"),
  },
  {
    type: "image",
    question: "Which word starts with Q?",
    answer: "Quilt",
    options: ["Quilt", "Apple", "Sun", "Fan"],
    sound: require("../../assets/sound/qu.m4a"),
  },
  {
    type: "image",
    question: "Tap the word that has Q sound",
    answer: "Quail",
    options: ["Quail", "Tree", "Fish", "Cup"],
    sound: require("../../assets/sound/qu.m4a"),
  },
],
  R:[
  {
    type: "sound",
    question: "Which sound is this?",
    answer: "R",
    options: ["R", "Q", "T", "M"],
    sound: require("../../assets/sound/r.m4a"),
  },
  {
    type: "image",
    question: "Select the word with R sound",
    answer: "Rabbit",
    options: ["Rabbit", "Dog", "Cat", "Ball"],
    sound: require("../../assets/sound/r.m4a"),
  },
  {
    type: "image",
    question: "Which word starts with R?",
    answer: "Rose",
    options: ["Rose", "Fan", "Tree", "Cup"],
    sound: require("../../assets/sound/r.m4a"),
  },
  {
    type: "image",
    question: "Tap the word that has R sound",
    answer: "Rat",
    options: ["Rat", "Fish", "Apple", "Sun"],
    sound: require("../../assets/sound/r.m4a"),
  },
],
  T:[
  {
    type: "sound",
    question: "Which sound is this?",
    answer: "T",
    options: ["T", "R", "N", "K"],
    sound: require("../../assets/sound/t.m4a"),
  },
  {
    type: "image",
    question: "Select the word with T sound",
    answer: "Tiger",
    options: ["Tiger", "Cat", "Dog", "Ball"],
    sound: require("../../assets/sound/t.m4a"),
  },
  {
    type: "image",
    question: "Which word starts with T?",
    answer: "Table",
    options: ["Table", "Sun", "Fan", "Cup"],
    sound: require("../../assets/sound/t.m4a"),
  },
  {
    type: "image",
    question: "Tap the word that has T sound",
    answer: "Tree",
    options: ["Tree", "Fish", "Apple", "Net"],
    sound: require("../../assets/sound/t.m4a"),
  },
],
  V:[
  {
    type: "sound",
    question: "Which sound is this?",
    answer: "V",
    options: ["V", "Y", "W", "B"],
    sound: require("../../assets/sound/v.m4a"),
  },
  {
    type: "image",
    question: "Select the word with V sound",
    answer: "Van",
    options: ["Van", "Dog", "Fan", "Car"],
    sound: require("../../assets/sound/v.m4a"),
  },
  {
    type: "image",
    question: "Which word starts with V?",
    answer: "Violin",
    options: ["Violin", "Ball", "Sun", "Cup"],
    sound: require("../../assets/sound/v.m4a"),
  },
  {
    type: "image",
    question: "Tap the word that has V sound",
    answer: "Vase",
    options: ["Vase", "Tree", "Fish", "Net"],
    sound: require("../../assets/sound/v.m4a"),
  },
],
  Y:[
  {
    type: "sound",
    question: "Which sound is this?",
    answer: "Y",
    options: ["Y", "V", "W", "Z"],
    sound: require("../../assets/sound/y.m4a"),
  },
  {
    type: "image",
    question: "Select the word with Y sound",
    answer: "Yak",
    options: ["Yak", "Dog", "Fan", "Car"],
    sound: require("../../assets/sound/y.m4a"),
  },
  {
    type: "image",
    question: "Which word starts with Y?",
    answer: "Yellow",
    options: ["Yellow", "Ball", "Tree", "Cup"],
    sound: require("../../assets/sound/y.m4a"),
  },
  {
    type: "image",
    question: "Tap the word that has Y sound",
    answer: "Yogurt",
    options: ["Yogurt", "Fish", "Apple", "Sun"],
    sound: require("../../assets/sound/y.m4a"),
  },
],
};

const shuffleArray = (array) => {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function FlashcardDrill({ route, onComplete, onBack }) {
  const { targetLetter } = route.params || { targetLetter: "F" };
  const [sound, setSound] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tries, setTries] = useState(2);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const quizData = letterQuizData[targetLetter] || letterQuizData["F"];
  const currentQuestion = quizData[currentIndex];

  useEffect(() => {
    if (currentQuestion?.sound) {
      playSound(currentQuestion.sound);
    }
    setTries(2);
    setSelectedOption(null);
    setShuffledOptions(shuffleArray(currentQuestion.options));
  }, [currentIndex, targetLetter]);

  const playSound = async (soundFile) => {
    if (sound) {
      await sound.unloadAsync();
    }
    const { sound: newSound } = await Audio.Sound.createAsync(soundFile);
    setSound(newSound);
    await newSound.playAsync();
  };

  const speakFeedback = (type) => {
    if (type === "correct") {
      Speech.speak("Correct!", { language: "en" });
    } else {
      Speech.speak("Wrong!", { language: "en" });
    }
  };

  const speakOption = (word) => {
    Speech.speak(word, { language: "en" });
  };

  const checkAnswer = (selected) => {
    setSelectedOption(selected);

    if (selected === currentQuestion.answer) {
      speakFeedback("correct");
      setTimeout(() => goNext(), 1000);
    } else {
      speakFeedback("wrong");
      if (tries > 1) {
        setTries(tries - 1);
      } else {
        setTimeout(() => goNext(), 1000);
      }
    }
  };

  const goNext = () => {
    if (currentIndex < quizData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
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
      {/* Back Arrow with onBack */}
      <Pressable onPress={onBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={28} color="black" />
      </Pressable>

      <Text style={styles.question}>{currentQuestion.question}</Text>

      {currentQuestion.type === "sound" && (
        <Pressable onPress={() => playSound(currentQuestion.sound)}>
          <Image
            source={require("../../assets/images/myimages/speaker.jpg")}
            style={{ width: 80, height: 80, alignSelf: "center", margin: 20 }}
          />
        </Pressable>
      )}

      <View style={styles.options}>
        {shuffledOptions.map((opt, idx) => {
          const label = typeof opt === "string" ? opt : opt.label;

          let bgColor = "#87CEEB";
          if (selectedOption) {
            if (label === currentQuestion.answer && selectedOption === label) {
              bgColor = "#98FB98"; // correct
            } else if (
              label === selectedOption &&
              selectedOption !== currentQuestion.answer
            ) {
              bgColor = "#F28A8A"; // wrong
            }
          }

          return (
            <Pressable
              key={idx}
              style={[styles.option, { backgroundColor: bgColor }]}
              onPress={() => checkAnswer(label)}
            >
              <Text style={styles.optionText}>{label}</Text>

              {currentQuestion.type === "image" && (
                <Pressable
                  onPress={() => speakOption(label)}
                  style={styles.speakerButton}
                >
                  <Image
                    source={require("../../assets/images/myimages/speaker.jpg")}
                    style={{ width: 25, height: 25 }}
                  />
                </Pressable>
              )}
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.score}>🔄 Tries Left: {tries}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  question: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 60,
    marginBottom: 15,
    fontWeight: "bold",
  },
  options: { marginTop: 20 },
  option: {
    padding: 15,
    borderRadius: 12,
    marginVertical: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  optionText: { fontSize: 20, fontWeight: "600" },
  speakerButton: {
    marginLeft: 10,
    padding: 5,
  },
  score: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    fontWeight: "600",
  },
  heading: {
    fontSize: 22,
    textAlign: "center",
    marginTop: 50,
  },
});