import muiTheme from './muiTheme.js';

const Styles = {
    flexRow:        {display:'flex', flexDirection:'row'},
    padding0:       {padding:0},
    appbarTitle:    {cursor: 'pointer', marginLeft: 200, width: 'wrap-content',
                     fontSize: 16, fontFamily: 'serif', letterSpacing: 4},
    hasuraLogo:     {width:220, height:200, marginTop:30},
    subheader:      {color:muiTheme.palette.subHeaderColor, fontWeight:100},
    appbarAvatar:   {marginRight:130, marginTop:0, width: 300, color: muiTheme.palette.primaryTextColor},
    labelText:      {textTransform: 'none', color: muiTheme.palette.primaryTextColor },
    LoginSignupImg: {height:200, marginLeft:420, marginTop:100, marginRight:60},
    LoginSignupDiv: {marginTop:70},

    flatLogin:      {lineHeight: '25px', height:25, borderRadius:5, marginTop:5, border:'1px solid #06b11a'},
    flatSignup:     {lineHeight: '25px', height:25, borderRadius:5, marginTop:5, border:'1px solid #de0000'},
    
    flatSignMeUp:   {height:50, fontSize:30, borderRadius:5, marginTop:5, border:'1px solid #de0000',
                    boxShadow: '0px 0px 3px #bfbfbf'},
    labelSignMeUp:  {textTransform: 'none', color: muiTheme.palette.primaryTextColor, fontSize:20,
                    textShadow: '0px -1px 0px #5d5d5d'},

    dashboardBanner:{backgroundColor:muiTheme.palette.banner,  padding:15},    
    dashboardMain:  {margin:'0px 5px 0px 20px', minHeight: '100vh'},
    dashboardBannerText:{fontSize:14, color:muiTheme.palette.subTextColor, display:'flex',
                        justifyContent:'space-around', textAlign:'center'},
    dashboardBannerMid: {padding:'0px 50px', borderLeft:'1px solid #9e9e9e', borderRight:'1px solid #9e9e9e'},

    dasboardFlatLabel:{textTransform: 'none', color: muiTheme.palette.primaryTextColor, fontSize:16},
    flatAddBill:    {lineHeight:'38px', height:'40px', borderRadius:5, marginTop:5, border:'1px solid #de0000'},
    flatSettleUp:   {lineHeight:'38px', height:'40px', borderRadius:5, marginTop:5, border:'1px solid #06b11a'},

    textFieldintro: {border: '1px solid #b1b0b0', borderRadius:5, fontSize: 35, width: 300, height: 50,
                     padding: '0px 4px', boxShadow: 'inset 0px 0px 3px #d3d3d3', color:'#acabab',},
    textFieldother: {border: '1px solid #b1b0b0', borderRadius:5, fontSize: 25, width: 300, height: 40,
                     padding: '0px 4px', boxShadow: 'inset 0px 0px 3px #d3d3d3'},
    dashboardHeader:{fontSize:'x-large', color: muiTheme.palette.subHeaderColor, fontWeight:700, letterSpacing:'1px',
                     verticalAlign:'sub', paddingLeft:10},
    dashboardMenuList:{display: 'inline-block', float: 'left', margin: '10px 0px 16px 0px'},
    menuDisabled:   {backgroundColor:'#EAEAEAFF',padding:'0px 10px', color:'#969696FF', border:'0px 0px 1px 0px red'},
    menuNav:        {color:'#6C6C6CFF'},
    menuNavSelected:{color:'#51b216'},
    account:        {lineHeight:'25px', color:muiTheme.palette.currency},

    listTimestamp:  {marginTop:-6, color:muiTheme.palette.primaryHeaderColor},
    listMonth:      {fontSize:'x-small', fontWeight:900},
    listDate:       {fontSize:'large'},
    listBill:       {fontSize:'35px',  color:muiTheme.palette.subTextColor, fontWeight:600},
    listPrimary:    {marginLeft:'10px', color:muiTheme.palette.subHeaderColor, fontWeight:'bold'},
    listSecondary:  {marginLeft:'10px', fontSize:'small', lineHeight:'25px', padding:'2px 5px', borderRadius:5,
                    color:muiTheme.palette.subTextColor, backgroundColor:muiTheme.palette.banner},
    listPayment:    {display:'flex',flexDirection:'row',height:'fit-content',width:'fit-content',marginTop:'5px',
                     marginRight:'15px'},
    listPayedBy:    {textAlign:'right',paddingRight:'20px'},
    listPayName:    {fontSize:'small',  color:muiTheme.palette.primaryHeaderColor},
    listPayAmt:     {fontWeight:'bold', color:'#5fcf00',lineHeight:'20px'},
    listLentAmt:    {fontWeight:'bold', color:'#f44b06',lineHeight:'20px'},
    listDivider:    {'marginTop':'0px'},

    addBillTitle:   {padding:'6px 24px', textAlign:'left', fontSize:'samll', fontWeight:600,
                     backgroundColor:muiTheme.palette.baseDark, color:muiTheme.palette.primaryTextColor},
    addBillContent: {width:'fit-content', maxWidth: 'none'},
    addBillBody:    {padding:'10px 20px 5px 20px',minHeight:300},
    addOtherBody:   {padding:'10px 20px 5px 20px', minWidth:300, minHeight:200},
    groupLabel:     {width:'max-content',marginTop:14},
    groupOption:    {width:180,marginTop:-10},

    flatModalCancel:{borderRadius:5, marginTop:5, border:'1px solid #de0000',marginRight:10},
    flatModalDone:  {borderRadius:5, marginTop:5, border:'1px solid #06b11a',marginRight:5},
    modalDivider:   {marginTop:'10px',marginBottom:'10px',marginLeft:'-5px',marginRight:'-5px'},

    asideBox:       {width:175, borderRadius:5, border:'1px solid #e8b38c', backgroundColor:'#f9ebe1', 
                     margin:'25px 0px 0px 20px', padding:'0px 10px 0px 5px', fontSize:'smaller',
                     color:muiTheme.palette.subTextColor},
    asideOther:     {width:175, borderRadius:5, border:'1px solid #7fa237', backgroundColor:'#b5ff26', 
                     margin:'15px 0px 0px 20px', padding:'0px 10px 0px 5px'},
    asideBoxLi:     {marginLeft:-15},
    asideLink:      {fontSize:'smaller', color:muiTheme.palette.subTextColor, textDecoration:'none'},
    disclaimer:     {color:muiTheme.palette.subHeaderColor, fontSize:'smaller', paddingLeft:8}
};
//  width: fit-content; margin: auto;
export default Styles;