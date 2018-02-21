import React, { Component } from 'react';
import Styles from '../Styles.js';
import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import Menu from 'material-ui/Menu';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Divider from 'material-ui/Divider';

var slidesLink = "https://docs.google.com/presentation/d/14KyhDPpIlfI8BX1Ma9BkSzicBxDGervLSGxa7d749wA/edit?usp=sharing";

class DashboardAside extends Component{
	constructor(props){
		super(props);
		this.state = {account: false};

		this.accountOpen.bind(this);
		this.accountClose.bind(this);
		this.selectAvatar.bind(this);
	};
	accountOpen(){
		this.setState({account: true});
		//console.log(this.state.account);
	};
	accountClose = () => {
		this.setState({account: false});
		//console.log(this.state.account);
	};
	selectAvatar = (evt) => {
		console.log("avatar : "+evt.target.value);
		this.props.setAvatar(1);
	}
	render(){
		return(
			<div>
				{(this.state.account===true)
				?
					<div>
						<List>
							<Divider />
					        <ListItem leftAvatar={<Avatar size={50} src="images/avatar_0.png" />} value={1}
					        			onClick={this.selectAvatar} innerDivStyle={{'height':'27px'}} />
					        <Divider />
					        <ListItem leftAvatar={<Avatar size={50} src="images/avatar_1.png" />} value={2}
					        			onClick={this.selectAvatar} innerDivStyle={{'height':'27px'}} />
					        <Divider />
					        <ListItem leftAvatar={<Avatar size={50} src="images/avatar_2.png" />} value={3}
					        			onClick={this.selectAvatar} innerDivStyle={{'height':'27px'}} />
					        <Divider />
					        <ListItem leftAvatar={<Avatar size={50} src="images/avatar_3.png" />} value={4}
					        			onClick={this.selectAvatar} innerDivStyle={{'height':'27px'}} />
					        <Divider />
					        <ListItem leftAvatar={<Avatar size={50} src="images/avatar_4.png" />} value={5}
					        			onClick={this.selectAvatar} innerDivStyle={{'height':'27px'}} />
					        <Divider />
					    </List>
					    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
      					<FlatButton	label="Close"	onClick={this.accountClose}	
							labelStyle={Styles.dasboardFlatLabel}				style={Styles.flatModalDone}
		                    backgroundColor='#08ce00' 	hoverColor='#64dd17' 	rippleColor='#efefef' />
					</div>
				:
					<div>
						<img style={Styles.hasuraLogo} src="/images/Hasura_HD.jpg" />
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
				}
			</div>
		);
	}
}

export default DashboardAside;