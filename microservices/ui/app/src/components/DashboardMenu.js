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
		this.state = {friends:friends, groups:groups, modalOpen: 0};
	};
	componentWillMount(){
		//console.log(this.props.friends);
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
		this.setState({friends:friends, groups:groups});
	}
	componentWillReceiveProps(nextProps){
		//console.log(this.props.friends);
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
		this.setState({friends:friends, groups:groups});
	};
	addFriend (){
		this.setState({modalOpen:2});
		//this.setState({modalOpen:2}, function(){console.log("modal "+this.state.modalOpen);});
	};
	addGroup (){
		this.setState({modalOpen:1});
		//this.setState({modalOpen:1}, function(){console.log("modal "+this.state.modalOpen);});
	};
	render(){
		return(
			<div style={Styles.dashboardMenuList}>
					<AddFriendDialog 	click={this.state.modalOpen}	users={this.props.users}
		       						addFriends={this.props.addFriends} 	/>
					<AddGroupDialog 	click={this.state.modalOpen}	friends={this.props.friends}
		       						addGroup={this.props.addGroup} 		/>
		      	<Menu desktop={true} width={150} listStyle={{'paddingBottom':'0px','paddingTop':'0px'}}>
			        <MenuItem 	leftIcon={<i className="material-icons">dashboard</i>}
			        			style={{marginLeft:'-7px',borderLeft:'7px solid #51b216'}}
			        			primaryText="Dashboard" innerDivStyle={Styles.menuNavSelected}/>
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