// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import PhonicLevels from "./app/PhonicPages/PhonicLevels";
import Level1 from "./app/PhonicPages/Level1";
import Letter1 from "./app/PhonicPages/Letter1";
// Import other screens when ready

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PhonicLevels">
        <Stack.Screen 
          name="PhonicLevels" 
          component={PhonicLevels}
          options={{ title: "Phonics Levels" }}
        />
        <Stack.Screen 
          name="Level1Screen" 
          component={Level1}
          options={{ title: "Level 1" }}
        />
        <Stack.Screen 
          name="Letter1Screen" 
          component={Letter1}
          options={({ route }) => ({ title: `Letter ${route.params?.letter || ''}` })}
        />
        {/* Add other screens when ready */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}