// Example POST method implementation:
async function postData(url = '', data = {}) {
// Default options are marked with *
const response = await fetch(url, {
method: 'POST', // *GET, POST, PUT, DELETE, etc.
mode: 'cors', // no-cors, *cors, same-origin
cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
credentials: 'same-origin', // include, *same-origin, omit
headers: {
'Content-Type': 'application/json'
// 'Content-Type': 'application/x-www-form-urlencoded',
},
redirect: 'follow', // manual, *follow, error
referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
body: JSON.stringify(data) // body data type must match "Content-Type" header
});
return response.json(); // parses JSON response into native JavaScript objects
}
// получить информацию о юзере
postData(apiURI +'/users/mult/bart', {})
.then((data) => {
console.log(data); // JSON data parsed by response.json() call
});

post('https://api.godialog.ru/api/v1/333/users/test/ok', {user: 'KrunalXXXXXXXXXXXXXXXXXXXXXXXX'})
.then(data => console.log(data))      // обрабатываем результат вызова response.json()
.catch(error => console.error(error))
// заголовок Authorization обязателен в запросе. Хранит токен 
function post(url, data) {
return fetch(url, {
credentials: 'same-origin',  // параметр определяющий передвать ли разные сессионные данные вместе с запросом
method: 'POST',              // метод POST
body: JSON.stringify(data),  // типа запрашиаемого документа
headers: new Headers({
'Authorization': localStorage.authToken,
}),
})
.then(response => response.json()) // возвращаем промис
}
/* 3 вариант */
async function requestGo(method, url=false, data={}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: method, // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization': localStorage.authToken,
      //'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *client
	//credentials: 'include',
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  }); 
  let JWT = response.headers.get('Expires');
  console.log(JWT);
	if (response.ok) {
	  //process jwt
	  if(JWT){
		  if(JWT == 'end'){
			console.log('jwt-end');
			delete localStorage.authToken;
			delete localStorage.loginData;
			//window.location.replace("/gen.html");//go login
		  }else{
			localStorage.authToken = JWT;
			console.log(JWT);
			console.log('jwt-good');
		  }
	  }else{
        // ошибка на сервере
		console.log('server-bad-request');
		
	  }
	} else {//if server-error
		
		console.log("error HTTP: " + response.status);
	}
	console.log(response);
  return await response.json(); // parses JSON response into native JavaScript objects
}




async function queryGo(api=[]){
	let uri = apiURI +'/'+ api.object +'/'+ api.method +'/'+ api.key;
	console.log(api);
	requestGo(api.methodRequest, uri, api.dataRequest)
	  .then((data) => {
			if(data.name_user){
				//$("#user").html('<div>'+ data.name_user +'</div><div><img src="'+ data.avatar_user +'.s.jpg" /></div>');
				//СЃРѕС…СЂР°РЅРёРј РґР°РЅРЅС‹Рµ СЋР·РµСЂР° 
				localStorage.setItem("loginData", JSON.stringify( data ));
				window.location.replace("/");
			}
		//console.log(data);
	  });
}