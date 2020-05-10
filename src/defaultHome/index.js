
import React, { Component } from 'react';
import { Router, Switch, Route, Redirect } from "react-router";
import { createBrowserHistory } from "history";
import "./index.scss";
import { connect } from "react-redux";

import { startLogin, createUserAuthProvider } from "../firebase/auth";
export const history = createBrowserHistory();



class DefaultHome extends Component { 
 

    constructor(props){
        super(props);

        this.state ={
            name: "", 
            username: "", 
            password: "", 
            email: "", 
            redirect:false
        }
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onSubmitOfRegister = this.onSubmitOfRegister.bind(this);
    }

    onChangeHandler = (e) => {
        const value = e.target.value;
        this.setState({
            ...this.state,
            [e.target.name]: value
        });
    } 

    onSubmitOfRegister = (e) => {
        console.log("inside onEmailIdPasswordLogin")
        e.preventDefault();
        //console.log("Inside Submit ". this.state);
        this.props.createUserAuthProvider(
            this.state.email, 
            this.state.password
        );

    }

    render() {
      

        if (this.state.redirect) {
            return <Redirect to='/' />
        }
        return (
            <div id="LoginForm">

                <div className="container">
                    <div className="login-form">
                        <div className="main-div">
                            <div className="panel">
                                <h2>Register</h2>
                            </div>
                            <form id="Register" onSubmit={this.onSubmitOfRegister} method="post">
                                <div className="form-group">
                                    <input type="text" name="name" placeholder="Name" value={this.state.name}  className="form-control" onChange={this.onChangeHandler} />
                                </div>
                                <div className="form-group">
                                    <input type="text" name="username" placeholder="User Name" value={this.state.username} className="form-control" onChange={this.onChangeHandler} />
                                </div>
                                <div className="form-group">
                                    <input type="email" name="email" placeholder="Email" value={this.state.email} className="form-control" onChange={this.onChangeHandler} />
                                </div>
                                <div className="form-group"> 
                                    <input type="password" name="password" placeholder="Password" value={this.state.password}  className="form-control" onChange={this.onChangeHandler} />
                                </div>

                                <button type="submit" className="btn btn-primary">
                                    Register
                                </button>
                            </form>
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
    }
});

export default connect(null, mapDispatchToPops) (DefaultHome);