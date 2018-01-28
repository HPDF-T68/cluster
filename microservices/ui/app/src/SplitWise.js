import React, { Component } from 'react';
import SWAppBar from './components/SWAppBar.js';
import LoginSignup from './pages/LoginSignup.js';
import Dashboard from './pages/Dashboard.js';

class SplitWise extends Component{
    constructor(props){
        super(props);
        this.state = {createGroupShow:false};
        this.createGroup = this.createGroup.bind(this);
    }
    createGroup(value) {
        this.setState({createGroupShow: value}, function(){console.log(this.state.createGroupShow);});
    }
    render(){
        return(
            <div>
                <SWAppBar   page={this.props.page}
                    onTitleClick={this.props.onTitleClick}  signupLogin={this.props.signupLogin}
                    signupPage={this.props.signupPage}      loginPage={this.props.loginPage}
                    signup={this.props.signup}              login={this.props.login}                
                    logged={this.props.logged}              username={this.props.username}
                    logout={this.props.logout}
                    createGroup={this.createGroup}
                />
                {this.props.logged
                ?
                    <Dashboard  users={this.props.users}
                                friends={this.props.friends}    groups={this.props.groups}
                                account={this.props.account}    log={this.props.log}
                                addBill={this.props.addBill}
                                addGroup={this.props.addGroup}  addFriends={this.props.addFriends}
                                />
                :
                    <LoginSignup logged={this.props.logged}     signupLogin={this.props.signupLogin}
                        signupPage={this.props.signupPage}      loginPage={this.props.loginPage}
                        signup={this.props.signup}              login={this.props.login}/>
                }
            </div>
        );
    }
}

export default SplitWise;