import React, { Component } from "react";
import { Node_API_URL } from "../Constants";
import recognizeMicrophone from "watson-speech/speech-to-text/recognize-microphone";
export default class SpeechToText extends Component {
  state = {
    formattedMessages: [],
    error: null,
    listening: false,
  };
  handleFormattedMessage = (msg) => {
    let { formattedMessages } = this.state;
    this.setState({ formattedMessages: formattedMessages.concat(msg) });
  };
  onClickButton = () => {
    fetch(Node_API_URL + "api/v1/credentials")
      .then((response) => {
        return response.text();
      })
      .then((token) => {
        console.log(token);
        var stream = recognizeMicrophone({
          accessToken: JSON.parse(token).accessToken,
          url: JSON.parse(token).serviceUrl,
          smart_formatting: true,
          objectMode: true, // send objects instead of text
          extractResults: true, // convert {results: [{alternatives:[...]}], result_index: 0} to {alternatives: [...], index: 0}
          format: true, // optional - performs basic formatting on the results such as capitals an periods
          interim_results: true,
          word_alternatives_threshold: 0.01,
          timestamps: true,
        });
        this.setState({ listening: true });
        stream.on("data", this.handleFormattedMessage);
        stream.on("end", this.handleTranscriptEnd);
        stream.on("error", this.handleError);

        stream.recognizeStream.on("end", () => {
          if (this.state.error) {
            this.handleTranscriptEnd();
          }
        });
        this.stream = stream;
        // document.querySelector("#stop").onclick =()=>{stream.stop.bind(stream); this.setState({listening:false})}
      })
      .catch(function (error) {
        this.setState({ error: "Could not load access token from server." });
      });
  };
  stopTranscription = () => {
    if (this.stream) {
      this.stream.stop();
      this.stream = null;
      this.setState({ listening: false });
    }
  };
  handleTranscriptEnd = () => {
    this.setState({ listening: false });
  };
  handleError = (err, extra) => {
    console.error(err, extra);
    if (err.name === "UNRECOGNIZED_FORMAT") {
      err =
        "Unable to determine content type from file name or header; mp3, wav, flac, ogg, opus, and webm are supported. Please choose a different file.";
    } else if (
      err.name === "NotSupportedError" &&
      this.state.audioSource === "mic"
    ) {
      err = "This browser does not support microphone input.";
    } else if (err.message === "('UpsamplingNotAllowed', 8000, 16000)") {
      err =
        "Please select a narrowband voice model to transcribe 8KHz audio files.";
    } else if (err.message === "Invalid constraint") {
      // iPod Touch does this on iOS 11 - there is a microphone, but Safari claims there isn't
      err = "Unable to access microphone";
    }
    this.setState({ error: err.message || err });
  };
  getFinalResults = () => {
    return this.state.formattedMessages.filter((r) => r.final);
  };
  getCurrentInterimResult = () => {
    const r = this.state.formattedMessages[
      this.state.formattedMessages.length - 1
    ];

    // When resultsBySpeaker is enabled, each msg.results array may contain multiple results.
    // However, all results in a given message will be either final or interim, so just checking
    // // the first one still works here.
    // if (!r || !r.results || !r.results.length || r.results[0].f) {
    //   return null;
    // }
    return r;
  };
  getFinalAndLatestInterimResult = () => {
    const final = this.getFinalResults();
    const interim = this.getCurrentInterimResult();
    if (interim) {
      final.push(interim);
    }
    return final;
  };
  render() {
    const { error, listening } = this.state;
    let messages = this.getFinalAndLatestInterimResult();
    // console.log("before messages", messages);
    // if (messages.length > 2) {
    //   messages.splice(messages.length - 1, 1);
    // }
    const results =
      messages &&
      messages.map((msg, i) => (
        <span key={`result-${msg + i}`}>{msg.alternatives[0].transcript}</span>
      ));
    // console.log("after messages", messages);
    return (
      <div className="container">
        <h1>Speech To Text</h1>
        {error}
        {!listening && (
          <button
            id="button"
            onClick={this.onClickButton}
            className="webcam-controls"
          >
            <i className="fa fa-microphone  fa-2x icons"></i> Listen To
            Microphone for Transcription
          </button>
        )}
        <button
          id="stop"
          onClick={this.stopTranscription}
          className={`webcam-controls ${listening ? "visible" : "hide"}`}
        >
          <i className="fa fa-stop  fa-2x icons"></i>Stop Transcription
        </button>

        {results.length>0&&<div className="App-Text dataCard">{results}</div>}
      </div>
    );
  }
}
