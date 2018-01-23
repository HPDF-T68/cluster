import React, { Component } from 'react';
import Styles from '../Styles.js';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
class DashboardAside extends  Component{
	render(){
		return(
			<div>
				<img style={Styles.hasuraLogo} src="/images/Hasura_HD.webp" />
			</div>
		);
	}
}

export default DashboardAside;