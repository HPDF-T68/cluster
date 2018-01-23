import React, { Component } from 'react';
import muiTheme from '../muiTheme.js';
import Styles from '../Styles.js';
import AddFriendDialog from './AddFriendDialog.js';
import AddGroupDialog from './AddGroupDialog.js';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';

class DashboardMenu extends Component{
	constructor(props){
		super(props);
		const friends = [];
		const groups = [];
		var fKeys = Object.keys(this.props.friends);
		var gKeys = Object.keys(this.props.groups);
		var fLen = fKeys.length;
		var gLen = gKeys.length;
		for(let i=0; i<fLen; i++){
			friends.push({
				name: this.props.friends[fKeys[i]]
			})
		}
		for(let j=0; j<gLen; j++){
			groups.push({
				name: this.props.groups[gKeys[j]]
			})
		}
		this.state = {friends:friends, groups:groups, modalAddFriend:false, modalAddGroup:false};
	}
	addFriend (){
		this.setState({ modalAddFriend: true, modalAddGroup:false});
		console.log("f | "+this.state.modalAddFriend+" "+this.state.modalAddGroup);
	};
	addGroup (){
		this.setState({ modalAddGroup: true, modalAddFriend:false});
		console.log("g | "+this.state.modalAddFriend+" "+this.state.modalAddGroup);
	};
	render(){
		return(
			<div style={Styles.dashboardMenuList}>
					<AddFriendDialog 	click={this.state.modalAddFriend}	users={this.props.users}
		       						addFriends={this.props.addFriends} />
					<AddGroupDialog 	click={this.state.modalAddGroup}	friends={this.props.friends}
		       						addGroup={this.props.addGroup} />
		      	<Menu desktop={true} width={150} listStyle={{'paddingBottom':'0px','paddingTop':'0px'}}>
			        <MenuItem leftIcon={<i className="material-icons">dashboard</i>} primaryText="Dashboard" innerDivStyle={Styles.menuNav}/>
			        <MenuItem leftIcon={<i className="material-icons">flag</i>} primaryText="Recent activity" innerDivStyle={Styles.menuNav}/>
			        <MenuItem leftIcon={<i className="material-icons">list</i>} primaryText="All expenses" innerDivStyle={Styles.menuNav}/>
			        <br />
			        <MenuItem 	primaryText="GROUPS" secondaryText={<b>+ add</b>} innerDivStyle={Styles.menuDisabled}
			        			onClick={this.addGroup.bind(this)}  />
			        <Divider style={{'marginTop':'0px'}}/>
			        {	this.state.groups.map((groups, index) => (
							<MenuItem leftIcon={<i className="material-icons">loyalty</i>} innerDivStyle={Styles.menuNav}
							key={index} primaryText={groups.name}/>
						))
			        }
			        <MenuItem 	primaryText="FRIENDS" secondaryText={<b>+ add</b>} innerDivStyle={Styles.menuDisabled}
			        			onClick={this.addFriend.bind(this)} />
			        <Divider style={{'marginTop':'0px'}}/>
				    {	this.state.friends.map((friends, index) => (
							<MenuItem leftIcon={<i className="material-icons">perm_identity</i>} innerDivStyle={Styles.menuNav}
							key={index} primaryText={friends.name}/>
						))
			        }
		    	</Menu>
		    </div>
		);
	}
}
export default DashboardMenu;