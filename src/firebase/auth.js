import { firebase, googleAuthProvider } from "./firebase";

export const startLogin = () => {
  return () => {
    return firebase.auth().signInWithPopup(googleAuthProvider);
  };
};

export const startLogout = () => {
  return () => {
    return firebase.auth().signOut();
  };
};
export const createUserAuthProvider = (email, password) => {
  return () => {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  };
};

export const sigininUserAuthProvider = (email, password) => {
  return () => {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  };
};
