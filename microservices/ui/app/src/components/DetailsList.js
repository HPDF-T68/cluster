import React, { Component } from 'react';
import muiTheme from '../muiTheme.js';
import Styles from '../Styles.js';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import MenuItem from 'material-ui/MenuItem';

import Menu from 'material-ui/Menu';

class DetailsList extends Component{
	render(){
		return(
			<div>
		    	<List style={Styles.padding0}>
		    		<ListItem
		    			leftIcon={
		    				<div style={Styles.flexRow}>
		    					<span style={Styles.listTimestamp}>
		    						<span style={Styles.listMonth}>{this.props.month}</span><br/>
		    						<span style={Styles.listDate}>{this.props.day}</span>
		    					</span>
		    					<i class="material-icons" style={Styles.listBill}>bookmark_border</i>
		    				</div>
		    			}
          				primaryText={<span style={Styles.listPrimary}>{this.props.name}<br/></span>}
          				secondaryText={<span style={Styles.listSecondary}>{this.props.group}</span>}
          				rightIcon={
		    				<div style={Styles.listPayment}>
		    					<span style={Styles.listPayedBy}>
		    						<span style={Styles.listPayName}>Paid by {this.props.paidBy}</span><br/>
									<span style={Styles.listPayAmt}>$ {this.props.paid}</span>
								</span>
		    					<span>
		    						<span style={Styles.listPayName}>Lent by {this.props.lentBy}</span><br/>
									<span style={Styles.listLentAmt}>$ {this.props.lent}</span>
		    					</span>
		    				</div>
		    			}
        			/>
        			<Divider style={Styles.listDivider} />
		    	</List>
			</div>
		);
	}
}

export default DetailsList;