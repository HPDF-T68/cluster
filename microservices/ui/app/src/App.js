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
        var usersList 	= {};
        var friendList 	= {};
        var groupsList 	= {};
        var log 		= {};

        this.user  =    { hasura_id:null, username: '', noOfFriends:0, avatar: 0};
        this.account =  { totalBalance: null, youOwe: null, youAreOwed: null};

        this.state =    { page:1 , signupLogin: 0, logged: false, err: 0, errorOpen: false,
                          users:usersList, friends:friendList, groups:groupsList, log:log};

        this.updateFriends.bind(this);
        this.updateGroups.bind(this);
        this.updateUserAccount.bind(this);
        this.updateUserlogs.bind(this);
		this.insertLog.bind(this);
		this.insertAccount.bind(this);
        this.setAvatar.bind(this);

        this.error.bind(this);
        this.setCookie.bind(this);
        this.getCookie.bind(this);
        //------------
        //this.componentWillMount();
    }
    //SWcomponentWillMount()
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
        this.updateUserAccount(); //get account balance of current user
        this.updateUserlogs();    //get the logs for current user
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
        var user_auth_token = this.getCookie("HASURA_AUTH_TOKEN");
        var authorization  = "Bearer ".concat(user_auth_token);
        var url = "https://data.bathtub62.hasura-app.io/v1/query";
        var requestOptions = { "method": "POST", 
                                "headers": {    "Content-Type": "application/json",
                                                "Authorization": authorization
                                            }
        };

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
        var user_auth_token = this.getCookie("HASURA_AUTH_TOKEN");
        var authorization  = "Bearer ".concat(user_auth_token);
        var url = "https://data.bathtub62.hasura-app.io/v1/query";
        var requestOptions = {
            "method": "POST",
            "headers": {    "Content-Type": "application/json",
                            "Authorization": authorization
            }
        };
        var body = {    "type": "select",
                        "args": {   "table": "groups",
                                    "columns": [    "group_name"    ],
                        "where": {
                            "$or": [
                                {   "member_username_1": {  "$eq": that.user.username   }   },
                                {   "member_username_2": {  "$eq": that.user.username   }   },
                                {   "member_username_3": {  "$eq": that.user.username   }   },
                                {   "member_username_4": {  "$eq": that.user.username   }   },
                                {   "member_username_5": {  "$eq": that.user.username   }   }
                            ]
                        }
                    }
        };
        requestOptions.body = JSON.stringify(body);
        fetchAction(url, requestOptions)
        .then(function(response) {
            return response.json();
        })
        .then(function(result) {
            //console.log(result);                        //console.log(result.result.length-1);
            var groups_current_user = result.length;    //var groups_current_user = result.result.length-1;

            for(let k=0; k < groups_current_user; k++){
                tmpGroupsList[k+1] = result[k]["group_name"];
            }
            // update state here
            //tmpGroupsList = { 1:'group  1', 2:'group  2', 3:'group  3'};
            that.setState({groups:tmpGroupsList});
            //console.log(that.state.groups);
        })
        .catch(function(error) {
            console.log('Request Failed:' + error);
        });
    }
// end of updating groups
//------------------ display the list of expenditures
    updateUserlogs(){
        var that = this;
        var user_owes_dollar = 0;
        var user_owed_dollar = 0;
        var logs = {};
        
		var fetchAction =  require('node-fetch');
        var user_auth_token = this.getCookie("HASURA_AUTH_TOKEN");
        var authorization  = "Bearer ".concat(user_auth_token);
		var url = "https://data.bathtub62.hasura-app.io/v1/query";
		var requestOptions = {  "method": "POST", 
                                "headers": {    "Content-Type": "application/json",
                                                "Authorization": authorization
                            } 
        };
		var body = { "type": "select",
		    "args": { "table": "logss",
		        "columns":["paid_by_username","paid_amount","lent_amount","year","date","month","bill_name","notes","group_name","file"],
		        "where": { "for_user_id": { "$eq": that.user.hasura_id }  }
		    }
		};		requestOptions.body = JSON.stringify(body);
		fetchAction(url, requestOptions).then(function(response) { return response.json(); })
		.then(function(result) {				//console.log(result);
			//fill the logs and calculate account
			for(let i = 0; i < result.length; i++){
				var tmpLog = {'name':null,'group':null,'year':null,'month':null,'day':null,'paidBy':null,
							  paid:null,'lentBy':null,'lent':null};

				tmpLog['name'] 		= result[i]['bill_name'];
				tmpLog['group'] 	= result[i]['group_name'];
				tmpLog['year'] 		= result[i]['year'];
				tmpLog['month'] 	= result[i]['month'];
				tmpLog['day'] 		= result[i]['date'];
				tmpLog['paidBy'] 	= result[i]['paid_by_username'];
				tmpLog['paid'] 		= result[i]['paid_amount'];
				tmpLog['lentBy'] 	= result[i]['paid_by_username'];
				tmpLog['lent'] 		= result[i]['lent_amount'];

				tmpLog['notes'] 	= result[i]['notes'];
				tmpLog['file_path'] = result[i]['file'];
				
				logs[i+1]  = tmpLog;
				if(result[i]['lent_amount'] === 0)	{ user_owed_dollar += result[i]['paid_amount']; }
				else								{ user_owes_dollar += result[i]['lent_amount']; }
			}
			that.account.youOwe     = user_owes_dollar;
 			that.account.youAreOwed = user_owed_dollar;
			that.setState({log:logs}, function(){console.log(that.state.log);})
		})
		.catch(function(error) { console.log('Request Failed:' + error); });
    }
//----- end of update log()
//------------------  displays the account status
    updateUserAccount(){
        var that = this;
        var user_auth_token = this.getCookie("HASURA_AUTH_TOKEN");
        var authorization  = "Bearer ".concat(user_auth_token);
        //get only total_balance
        var fetchAction =  require('node-fetch');

		var url = "https://data.bathtub62.hasura-app.io/v1/query";
		var requestOptions = { "method": "POST", 
                                "headers": {    "Content-Type": "application/json",
                                                "Authorization": authorization
                                            } 
                            };
		var body = {
		    "type": "select",
		    "args": { "table": "users", "columns": [ "total_balance" ],
		        "where": { "user_id": { "$eq": that.user.hasura_id } }
		    }
		};		requestOptions.body = JSON.stringify(body);
		fetchAction(url, requestOptions).then(function(response) { return response.json(); })
		.then(function(result) {				//console.log(result);
			that.account.totalBalance = result[0]["total_balance"];
		})
		.catch(function(error) { console.log('Request Failed:' + error); });
    }
//----- end of update account()
//----------- end of component will mount

    setAvatar = (avatar_no) => {
        console.log("app.js : set avatar")
        console.log(avatar_no);
    }

    dateTime(){
        var billTime = {};
        var today = new Date();
        var time = today.getTime();
        var date = today.getDate();
        var month = "";
        var mm = today.getMonth()+1;
        var year = today.getFullYear();
        switch(mm){
             case 1 :   month = "JAN";      break;
             case 2 :   month = "FEB";      break;
             case 3 :   month = "MAR";      break;
             case 4 :   month = "APR";      break;
             case 5 :   month = "MAY";      break;
             case 6 :   month = "JUN";      break;
             case 7 :   month = "JUL";      break;
             case 8 :   month = "AUG";      break;
             case 9 :   month = "SEP";      break;
             case 10 :  month = "OCT";      break;
             case 11 :  month = "NOV";      break;
             case 12 :  month = "DEC";      break;
        }
        billTime.date = date;
        billTime.month = month;
        billTime.year = year;
        billTime.time = time;
        //console.log(billTime);
        return (billTime);
    }
//  end of date time
	
	//--- start of inserting account
	insertAccount(accountDetails){					console.log(accountDetails);
		var that =  this;
        var user_auth_token = this.getCookie("HASURA_AUTH_TOKEN");
        var authorization  = "Bearer ".concat(user_auth_token);
		for(let i=0; i< accountDetails['user_id_list'].length ; i++){
			
			var user_total_balance = 0;
			var user_user_owes = 0;
			var user_user_owed = 0;
			//fetch
			var fetchAction =  require('node-fetch');
			var url = "https://data.bathtub62.hasura-app.io/v1/query";
			var requestOptions = { "method": "POST", 
                                   "headers": { "Content-Type": "application/json",
                                                "Authorization": authorization
                                } 
                            };
			var body = { "type": "select",
			    "args": { "table": "users",
			        "columns": [ "total_balance", "user_owed", "user_owes" ],
			        "where": {  "user_id": {  "$eq": accountDetails['user_id_list'][i] } }
			    }
			};									requestOptions.body = JSON.stringify(body);
			fetchAction(url, requestOptions).then(function(response) { return response.json(); })
			.then(function(result) {									//console.log(result);
				//current user
				if(accountDetails['user_id_list'][i] === that.user.hasura_id){
					user_total_balance = parseFloat(result[0]["total_balance"]); //+ logDetails.insert_paid_amount;
					user_user_owes     = parseFloat(result[0]["user_owes"]);
					user_user_owed     = parseFloat(result[0]["user_owed"]) + accountDetails['account_paid'];
					//update
					var body = { "type": "update",
					    "args": { "table": "users", "where": { "user_id": { "$eq": accountDetails['user_id_list'][i] } },
					        "$set": {
					            "total_balance": user_total_balance,
					            "user_owes": user_user_owes,
					            "user_owed": user_user_owed
					        }
					    }
					};									requestOptions.body = JSON.stringify(body);
					fetchAction(url, requestOptions).then(function(response) { return response.json(); })
					.then(function(result) { console.log(result); 
						//update display for current user
					})
					.catch(function(error) { console.log('Request Failed:' + error); });
				}
				else{
					user_total_balance = parseFloat(result[0]["total_balance"]); //- logDetails.insert_lent_amount;
					user_user_owes     = parseFloat(result[0]["user_owes"]) + (accountDetails['account_paid'] / accountDetails['user_id_list'].length);
					user_user_owed     = parseFloat(result[0]["user_owed"]);
					//update
					console.log("updating account for :"+(accountDetails['user_id_list'][i])+" "+user_total_balance+" "+user_user_owes);
					var body = { "type": "update",
					    "args": { "table": "users", "where": { "user_id": { "$eq": accountDetails['user_id_list'][i] } },
					        "$set": {
					            "total_balance": user_total_balance,
					            "user_owes": user_user_owes,
					            "user_owed": user_user_owed
					        }
					    }
					};									requestOptions.body = JSON.stringify(body);
					fetchAction(url, requestOptions).then(function(response) { return response.json(); })
					.then(function(result) { console.log(result); })
					.catch(function(error) { console.log('Request Failed:' + error); });
				}
			})
			.catch(function(error) { console.log('Request Failed:' + error); });
		}
	}
    //--- end   of account insert

	//--- start of inserting log
	insertLog(logDetails){					console.log(logDetails);
		var that =  this;
        var user_auth_token = this.getCookie("HASURA_AUTH_TOKEN");
        var authorization  = "Bearer ".concat(user_auth_token);
		console.log("inserting log for :"+logDetails.insert_for_user_id);
		var fetchAction =  require('node-fetch');
		var url = "https://data.bathtub62.hasura-app.io/v1/query";
		var requestOptions = { "method": "POST", 
                               "headers": { "Content-Type": "application/json",
                                            "Authorization": authorization
                                            } 
                            };
		var body = { "type": "insert",
		    "args": {
		        "table": "logss",
		        "objects": [
		            {
		                "year": logDetails.insert_year,
		                "group_name": logDetails.insert_group_name,
		                "notes": logDetails.insert_notes,
		                "paid_by_username": logDetails.insert_paid_by_username,
		                "bill_id": logDetails.insert_bill_id,
		                "date": logDetails.insert_date,
		                "paid_amount": logDetails.insert_paid_amount,
		                "lent_amount": logDetails.insert_lent_amount,
		                "month": logDetails.insert_month,
		                "for_user_id": logDetails.insert_for_user_id,
		                "file": logDetails.insert_file,
		                "bill_name": logDetails.insert_bill_name
		            }
		        ]
		    }
		};					requestOptions.body = JSON.stringify(body);
		fetchAction(url, requestOptions).then(function(response) { return response.json(); })
		.then(function(result) { 				//console.log(result);
            that.updateUserlogs();
		})
		.catch(function(error) { console.log('Request Failed:' + error); });
	
	}
	//--- end   of log insert
	
	
    onTitleClick(){
        //this.setState({page:0});
        //console.log(this.state.page);
        window.open("https://github.com/rounakpolley/", "_blank");
    }
    signupPage(){   this.setState({signupLogin: 0});    }
    loginPage(){    this.setState({signupLogin: 1});    }
    
    ValidateEmail(mail) {  
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))  {  return (true);  }   
        return (false);  
    }  
    error = (val) => {
        this.setState({ errorOpen: true});
        //this.setState({err: val}, function(){console.log("error in app.js - "+this.state.err);});
        this.setState({err: val});
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
            var user_auth_token = this.getCookie("HASURA_AUTH_TOKEN");
            var authorization  = "Bearer ".concat(user_auth_token);

            var fetchAction =  require('node-fetch');
            var url = "https://auth.bathtub62.hasura-app.io/v1/signup";
            var res_username,res_username1,res_role, res_password,res_password1, res_id, res_e;
            var requestOptions = {  "method": "POST",
                                    "headers": {    "Content-Type": "application/json",
                                                    "Authorization": authorization
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
                var user_auth_token = this.getCookie("HASURA_AUTH_TOKEN");
                var authorization  = "Bearer ".concat(user_auth_token);
                //var obj = result;
                var url = "https://data.bathtub62.hasura-app.io/v1/query";
                var requestOptions = {  "method": "POST",
                                        "headers": {    "Content-Type": "application/json",
                                                        "Authorization": authorization
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
                                "total_balance": "100",
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
                //that.updateUserAccount();
                //that.updateUserlogs();
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
        var fetchAction =  require('node-fetch');
        var url = "https://auth.bathtub62.hasura-app.io/v1/user/logout";

        var user_auth_token = this.getCookie("HASURA_AUTH_TOKEN");
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
    addBill = (billDetails) => {					//console.log(billDetails);
        var that = this;
        var billTime = this.dateTime();

        var noOfGroupMembers = 0;
        var allMemberUsername = {};
        var allMemberID = [];

        var accountDetails = {};
		var account_user_ids = [];
		var account_paid = billDetails.billAmount;


        //vars for the columns of logs
        var logDetails = {};
        logDetails.insert_bill_id          = billTime.time;
        logDetails.insert_for_user_id      = null;
        logDetails.insert_bill_name        = billDetails.billName;
        logDetails.insert_date             = billTime.date;
        logDetails.insert_month            = billTime.month;
        logDetails.insert_group_name       = billDetails.groupName;
        logDetails.insert_paid_by_username = that.user.username;
        logDetails.insert_paid_amount      = billDetails.billAmount;
        logDetails.insert_lent_amount      = 0;
        logDetails.insert_notes            = billDetails.notes;
        logDetails.insert_file             = billDetails.tmpFilepath;
        logDetails.insert_year             = billTime.year;
		//console.log(logDetails);
	//get all the group member username then their corresponding ids
		//fetch usernames
		var fetchAction =  require('node-fetch');
        var user_auth_token = this.getCookie("HASURA_AUTH_TOKEN");
        var authorization  = "Bearer ".concat(user_auth_token);
		var url = "https://data.bathtub62.hasura-app.io/v1/query";
		var requestOptions = {  "method": "POST", 
                                "headers": {    "Content-Type": "application/json",
                                                "Authorization": authorization
                            }    
        };
		var body = { "type": "select",
		    "args": { "table": "groups",
		        "columns": [ "number_of_members", "member_username_1", "member_username_2",
		            		 "member_username_3", "member_username_4", "member_username_5" ],
		        "where": { "group_name": { "$eq": billDetails.groupName} }
		    }
		};
		requestOptions.body = JSON.stringify(body);		fetchAction(url, requestOptions)
		.then(function(response) { return response.json(); })
		.then(function(result) {									//console.log(result);
			noOfGroupMembers     = result[0]["number_of_members"];
			allMemberUsername[1] = result[0]["member_username_1"];
			allMemberUsername[2] = result[0]["member_username_2"];
			allMemberUsername[3] = result[0]["member_username_3"];
			allMemberUsername[4] = result[0]["member_username_4"];
			allMemberUsername[5] = result[0]["member_username_5"];

			//fetch ids (no need to fetch for current_user)
			//--- start of for loop
			for(let i=1; i<=noOfGroupMembers; i++){
				
				if(allMemberUsername[i] != that.user.username){				//eliminate current_user
					var body = { "type": "select",
					    "args": { "table": "users", "columns": [ "user_id" ],
					        "where": { "username": { "$eq": allMemberUsername[i] } }
					    }
					};
					requestOptions.body = JSON.stringify(body);		fetchAction(url, requestOptions)
					.then(function(response) { return response.json(); })
					.then(function(result) {							//console.log(result);
						logDetails.insert_for_user_id = result[0]["user_id"];
						logDetails.insert_lent_amount = ( (logDetails.insert_paid_amount) / (noOfGroupMembers) ).toFixed(2);
                        
						account_user_ids[i] = logDetails.insert_for_user_id;
						//console.log(logDetails);
						that.insertLog(logDetails);
					})
					.catch(function(error) {
						console.log('Request Failed:' + error);
					});
				}
			}
			//--- end of for loop still in results of 1st api-call

			// call for current_user
				logDetails.insert_for_user_id = that.user.hasura_id;
				logDetails.insert_lent_amount = 0;
				that.insertLog(logDetails);

				account_user_ids[0] = parseInt(that.user.hasura_id);
				accountDetails = {'user_id_list':account_user_ids, 'account_paid':account_paid};
			
				//call  for ui update
		})
		.catch(function(error) { console.log('Request Failed:' + error); });
    };
//--- end of adding bills

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
            var user_auth_token = this.getCookie("HASURA_AUTH_TOKEN");
            var authorization  = "Bearer ".concat(user_auth_token);
            var url = "https://data.bathtub62.hasura-app.io/v1/query";
            var requestOptions = {
                "method": "POST",
                "headers": {    "Content-Type": "application/json",
                                "Authorization": authorization
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
            var user_auth_token = this.getCookie("HASURA_AUTH_TOKEN");
            var authorization  = "Bearer ".concat(user_auth_token);
            var url = "https://data.bathtub62.hasura-app.io/v1/query";
            var requestOptions = {
                "method": "POST",
                "headers": {    "Content-Type": "application/json",
                                "Authorization": authorization
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
            .then(function(result) {		//console.log(result);
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
                        logout={this.logout.bind(this)}             setAvatar={this.setAvatar}
                        account={this.account}                      users={this.state.users}
                        friends={this.state.friends}                groups={this.state.groups}
                        log={this.state.log}                              
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
