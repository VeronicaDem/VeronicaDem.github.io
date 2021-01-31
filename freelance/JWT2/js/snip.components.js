$('#goSignUp').click(function() {
    goSignUp.dataRequest.auth_token = localStorage.authToken;
	goRequest(goSignUp) ;
});
$('#getUser').click(function() {
	queryGo(getUser);
});
$('#getToken').click(function() {
	/*
    getToken.dataRequest.auth_token = localStorage.authToken;
	goRequest(getToken);
	*/
	queryGo(getToken);
});
$('#tokenCha').click(function() {
    tokenCha.dataRequest.auth_token = localStorage.authToken;
	goRequest(tokenCha) ;
});
$('#getLogin').click(function() {
    //getLogin.dataRequest.auth_token = localStorage.authToken;
	//goRequest(getLogin) ;
	queryGo(getLogin);
});
$('#Logout').click(function() {
    delete localStorage.authToken;
    delete localStorage.loginData;
	//queryGo(Logout);
});


if(!ls.userLogin){
	$('#loginGen').html('<a href="#" onclick=location.href="/gen.html">login</a>');
}