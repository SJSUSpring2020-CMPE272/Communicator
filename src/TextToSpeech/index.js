import React, { Component } from "react";
import {Node_API_URL} from '../Constants'
const voices = [
  {
    name: "en-US_MichaelV3Voice",
    language: "en-US",
    option: "American English (en-US): MichaelV3 (male, enhanced dnn)",
    customizable: true,
    gender: "male",
    url:
      "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/en-US_MichaelV3Voice",
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: true
    },
    description: "Michael: American English male voice. Dnn technology."
  },
  {
    name: "en-US_AllisonV3Voice",
    option: "American English (en-US): AllisonV3 (female, enhanced dnn)",
    language: "en-US",
    customizable: true,
    gender: "female",
    url:
      "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/en-US_AllisonV3Voice",
    supported_features: {
      voice_transformation: false,
      custom_pronunciation: true
    },
    description: "Allison: American English female voice. Dnn technology."
  }
];
export default class TextToSpeech extends Component {
  constructor(props) {
    super(props);
    this.state = {
      voice: voices[1], // Allison v3 is the first voice
      error: null, // the error from calling /classify
      text: "Mal" // default text
    };
    this.audioElementRef = React.createRef();
  }
  componentDidMount() {
    if (this.audioElementRef.current) {
      this.audioElementRef.current.addEventListener("play", this.onAudioLoaded);
      this.audioElementRef.current.addEventListener(
        "error",
        this.handleAudioError
      );
    }
  }

  componentWillUnmount() {
    if (this.audioElementRef.current) {
      this.audioElementRef.current.removeEventListener(
        "play",
        this.onAudioLoaded
      );
      this.audioElementRef.current.removeEventListener(
        "error",
        this.handleAudioError
      );
    }
  }
  onAudioLoaded = () => {
    this.setState({ hasAudio: true });
  };
  textChange = e => {
    this.setState({ text: e.target.value });
  };
  onTextChange(event) {
    this.setState({ text: event.target.value });
  }
  speak = e => {
    const { text } = this.state;

    const audio = this.audioElementRef.current;
    audio.setAttribute("type", "audio/ogg;codecs=opus");
    audio.setAttribute(
      "src",
      `${Node_API_URL}api/v1/synthesize?text=${text}&voice=en-US_AllisonV3Voice&download=true&accept=audio%2Fmp3`
    );
  };
  render() {
    const { text, hasAudio } = this.state;
    return (
      <div>
        <h2>Text To Speech</h2>
        <input name="text" value={text} onChange={this.textChange} />
        <button onClick={this.speak}>To Speech</button>
        <audio
          ref={this.audioElementRef}
          autoPlay
          id="audio"
          className={`audio ${hasAudio ? "" : "hidden"}`}
          controls="controls"
        >
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  }
}
