import React, { Component } from 'react';
import muiTheme from '../muiTheme.js';
import Styles from '../Styles.js';
import DetailsList from  './DetailsList.js';
import AddBillDialog from  './AddBillDialog.js';

import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';

class DashboardMain extends Component{
	constructor(props){
		super(props);
		const log = [];
		var lKeys = Object.keys(this.props.log);
		var lLen  = lKeys.length;
		for(let i=0; i<lLen; i++){
			log.push({
				details: this.props.log[ lKeys[i] ]
			})
		}
		this.state = {log:log, modalAddBill:false};
	}
	addBill(){
		this.setState({ modalAddBill: true});
	}
	render(){
		return(
			<Paper style={Styles.dashboardMain}>
		       	<AddBillDialog 	click={this.state.modalAddBill}		groups={this.props.groups}
		       					addBill={this.props.addBill} /> 
				<div style={Styles.dashboardBanner}>			
					<b style={Styles.dashboardHeader}>Dashboard</b>
					<span style={{'marginLeft':'150px'}}>
						<FlatButton style={Styles.flatAddBill} labelStyle={Styles.dasboardFlatLabel}
		                        backgroundColor='#ff4e00' hoverColor='#ff9d00' rippleColor='#efefef' 
		                        label="Add a bill"	onClick={this.addBill.bind(this)} />
		                &nbsp;&nbsp;&nbsp;
						<FlatButton style={Styles.flatSettleUp} labelStyle={Styles.dasboardFlatLabel}
		                        backgroundColor='#08ce00' hoverColor='#64dd17' rippleColor='#efefef' 
		                        label="Settle up" />
					</span>
				</div>
				<Divider style={{'backgroundColor': muiTheme.palette.primaryHeaderColor}}/>
				<div style={Styles.dashboardBanner}>
					<div style={Styles.dashboardBannerText}>
						<div>
							total balance<br />
							<span style={Styles.account}>$ {this.props.account.totalBalance}</span>
						</div>
						<div style={Styles.dashboardBannerMid}>
							you owe<br />
							<span style={Styles.account}>$ {this.props.account.youOwe}</span>
						</div>
						<div>
							you are owed<br />
							<span style={Styles.account}>$ {this.props.account.youAreOwed}</span>
						</div>
					</div>
				</div>
				{	this.state.log.map((log, index) => (
							<DetailsList	key={index+1000}
							year={log.details.year}		month={log.details.month}	day={log.details.day}
							name={log.details.name}		group={log.details.group}
							paidBy={log.details.paidBy}	paid={log.details.paid}
							lentBy={log.details.lentBy}	lent={log.details.lent}	/>		
					))
			     }
				
			</Paper>
		);
	}
}

export default DashboardMain;