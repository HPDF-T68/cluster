import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import muiTheme from './muiTheme.js';
import SplitWise from './SplitWise.js';
import Snackbar from 'material-ui/Snackbar';
/*** change logged state to  false ***/
//login/signup has a separate 'signupLogin: 0/1' because there is interchangable tabs user can go independent
//of app state on start up i.e. when user is not logged in
//page 0 default welcome page from where user gets into app login/signup options
//page1 is the base page : Dashboard if logged in or else show login/signup

class App extends Component{
    constructor(){
        super();
        var usersList = {};
        var friendList = {};
        var groupsList = {};
        
        this.user  =    { hasura_id:null, username: '', noOfFriends:0, avatar: ''};

        this.account =  { totalBalance: 10, youOwe: 20, youAreOwed: 30};
        
        //this.users =    { 1:'user 1', 2:'user 2', 3:'user 3', 4:'user 4', 5:'user 5', 6:'user 6', 7:'user 7'};
        //this.friends =  { 1:'friend 1', 2:'friend 2', 3:'friend 3', 4:'friend 4'};
        //this.groups =   { 1:'group  1', 2:'group  2', 3:'group  3'};

        this.log =      { 1:{'name':'Expense name 1','group':'group 1','year':2017,'month':'DEC','day':25,
                            'paidBy':'friend 1',paid:14,'lentBy':'friend 1','lent':14},
                          2:{'name':'Expense name 2','group':'group 2','year':2017,'month':'DEC','day':31,
                            'paidBy':'friend 1',paid:84,'lentBy':'friend 2','lent':42},
                          3:{'name':'Expense name 3','group':'group 1','year':2018,'month':'JAN','day':31,
                            'paidBy':'friend 2',paid:55,'lentBy':'friend 2','lent':55},
                          4:{'name':'Expense name 1','group':'group 1','year':2017,'month':'DEC','day':25,
                            'paidBy':'friend 1',paid:14,'lentBy':'friend 1','lent':14},
                        };

        this.state =    { page:1 , signupLogin: 0, logged: false, err: 0, errorOpen: false,
                          users:usersList, friends:friendList, groups:groupsList};

        this.updateFriends.bind(this);
        this.updateGroups.bind(this);
        
        this.error.bind(this);
        this.setCookie.bind(this);
        this.getCookie.bind(this);
        //------------
        
        //this.componentWillMount();
    }
    componentWillMount(){
        var userCookie   = this.getCookie("username");
        var loggedCookie = this.getCookie("user_logged");
        var userAuth_token = this.getCookie("HASURA_AUTH_TOKEN");
        var hasura_cookie = this.getCookie("hasura_id");
        if(loggedCookie){
            this.setState({logged:true});//that.state.auth = true;
            this.user.username = userCookie;
            this.user.hasura_id = hasura_cookie;//console.log(this.user);
            this.APPcomponentWillMount();
        }
    }
    //---- after construction mounting will take place
    APPcomponentWillMount(){
        this.updateFriends();
        this.updateGroups();
    }
//----------   update friends after adding new friends or on mounting    
    updateFriends(){
        var that = this;
        var tmpAllUsersList = {};
        var potentialFriendsList = {};
        var tmpUsersList = {};
        var tmpFriendList = {};

        //--- common for most of the calls
        var fetchAction =  require('node-fetch');
        var url = "https://data.bathtub62.hasura-app.io/v1/query";
        var requestOptions = { "method": "POST", "headers": { "Content-Type": "application/json" } };

        var body = {
            "type": "select",
            "args": {
                "table": "users", "columns": [ "username" ]
            }
        };
        requestOptions.body = JSON.stringify(body);
        fetchAction(url, requestOptions)
        .then(function(response) {
            return response.json();
        })
        .then(function(result) {                            //console.log(result);
            for(let i=0,j=1; i < result.length; i++,j++){
                tmpAllUsersList[j] = result[i].username;
            }
            //---We have list of all users now we will fetch existing friends of current user
            var body = {
                "type": "select",
                "args": {
                    "table": "friends",
                    "columns": [
                        "total_friends",
                        "friend_username_1","friend_username_2","friend_username_3","friend_username_4","friend_username_5",
                        "friend_username_6","friend_username_7","friend_username_8","friend_username_9","friend_username_10"
                    ],
                    "where": { "user_id": { "$eq": that.user.hasura_id } }
                }
            };
            requestOptions.body = JSON.stringify(body);
            fetchAction(url, requestOptions)
            .then(function(response) {
                return response.json();
            })
            .then(function(result) {                                //console.log(result);
                that.state.noOfFriends = result[0].total_friends; //try a setState here
                var tmpStr = "friend_username_";
                for(let i=0,j=1; i < that.state.noOfFriends; i++,j++){
                    let tmpCol = tmpStr + j;
                    tmpFriendList[j] = result[0][tmpCol];
                }
                that.setState({friends:tmpFriendList});
                //--- this is the list of all existing friends
                //--- next we will show potential friends  = users who aren't already friends
                var TMPusers   = tmpAllUsersList;
                var TMPfriends = that.state.friends;
                
                var k = 1;
                for(let i=1; i<=Object.keys(TMPusers).length; i++){
                  let check = 0;
                  for(let j=1; j<=Object.keys(TMPfriends).length; j++){
                    if((TMPusers[i]===TMPfriends[j])||(TMPusers[i]===that.user.username)){
                      check = 1;
                    }
                  }
                  if(check===0){
                    potentialFriendsList[k] = TMPusers[i];
                    k++;
                  }
                }
                //console.log(potentialFriendsList);         
                that.setState({users:potentialFriendsList});
            })
            .catch(function(error) {
                console.log('Request Failed:' + error);
            });
            //------------
        })
        .catch(function(error) {
            console.log('Request Failed:' + error);
        });
    }
//----------- end of update friends   
//----------- updating the groups in a similar way 
    updateGroups(){
        var that = this;
        var tmpGroupsList = {};
        //------- getting names of all  the groups an user is associated with
        var fetchAction =  require('node-fetch');
        var url = "https://data.bathtub62.hasura-app.io/v1/query";
        var requestOptions = {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer e738169cbb0ebbf3c89f96881ed6e549a3c79977bbff1f97"
            }
        };
        var queryString = "SELECT group_name FROM groups WHERE member_username_1='"+that.user.username
                            +"' OR member_username_2='"+that.user.username
                            +"' OR member_username_3='"+that.user.username
                            +"' OR member_username_4='"+that.user.username
                            +"' OR member_username_5='"+that.user.username
                            +"';";
        var body = {
            "type": "run_sql",
            "args": { "sql": queryString }
        };
        requestOptions.body = JSON.stringify(body);
        fetchAction(url, requestOptions)
        .then(function(response) {
            return response.json();
        })
        .then(function(result) {
            //console.log(result);
            //console.log(result.result.length-1);
            var groups_current_user = result.result.length;//var groups_current_user = result.result.length-1;
            for(let k=1; k < groups_current_user; k++){
                tmpGroupsList[k] = result.result[k][0];
            }
            // update state here
            //tmpGroupsList = { 1:'group  1', 2:'group  2', 3:'group  3'};
            that.setState({groups:tmpGroupsList});
            console.log(that.state.groups);
        })
        .catch(function(error) {
            console.log('Request Failed:' + error);
        });
    }
//----------- end of component will mount


    onTitleClick(){
        this.setState({page:0});
        console.log(this.state.page);
    }
    signupPage(){   this.setState({signupLogin: 0});    }
    loginPage(){    this.setState({signupLogin: 1});    }
    
    ValidateEmail(mail)   
    {  
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))  {  return (true);  }   
        return (false);  
    }  
    error = (val) => {
        this.setState({ errorOpen: true});
        this.setState({err: val}, function(){console.log("error in app.js - "+this.state.err);});
    };
    
    handleError1Click = () => {
        this.setState({errorOpen: false});
    };
    handleError2Click = () => {
        this.setState({errorOpen: false});
        alert('Re-type : both username and password manually');
    };
    handleErrorRequestClose = () => {
        this.setState({errorOpen: false});
    };
//--------- API CALLS SIGNUP
    signup = (newUser) => {
        //console.log(newUser);
        if((newUser.username==='')||(newUser.email==='')||(newUser.password==='')){
            this.error(3);
        }
        else if((newUser.password).length < 8){
            this.error(5);
        }
        else if(!this.ValidateEmail(newUser.email)){
            this.error(1);
        }
        else{
            var that = this;
            var fetchAction =  require('node-fetch');
            var url = "https://auth.bathtub62.hasura-app.io/v1/signup";
            var res_username,res_username1,res_role, res_password,res_password1, res_id, res_e;
            var requestOptions = {
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json"
                }
            };
            var body = {
                "provider": "username",
                "data": {
                    "username": newUser.username,
                    "password": newUser.password
                }
            };
            requestOptions.body = JSON.stringify(body);
            fetchAction(url, requestOptions)
            .then(function(response) {
                return response.json();
            })
            .then(function(result) {
                console.log(result);
                //console.log(JSON.stringify(result.hasura_id));
                res_username1= JSON.stringify(result.username);
                res_username= res_username1.substring(1,res_username1.length-1);
                res_password1= JSON.stringify(body.data.password);
                res_password= res_password1.substring(1,res_password1.length-1);
               
                res_id= JSON.stringify(result.hasura_id);
                res_role=JSON.stringify(result.hasura_roles[0]).substring(1,JSON.stringify(result.hasura_roles[0]).length-1);
            })
            .then(function(result)
            {
                var fetchAction =  require('node-fetch');
                //var obj = result;
                var url = "https://data.bathtub62.hasura-app.io/v1/query";
                var requestOptions = {
                    "method": "POST",
                    "headers": {
                        "Content-Type": "application/json"
                    }
                };
                //console.log("role= "+ res_role);
                var body = {
                    "type": "insert",
                    "args": {
                        "table": "users",
                        "objects": [
                            {
                                "email": newUser.email,
                                "password": res_password,
                                "avatar": null,
                                "user_id": res_id,
                                "total_balance": "0",
                                "user_owes": "0",
                                "user_owed": "0",
                                "username": res_username,
                                "role": res_role
                            }
                        ]
                    }
                };
                requestOptions.body = JSON.stringify(body);
                fetchAction(url, requestOptions)
                .then(function(response) {
                    return response.json();
                })
                .then(function(result) {
                    console.log(result);
                    that.setState({signupLogin: 1});
                    //------- add an empty row in friends
                    var fetchAction =  require('node-fetch');
                    var url = "https://data.bathtub62.hasura-app.io/v1/query";
                    var requestOptions = {
                        "method": "POST",
                        "headers": {
                            "Content-Type": "application/json"
                        }
                    };
                    var body = {
                        "type": "insert",
                        "args": {
                            "table": "friends",
                            "objects": [ { "total_friends": "0", "user_id": res_id } ]
                        }
                    };
                    requestOptions.body = JSON.stringify(body);
                    fetchAction(url, requestOptions)
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(result) {
                        console.log(result);
                    })
                    .catch(function(error) {
                        console.log('Request Failed:' + error);
                    });
                })
                .catch(function(error) {
                    console.log('Request Failed:' + error);
                });
            })
            .catch(function(error) {
                console.log('Request Failed:' + error);
            });
        }
    };
//-------- end up sign up
//-------- API CALL LOGIN
    login = (authUser) => {        
        //console.log(authUser);
        var that = this;
        var fetchAction =  require('node-fetch');
        var url = "https://auth.bathtub62.hasura-app.io/v1/login";
        var requestOptions = {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            }
        };
        var body = {
            "provider": "username",
            "data": {
                "username": authUser.username,
                "password": authUser.password
            }
        };
        requestOptions.body = JSON.stringify(body);
        fetchAction(url, requestOptions)
        .then(function(response) {
            return response.json();
        })
        .then(function(result) {
            //console.log(result);
            if(result.code === "invalid-creds"){
                that.error(2);
            }
            else{
                //console.log(result);
                that.state.auth = true;
                that.user.username = result.username;
                that.user.hasura_id = result.hasura_id;
                //console.log(that.user);
                var authToken = result.auth_token;
                var hasura_id = result.hasura_id;
                //console.log('authenticated user');
                that.setCookie("username",that.user.username,1);
                that.setCookie("user_logged",true,1);
                that.setCookie("HASURA_AUTH_TOKEN",authToken,1);
                that.setCookie("hasura_id",hasura_id,1);
                that.setState({logged: true});
                that.updateFriends();//that.APPcomponentWillMount();
                that.updateGroups();
            }
        })
        .catch(function(error) {
            console.log('Request Failed:' + error);
        });
        //this.setState({page: 2});   
    };
//---- end of  login
    logout(){
        var that = this;
        var user_auth_token = this.getCookie("HASURA_AUTH_TOKEN");

        var fetchAction =  require('node-fetch');
        var url = "https://auth.bathtub62.hasura-app.io/v1/user/logout";
        var authorization  = "Bearer ".concat(user_auth_token);
        //console.log(authorization);
        var requestOptions = {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": authorization
            }
        };
        fetchAction(url, requestOptions)
        .then(function(response) {
            return response.json();
        })
        .then(function(result) {
            //console.log(result);
            that.setCookie("hasura_id",0,0);
            that.setCookie("username","",0);
            that.setCookie("user_logged",false,0);
            that.setCookie("HASURA_AUTH_TOKEN",null,0);
            that.setState({logged: false, signupLogin: 1}); 
        })
        .catch(function(error) {
            console.log('Request Failed:' + error);
        });  
    };
//----------   end of logout
//----------- and new bill  and update all  logs and the user accounts
    addBill = (billDetails) => {
        console.log(billDetails);
    };
//----------   add new friends
    addFriends = (newFriends) => {
        var that = this;
        //console.log(newFriends);
        var selected_friends =  newFriends;
        var selected_friends_id=[]; // this array will contain the retrieved ids of the friends

        if((that.state.noOfFriends + selected_friends.length) >10){
            this.error(6);
        }
        else{
            //------- step 1 : get corresponding ids of all selected users from the list of potential friends
            var fetchAction =  require('node-fetch');
            var url = "https://data.bathtub62.hasura-app.io/v1/query";
            var requestOptions = {
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json"
                }
            };

            for(let i=0; i < selected_friends.length; i++){
                var body = {
                    "type": "select",
                    "args": {
                        "table": "users",
                        "columns": [
                            "user_id"
                        ],
                        "where": {
                            "username": {
                                "$eq": selected_friends[i]
                            }
                        }
                    }
                };
                requestOptions.body = JSON.stringify(body);
                fetchAction(url, requestOptions)
                .then(function(response) {
                    return response.json();
                })
                .then(function(result) {
                    selected_friends_id[i]=result[0].user_id;
                    //console.log(selected_friends_id);
                    //------- step 2 : inserting the id, username pairs of new friends for current-user
                    if(i === (selected_friends.length - 1)){
                        let col_name_1 = "friend_user_id_";
                        let col_name_2 = "friend_username_";
                        let friend_counter = that.state.noOfFriends;
                        for(let j=0; j < selected_friends.length; j++){
                            friend_counter++;
                            let COL_friend_user_id  = col_name_1 + friend_counter;
                            let COL_friend_username = col_name_2 + friend_counter;
                            var c1  = JSON.stringify(COL_friend_user_id);
                            var c1  = JSON.stringify(COL_friend_user_id);
                            //console.log(COL_friend_username);
                            var body = {
                                "type": "update",
                                "args": {
                                    "table": "friends",
                                    "where": { "user_id": { "$eq": that.user.hasura_id  } },
                                    "$set": {
                                        [COL_friend_user_id]  :  selected_friends_id[j],
                                        [COL_friend_username] : selected_friends[j]
                                    }
                                }
                            };
                            requestOptions.body = JSON.stringify(body);
                            fetchAction(url, requestOptions)
                            .then(function(response) {
                                return response.json();
                            })
                            .then(function(result) {
                                console.log(result);
                                //------- step 3 : when  all the insertions are done update the total_friends
                                var total_friends_update = that.state.noOfFriends + selected_friends.length;
                                if(j === (selected_friends.length - 1)){
                                    var body = {
                                        "type": "update",
                                        "args": {
                                            "table": "friends",
                                            "where": { "user_id": { "$eq": that.user.hasura_id } },
                                            "$set":  { "total_friends" : total_friends_update }
                                        }
                                    };
                                    requestOptions.body = JSON.stringify(body);
                                    fetchAction(url, requestOptions)
                                    .then(function(response) {
                                        return response.json();
                                    })
                                    .then(function(result) {
                                        console.log(result);
                                        //------- step 4 : update ui to display new friends
                                        // and remove them from list of potential friends
                                        that.state.noOfFriends = total_friends_update;
                                        console.log("updated no of friends : "+that.state.noOfFriends);
                                        that.updateFriends();//that.APPcomponentWillMount();
                                        that.error(1001);
                                    })
                                    .catch(function(error) {
                                        console.log('Request Failed:' + error);
                                    });
                                }
                                //-------------------------------------------
                                //--- update other users' friend-list as well
                            })
                            .catch(function(error) {
                                console.log('Request Failed:' + error);
                            });
                        }
                    }
                })
                .catch(function(error) {
                    console.log('Request Failed:' + error);
                });
            }    
        }
        // end of else i.e. when no of friends <=  10
        
    };
//---------- end of add friends
    addGroup = (groupName, groupMembers) => {
        var that = this;
        //console.log(groupName);
        //console.log(groupMembers);
        if(groupMembers.length <= 0){
            this.error(4);
        }
        else if(groupMembers.length > 4){
            this.error(7);
        }
        else{
            var group_name = groupName;
            var group_member_default = that.user.username;
            var group_members = groupMembers;
            var no_of_members = group_members.length + 1;
            
            var fetchAction =  require('node-fetch');
            var url = "https://data.bathtub62.hasura-app.io/v1/query";
            var requestOptions = {
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json"
                }
            };
            var body = {
                "type": "insert",
                "args": {
                    "table": "groups",
                    "objects": [
                        {
                            "group_name": group_name, "member_username_1": group_member_default,
                            "member_username_2": group_members[0],
                            "member_username_3": group_members[1],
                            "member_username_4": group_members[2],
                            "member_username_5": group_members[3],
                            "number_of_members": no_of_members
                        }
                    ]
                }
            };
            requestOptions.body = JSON.stringify(body);
            fetchAction(url, requestOptions)
            .then(function(response) {
                return response.json();
            })
            .then(function(result) {
                console.log(result);
                //-------- next : update users append to the group_ids for current user
                that.updateGroups();
                that.error(1002);
                //that.APPcomponentWillMount();
            })
            .catch(function(error) {
                console.log('Request Failed:' + error);
            });
        }
    };
//----------- end of add group

//------------- for handling cookies
    setCookie = (cname, cvalue, exdays) => {
	    var d = new Date();
	    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	    var expires = "expires="+d.toUTCString();
	    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
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
//------------ end of   cookie  handling
    render(){
        return(
            <div className="App">
                <MuiThemeProvider muiTheme={muiTheme}>
                <div>
                    <SplitWise  page={this.state.page}
                        onTitleClick={this.onTitleClick.bind(this)} signupLogin={this.state.signupLogin}
                        signupPage={this.signupPage.bind(this)}     loginPage={this.loginPage.bind(this)}
                        signup={this.signup.bind(this)}             login={this.login.bind(this)}               
                        logged={this.state.logged}                  username={this.user.username}
                        logout={this.logout.bind(this)}             account={this.account}
                        users={this.state.users}
                        friends={this.state.friends}                groups={this.state.groups}
                        log={this.log}                              
                        addBill={this.addBill.bind(this)}
                        addGroup={this.addGroup.bind(this)}         addFriends={this.addFriends.bind(this)}
                    />
                <div className="error-display">
                    {(this.state.err===1)
                        ?
                            <Snackbar
                                open={this.state.errorOpen}
                                message="Please enter email in correct format"
                                action="Try Again"
                                autoHideDuration={5000}
                                onActionClick={this.handleError1Click.bind(this)}
                                onRequestClose={this.handleErrorRequestClose.bind(this)}
                            />
                        :   <span></span>
                        }
                        {(this.state.err===2)
                        ?
                            <Snackbar
                                open={this.state.errorOpen}
                                message="Whoops! We couldn’t find an account for that username/password."
                                action="Re-type"
                                autoHideDuration={5000}
                                onActionClick={this.handleError2Click.bind(this)}
                                onRequestClose={this.handleErrorRequestClose.bind(this)}
                            />
                        :   <span></span>
                        }
                        {(this.state.err===3)
                        ?
                            <Snackbar
                                open={this.state.errorOpen}
                                message="All fields are required"
                                action="Try Again"
                                autoHideDuration={5000}
                                onActionClick={this.handleError1Click.bind(this)}
                                onRequestClose={this.handleErrorRequestClose.bind(this)}
                            />
                        :   <span></span>
                        }
                        {(this.state.err===4)
                        ?
                            <Snackbar
                                open={this.state.errorOpen}
                                message="You cannot form group without adding friends"
                                action="Re-select"
                                autoHideDuration={5000}
                                onActionClick={this.handleError1Click.bind(this)}
                                onRequestClose={this.handleErrorRequestClose.bind(this)}
                            />
                        :   <span></span>
                        }
                        {(this.state.err===5)
                        ?
                            <Snackbar
                                open={this.state.errorOpen}
                                message="Password must be at lest 9 characters long"
                                action="ok"
                                autoHideDuration={5000}
                                onActionClick={this.handleError1Click.bind(this)}
                                onRequestClose={this.handleErrorRequestClose.bind(this)}
                            />
                        :   <span></span>
                        }
                        {(this.state.err===6)
                        ?
                            <Snackbar
                                open={this.state.errorOpen}
                                message="Currently you can have atmost 10 friends"
                                action="ok"
                                autoHideDuration={5000}
                                onActionClick={this.handleError1Click.bind(this)}
                                onRequestClose={this.handleErrorRequestClose.bind(this)}
                            />
                        :   <span></span>
                        }
                        {(this.state.err===7)
                        ?
                            <Snackbar
                                open={this.state.errorOpen}
                                message="You can have atmost 5 members (including you)"
                                action="ok"
                                autoHideDuration={5000}
                                onActionClick={this.handleError1Click.bind(this)}
                                onRequestClose={this.handleErrorRequestClose.bind(this)}
                            />
                        :   <span></span>
                        }
                        {(this.state.err===1001)
                        ?
                            <Snackbar
                                open={this.state.errorOpen}
                                message="Selected friend(s) added successfully"
                                action="ok"
                                autoHideDuration={5000}
                                onActionClick={this.handleError1Click.bind(this)}
                                onRequestClose={this.handleErrorRequestClose.bind(this)}
                            />
                        :   <span></span>
                        }
                        {(this.state.err===1002)
                        ?
                            <Snackbar
                                open={this.state.errorOpen}
                                message="Group created successfully"
                                action="ok"
                                autoHideDuration={5000}
                                onActionClick={this.handleError1Click.bind(this)}
                                onRequestClose={this.handleErrorRequestClose.bind(this)}
                            />
                        :   <span></span>
                        }
                </div>                    
                </div>
                </MuiThemeProvider>
            </div>
        );
    }
}

export default App;

        // If you have the auth token saved in offline storage
        // var authToken = window.localStorage.getItem('HASURA_AUTH_TOKEN');
        // headers = { "Authorization" : "Bearer " + authToken }
        //that.setCookie("HASURA_AUTH_TOKEN",authToken,1);

        // If you have the auth token saved in offline storage
        // var authToken = window.localStorage.getItem('HASURA_AUTH_TOKEN');
        // headers = { "Authorization" : "Bearer " + authToken }
        // If you have the auth token saved in offline storage
        // var authToken = window.localStorage.getItem('HASURA_AUTH_TOKEN');
        // headers = { "Authorization" : "Bearer " + authToken }