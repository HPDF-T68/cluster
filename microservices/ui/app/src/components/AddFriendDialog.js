import React, {Component} from 'react';
import Styles from '../Styles.js';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import Divider from 'material-ui/Divider';

class AddFriendDialog extends Component{
	constructor(props){
		super(props);
		const users = [];
		var uKeys = Object.keys(this.props.users);
		var uLen  = uKeys.length;
		for (let i=0; i<uLen; i++){
  			users.push(
  				<Checkbox	key={i+2500}	label={this.props.users[uKeys[i]]}	labelPosition="left"
          					onCheck={this.updateCheck.bind(this)}		value={this.props.users[uKeys[i]]}/>
          	);
		}
		this.state={users:users, modalOpen:this.props.click, selectedUsers:[]};
		this.newFriends=[];
	};
	componentWillReceiveProps(nextProps){
		this.setState({modalOpen: true});
	};
	updateCheck = (event, index, value) => {
		if(event.target.checked){
			this.state.selectedUsers.push(event.target.value);
		}
		else if(!event.target.checked){
			this.state.selectedUsers.splice(this.state.selectedUsers.indexOf(event.target.value), 1);
		}
  	}
	handleClose = () => {
    	this.setState({modalOpen: false});
  	};
	addDone = () => {
		this.newFriends = this.state.selectedUsers;
    	this.setState({modalOpen: false});
    	this.props.addFriends(this.newFriends);
    	this.state.selectedUsers=[];
  	};

	render(){
		const actions = [	<FlatButton	label="Cancel"	primary={true}	onClick={this.handleClose} 	/>,
      						<FlatButton	label="Done"	primary={true}	onClick={this.addDone.bind(this)}	/>
      					];
		return(
			<Dialog		title="Add new friends"	modal={true}	autoScrollBodyContent={true}  
						actions={actions}					open={this.state.modalOpen}
						titleStyle={Styles.addBillTitle} 	bodyStyle={Styles.addBillBody}
						contentStyle={Styles.addBillContent}>
				<div>
						<span>The existing friends will be ignored</span>
						<Divider />
						<div>{this.state.users}</div>
				</div>
			</Dialog>
		);
	}
}

export default AddFriendDialog;