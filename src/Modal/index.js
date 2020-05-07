//SJSU CMPE 138 Spring2020 TEAM7
import React from "react";
import "./index.scss";

export default class Modal extends React.Component {
  render() {
    const { open, closeHandler } = this.props;

    return (
      <React.Fragment>
        {open && (
          <div className="modal-custom" onClick={closeHandler}>
            <div
              className="modal-custom-content"
              onClick={e => {
                e.stopPropagation();
              }}
            >
              <span className="close" onClick={closeHandler}>
                &times;
              </span>
              {this.props.children}
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}
