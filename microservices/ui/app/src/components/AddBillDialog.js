import React, {Component} from 'react';
import Styles from '../Styles.js';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';

class AddBillDialog extends Component{
	constructor(props){
		super(props);
		const groups = [];
		var gKeys = Object.keys(this.props.groups);
		var gLen  = gKeys.length;
		for (let i=0; i<gLen; i++){
  			groups.push(<MenuItem value={this.props.groups[ gKeys[i] ]} key={i+500} primaryText={this.props.groups[ gKeys[i] ]} />);
		}
		this.state={groups:groups, modalOpen:this.props.click, 
					groupName:this.props.groups[gKeys[0]], billName:"new expenditure", billAmount:10.0,notes:"", tmpFilepath:""};

		this.newBill={groupName:"", billName:"", billAmount:0, billAmount:null,notes:"", tmpFilepath:""};
	}
	componentWillReceiveProps(nextProps){
		this.setState({modalOpen: true});
	};
	handleClose = () => {
    	this.setState({modalOpen: false});
  	};
	dropdownChange = (event, index, value) => {
		this.setState({groupName: value});
	};
	descriptionChange = (event, index) => {
		this.setState({billName: event.target.value});
	};
	amountChange = (event, index) => {
		this.setState({billAmount: event.target.value});
	};
	handleFile = (event, index) => {
		let tmpFile = event.target.files[0];
		if(tmpFile){
			this.setState({tmpFilepath: URL.createObjectURL(tmpFile)});
		}
	};
	notesChange = (event, index) => {
		this.setState({notes: event.target.value});
	};
	billSave = () => {
		this.newBill.groupName 	= this.state.groupName;
		this.newBill.billName 	= this.state.billName;
		this.newBill.billAmount = this.state.billAmount;
		this.newBill.billAmount = this.state.billAmount;
		this.newBill.notes 		= this.state.notes;
		this.newBill.tmpFilepath= this.state.tmpFilepath;
		
    	this.setState({modalOpen: false});
    	this.props.addBill(this.newBill);
  	};

	render(){
		const actions = [	<FlatButton	label="Cancel"	primary={true}	onClick={this.handleClose} 	/>,
      						<FlatButton	label="Save"	primary={true}	onClick={this.billSave.bind(this)}	/>
      					];
		return(
			<Dialog		title="Add a new expenditure"	modal={true}	autoScrollBodyContent={true}  
						actions={actions}					open={this.state.modalOpen}
						titleStyle={Styles.addBillTitle} 	bodyStyle={Styles.addBillBody}
						contentStyle={Styles.addBillContent}>
				<div>
					<span>Group :</span>
					<DropDownMenu	value={this.state.groupName}	onChange={this.dropdownChange}
						anchorOrigin={{vertical:'bottom', horizontal:'left'}}	autoWidth={false}	style={{width: 200}} >
						{this.state.groups}
        			</DropDownMenu><br/>
        			<TextField	defaultValue="new expenditure"	floatingLabelText="Enter a description"
								value={this.state.billName}	onChange={this.descriptionChange}	floatingLabelFixed={true}/><br/>
					<span>$</span>
					<TextField	defaultValue="10.0"	floatingLabelText="Amount"
								value={this.state.billAmount} onChange={this.amountChange}		floatingLabelFixed={true}/><br/>
					<span>Paid by you and split equally</span>
					<Divider/>
					<span>Add an image or PDF :</span><br/>
					<input id="fileinput" name="billAttachment" type="file" value={this.state.file} onChange={this.handleFile} /><br />
        			<TextField	defaultValue=""	floatingLabelText="Add Notes"	multiLine={true}	rows={2}
								value={this.state.notes}	onChange={this.notesChange}	floatingLabelFixed={true}/>
      
				</div>
			</Dialog>
		);
	}
}

export default AddBillDialog;