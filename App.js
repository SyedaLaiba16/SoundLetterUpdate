import React, { useState } from "react";

// Import your screens
import PhonicLevels from "./app/PhonicPages/PhonicLevels";
import Level1 from "./app/PhonicPages/Level1";
import Level2 from "./app/PhonicPages/Level2";
import Level3 from "./app/PhonicPages/Level3";
import Letter1 from "./app/PhonicPages/Letter1";
import BalloonGame from "./app/PhonicPages/BalloonGame"; // Import the unified BalloonGame component
import SoundMatchingGame from "./app/PhonicPages/SoundMatchingGame";
import FlashcardDrill from "./app/PhonicPages/FlashcardDrill";



export default function App() {
  const [screen, setScreen] = useState("PhonicLevels");
  const [params, setParams] = useState({});

  // Helper function to navigate
  const navigate = (nextScreen, nextParams = {}) => {
    setScreen(nextScreen);
    setParams(nextParams);
  };

  if (screen === "PhonicLevels") {
    return <PhonicLevels onNext={(p) => navigate(p.screen)} />;
  }

  if (screen === "Level1Screen") {
    return <Level1 onNext={(p) => navigate("Letter1Screen", p)} onBack={() => navigate("PhonicLevels")} />;
  }

  if (screen === "Level2Screen") {
    return <Level2 onNext={(p) => navigate("Letter1Screen", p)} onBack={() => navigate("PhonicLevels")} />;
  }

  if (screen === "Level3Screen") {
    return <Level3 onNext={(p) => navigate("Letter1Screen", p)} onBack={() => navigate("PhonicLevels")} />;
  }

  if (screen === "Letter1Screen") {
    return (
      <Letter1
        letter={params.letter}
        onBack={() => navigate("PhonicLevels")}
        onNext={(nextScreen, nextParams) => navigate(nextScreen, nextParams)}
      />
    );
  }

  // Add the BalloonGame screen navigation
  if (screen === "BalloonGame") {
    return (
      <BalloonGame
        route={{ params: { targetLetter: params.targetLetter } }}
        onBack={() => navigate("Letter1Screen", { letter: params.targetLetter })}
        onComplete={() => navigate("PhonicLevels", { letter: params.targetLetter })}
      />
    );
  }
// In your App.js navigation
if (screen === "SoundMatchingGame") {
  return (
    <SoundMatchingGame
      route={{ params: { targetLetter: params.targetLetter } }}
      onBack={() => navigate("Letter1Screen", { letter: params.targetLetter })}
      onComplete={() => navigate("PhonicLevels", { letter: params.targetLetter })}
    />
  );
}
if (screen === "FlashcardDrill") {
  return (
    <FlashcardDrill
      route={{ params: { targetLetter: params.targetLetter } }}
      onBack={() => navigate("Letter1Screen", { letter: params.targetLetter })}
      onComplete={() => navigate("PhonicLevels")}
    />
  );
}
  return null;
}