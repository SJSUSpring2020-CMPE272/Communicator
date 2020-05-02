import React, { useEffect } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import "./index.css";
const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

const WebcamCapture = () => {
  const webcamRef = React.useRef(null);
  const audioElementRef = React.useRef(null);
  const [imageSrc, setImageSrc] = React.useState(null);
  const [toggleCam, setToggleCam] = React.useState(true);
  const [result, setResult] = React.useState("");

  // useEffect(() => {
  //   let clear;
  //   if (toggleCam) {
  //     clear = setInterval(capture, 100);
  //   }

  //   return () => {
  //     clearInterval(clear);
  //   };
  // });

  const speak = e => {
    const audio = audioElementRef.current;
    audio.setAttribute("type", "audio/ogg;codecs=opus");
    audio.setAttribute(
      "src",
      `http://localhost:3001/api/v1/synthesize?text=${result}&voice=en-US_AllisonV3Voice&download=true&accept=audio%2Fmp3`
    );
  };
  function predict(image) {
    axios
      .post("http://localhost:5000/predict", { image_txt: image })
      .then((response) => {
        response.data =
          document.getElementById("result").value + " " + response.data;
        response.data.trim();
        setResult(response.data);
      })
      .catch((e) => {
        console.log("error", e);
      });
  }

  const capture = React.useCallback(() => {
    const image = webcamRef.current.getScreenshot();
    console.log(image);
    setImageSrc(image);
    predict(image);
  }, [webcamRef]);

  return (
    <>
      <h1>SIGN LANGUAGE INTERPRETER</h1>
      {toggleCam && (
        <>
          <Webcam
            audio={false}
            height={400}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={600}
            forceScreenshotSourceSize={true}
            videoConstraints={videoConstraints}
            mirrored={true}
          />
          <div className="camera-border"></div>
        </>
      )}
      <textarea
        type="text"
        value={result}
        name="result"
        id="result"
        onChange={(e) => {
          setResult(e.target.value);
        }}
      />
      {/* <img src={imageSrc} alt="Something" id={"imdId"} /> */}

      {/* <canvas id="myCanvas" width="500" height="500" /> */}

      {toggleCam && (
        <i
          className="fa fa-camera fa-2x icons"
          onClick={capture}
          title="Capture Sign"
        ></i>
      )}

      {/* <button
        onClick={() => {
          setToggleCam(!toggleCam);
        }}
      >
        Turn {toggleCam ? "Off" : "On"} camera
      </button> */}
      {toggleCam ? (
        <span
          class="fa-stack fa-lg icons"
          onClick={() => {
            setToggleCam(!toggleCam);
          }}
        >
          <i className="fa fa-video-camera fa-stack-1x"></i>
          <i class="fa fa-ban fa-stack-2x" title="Turn off camera"></i>
        </span>
      ) : (
        <i
          className="fa fa-video-camera fa-2x icons"
          title="Turn on camera"
          onClick={() => {
            setToggleCam(!toggleCam);
          }}
        ></i>
      )}

      {result && <i class="fa fa-volume-up fa-2x icons" onClick={speak}></i>}
      <audio
          ref={audioElementRef}
          autoPlay
          id="audio"
          className={`audio`}
          controls="controls"
        >
          Your browser does not support the audio element.
        </audio>
    </>
  );
};

export default WebcamCapture;
