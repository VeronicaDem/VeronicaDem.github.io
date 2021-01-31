$(function() {
//проверка клиента - отправим пинг с заголовками и токкеном 
queryGo(serverPing);




$('#goSignUp').click(function() {
    goSignUp.dataRequest.auth_token = localStorage.getItem("authToken");
	goRequest(goSignUp) ;
});
$('#getUser').click(function() {
	queryGo(getUser);
});
$('#tokenCha').click(function() {
	goRequest(tokenCha) ;
});



$('#getToken').click(function() {
	queryGo(getToken);
});
$('#getLogin').click(function() {
	queryGo(getLogin);
});
$('#getDataDOM').click(function() {
	queryGo(dataDOM);
});
$$(document).on('click', '.click-logout', function(e) {
	GO.fn.responseTokenEND();
});
$$(document).on('click', '#serverPing', function(e) {
    queryGo(serverPing);
	//queryGo( xxx);
});



$("#idBro").html('Bro : '+ XBro);

if(isLogin){
	$("#viewToken").html('Stat : '+ cropText( window.localStorage.getItem("authToken"), 16));
}else{
	$('#loginGen').html('<a href="#" onclick=location.href="/gen.html">login</a>');
}
if(LS.userLogin){
	$('#goApp').html('<a href="#" onclick=location.href="/"  class="s-button button color-yellow">Go App</a>');
	
	let pap = '\
				<ul class="popular-authors">\
                   <li>\
                       <a href="/author/">\
                           <div class="author-image"><img src="'+ LS.userLogin.avatar_user +'.s.jpg" alt=""></div>\
                           <div class="author-infos">\
                               <div class="author-name">'+ LS.userLogin['name_user'] +'</div>\
                               <div class="author-description">@'+ LS.userLogin['username'] +'</div>\
                               <div class="author-description">'+ LS.userLogin['alfa_user'] +'</div>\
                           </div>\
                       </a>\
                   </li>\
               </ul>';
	
	$("#viewUser").html(pap); 
}

$("#path").html( cropText(pathHASH,10) );
//$(".textcomplete-dropdown").css({'position' : 'absolute', 'z-index':'100', 'display':'block', 'bottom':'0px', 'width':'100%'});   


if(pathName == '/auth'){
	requestGo('GET', apiURI +'/areas/all', {})
	  .then((a) => {
		//console.log(a);
		let o=[]
		a.forEach((d) => {
		o += '<option key="'+ d.nname +'" value="'+ d['id_area'] +'">'+ d.name +'</option>'//
		})
		$('#f-area').html('<option value="0">площадка не выбрана</option>' + o);
	});	
	
}


/*
//language
requestGo('POST', apiURI +'/users/lang/rus', {})
  .then((L10) => {
	window.localStorage.setItem("L10", JSON.stringify( L10));
	LS.L10 = JSON.parse(window.localStorage.getItem("L10"));
});
*/



/* && isLogin*/
//if(pathName != '/auth' && isLogin){
if( isLogin){
/*
	$$(document).on('page:init', 'html', function(e) {
		componentsSTART();
	});

*/






	// SEND FORM  Onchange
	function sendOnchangeForm( o={}){
		$$('form'+ o.aid).on('formajax:beforesend', function (e) {
			let data = e.detail.data; // Ajax response from action file

			let sendFormSetting = {
					methodRequest : 'POST',
					object : o.ob,
					method : o.me,
					key	   : o.ke,
					dataRequest : data
				};
			queryGo(sendFormSetting);
		  //console.log( data);
		});
	}

		
		
		
	//### THEME DARK
	//если нет в хранилище
	if(!localStorage.getItem("themeDark")) $('html').addClass('theme-dark');
	let toggleTheme = app.toggle.get('.toggle-theme');
	toggleTheme.on('change', function() {
		let isCheckedTheme = $$('.toggle-theme input').prop('checked');
		
		$$('html').toggleClass('theme-dark');
		
		localStorage.setItem("themeDark", isCheckedTheme ? 'dark' : false);
		//console.log( isCheckedTheme);
	});
	//если в хранилище тема дарк то добавим класс или удалим
	if(localStorage.getItem("themeDark")=='dark'){
		$$('html').addClass('theme-dark');
		$$('.toggle-theme input[type="checkbox"]').prop('checked', true);
	}else{
		$$('html').removeClass('theme-dark');
		$$('.toggle-theme input[type="checkbox"]').prop('checked', false);
	}
	//console.log( localStorage.getItem("themeDark"));



	//### COLOR 
	let currentTheme = window.localStorage.getItem("themeColor") ? window.localStorage.getItem("themeColor") : 'color-theme-blue';
	$$('html').addClass(currentTheme);
	$$('#'+ currentTheme).prop('checked', true);
	$$('[name="radio-color-theme"]').on('change', function(e) {
		let selectedTheme = $$('[name="radio-color-theme"]:checked').attr('id');
		$$('html').toggleClass(currentTheme + ' ' + selectedTheme);
		currentTheme = selectedTheme;
		window.localStorage.setItem("themeColor", currentTheme );
	});






	
	
	
	//user notifications 
	$$('[href="#view-notification"]').on('click', function() {
		requestGo('POST', apiURI +'/process/notifications/nota', {})
		  .then((un) => {
			console.log(un);
			$('#notificationsList').html( un.html );
		});
	});






	//перенести в response
	app.form.fillFromData('#send--user--settings-username', {username: LS.user.usernameo});

	sendOnchangeForm({aid:'#send--user--settings-rest',		ob:'users', me:'form', ke:'rest'});
	sendOnchangeForm({aid:'#send--user--settings-email',	ob:'users', me:'form', ke:'email'});
	sendOnchangeForm({aid:'#send--user--settings-username', ob:'users', me:'form', ke:'username'});


	//обновляем дерево по таймеру в цикле
	//GO.fn.TimerGetQueryUser( 120000 ); 
	//GO.fn.dataDOM( 10000 );//code 878

//console.log(  apiHost +'/ping.php?ping='+ LS.user.sp);
/**/ 
	//NOTIFICATION PING
	let delay = 500;
	let timerId = setTimeout(function request() {
	//... запрос..
		//requestGo('GET', apiURI +'/users/pingnotification/nota', {}).then((d) => {
		//requestGo('GET', apiHost +'/ping.php?ping='+ LS.user.sp, {}).then((d) => {
		requestGo('GET', pathUSP + LS.user.spUser +'/ping.json', {}, false).then((d) => {
		//$.getJSON(LS.user.usp +'ping.json', function(d) {
			n = d.notice;
			if(n['noti_count'] > 0){
				delay = 120000;
				$$('.ping-notification-time').text(n['noti_time']);
				$$('.ping-notification-noticount').addClass("top-btn-number on");
				$$('.ping-notification-noticount').html('<span class="badge color-red"><b class="text-color-white">'+ n['noti_count'] +'</b></span>');
			}else{
				delay = 60000;
				$$('.ping-notification-noticount').html("");
				$$('.ping-notification-noticount').removeClass("top-btn-number on");
			}
		});

	timerId = setTimeout(request, delay);
	//console.log(delay);
	}, delay);


















}






});