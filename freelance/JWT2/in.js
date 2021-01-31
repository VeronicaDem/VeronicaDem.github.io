async function requestGo(method, url=false, data={}) {
	// Default options are marked with *
	const response = await fetch(url, Object.assign({
		method: method, // *GET, POST, PUT, DELETE, etc.
		mode: 'cors', // no-cors, *cors, same-origin
		cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		credentials: 'same-origin', // include, *same-origin, omit
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			'Authorization': localStorage.authToken,
		},
		redirect: 'follow', // manual, *follow, error
		referrerPolicy: 'no-referrer', // no-referrer, *client
		//credentials: 'include',
		// body data type must match "Content-Type" header
	}, method=='GET' ? {} : {body: JSON.stringify(data)}));
	let JWT = response.headers.get('Expires');
	console.log(JWT);
	if (response.ok) {
		//process jwt
		if(JWT){
			if(JWT == 'end'){
				console.log('jwt-end');
				delete localStorage.authToken;
				delete localStorage.loginData;
				window.location.replace("/gen.html");//go login
			}else{
				localStorage.authToken = JWT;
				console.log(JWT);
				console.log('jwt-good');
			}
		}else{
			console.log('server-bad-request');
			localStorage.authToken = localStorage.authToken;
		}
	} else {//if server-error
		localStorage.authToken = localStorage.authToken;
		console.log("error HTTP: " + response.status);
	}
	console.log(response);
	return await response.json(); // parses JSON response into native JavaScript objects
}
async function requestGo(method, url=false, data={}) {
	// Default options are marked with *
	const response = await fetch(url, Object.assign({
		method: method, // *GET, POST, PUT, DELETE, etc.
		mode: 'cors', // no-cors, *cors, same-origin
		cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		credentials: 'same-origin', // include, *same-origin, omit
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			'Authorization': localStorage.authToken,
		},
		redirect: 'follow', // manual, *follow, error
		referrerPolicy: 'no-referrer', // no-referrer, *client
		//credentials: 'include',
		// body data type must match "Content-Type" header
	}, method=='GET' ? {} : {body: JSON.stringify(data)}));
	let JWT = response.headers.get('Expires');
	console.log(JWT);
	if (response.ok) {
		//process jwt
		if(JWT){
			if(JWT == 'end'){
				console.log('jwt-end');
				delete localStorage.authToken;
				delete localStorage.loginData;
				window.location.replace("/gen.html");//go login
			}else{
				localStorage.authToken = JWT;
				console.log(JWT);
				console.log('jwt-good');
			}
		}else{
			console.log('server-bad-request');
			localStorage.authToken = localStorage.authToken;
		}
	} else {//if server-error
		localStorage.authToken = localStorage.authToken;
		console.log("error HTTP: " + response.status);
	}
	console.log(response);
	return await response.json(); // parses JSON response into native JavaScript objects
}
