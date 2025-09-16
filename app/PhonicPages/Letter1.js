// app/PhonicPages/Letter1.js
import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import { Ionicons } from "@expo/vector-icons";

const letterData = {
  S: {
    sound: require("../../assets/sound/s.m4a"), 
    words: [
      { label: "Sun", image: require("../../assets/images/myimages/sun.png") },
      { label: "Snake", image: require("../../assets/images/myimages/snake.png") }
    ]
  },
  A: { 
    sound: require("../../assets/sound/a.m4a"), 
    words: [
      { label: "Ant", image: require("../../assets/images/myimages/ant.png") },
      { label: "Apple", image: require("../../assets/images/myimages/apple.jpg") }
    ]
  }, 
  T: { 
    sound: require("../../assets/sound/t.m4a"), 
    words: [
      { label: "Tree", image: require("../../assets/images/myimages/tree.png") },
      { label: "Train", image: require("../../assets/images/myimages/train.png") }
    ]
  }, 
  P: { 
    sound: require("../../assets/sound/p.m4a"), 
    words: [
      { label: "Pen", image: require("../../assets/images/myimages/pen.png") },
      { label: "Pin", image: require("../../assets/images/myimages/pin.png") }
    ]
  }, 
  I: { 
    sound: require("../../assets/sound/i.m4a"),
    words: [
      { label: "Igloo", image: require("../../assets/images/myimages/igloo.jpg") },
      { label: "Insect", image: require("../../assets/images/myimages/insect.jpg") }
    ]
  }, 
  N: { 
    sound: require("../../assets/sound/n.m4a"), 
    words: [
      { label: "Nest", image: require("../../assets/images/myimages/nest.jpg") },
      { label: "Nose", image: require("../../assets/images/myimages/nose.jpg") }
    ]
  }, 
  M: { 
    sound: require("../../assets/sound/m.m4a"), 
    words: [
      { label: "Moon", image: require("../../assets/images/myimages/moon.jpg") },
      { label: "Mango", image: require("../../assets/images/myimages/mango.jpg") }
    ]
  }, 
  D: { 
    sound: require("../../assets/sound/d.m4a"), 
    words: [
      { label: "Dog", image: require("../../assets/images/myimages/dog.png") },
      { label: "Duck", image: require("../../assets/images/myimages/duck.jpg") }
    ]
  }, 
  G: { 
    sound: require("../../assets/sound/g.m4a"), 
    words: [
      { label: "Goat", image: require("../../assets/images/myimages/goat.jpg") },
      { label: "Grapes", image: require("../../assets/images/myimages/grapes.jpg") }
    ]
  },
  O: { 
    sound: require("../../assets/sound/o.m4a"), 
    words: [
      { label: "Orange", image: require("../../assets/images/myimages/orange.jpg") },
      { label: "Owl", image: require("../../assets/images/myimages/owl1.jpg") }
    ]
  }, 
  C: { 
    sound: require("../../assets/sound/c.m4a"), 
    words: [
      { label: "Cat", image: require("../../assets/images/myimages/cat.png") },
      { label: "Car", image: require("../../assets/images/myimages/car.png") }
    ]
  }, 
  K: { 
    sound: require("../../assets/sound/k.mp3"), 
    words: [
      { label: "Kite", image: require("../../assets/images/myimages/kite.jpg") },
      { label: "Key", image: require("../../assets/images/myimages/key.jpg") }
    ]
  }, 
  E: { 
    sound: require("../../assets/sound/e.m4a"), 
    words: [
      { label: "Egg", image: require("../../assets/images/myimages/egg.jpg") },
      { label: "Elephant", image: require("../../assets/images/myimages/elephant.jpg") }
    ]
  }, 
  U: { 
    sound: require("../../assets/sound/u.m4a"), 
    words: [
      { label: "Umbrella", image: require("../../assets/images/myimages/umbrella.jpg") },
      { label: "Up", image: require("../../assets/images/myimages/up.jpg") }
    ]
  }, 
  R: { 
    sound: require("../../assets/sound/r.m4a"), 
    words: [
      { label: "Rabbit", image: require("../../assets/images/myimages/rabbit.jpg") },
      { label: "Ring", image: require("../../assets/images/myimages/ring.jpg") }
    ]
  }, 
  H: { 
    sound: require("../../assets/sound/h.m4a"), 
    words: [
      { label: "Hat", image: require("../../assets/images/myimages/hat.jpg") },
      { label: "Hen", image: require("../../assets/images/myimages/hen.jpg") }
    ]
  }, 
  B: { 
    sound: require("../../assets/sound/b.m4a"), 
    words: [
      { label: "Ball", image: require("../../assets/images/myimages/ball.jpg") },
      { label: "Bat", image: require("../../assets/images/myimages/bat.png") }
    ]
  }, 
  F: { 
    sound: require("../../assets/sound/f.m4a"), 
    words: [
      { label: "Fish", image: require("../../assets/images/myimages/fish.jpg") },
      { label: "Fan", image: require("../../assets/images/myimages/fan.png") }
    ]
  }, 
  L: { 
    sound: require("../../assets/sound/l.m4a"), 
    words: [
      { label: "Lion", image: require("../../assets/images/myimages/lion.jpg") },
      { label: "Leaf", image: require("../../assets/images/myimages/leaf.jpg") }
    ]
  }, 
  J: { 
    sound: require("../../assets/sound/j.m4a"), 
    words: [
      { label: "Jeep", image: require("../../assets/images/myimages/jeep.png") },
      { label: "Jug", image: require("../../assets/images/myimages/jug.jpg") }
    ]
  }, 
  V: { 
    sound: require("../../assets/sound/v.m4a"), 
    words: [
      { label: "Vegetables", image: require("../../assets/images/myimages/vegetables.jpg") },
      { label: "Vase", image: require("../../assets/images/myimages/vase.png") }
    ]
  }, 
  W: { 
    sound: require("../../assets/sound/w.m4a"), 
    words: [
      { label: "Watch", image: require("../../assets/images/myimages/watch.png") },
      { label: "Window", image: require("../../assets/images/myimages/window.jpg") }
    ]
  }, 
  X: { 
    sound: require("../../assets/sound/x.m4a"), 
    words: [
      { label: "Xylophone", image: require("../../assets/images/myimages/xylophone.jpg") },
      { label: "X-ray", image: require("../../assets/images/myimages/x-ray.jpg") }
    ]
  }, 
  Y: { 
    sound: require("../../assets/sound/y.m4a"), 
    words: [
      { label: "Yak", image: require("../../assets/images/myimages/yak.jpg") },
      { label: "Yoyo", image: require("../../assets/images/myimages/yoyo.jpg") }
    ]
  }, 
  Z: { 
    sound: require("../../assets/sound/z.m4a"), 
    words: [
      { label: "Zebra", image: require("../../assets/images/myimages/zebra.jpg") },
      { label: "Zip", image: require("../../assets/images/myimages/zip.jpg") }
    ]
  }, 
  Q: { 
    sound: require("../../assets/sound/qu.m4a"), 
    words: [
      { label: "Queen", image: require("../../assets/images/myimages/queen.png") },
      { label: "Queue", image: require("../../assets/images/myimages/queue.png") }
    ]
  }
};


export default function Letter1({ letter, onBack, onNext }) {
  const [sound, setSound] = useState(null);

  const playLetterSound = async () => {
    if (!letter || !letterData[letter]) return;

    const { sound: soundFile } = letterData[letter];
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }
      
      const { sound: newSound } = await Audio.Sound.createAsync(soundFile);
      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.error("Error playing letter sound:", error);
    }
  };

  const speakWord = (word) => {
    Speech.speak(word, { language: "en-US", pitch: 1.0, rate: 0.9 });
  };

  const words = letterData[letter]?.words || [];

  /// In Letter1.js navigateToGame function
const navigateToGame = () => {
  // BalloonGame ke liye letters
  const balloonGameLetters = ["A", "D", "E", "H", "I", "J", "L", "O", "X"];
  
  // SoundMatchingGame ke liye letters
  const soundMatchingLetters = ["B", "C", "W", "S", "M", "P", "U", "Z"];
  
  // FlashcardDrill ke liye letters
  const flashcardDrillLetters = ["F", "G", "K","N","Q","R","T","V","Y"];
  
  if (balloonGameLetters.includes(letter)) {
    onNext("BalloonGame", { targetLetter: letter });
  } else if (soundMatchingLetters.includes(letter)) {
    onNext("SoundMatchingGame", { targetLetter: letter });
  } else if (flashcardDrillLetters.includes(letter)) {
    onNext("FlashcardDrill", { targetLetter: letter });
  } else {
    Alert.alert("Info", `No game defined for letter ${letter}`);
  }
};

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.header}>
        <Pressable
          onPress={onBack}
          style={({ pressed }) => [
            styles.backButton,
            pressed && { backgroundColor: "#e0e0e0", borderRadius: 8 },
          ]}
        >
          <Ionicons name="arrow-back" size={26} color="#000" />
        </Pressable>
        <Text style={styles.heading}>Letter: {letter}</Text>
      </View>

      {/* Activity 1: Hear Letter Sound */}
      <Text style={styles.activityTitle}>🔊 Hear the Sound</Text>
      <Pressable style={styles.soundButton} onPress={playLetterSound}>
        <Text style={styles.soundButtonText}>▶️ Say "{letter}"</Text>
      </Pressable>

      {/* Activity 2: Tap Object to Hear Word */}
      <Text style={styles.activityTitle}>🧠 Tap Object to Hear Word</Text>
      <View style={styles.optionsRow}>
        {words.map((item, index) => (
          <Pressable
            key={index}
            style={styles.option}
            onPress={() => speakWord(item.label)}
          >
            <Image source={item.image} style={styles.image} />
            <Text style={styles.wordLabel}>{item.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* Next Button - Automatically decides which game to navigate to */}
      <Pressable
        style={styles.nextButton}
        onPress={navigateToGame}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f5f5f5", // Changed to light gray
    padding: 20 
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 55,
    color: "#333333", // Changed to dark gray
  },
  activityTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#333333", // Added dark gray color
  },
  soundButton: {
    backgroundColor: "#87CEEB", // Changed to sky blue
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  soundButtonText: { 
    fontSize: 18,
    color: "#333333", // Added dark gray color
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  option: {
    alignItems: "center",
    marginVertical: 12,
    width: "45%",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 8,
  },
  wordLabel: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    color: "#333333", // Added dark gray color
  },
  nextButton: {
    backgroundColor: "#98FB98", // Changed to mint green
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },
  nextButtonText: {
    color: "#333333", // Changed to dark gray
    fontSize: 18,
    fontWeight: "600",
  },
  backButton: {
    padding: 6,
  },
});