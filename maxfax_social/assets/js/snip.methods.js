let auth_token = localStorage.authToken;
let xxx = {
		methodRequest : 'POST',
		object : 'users',
		method : 'test',
		key	   : 'xxx',
		dataRequest   : {
			form_area:	33905,
			form_email:	"test.gpu@mail.ru",
			form_fname:	"Иван Иванов1",
			form_pass:	"Aa123456789@",
			like: {
				object: "image",
				id: "dXiq"
			}
		}
	};
	

let getToken = {
		methodRequest : 'POST',
		object : 'users',
		method : 'test',
		key	   : 'tokenget',
		dataRequest   : {}
	};
let getUser = {
		methodRequest : 'POST',
		object : 'users',
		method : 'mult',
		key	   : 'bart',
		dataRequest   : {}
	};
let tokenCha = {
		methodRequest : 'POST',
		object : 'users',
		method : 'test',
		key	   : 'tokencha',
		dataRequest   : {}
	};
let serverPing = {
		methodRequest : 'POST',
		object : 'auth',
		method : 'ping',
		key	   : 'true',
		dataRequest   : {}
	};
let Logout = {
		methodRequest : 'POST',
		object : 'users',
		method : 'test',
		key	   : 'logout',
		dataRequest   : {}
	};
let getLogin = {
		methodRequest : 'POST',
		object : 'users',
		method : 'login',
		key	   : 'true',
		dataRequest   : {}
	};
let postOK = {
		methodRequest : 'POST',
		object : 'users',
		method : 'test',
		key	   : 'ok',
		dataRequest   : {aaa:111,bbb:222}
	};
let dataDOM = {
		methodRequest : 'GET',
		object : 'users',
		method : 'get-data-dom',
		key	   : 'true',
		dataRequest   : {}
	};
