import React, { Component } from 'react';
import Styles from '../Styles.js';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

var slidesLink = "https://docs.google.com/presentation/d/14KyhDPpIlfI8BX1Ma9BkSzicBxDGervLSGxa7d749wA/edit?usp=sharing";

class DashboardAside extends  Component{
	render(){
		return(
			<div>
				<img style={Styles.hasuraLogo} src="/images/Hasura_HD.webp" />
				<div style={Styles.asideBox}>
				<h4 style={{'margin':'10px 5px 0px 10px'}}>~ &nbsp;RULES</h4>
					<ul>
						<li style={Styles.asideBoxLi}>Users are given <b>$100</b> as welcome bonus.</li>
						<li style={Styles.asideBoxLi}>You need to add friends before you can create group.</li>
						<li style={Styles.asideBoxLi}>Groups are immutable to prevent distortion of group history.</li>
						<li style={Styles.asideBoxLi}>Bills are always split equally.</li>
						<li style={Styles.asideBoxLi}>Payments are made outside the app.</li>
					</ul>
				</div>
				<div style={Styles.asideOther}>
					<h4 style={{'margin':'10px 5px 10px 10px'}}>
						<a style={Styles.asideLink} href={slidesLink} target="_blank">Minimum Value Product</a>
					</h4>
					<p style={Styles.disclaimer}>Please use a desktop browser &amp; 
					decent internet connection to use this app.</p>
				</div>
			</div>
		);
	}
}

export default DashboardAside;
/*
    margin: 5px 5px 5px 10px;
    text-align: center;
*/