import React, { useEffect } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

const WebcamCapture = () => {
  const webcamRef = React.useRef(null);
  let [imageSrc, setImageSrc] = React.useState(null);
  let [toggleCam, setToggleCam] = React.useState(true);

  useEffect(() => {
    let clear;
    if (toggleCam) {
      clear = setInterval(capture, 100);
    }

    return () => {
      clearInterval(clear);
    };
  }, [toggleCam]);

  const capture = React.useCallback(() => {
    const image = webcamRef.current.getScreenshot();
    setImageSrc(image);
  }, [webcamRef]);
  return (
    <>
      {toggleCam && (
        <Webcam
          audio={false}
          height={300}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={600}
          videoConstraints={videoConstraints}
        />
      )}

      <img src={imageSrc} alt="Something" />

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
