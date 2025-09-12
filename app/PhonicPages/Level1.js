// Level1.js (app/PhonicPages/Level1.js)
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
  { letter: "S", sound: require("../../assets/sound/s.m4a") },
  { letter: "A", sound: require("../../assets/sound/a.m4a") },
  { letter: "T", sound: require("../../assets/sound/t.m4a") },
  { letter: "P", sound: require("../../assets/sound/p.m4a") },
  { letter: "I", sound: require("../../assets/sound/i.m4a") },
  { letter: "N", sound: require("../../assets/sound/n.m4a") },
  { letter: "M", sound: require("../../assets/sound/m.m4a") },
  { letter: "D", sound: require("../../assets/sound/d.m4a") },
];

export default function Level1({ navigation }) {
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
    // Navigate to Letter1 screen with the selected letter as parameter
    navigation.navigate("Letter1Screen", { letter });
  };

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
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
              handleLetterPress(item.letter); // Navigate to Letter1 screen
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