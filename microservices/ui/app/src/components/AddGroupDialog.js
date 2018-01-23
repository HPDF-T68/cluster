import React, {Component} from 'react';
import Styles from '../Styles.js';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import Divider from 'material-ui/Divider';

class AddGroupDialog extends Component{
	constructor(props){
		super(props);
		const friends = [];
		var fKeys = Object.keys(this.props.friends);
		var fLen  = fKeys.length;
		for (let i=0; i<fLen; i++){
  			friends.push(
  				<Checkbox	key={i+2500}	label={this.props.friends[fKeys[i]]}	labelPosition="left"
          					onCheck={this.updateCheck.bind(this)}		value={this.props.friends[fKeys[i]]}/>
          	);
		}
		this.state={friends:friends, modalOpen:this.props.click, groupName:"new group", selectedFriends:[]};
		this.groupName="";
		this.groupMembers=[];
	};
	componentWillReceiveProps(nextProps){
		this.setState({modalOpen: true});
	};
	updateCheck = (event, index, value) => {
		if(event.target.checked){
			this.state.selectedFriends.push(event.target.value);
		}
		else if(!event.target.checked){
			this.state.selectedFriends.splice(this.state.selectedFriends.indexOf(event.target.value), 1);
		}
  	};
  	handleChange = (event, index) => {
		this.setState({groupName: event.target.value});
	};
	handleClose = () => {
    	this.setState({modalOpen: false});
  	};
	addDone = () => {
		this.groupName = this.state.groupName;
		this.groupMembers = this.state.selectedFriends;
		if(this.groupMembers.length <= 0){
			//console.log("You need to select atlest one friend");
			this.setState({modalOpen: false});
	    	this.props.addGroup(this.groupName,this.groupMembers);
	    	this.state.selectedFriends=[];
		}
		else{
	    	this.setState({modalOpen: false});
	    	this.props.addGroup(this.groupName,this.groupMembers);
	    	this.state.selectedFriends=[];	
		}
  	};

	render(){
		const actions = [	<FlatButton	label="Cancel"	primary={true}	onClick={this.handleClose} 	/>,
      						<FlatButton	label="Done"	primary={true}	onClick={this.addDone.bind(this)}	/>
      					];
		return(
			<Dialog		title="Create a new group"	modal={true}	autoScrollBodyContent={true}  
						actions={actions}					open={this.state.modalOpen}
						titleStyle={Styles.addBillTitle} 	bodyStyle={Styles.addBillBody}
						contentStyle={Styles.addBillContent}>
				<div>
					<TextField	defaultValue="new group"	floatingLabelText="Enter a group name"
								value={this.state.billName}	onChange={this.handleChange}	floatingLabelFixed={true}/><br/>
					<div>{this.state.friends}</div>		
				</div>
			</Dialog>
		);
	}
}

export default AddGroupDialog;