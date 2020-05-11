import "./App.css";

import React, { Component } from "react";
import { Router, Switch, Route, Redirect } from "react-router";
import { createBrowserHistory } from "history";
import { connect } from "react-redux";
import "font-awesome/css/font-awesome.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import { startLogout } from "./firebase/auth";

import Login from "./login";
import TextToSpeech from "./TextToSpeech";
import SpeechToText from "./SpeechToText";
import DefaultHome from "./defaultHome";

import { logoutAction } from "./reducer/authReducer";
import Webcam from "./webcam";
import ZoomCC from './ZoomCC';
import AboutUs from "./Home/inedx";
// import './Main.css';

export const history = createBrowserHistory();

export const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true;
    setTimeout(cb, 100);
  },
  signout(cb) {
    this.isAuthenticated = false;
    cb();
  },
};

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      fakeAuth.isAuthenticated === true ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location },
          }}
        />
      )
    }
  />
);
class App extends Component {
  componentDidMount() {}

  logOut = () => {
    fakeAuth.signout(() => {
      // this.props.startLogout();
      this.props.logoutAction();
      this.props.startLogout();
      history.push(`/login`);
    });
  };

  render() {
    return (
      <div className="App">
        <Router history={history}>
          <div className="main">
            {this.props.auth && this.props.auth.uid && (
              <nav className="navbar navbar-default">
                <div className="container-fluids">
                  <div
                    className="navbar-header"
                    onClick={() => {
                      history.push("/home");
                    }}
                    style={{
                      fontSize: "21px",
                      fontWeight: "bold"
                    }}
                  >
                    Communicator
                  </div>

                  <ul className="nav navbar-nav">
                    <li
                      className="navigation-item cursor"
                      onClick={() => {
                        history.push(`/sign-to-speech`);
                      }}
                    >
                      {/* <a href="#"> */}
                      Sign To Speech
                      {/* </a> */}
                    </li>
                    <li
                      className="navigation-item cursor"
                      onClick={() => {
                        history.push(`/text-to-speech`);
                      }}
                    >
                      {/* <a href="#"> */}
                      Text To Speech
                      {/* </a> */}
                    </li>
                    <li
                      className="navigation-item cursor"
                      onClick={() => {
                        history.push(`/speech-to-text`);
                      }}
                    >
                      {/* <a href="#"> */}
                      Speech To Text
                      {/* </a> */}
                    </li>
                    <li
                      className="navigation-item cursor"
                      onClick={() => {
                        history.push(`/zoom-cc`);
                      }}
                    >
                      {/* <a href="#"> */}
                      Zoom CC
                      {/* </a> */}
                    </li>
                  </ul>
                  <ul className="nav navbar-nav navbar-right">
                  {/* <li  onClick={() => {
                        history.push(`/about-us`);
                      }} className="navigation-item cursor">
                      About Us
                    </li> */}
                    <li onClick={this.logOut} className="cursor">
                      {/* <a href="#"> */}
                      {/* <span className="glyphicon glyphicon-log-in" /> */}
                      Logout
                      {/* </a> */}
                    </li>
                  </ul>
                </div>
              </nav>
            )}
            <div />
            <Switch>
              <PrivateRoute path="/" component={Webcam} exact={true} />
              <PrivateRoute
                path="/sign-to-speech"
                component={Webcam}
                exact={true}
              />
              <PrivateRoute path="/speech-to-text" component={SpeechToText} />
              <PrivateRoute path="/text-to-speech" component={TextToSpeech} />
              <PrivateRoute path="/zoom-cc" component={ZoomCC} />
              <Route path="/webcam" component={Webcam} exact={true} />
              <Route path="/Login" component={Login} exact={true} />
              <Route path="/home" component={AboutUs} exact={true} />
              <Route path="/DefaultHome" component={DefaultHome} exact={true} />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logoutAction: () => {
      dispatch(logoutAction());
    },
    startLogout: () => {
      dispatch(startLogout());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
