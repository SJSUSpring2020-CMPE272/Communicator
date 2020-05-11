
import React, { Component } from 'react';
import { Redirect } from "react-router";
import { createBrowserHistory } from "history";
//import "..//index.scss";
import Backgroundimage from "../AboutUs.jpg";
export const history = createBrowserHistory();



class Home extends Component { 
 
    constructor(props){
        super(props);
    }

    render() {
      
        return (
            <div className="container" style={{backgroundColor : "darkgray" , margin : "20px"}}>
                
                <h3> About </h3>
                <div className="row">
                    <div className="col-md-8">
                  
                    <p> The idea behind this project is to create an application to help specially abled people interact with other people with ease. It reduces the dependence on mediators and makes even the differently abled people independent. With the use of this application differently abled people can even access technical training without any loss of information.</p>
                    <ul>
                        <li> Differently abled people </li>
                        <ul>
                            <li>Ease of Communication in day to-day life amongst themselves as well others.</li>
                            <li>Eliminates the dependency on Mediators and Interpreters.</li>
                            <li>Reduces Loss of Information </li>
                        </ul>
                        <li>
                            Others
                        </li>
                        <ul>
                            <li>Removes the hardle while communnicating with differently abled people.</li>
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
        );
    }
        
   
}


export default  Home;