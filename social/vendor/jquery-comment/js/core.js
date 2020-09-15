console.log(localStorage);


/* 
delete localStorage.authToken;
delete localStorage.loginData;

localStorage.authToken = false;
localStorage.loginData = false;

console.log(location.protocol);//https:
console.log(location.hostname);//b.godialog.ru
console.log(location.pathname);//  /
console.log(location.hash);//#
console.log(location.href);//https://b.godialog.ru/

//console.log(md5(pathName));
//console.log(md2(pathName));
*/

 


let hostName = location.hostname;
let pathName = location.pathname;
let pathHASH = "6666cd76f96956469e7be39d750cc7d9";//md5(pathName);//unic hash this page
let hostnameProtocol = document.location.protocol == "https:" ? "https" : "http";
//const apiHost = hostnameProtocol+'://'+ hostName +''; // СЌС‚РѕС‚ РґРѕРјРµРЅ
let apiHost = 'https://api.godialog.ru'; // РґРѕРјРµРЅ РїРѕСЃС‚Р°РІС‰РёРє API
let apiVersion = 'v1';
let apiKey = 'cfa6efe331fad9c4657c7557ff07c2b2';
let apiURI = apiHost +'/api/'+ apiVersion +'/'+ apiKey +'';


let tURL = apiURI +'/users/test/ok';//test

ls=[];//localStorage
sd=[];//loginTrue

let statusLogin=false;
let isMaster=false;
//let thisID;
ls.userLogin = JSON.parse(localStorage.getItem("loginData"));
ls.authToken = localStorage.authToken;

//РµСЃР»Рё РµСЃС‚СЊ С‚РѕРєРµРЅ Рё РґР°РЅРЅС‹Рµ СЋР·РµСЂР°
if(ls.authToken && ls.userLogin){
	statusLogin = !ls.userLogin.id_user ? false : true;
	//РµСЃР»Рё РјР°СЃС‚РµСЂ РЅР° СЃРІРѕРµР№ РїР»РѕС‰Р°РґРєРµ Рё СЌС‚РѕС‚ РѕР±СЊРµРєС‚ СЂРѕРґРЅРѕР№, С‚Рѕ РјР°СЃС‚РµСЂ СЃСѓРїРµСЂРђРґРјРёРЅ
	isMaster = ls.userLogin.role == 'master' /*&& ls.userLogin.id_user == thisID */ ? true : false;

	// from DATA
	sd['userAvatar']    = ls.userLogin.avatar_user;
	sd['userName']		= ls.userLogin.name_user;
	sd['userUsername']  = ls.userLogin.username;
	sd['userCreatorID'] = ls.userLogin.id_user;
	sd['userRole']		= ls.userLogin.role;
	sd['areaThisID']	= "areaThisID";
	sd['loginStatus'] 	= !ls.userLogin.id_user ? false : true;
}
