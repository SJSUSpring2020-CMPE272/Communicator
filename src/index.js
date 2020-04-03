import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";

import { history, fakeAuth } from "./App";
import store from "./reducer/store";
import { loginAction, logoutAction } from "./reducer/authReducer";
import { firebase } from "./firebase/firebase";
import * as serviceWorker from "./serviceWorker";



let hasAppRendered = false;

const Application = (
  <Provider store={store}>
    <App />
  </Provider>
);

const renderApp = () => {
  if (!hasAppRendered) {
    ReactDOM.render(Application, document.getElementById("root"));
    hasAppRendered = true;
  }
};

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    debugger;
    fakeAuth.authenticate(() => {
      store.dispatch(loginAction(user));
      // store.dispatch(getEvents());
      if (window.location.href.toLowerCase().indexOf("login") >= 0) {
        history.push("/");
      }
      renderApp();
      console.log("logged in", user);
    });
  } else {
    debugger;
    store.dispatch(logoutAction());
    history.push("/Login");
    renderApp();
    console.log("logged out");
  }
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
