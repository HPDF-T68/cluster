# Splitwise - clone app

•    This is a clone app of [Splitwise](https://www.splitwise.com/).

•    It is an app that makes it easy to split bills with friends and family. It allows you to organize all your shared expenses and IOUs in one place, so that everyone can see who they owe. 

•    It is a Minimum Viable Product(MVP) version of the original [Splitwise](https://www.splitwise.com/) web application. A Minimum Viable Product is the "version of a new product which allows a team to collect the maximum amount of validated learning about customers with the least effort."

## Salient features of the app

1. Users can sign up using "username - password" based registration.

2. Users can log in into their accounts, and will be authenticated with the help of "Hasura" Auth API.

3. After logging in, users can select from a list of other registered users on the app and add them to their friend-list.

4. Users can create groups of 3-4 members by selecting friends from their friend-list and can share/split their expenses equally with other members in the group.

5. Provision of uploading an image of the bill with the help of filestore API of Hasura.

6. Every logged in user is associated with a randomly generated "auth-token" which is unique for every login session and is used to maintain important user credentials in the Auth API.

## Workflow
Let us consider an example where a group of friends are out on a road trip and one of them pays the tolls. These tolls can later be equally divided amongst the group of friends and a suitable transaction log will be maintained for the same. A group consisting of these friends needs to be formed and the person needs to upload the bill as an attachment and split the expense equally with the members of the group. Each member will owe an amount equal to `total_bill_amount / no. of group members` to this user who has uploaded the bill. Not only group expense sharing but peer to peer bill splitting option and transaction management is also equally viable.
## Requirements
1.    [React-JS](https://reactjs.org/) for frontend

2.    [NodeJS- Express]( https://expressjs.com/) for backend

3.    [Hasura Auth API]( https://hasura.io/hub/project/hasura/auth-api-quickstart)

4.    [Hasura Data API]( https://docs.hasura.io/0.15/manual/reference/data/index.html)

5.    [Hasura filestore API]( https://docs.hasura.io/0.15/manual/reference/filestore/api.html)

6.    And other relevant [resources]( https://docs.hasura.io/0.15/manual/getting-started/index.html) provided by [Hasura](https://hasura.io/)

## Getting Started

>You can clone above remote repository to create a local copy on your computer and sync between the two locations.
Follow the instructions on the following link for the same, 
https://help.github.com/articles/cloning-a-repository/

### Prerequisites

>You need to install ```git bash``` if you are making use of Windows Operating system. 
https://www.youtube.com/watch?v=j70iLTSG0xg
Follow the video tutorial in the aforementioned link to successfully install ```git-bash``` on your machine.

>[Install hasura CLI](https://docs.hasura.io/0.15/manual/install-hasura-cli.html)


### Installing
Assuming that you have the local copy of this remote github repository after successful cloning. If not then please refer **"Getting started"** section above.

######
:point_right: Step 1: First enter the directory i.e. your local repository
![cd_dir](https://user-images.githubusercontent.com/30600211/35770151-15b90944-093c-11e8-9236-5f6bd511f0f8.PNG)

:point_right: Step 2: Type the following command to create a `package.json` file:
```
npm init
```
Press the Return/Enter key in response to all the questions to accept the default values **except "entry point" option**
For the **entry point** option the default value should be modified to:
```
entry point: (app.js)
```
![npm_init](https://user-images.githubusercontent.com/30600211/35749943-3789a628-0879-11e8-8716-859d17309884.PNG)
:point_right: Step 3: Type the following command to install the necessary react and other modules:
```
npm install
```
![npm_install](https://user-images.githubusercontent.com/30600211/35749949-3e7d7b9e-0879-11e8-9bdc-20b792097370.PNG)

**Note**: This might almost take a minute or so, be patient :innocent:

:point_right: Step 4: Type the following command to launch the react app and the app runs on the `port 3000` of the server by default. You can open any browser( preferably *Google chrome* ) and visit the URL http://localhost:3000
```
npm start
```
![npm_start](https://user-images.githubusercontent.com/30600211/35749955-428294b8-0879-11e8-9f47-f13672e5d6bc.PNG)

## Test your app locally
On visiting http://localhost:3000 , you can see the default page i.e. the SignUp page.
![2018-02-03 1](https://user-images.githubusercontent.com/30600211/35750668-c0dc7188-087b-11e8-8222-b997c2d9ee32.png)
### Steps to be followed
`NOTE: Following screenshots depict the app running on a hasura cluster and not locally. `
<br />
To deploy your own app and explore hasura clusters , refer these [docs](https://docs.hasura.io/0.15/manual/cluster/index.html).
>:arrow_right:Enter your credentials to SignUp/Register.

![1 signup](https://user-images.githubusercontent.com/30600211/35769850-ab903a96-0937-11e8-8df7-b17dc29bf1ed.png)





>:arrow_right:After sucessful registration you will be redirected to the login page, here you are expected to enter your valid credentials. The authentication of the users is handled by making API call to [Hasura Auth API]( https://hasura.io/hub/project/hasura/auth-api-quickstart).

![2 login](https://user-images.githubusercontent.com/30600211/35769854-b1039c98-0937-11e8-8c4e-15ab148db2ab.png)

:arrow_right:Here is your dashboard. You can view your profile details on right-top corner of this web page. All kinds of management i.e. adding friends to your friend-list from existing users of the app and forming new groups by selecting members of the group from your friend-list are done on the dashboard itself.

![3 new_account](https://user-images.githubusercontent.com/30600211/35769856-b3b376a2-0937-11e8-9957-207518e3d985.png)

:arrow_right:You can add friends to your friend-list by clicking on the **"+"** sign on the friends tab on the left hand side of the web page where you can later view your friend-list.

![4 add_friends](https://user-images.githubusercontent.com/30600211/35769858-b5900ada-0937-11e8-8d67-709e18efdb85.png)

:arrow_right:You can form new groups and add members to it from your existing friend-list by clicking on the **"+"** sign on the groups tab on the left hand side of the web page where you can later view list of groups that you are a part of.

![5 add_group](https://user-images.githubusercontent.com/30600211/35769859-b7c10b56-0937-11e8-8c20-b47feb303f2b.png)

![6 dashboard_after_adding_friends_groups](https://user-images.githubusercontent.com/30600211/35769860-ba498254-0937-11e8-884b-8d26ea76cc85.png)






:arrow_right:You can add an attachment in the form of an image of your bill with the bill details.





![7 add_bill](https://user-images.githubusercontent.com/30600211/35769861-bbf3626e-0937-11e8-92b5-dfd497b694a9.png)

![8 after_adding_bills](https://user-images.githubusercontent.com/30600211/35769862-bda371a8-0937-11e8-9cc7-ff8adc3c0f43.png)

![9 changes_on_others_dashboard](https://user-images.githubusercontent.com/30600211/35769863-bf42ca9a-0937-11e8-8fbb-03291624aab3.png)

:arrow_right:You can logout by clicking on your username tab on the top-right section of the dashboard. You will be redirected to the login page after successfully logging out.

![10 logout](https://user-images.githubusercontent.com/30600211/35770155-1c5b5bf8-093c-11e8-972b-8ad23412a8f1.png)

