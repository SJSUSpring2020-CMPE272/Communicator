#! /usr/bin/env node

require("dotenv").config({ silent: true });
const path = require("path");
const express = require("express");
const publicPath = path.join(__dirname, "build");
const app = express();
const TextToSpeechV1 = require("ibm-watson/text-to-speech/v1.js");
const { IamAuthenticator,IamTokenManager } = require("ibm-watson/auth");
const cors = require('cors');



app.use(express.static(publicPath));
app.use(cors());



//Host react application on root url
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});


//Text To Speech API block begins
const textToSpeech = new TextToSpeechV1({
  version: "2018-04-05",
  authenticator: new IamAuthenticator({
    apikey: process.env.TEXT_TO_SPEECH_IAM_APIKEY || "type-key-here"
  }),
  url: process.env.TEXT_TO_SPEECH_URL
});

const getFileExtension = acceptQuery => {
  const accept = acceptQuery || "";
  switch (accept) {
    case "audio/ogg;codecs=opus":
    case "audio/ogg;codecs=vorbis":
      return "ogg";
    case "audio/wav":
      return "wav";
    case "audio/mpeg":
      return "mpeg";
    case "audio/webm":
      return "webm";
    case "audio/flac":
      return "flac";
    default:
      return "mp3";
  }
};

/**
 * Pipe the synthesize method
 */
app.get("/api/v1/synthesize", async (req, res, next) => {
  
  try {
    const { result } = await textToSpeech.synthesize(req.query);
    const transcript = result;
    transcript.on("response", response => {
      if (req.query.download) {
        response.headers[
          "content-disposition"
        ] = `attachment; filename=transcript.${getFileExtension(
          req.query.accept
        )}`;
      }
    });
    transcript.on("error", next);
    transcript.pipe(res);
  } catch (error) {
    res.send(error);
  }
});
//Text to Speech API block ends

//Speech to Text API block begins
const tokenManagerSpeechToText = new IamTokenManager({
  apikey: process.env.SPEECH_TO_TEXT_IAM_APIKEY || '<iam_apikey>',
});

const serviceUrl = process.env.SPEECH_TO_TEXT_URL;

app.get('/api/v1/credentials', async (req, res, next) => {
  try {
    const accessToken = await tokenManagerSpeechToText.getToken();
    res.json({
      accessToken,
      serviceUrl,
    });
  } catch (err) {
    next(err);
  }
});
//Speech to Text API block ends
//Run application 
const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log("Server running on port: %d", port);
});

