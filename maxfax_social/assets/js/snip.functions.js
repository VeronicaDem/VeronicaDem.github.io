

async function requestGo(method, url=false, data={}, AT=true) {
		// AT -- отправить ли токен на обработку к серверу в этом запросе
		const response = await fetch(url, Object.assign( {
			method: method, // *GET, POST, PUT, DELETE, etc. 
			mode: 'cors', // no-cors, *cors, same-origin
			cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
			credentials: 'same-origin', // include, *same-origin, omit
			headers: {
				'Content-Type': 'application/json',
				'Authorization': AT ? GO.fn.responseToken() : false,
				'X-Bro': XBro,
			},
			redirect: 'follow', // manual, *follow, error
			referrerPolicy: 'no-referrer', // no-referrer, *client
		}, method=='GET' ? {} : {body: JSON.stringify(data)} ));
	//если не предусмотрено обработка токена в этом запросе то подставим из хранилища последний валидный токен	
	JWT = AT ? response.headers.get('Expires') : window.localStorage.getItem("authToken");
	//console.log('JWT : '+ JWT);
	$('#responseToken').html('<div>JWT : '+ cropText(JWT, 32) +'</div>');
	if (response.ok) {
		//GO.fn.responseTokenEND();
		console.log(response);
		//process jwt
		if(JWT){
				//обнуляем данные динамических форм в документе
				GO.fn.removeDynamicForm();	
			switch (JWT) {
			  case 'end':
						GO.fn.responseTokenEND();
				break;
			  case 'xxx':
						console.log('jwt-xxx');
				break;
			  default:
						window.localStorage.setItem("authToken", JWT);
						//console.log(JWT);
						//console.log('jwt-good');

						//$("#viewToken").html('<div>viewToken: '+ cropText(localStorage.authToken, 16) +'</div>'); 
						//$('#goApp').html('<button><a href="#" onclick=location.href="/">login</a></button><br>');
			}

		}else{
			if(isLogin){
			//console.log('no found token, or user no login');
			}
		}

	} else {//if server-error
		console.log("error HTTP: " + response.status);
		console.log(response);
	}
	//console.log(response);
	return await response.json(); // parses JSON response into native JavaScript objects
}


async function queryGo(api=[]){
	let uri = apiURI +'/'+ api.object +'/'+ api.method +'/'+ api.key;
	//console.log(api);
	requestGo(api.methodRequest, uri, api.dataRequest)
	  .then((d) => {
				switch (d.status_code) {
					case 200:

						switch (d.success.code) {
					//КОДЫ   ОШИБКИ		600-799
					//КОДЫ   ВАЛИДНЫЕ	800-999
					
							
							
					//ОШИБКИ КОДЫ ОТВЕТА
							case 602:
									toastOpen('нет! Этот username не валиден или уже им пользуется другой пользователь. Попробуйте подобрать еще', 'ok', 'top', 6000);
									$('form input[name="username"]').addClass('text-color-red');
							break;


					//ВАЛИДНЫЕ КОДЫ ОТВЕТА 
							case 800:
									//сохраним данные юзера 
									localStorage.setItem("dinamicData", JSON.stringify( d.success.data ));
									//localStorage.setItem("dataDOM", JSON.stringify( d.success.data ));
									
									//динамически изменим все данные в документе по обьекту
									LS.user = d.success.data;
									//выводим динамические данные в документ 
									GO.fn.getDynamicData( LS.user);


									let o = [];
									for(let index in LS.user) {
									  o += '<div>'+ index + " : " + LS.user[index] +' </div>'
									}
									$('#consoleLog').html(o)
									
									//если смена username успешна
									if(d.success.message == 'update.username'){
										//toastOpen('все ок! Ваш username я сменила успешно', 'ok', 'top', 3000);
										$('form input[name="username"]').removeClass('text-color-red');
									}
									
									
									//toastOpen('все ок! Я все успешно обновила', 'ok', 'top', 3000);

							break;
							case 801:
									toastOpen('все ок! Я все успешно сохранила', 'ok', 'top', 3000);
							break;
							case 803:
									toastOpen('для смены почтового адреса, следует ввести коды пришедшие на оба адреса.', 'ok', 'top', 5000);
							break;
							case 805:
									toastOpen('получила ошибку. Вероятно код не верный, или время истекло. Допускаю, что вы не верно набрали код - в таком случае попробуйте еще через 15 минут', 'error', 'top', 8000);
							break;
							case 810:
									$('#responseData').html('ping: '+ cropText(d.success.message, 44) +'');
							break;
							case 877:
									//сохраним данные юзера 
									window.localStorage.setItem("dinamicData", JSON.stringify( d.success.data.user ));
									
									window.localStorage.setItem("dataDOM", JSON.stringify( d.success.data));
									
									//удалим уже лишний код активации
									delete localStorage.codeConfirm;
									//перекинем на страницу
									window.location.replace("/");
							break;
							case 878:
									//получим пакет перевода и другие данные для DOM
									window.localStorage.setItem("dataDOM", JSON.stringify( d.success.data));
							break;
							default:
								console.log("server ok! no detect code : "+ d);

						}


					break;
					case 203:
							console.log(d);
					break;
					case 300:
							console.log(d);
					break;
					case 400:
							console.log(d);
							setTimeout(function () {
								toastOpen('Получила ошибку. Пробуйте еще несколько раз', 'error', 'top');
							}, 3000);
							
							if(d.error.code == 203){
								GO.fn.responseTokenEND();
							}

					break;
					default:
							console.log("server not : "+ d);
							
				}
		//console.log(d);
	  });
}




async function queryGoProcessFile(api=[]){
	app.dialog.preloader('ждем...');

	xhr = new XMLHttpRequest();
	xhr.open("POST", apiURI +'/process/x/x', true);
	xhr.setRequestHeader('Authorization', GO.fn.responseToken() );
	xhr.responseType = 'json';
	xhr.send(api);
	xhr.onreadystatechange = function () {
		if (this.readyState == 3) {
		// загрузка...
		}
		if (this.readyState == 4) {
			//ОТВЕТ ПОЛУЧЕН...
			//поместим ответ токен в глобальное хранилище
			JWT = xhr.getResponseHeader('Expires');
			JWT ? window.localStorage.setItem("authToken", JWT ) : window.localStorage.setItem("authToken", window.localStorage.getItem("authToken") );

			if (this.status == 200) {
				//console.log(xhr.response)
				queryGo(getLogin);
				app.dialog.close();
				toastOpen('файл изображения успешно добавлен.', 'ok', 'top', 3000);
			} else {
				//$loading.addClass("hidden").empty();
				//GO.fn.growl.expirable(GO.fn._s("An error occurred. Please try again later."));
			}
		}
	};
	return;
}



/*
async function queryGoProcessFile(api=[]){
  fetch(apiURI +'/process/x/x', {
    method: 'POST',
	headers: {
		'Authorization': window.localStorage.getItem("authToken") +':'+ XBro +':'+ window.localStorage.getItem("conterPlus")
	},
    body: upf
  })
  .then(response => response.json())
  .then(data => {
    console.log(data)
  })
  .catch(error => {
    console.error(error)
  })
}
*/



