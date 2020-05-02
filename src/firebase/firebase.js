import * as firebase from "firebase";

const config = {
    apiKey: "AIzaSyD8QN51LutpvADKbxwFDdmW25fZLwebS3I",
    authDomain: "cmpe-272-sign-to-speech.firebaseapp.com",
    databaseURL: "https://cmpe-272-sign-to-speech.firebaseio.com",
    projectId: "cmpe-272-sign-to-speech",
    storageBucket: "cmpe-272-sign-to-speech.appspot.com",
    messagingSenderId: "79459927890",
    appId: "1:79459927890:web:d27b1d7f6db7d9bd835c8b",
    measurementId: "G-43DH5YRMR7"
};

firebase.initializeApp(config);
const database = firebase.database();
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export { database as default, firebase, googleAuthProvider };
