import React, { Component } from "react";

import recognizeMicrophone from "watson-speech/speech-to-text/recognize-microphone";
export default class SpeechToText extends Component {
  state = {};
  onClickButton = () => {
    fetch("http://localhost:3001/api/v1/credentials")
      .then((response) => {
        return response.text();
      })
      .then((token) => {
        console.log(token);
        var stream = recognizeMicrophone({
          accessToken: JSON.parse(token).accessToken,
          url: JSON.parse(token).serviceUrl,
          objectMode: true, // send objects instead of text
          extractResults: true, // convert {results: [{alternatives:[...]}], result_index: 0} to {alternatives: [...], index: 0}
          format: false, // optional - performs basic formatting on the results such as capitals an periods
        });

        /**
         * Prints the users speech to the console
         * and assigns the text to the state.
         */
        stream.on("data", (data) => {
          console.log("data", data);
          this.setState({
            text: data.alternatives[0].transcript,
          });

          // console.log(data.alternatives[0].transcript)
        });
        stream.on("error", function (err) {
          console.log(err);
        });
        document.querySelector("#stop").onclick = stream.stop.bind(stream);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  render() {
    return (
      <div className="App">
        <h2>Speech To Text</h2>
        <button id="button" onClick={this.onClickButton}>
          Listen To Microphone
        </button>
        <button id="stop">stop</button>
        <div className="App-Text">{this.state.text}</div>
      </div>
    );
  }
}
