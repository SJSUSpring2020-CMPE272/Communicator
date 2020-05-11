import React, { Component } from "react";
import { Router, Switch, Route, Redirect } from "react-router";
import { createBrowserHistory } from "history";
// import "./index.scss";
import { connect } from "react-redux";
import Backgroundimage from "../images.jpg";
import { history } from "../App";
import { startLogin, createUserAuthProvider } from "../firebase/auth";

class DefaultHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      username: "",
      password: "",
      email: "",
      redirect: false,
    };
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onSubmitOfRegister = this.onSubmitOfRegister.bind(this);
  }

  onChangeHandler = (e) => {
    const value = e.target.value;
    this.setState({
      ...this.state,
      [e.target.name]: value,
    });
  };

  onSubmitOfRegister = (e) => {
    console.log("inside onEmailIdPasswordLogin");
    e.preventDefault();
    //console.log("Inside Submit ". this.state);
    this.props.createUserAuthProvider(this.state.email, this.state.password);
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
    return (
      <div id="LoginForm">
        <div
          className="logo-text"
          onClick={() => {
            history.push("/");
          }}
        >
          Communicator
        </div>
        <div className="row" style={{ backgroundColor: "lightgray" }}>
          <div className="col-md-8">
            <div class="img-wrap">
              <img
                src={Backgroundimage}
                style={{ height: "99vh", width: "100vw" }}
              />
            </div>
          </div>
          <div className="col-md-4">
            <div id="LoginForm" style={{ margin: "10px" }}>
              <div className="login-form">
                <div className="main-div">
                  <div className="panel">
                    <h2>Register</h2>
                  </div>
                  <form
                    id="Register"
                    onSubmit={this.onSubmitOfRegister}
                    method="post"
                  >
                    <div className="form-group">
                      <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={this.state.name}
                        className="form-control"
                        onChange={this.onChangeHandler}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        name="username"
                        placeholder="User Name"
                        value={this.state.username}
                        className="form-control"
                        onChange={this.onChangeHandler}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={this.state.email}
                        className="form-control"
                        onChange={this.onChangeHandler}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={this.state.password}
                        className="form-control"
                        onChange={this.onChangeHandler}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary">
                      Register
                    </button>
                    <div style={{ textAlign: "right" }}>
                      <span>
                        Already registered? <a href="/login">Sign in</a>
                      </span>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToPops = (dispatch) => ({
  // startLogin: () => {
  //     dispatch(startLogin());
  // },
  createUserAuthProvider: (email, password) => {
    dispatch(createUserAuthProvider(email, password));
  },
});

export default connect(null, mapDispatchToPops)(DefaultHome);
