import React, { Component } from "react";
import { Redirect } from "react-router";
//import "..//index.scss";
import Backgroundimage from "../AboutUs.jpg";
import { history } from "../App";
import { connect } from "react-redux";
import SpeechToTextImage from "../SpeechToTextImage.png";
import SignToSpeechImage from '../SignToSpeechImage.jpg';
import TextToSpeechImage from "../TextToSpeechImage.png";
import ZoomCCImage from '../ZoomCC.jpg';

class Home extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { auth } = this.props;
    debugger;
    return (
      <div className="home-about-us">
        {!this.props.auth.uid && (
          <div
            className="logo-text"
            onClick={() => {
              history.push("/defaultHome");
            }}
            style={{ position: "relative", marginTop: "0px" }}
          >
            Communicator
          </div>
        )}
        {!this.props.auth.uid && (
          <button
            className="btn btn-primary homepagelogin"
            style={{ zIndex: "1" }}
            onClick={() => {
              history.push("/login");
            }}
          >
            Login
          </button>
        )}
        <div className="container">
          <h3> About Us</h3>
          <div className="row">
            <div className="col-md-8">
              <p>
                {" "}
                The idea behind this project is to create an application to help
                specially abled people interact with other people with ease. It
                reduces the dependence on mediators and makes even the
                differently abled people independent. With the use of this
                application differently abled people can even access technical
                training without any loss of information.
              </p>
              <ul>
                <li> Differently abled people </li>
                <ul>
                  <li>
                    Ease of Communication in day to-day life amongst themselves
                    as well others.
                  </li>
                  <li>
                    Eliminates the dependency on Mediators and Interpreters.
                  </li>
                  <li>Reduces Loss of Information </li>
                </ul>
                <li>Others</li>
                <ul>
                  <li>
                    Removes the hardle while communnicating with differently
                    abled people.
                  </li>
                </ul>
              </ul>
            </div>
            <div className="col-md-4">
              <img
                src={Backgroundimage}
                style={{ height: "30vh", width: "30vw" }}
              />
            </div>
          </div>
        </div>
        <div className="container">
          <h3>Available Features</h3>
          <hr />
          <div className="row">
            <div className="col-8">
              <h4>Translate Signs into Speech</h4>
            </div>
            <div className="col-4">
              <img src={SignToSpeechImage} style={{ width: "360px" }}/>
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-4">
              <img src={TextToSpeechImage}  />
            </div>
            <div className="col-8">
              <h4>Give voice to your words</h4>
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-8">
              <h4>Hear the world with your eyes</h4>
            </div>
            <div className="col-4">
              <img src={SpeechToTextImage} style={{ width: "360px" }}/>
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-4">
              <img src={ZoomCCImage} style={{ width: "360px" }}/>
            </div>
            <div className="col-8">
              <h4>Post Live captions in Zoom meeting</h4>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps, null)(Home);
