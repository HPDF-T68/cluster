import React, { Component } from 'react';
import muiTheme from '../muiTheme.js';
import Styles from '../Styles.js';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';

class LoginSignup extends Component{
    constructor(){
        super();
        this.newUser  = {username:'', email:'', password:''};
        this.authUser = {email:'', password:''};
    }
    signupUsername(evt) {   this.newUser.username = evt.target.value;   };
    signupEmail(evt)    {   this.newUser.email    = evt.target.value;   };
    signupPassword(evt) {   this.newUser.password = evt.target.value;   };
    
    copyCredentials()   {   this.authUser.email   = this.newUser.email; 
                            this.authUser.password= this.newUser.password;
                        };
    loginEmail(evt)     {   this.authUser.email   = evt.target.value;   };
    loginPassword(evt)  {   this.authUser.password= evt.target.value;   };
    
    signup = () => {
        this.props.signup(this.newUser);
        this.copyCredentials();
    };
    login = () => {
        this.props.login(this.authUser);
    };
    render(){
        return(
            <div style={{display:'flex', flexDirection:'row'}}>
                <img style={Styles.LoginSignupImg} src="images/big_logo.png" />
                {(this.props.signupLogin === 0)
                ?
                    <form style={Styles.LoginSignupDiv}>
                        <h4 style={{color:muiTheme.palette.primaryHeaderColor}}>INTRODUCE YOURSELF</h4>
                        <h2 style={Styles.subheader}>Hi there! My name is</h2>
                        <TextField id="signup-username" onChange={this.signupUsername.bind(this)}
                            underlineShow={false} style={Styles.textFieldintro} type="text"/>
                        <h3 style={Styles.subheader}>Here’s my <b>email address:</b></h3>
                        <TextField id="signup-email" onChange={this.signupEmail.bind(this)}
                            underlineShow={false} style={Styles.textFieldother} type="email"/>
                        <h3 style={Styles.subheader}>And here’s <b>my password:</b></h3>
                        <TextField id="signup-password" onChange={this.signupPassword.bind(this)}
                            underlineShow={false} style={Styles.textFieldother} type="password"/><br/><br/>
                        <FlatButton style={Styles.flatSignMeUp} labelStyle={Styles.labelSignMeUp}
                        backgroundColor='#ff6200' hoverColor='#ff4500' rippleColor='#efefef' 
                        label="Sign me up!" onClick={this.signup} />
                        <br/><br/>
                    </form>
                :
                    <form style={Styles.LoginSignupDiv}>
                        <h4 style={{color:muiTheme.palette.primaryHeaderColor}}>WELCOME TO SPLITWISE</h4>
                        <h3 style={Styles.subheader}>Email address</h3>
                        <TextField id="login-email" onChange={this.loginEmail.bind(this)}
                            underlineShow={false} style={Styles.textFieldother} type="email" />
                        <h3 style={Styles.subheader}>Password</h3>
                        <TextField id="login-password" onChange={this.loginPassword.bind(this)}
                            underlineShow={false} style={Styles.textFieldother} type="password"/><br/><br/>
                        <FlatButton style={Styles.flatSignMeUp} labelStyle={Styles.labelSignMeUp}
                            backgroundColor='#ff6200' hoverColor='#ff4500' rippleColor='#efefef' 
                            label=" &nbsp; Log in &nbsp; " onClick={this.login} />
                    </form>
                }
            </div>
        );
    }
}


export default LoginSignup;

