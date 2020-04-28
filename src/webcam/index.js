import React, { useEffect } from "react";
import Webcam from "react-webcam";
import "./index.css";
const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

const WebcamCapture = () => {
  const webcamRef = React.useRef(null);
  let [imageSrc, setImageSrc] = React.useState(null);
  let [toggleCam, setToggleCam] = React.useState(true);

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
  const capture = React.useCallback(() => {
    const image = webcamRef.current.getScreenshot();
    console.log(image);
    setImageSrc(image);
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

      <img src={imageSrc} alt="Something" id={"imdId"} />

      {/* <canvas id="myCanvas" width="500" height="500" /> */}
      <button onClick={capture}>Capture photo</button>
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
