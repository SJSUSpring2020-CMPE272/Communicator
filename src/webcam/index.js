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
  
  // const setCanvas = () => {
  //   var img = document.getElementById("imdId");
  //   var canvas = document.getElementById("myCanvas");
  //   var context = canvas.getContext("2d");
  // context.drawImage(img,300,300,400,500, 400, 400,100,100);
  // context.beginPath();
  // context.rect(188, 50, 200, 100);
  // context.fillStyle = "yellow";
  // context.fill();
  // context.lineWidth = 7;
  // context.strokeStyle = "black";
  // context.stroke();
  // };
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
      <input
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
      {toggleCam && <button onClick={capture}>Capture photo</button>}
      <button
        onClick={() => {
          setToggleCam(!toggleCam);
        }}
      >
        Turn {toggleCam ? "Off" : "On"} camera
      </button>
    </>
  );
};

export default WebcamCapture;
