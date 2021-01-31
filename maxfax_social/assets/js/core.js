console.log(localStorage);
FO	= {};//form
url	= {};
LS	= {};//localStorage
sd	= {};//loginTrue
L10 = {};


/* 
console.log(location.protocol);//https:
console.log(location.hostname);//b.godialog.ru
console.log(location.pathname);//  /
console.log(location.hash);//#
console.log(location.href);//https://b.godialog.ru/

//console.log(md5(pathName));
//console.log(md2(pathName));
*/
//fas fa-people-arrows  --- dialog

let hostName = location.hostname;
let pathName = location.pathname;
let pathHASH = md5(pathName);//unic hash this page
let hostnameProtocol = document.location.protocol == "https:" ? "https" : "http";
//const apiHost = hostnameProtocol+'://'+ hostName +''; // этот домен
let appHost		= 'https://test.godialog.ru'; // домен app
let apiHost		= 'https://api.godialog.ru'; // домен поставщик API
let apiVersion	= 'v1';
let apiKey		= 'cfa6efe331fad9c4657c7557ff07c2b2';
let apiURI		= apiHost +'/api/'+ apiVersion +'/'+ apiKey +'';
let pathUSP		= apiHost +'/content/storage/users/';
let pathIMAGE	= apiHost +'/content/storage/images/';
let appLink		= appHost +'/#!/';

//уникальный идентификатор бро
const XBro = window.localStorage.getItem("XBro") && window.localStorage.getItem("XBro").length === 16 ? window.localStorage.getItem("XBro") : GO.fn.generate_random_string(16);

//счетчик - сколько юзер юзал экран сек
GO.fn.TimerCount();


//localStorage.setItem("XBro", XBro);



//является ли токен hex строкой  - проверка токена
let isAuthToken = window.localStorage.getItem("authToken") && window.localStorage.getItem("authToken").length > 32 ? true : false;
if(location.pathname != '/auth' && !isAuthToken){
	window.location.replace("/auth");//go login
}

LS.dataDOM = JSON.parse(window.localStorage.getItem("dataDOM"));
if(LS.dataDOM){
	LS.L10	= LS.dataDOM.L10;
	LS.user = LS.dataDOM.user;
}

//динамически обновим данные по юзеру 
LS.user = JSON.parse(window.localStorage.getItem("dinamicData"));

//если юзер авторизован 
let isLogin = isAuthToken && LS.user ? true : false;

//если есть токен и данные юзера
if( isLogin){
	//если мастер на своей площадке и этот обьект родной, то мастер суперАдмин
	isMaster = isLogin && LS.user.role == 'master' ? true : false;

	//выводим динамические данные в документ 
	GO.fn.getDynamicData( LS.user);
}

