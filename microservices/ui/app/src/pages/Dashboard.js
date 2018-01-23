import React, { Component } from 'react';
import Styles from '../Styles.js';
import DashboardMenu from '../components/DashboardMenu.js';
import DashboardMain from '../components/DashboardMain.js';
import DashboardAside from '../components/DashboardAside.js';

class Dashboard extends Component{
    render(){
        return(
            <div style={{display:'flex', flexDirection:'row', marginLeft:'190px'}}>
                <DashboardMenu  users={this.props.users}    friends={this.props.friends}    groups={this.props.groups}
                                addGroup={this.props.addGroup}  addFriends={this.props.addFriends}/>
                <DashboardMain account={this.props.account} groups={this.props.groups}		log={this.props.log} 
                addBill={this.props.addBill} />
                <DashboardAside />
            </div>
        );
    }
}

export default Dashboard;