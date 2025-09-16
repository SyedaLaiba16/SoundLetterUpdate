import React from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";

const levels = [
  { id: "1", name: "Level 1", screenName: "Level1Screen" },
  { id: "2", name: "Level 2", screenName: "Level2Screen" },
  { id: "3", name: "Level 3", screenName: "Level3Screen" },
  { id: "4", name: "LetterBuilder", screenName: "LetterBuilder" },
  { id: "5", name: "Quiz", screenName: "Quiz" },
  // Future levels can be added here
];

export default function PhonicLevels({ onNext }) {
  const handleSelectLevel = (screenName, name) => {
    console.log("Navigating to:", name);
    onNext({ screen: screenName });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Phonics Levels</Text>
      <FlatList
        data={levels}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleSelectLevel(item.screenName, item.name)}
            style={({ pressed }) => [
              styles.levelButton,
              pressed && { backgroundColor: "#3399ff" },
            ]}
          >
            <Text style={styles.levelText}>{item.name}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f5f5f5", // Light gray background
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#363737 ", // Sky Blue heading
  },
  levelButton: {
    padding: 16,
    marginVertical: 10,
    backgroundColor: "#4682B4", // Deep Blue buttons
    borderRadius: 12,
  },
  levelText: {
    color: "#363737 ",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
});