// PhonicLevels.js (app/PhonicPages/PhonicLevels.js)
import React from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";

const levels = [
  { id: "1", name: "Level 1", screenName: "Level1Screen" },
  /* 
  { id: "2", name: "Level 2", screenName: "Level2Screen" },
  { id: "3", name: "Level 3", screenName: "Level3Screen" },
  { id: "4", name: "Letter Builder", screenName: "LetterBuilderScreen" },
  { id: "5", name: "Quiz", screenName: "QuizScreen" },
  */
];

export default function PhonicLevels({ navigation }) {
  const handleSelectLevel = (screenName, name) => {
    console.log("Navigating to:", name);
    navigation.navigate(screenName);
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
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  levelButton: {
    padding: 16,
    marginVertical: 10,
    backgroundColor: "#0066cc",
    borderRadius: 12,
  },
  levelText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
});