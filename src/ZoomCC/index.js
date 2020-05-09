import React, { Component } from "react";
import { Node_API_URL } from "../Constants";
import recognizeMicrophone from "watson-speech/speech-to-text/recognize-microphone";
import Axios from "axios";
import Modal from "../Modal";
import DemoVideo from "../zoom-cc-demo.mov";
import './index.scss';

export default class SpeechToText extends Component {
  state = {
    seq: 1,
    text: "",
    isSet: false,
    meetingUrl: "",
    meetingName: "",
    posted_cc: [],
    formattedMessages: [],
    open: true,
  };
  componentDidMount() {
    setTimeout(this.closeModal, 30000);
  }
  closeModal = () => {
    this.setState({ open: false });
  };
  sendCC = () => {
    const { seq, meetingUrl } = this.state;
    let messages = this.getFinalAndLatestInterimResult();
    console.log("before messages", messages);
    if (messages.length > seq) {
      let message = messages[seq - 1];
      console.log("after messages", message);
      let text = message.alternatives[0].transcript;
      Axios.post(`${meetingUrl}&seq=${seq}`, text, {
        headers: {
          "Content-Type": "text/plain",
        },
      })
        .then((response) => {
          let { posted_cc } = this.state;
          posted_cc.push({ time: response.data, text });
          this.setState({ seq: this.state.seq + 1, posted_cc });
        })
        .catch((e) => {
          let { posted_cc } = this.state;
          posted_cc.push({ time: null, text });
          this.setState({ seq: this.state.seq + 1, posted_cc });
        });
    }
  };
  setMeetingUrl = (e) => {
    e.preventDefault();
    let { meetingUrl } = this.state;
    this.setState({ isSet: true, meetingUrl });
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
      })
      .catch(function (error) {
        this.setState({ error: "Could not load access token from server." });
      });
  };
  handleFormattedMessage = (msg) => {
    let { formattedMessages } = this.state;
    this.setState(
      { formattedMessages: formattedMessages.concat(msg) },
      this.sendCC
    );
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
    const {
      meetingUrl,
      isSet,
      meetingName,
      listening,
      open,
      posted_cc,
    } = this.state;
    return (
      <div className="container">
        <h1>
          Live zoom closed captioning{" "}
          {isSet && meetingName && `for meeting ${meetingName}`}
        </h1>
        <div className="row">
          <div className="col-md-5 dataCard">
            {!isSet ? (
              <form onSubmit={this.setMeetingUrl}>
                <input
                  type="text"
                  name="meeting-name"
                  placeholder="Enter meeting name (optional)"
                  value={meetingName}
                  onChange={(e) => {
                    this.setState({ meetingName: e.target.value });
                  }}
                  style={{ width: "100%", marginBottom: "5px" }}
                />
                <textarea
                  // type="text"
                  name="meetingUrl"
                  value={meetingUrl}
                  placeholder={"Enter API token from Zoom"}
                  className="meetingUrl-textarea"
                  onChange={(e) => {
                    this.setState({ meetingUrl: e.target.value });
                  }}
                  required
                />
                <button type="submit" className="webcam-controls">
                  <i className="fa fa-save  fa-2x icons"></i>
                  Save API token
                </button>
              </form>
            ) : (
              <>
                <button
                  onClick={() => {
                    this.stopTranscription();
                    this.setState({
                      meetingUrl: "",
                      meetingName: "",
                      formattedMessages: [],
                      posted_cc: [],
                      isSet: false,
                      seq: 1,
                    });
                  }}
                  className="webcam-controls"
                  style={{ marginBottom: "5px" }}
                >
                  <i className="fa fa-gear  fa-2x icons"></i>
                  Change API token
                </button>
                <br />
                {!listening && (
                  <button
                    id="button"
                    onClick={this.onClickButton}
                    className="webcam-controls"
                  >
                    <i className="fa fa-microphone  fa-2x icons"></i> Listen To
                    Microphone for live CC
                  </button>
                )}

                <button
                  id="stop"
                  onClick={this.stopTranscription}
                  className={`webcam-controls ${
                    listening ? "visible" : "hide"
                  }`}
                >
                  <i className="fa fa-stop  fa-2x icons"></i>Stop Broadcasting
                  live CC
                </button>
              </>
            )}
          </div>
          <div className="col-md-5 dataCard">
            <h3>Posted Captions</h3>
            <hr />
            <div
              className="posted-cc-div"
              style={{ maxHeight: "500px", overflowY: "auto" }}
            >
              {posted_cc.map((item) => (
                <div className="row">
                  {/* <div className="col-4">{item.time}</div> */}
                  <div className="col">{item.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Modal open={open} closeHandler={this.closeModal}>
          <div className="container" style={{ textAlign: "center" }}>
            <video src={DemoVideo} width={950} autoPlay />
          </div>
        </Modal>
      </div>
    );
  }
}
