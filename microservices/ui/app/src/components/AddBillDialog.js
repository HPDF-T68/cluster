import React, {Component} from 'react';
import Styles from '../Styles.js';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import Chip from 'material-ui/Chip';

class AddBillDialog extends Component{
	constructor(props){
		super(props);
		const groups = [];

		this.state={groups:groups, modalOpen:this.props.click, groupName:"", 
					billName:"new expenditure", billAmount:10.0,notes:"", tmpFilepath:""};
		
		this.newBill={groupName:"", billName:"", billAmount:0, billAmount:null,notes:"", tmpFilepath:""};
	}
	componentWillMount(){
		const groups = [];
		var gKeys = Object.keys(this.props.groups);
		var gLen  = gKeys.length;
		for (let i=0; i<gLen; i++){
  			groups.push(<MenuItem value={this.props.groups[ gKeys[i] ]} key={i+500} primaryText={this.props.groups[ gKeys[i] ]} />);
		}
		this.setState({groups:groups,groupName:this.props.groups[gKeys[0]]});
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.click===true){
			this.setState({modalOpen: true});	
		}
		const groups = [];
		var gKeys = Object.keys(this.props.groups);
		var gLen  = gKeys.length;
		for (let i=0; i<gLen; i++){
  			groups.push(<MenuItem value={this.props.groups[ gKeys[i] ]} key={i+500} primaryText={this.props.groups[ gKeys[i] ]} />);
		}
		this.setState({groups:groups,groupName:this.props.groups[gKeys[0]]});
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
		var that = this;
		var tmpFile = event.target.files;
		var tmpType = event.target.files[0]["type"];
		var fileData = new Blob([tmpFile[0]], {type : tmpType});
		var img_url;

		function getBuffer(resolve){
			var fr = new FileReader();
			fr.readAsArrayBuffer(fileData);
			fr.onload = function(){
				var arrayBuffer=fr.result;
				var bytes=new Uint8Array(arrayBuffer);
				var base64String = btoa(String.fromCharCode.apply(null, bytes));
				resolve(base64String);
			}	
		}
		var promise  = new Promise(getBuffer);
		promise.then(function(data){
			//var arrayBuffer=fr.result;	//console.log("arrayBuffer="+ arrayBuffer);
			//if(tmpFile){
			var authorization  = "Bearer ".concat(that.getCookie("HASURA_AUTH_TOKEN"));
			var fetchAction =  require('node-fetch');
			var url = "https://filestore.bathtub62.hasura-app.io/v1/file";
			var file = data;
			var requestOptions = {  method: 'POST',
									headers: {  "Authorization": authorization    },
									body: file
			};
			fetchAction(url, requestOptions)
			.then(function(response) {	return response.json();	})
			.then(function(result) {
				console.log('File upload sucessful!');
				console.log(result);
				var fileURL = tmpType + " " + "https://filestore.bathtub62.hasura-app.io/v1/file/" + result.file_id;
				console.log(fileURL);
				//pass to app.js to put url in logss table
				that.setState({tmpFilepath: fileURL});
			})
			.catch(function(error) {	console.log('Request Failed:' + error);	});
		})
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
	getCookie = (cname) => {
	    var name = cname + "=";
	    var ca = document.cookie.split(';');
	    for(var i = 0; i < ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0) == ' ') {
	            c = c.substring(1);
	        }
	        if (c.indexOf(name) == 0) {
	            return c.substring(name.length, c.length);
	        }
	    }
	    return "";
	};

	render(){
		const actions = [	<FlatButton	label="Cancel"	onClick={this.handleClose} 	
							labelStyle={Styles.dasboardFlatLabel} 				style={Styles.flatModalCancel}
							backgroundColor='#ff4e00' 	hoverColor='#ff9d00' 	rippleColor='#efefef' />,					
      						<FlatButton	label="Save"	onClick={this.billSave.bind(this)}	
      						labelStyle={Styles.dasboardFlatLabel}				style={Styles.flatModalDone}
		                    backgroundColor='#08ce00' 	hoverColor='#64dd17' 	rippleColor='#efefef' />
      					];
		return(
			<Dialog		title="New Bill"	modal={true}	autoScrollBodyContent={true}  
						actions={actions}					open={this.state.modalOpen}
						titleStyle={Styles.addBillTitle} 	bodyStyle={Styles.addBillBody}
						contentStyle={Styles.addBillContent}>
				<div>
					<div style={Styles.flexRow}>
						<span style={Styles.groupLabel}>GROUP :</span>
						<DropDownMenu	value={this.state.groupName}	onChange={this.dropdownChange}
							anchorOrigin={{vertical:'bottom', horizontal:'left'}}	autoWidth={false}	style={Styles.groupOption} >
							{this.state.groups}
	        			</DropDownMenu>
        			</div><br/>
        			<div style={{marginTop:'-24px'}}>
	        			<TextField	style={{marginTop:'-24px',width:'150px'}}	defaultValue="new expenditure"
	        						floatingLabelText="Enter a description"		floatingLabelFixed={true}
									value={this.state.billName}	onChange={this.descriptionChange}/>
						<span style={{paddingLeft:'20px'}}>$ </span>
						<TextField	defaultValue="10.0"		floatingLabelText="Amount"			floatingLabelFixed={true}
									value={this.state.billAmount} onChange={this.amountChange}	style={{width:'50px'}}	/>
					</div>
					<span style={{lineHeight:'32px',fontSize:'smaller',display: 'flex',flexWrap: 'wrap'}}>
						Paid by &nbsp;<Chip>you</Chip>&nbsp; and split &nbsp;<Chip>equally</Chip>
					</span>
					<Divider style={Styles.modalDivider}/>
					<span style={{fontSize:'smaller'}}>Add an image or PDF :</span><br/>
					<input 	id="fileinput" name="billAttachment" type="file" 	style={{paddingTop:'5px'}}
							value={this.state.file} onChange={this.handleFile} /><br />
        			<TextField	defaultValue=""	floatingLabelText="Add Notes"
								value={this.state.notes}	onChange={this.notesChange}	floatingLabelFixed={true}/>
      
				</div>
			</Dialog>
		);
	}
}

export default AddBillDialog;