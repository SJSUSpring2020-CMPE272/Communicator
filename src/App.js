import "./App.css";

import React, { Component } from "react";
import { Router, Switch, Route, Redirect } from "react-router";
import { createBrowserHistory } from "history";
import { connect } from "react-redux";
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import { startLogout } from "./firebase/auth";

import Login from "./login";
import TextToSpeech from "./TextToSpeech";
import SpeechToText from "./SpeechToText";

import { logoutAction } from "./reducer/authReducer";
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
  }
};

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      fakeAuth.isAuthenticated === true ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);
class App extends Component {
  componentDidMount() {}

  logOut = () => {
    debugger;
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
          <div>
            {this.props.auth && this.props.auth.uid && (
              <nav className="navbar navbar-default">
                <div className="container-fluid">
                  <div
                    className="navbar-header"
                    onClick={() => {
                      history.push("/");
                    }}
                  >
                    <a className="navbar-brand" href="#">
                      Home
                    </a>
                  </div>
                  <ul className="nav navbar-nav">
                    <li
                      className="active"
                      onClick={() => {
                        history.push(`/text-to-speech`);
                      }}
                    >
                      <a href="#">Text To Speech</a>
                    </li>
                    <li
                      onClick={() => {
                        history.push(`/speech-to-text`);
                      }}
                    >
                      <a href="#">Speech To Text</a>
                    </li>
                  </ul>
                  <ul className="nav navbar-nav navbar-right">
                    <li onClick={this.logOut}>
                      <a href="#">
                        <span className="glyphicon glyphicon-log-in" /> Logout
                      </a>
                    </li>
                  </ul>
                </div>
              </nav>
            )}
            <div style={{ marginTop: "10px" }} />
            <Switch>
              <PrivateRoute path="/" component={TextToSpeech} exact={true} />
              <Route path="/speech-to-text" component={SpeechToText} />
              <Route path="/text-to-speech" component={TextToSpeech} />
              <Route path="/Login" component={Login} exact={true} />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logoutAction: () => {
      dispatch(logoutAction());
    },
    startLogout: () => {
      dispatch(startLogout());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
