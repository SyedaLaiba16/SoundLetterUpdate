// app/PhonicPages/Level3.js
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
  { letter: "J", sound: require("../../assets/sound/j.m4a") },
  { letter: "V", sound: require("../../assets/sound/v.m4a") },
  { letter: "W", sound: require("../../assets/sound/w.m4a") },
  { letter: "X", sound: require("../../assets/sound/x.m4a") },
  { letter: "Y", sound: require("../../assets/sound/y.m4a") },
  { letter: "Z", sound: require("../../assets/sound/z.m4a") },
  { letter: "Q", sound: require("../../assets/sound/qu.m4a") },
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
              <Ionicons name="volume-high" size={28} color="#000" />
            </View>
          </Pressable>
        )}
      />
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
    color: "#000", // Changed to dark gray
  },
  list: {
    justifyContent: "center",
  },
  letterBox: {
    backgroundColor: "#4682B4", // Changed to deep blue
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
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  backButton: {
    padding: 6,
  },
});
