import React, { Component } from 'react';
import muiTheme from '../muiTheme.js';
import Styles from '../Styles.js';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Avatar from 'material-ui/Avatar';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';


class CurrentUser extends Component{
    constructor(){
        super();
        this.state = { open: false};
    }
    logout(){
        this.props.toggle();
    }
    popover = (event) => {
        event.preventDefault();
        if(this.props.logged){
            this.setState({open: true, anchorEl: event.currentTarget});
        }
    };
    handleRequestClose = () => {
        this.setState({open: false});
    };
    render(){
        return(
            <span>
            {this.props.logged
             ? <span>
                    <FlatButton style={{'marginLeft':'70px'}} target="_blank" onClick={this.popover}
                        label={ <span style={{color: muiTheme.palette.primaryTextColor}}>{this.props.username}&nbsp;
                                <i style={{verticalAlign:'middle'}} className="material-icons">arrow_drop_down</i>
                            </span>}
                        icon={<Avatar src="images/avatar1.png" size={30} />} />
                        <Popover   
                            open={this.state.open} onRequestClose={this.handleRequestClose}
                            anchorEl={this.state.anchorEl} animation={PopoverAnimationVertical}
                            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                            targetOrigin={{horizontal: 'left', vertical: 'top'}} >
                            <Menu desktop={true} listStyle={{'paddingBottom':'0px','paddingTop':'0px'}}>
                                <MenuItem primaryText="Your Account" />
                                <MenuItem primaryText="Create a group" />
                                <MenuItem primaryText="Fairness calculators" />
                                <MenuItem primaryText="Log out" onClick={this.props.logout} />
                            </Menu>
                        </Popover>
                </span>
                
                : <span>
                    <FlatButton style={Styles.flatLogin} labelStyle={Styles.labelText}
                        backgroundColor='#08ce00' hoverColor='#64dd17' rippleColor='#efefef' 
                        label="Log in" onClick={this.props.loginPage} />
                    &nbsp; or &nbsp;
                    <FlatButton style={Styles.flatSignup} labelStyle={Styles.labelText}
                        backgroundColor='#ff4e00' hoverColor='#ff9d00' rippleColor='#efefef' 
                        label="Sign up" onClick={this.props.signupPage} />
                 </span>
            }
            </span>
        );
    };
}
class SWAppBar extends Component{
    render(){
        return(
            <AppBar
                title="S P L I T W I S E"
                showMenuIconButton={false}
                titleStyle={Styles.appbarTitle}
                onTitleClick={this.props.onTitleClick}
                iconElementRight=
                {<CurrentUser   logged={this.props.logged}              username={this.props.username}
                                signupPage={this.props.signupPage}      loginPage={this.props.loginPage}
                                logout={this.props.logout}  />}
                iconStyleRight={Styles.appbarAvatar}
            />
        );
    }
}

export default SWAppBar;