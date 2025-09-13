// app/PhonicPages/Level2.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";

const data = [
  { letter: "G", sound: require("../../assets/sound/g.m4a") },
  { letter: "O", sound: require("../../assets/sound/o.m4a") },
  { letter: "C", sound: require("../../assets/sound/c.m4a") },
  { letter: "K", sound: require("../../assets/sound/k.mp3") },
  { letter: "E", sound: require("../../assets/sound/e.m4a") },
  { letter: "U", sound: require("../../assets/sound/u.m4a") },
  { letter: "R", sound: require("../../assets/sound/r.m4a") },
  { letter: "H", sound: require("../../assets/sound/h.m4a") },
  { letter: "B", sound: require("../../assets/sound/b.m4a") },
  { letter: "F", sound: require("../../assets/sound/f.m4a") },
  { letter: "L", sound: require("../../assets/sound/l.m4a") },
];

export default function Level1({ onNext, onBack }) {
  const [sound, setSound] = useState(null);

  // Clean up sound when component unmounts
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const playSound = async (soundFile) => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync(soundFile);
      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      Alert.alert("Error", "Unable to play sound.");
      console.error(error);
    }
  };

  const handleLetterPress = (letter) => {
    // Instead of navigation.navigate → use onNext prop
    onNext({ letter });
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
        <Text style={styles.heading}>Tap a Letter</Text>
      </View>

      {/* Letter List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.letter}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.letterBox,
              pressed && { backgroundColor: "#3385ff" },
            ]}
            onPress={() => {
              playSound(item.sound);
              handleLetterPress(item.letter); // Navigate via onNext
            }}
          >
            <View style={styles.letterRow}>
              <Text style={styles.letter}>{item.letter}</Text>
              <Ionicons name="volume-high" size={28} color="#fff" />
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 55,
    color: "#000",
  },
  list: {
    justifyContent: "center",
  },
  letterBox: {
    backgroundColor: "#0066cc",
    padding: 20,
    marginVertical: 8,
    borderRadius: 12,
  },
  letterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  letter: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    marginRight: 10,
  },
  backButton: {
    padding: 6,
  },
});
