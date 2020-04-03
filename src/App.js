import React from "react";

import "./App.css";
import TextToSpeech from "./TextToSpeech";
import SpeechToText from "./SpeechToText";
function App() {
  return (
    <div className="App">
      <TextToSpeech />
      <br/>
      <SpeechToText />
    </div>
  );
}

export default App;
