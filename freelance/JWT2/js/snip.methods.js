let auth_token = localStorage.authToken;
let goSignUp = {
		methodRequest : 'POST',
		object : 'process',
		method : 'signup',
		key	   : 'true',
		dataRequest   : {
			auth_token: localStorage.authToken,
			form_area:	33905,
			form_email:	"test.gpu@mail.ru",
			form_fname:	"РРІР°РЅ РРІР°РЅРѕРІ1",
			form_pass:	"Aa123456789@",
			form_accept_policies: 0,
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
		dataRequest   : {auth_token: localStorage.authToken}
	};
let Logout = {
		methodRequest : 'POST',
		object : 'users',
		method : 'test',
		key	   : 'logout',
		dataRequest   : {auth_token: localStorage.authToken}
	};
let getLogin = {
		methodRequest : 'POST',
		object : 'users',
		method : 'login',
		key	   : 'true',
		dataRequest   : {auth_token: localStorage.authToken}
	};
