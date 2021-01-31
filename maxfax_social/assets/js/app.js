

//$$('body').attr('style', 'display:block');



/**/
// Create the tabs views
let startView		= app.views.create('#view-start');
let mainView		= app.views.create('.view-main');
let categoriesView	= app.views.create('#view-categories');
let discoverView	= app.views.create('#view-discover');
let notificationView= app.views.create('#view-notification');
let pagesView		= app.views.create('#view-pages');

let Width = app.width;











		


// Function to scale cards when pushed
function activeCardTouch() {
    $$('.anim-touchstart').on('touchstart', function(e) {
        $$(this).addClass('card-scale');
    });
    $$('.anim-touchstart').on('touchend', function(e) {
        $$(this).removeClass('card-scale');
    });
    $$('.anim-touchstart').on('mousedown', function() {
        $$(this).addClass('card-scale');
    });
    $$('.anim-touchstart').on('mouseup', function() {
        $$(this).removeClass('card-scale');
    });

    $$('.swiper-slide a').on('click', function(e) {
        app.views.current.router.navigate($$(this).attr('data-href'));
    });
	
	
	
	//$$(document).on('page:init', '.page[data-name="start"]', function(e) { });
	if(isLogin){
		// #change: инкапсулировала getStatistics в событие ready
        $(document).ready(function() {
			getStatistics();
		});
		// #change end
		
		// #change: инкапсулировала данные о юзере в событие ready
		$(document).ready(function(e) {
		let delay = 6000;
		let timerId = setTimeout(function request() {
				requestGo('GET', apiURI +'/users/all/mix', {})
				  .then((userArray) => {
					if(userArray){
						delay = 100000;
						let uo=[]
						userArray.forEach((d) => {
						let cs = hexToRGB('#'+ d.csentiment);
						let sp = pathUSP + d.spUser + '/';
							uo +=   '<li id="userStoriesID'+ d.idUser +'" class="swiper-go-item">'+ 
										'<a href="/user/'+ d.username +'">'+
											'<div class="  " style="width:68px;height:68px;">'+
												'<img src="'+ sp + d.avatar +'.s.jpg" class="lazy  swiper-go-user-avatar  swiper-avatar-user-avatar" style="border:3px solid rgba('+ cs +',.3);">'+
												'<div class="usernsme">'+ cropText(d.nameUser, 7) +'</div>'+
											'</div>'+
										'</a>'+
									'</li>'
						})
						$$('#userArray').html( swiperBlock({data: uo, heigh:68}) );
						//$$('#userArrayEE').html( swiperBlock({data: uo, heigh:88}) );
					}
				});
			timerId = setTimeout(request, delay);
			//console.log(delay);
		}, delay)});
        // #change end


		let GET = GO.fn.objToGET({
			get		: "images,followers",
			triger	: isLogin ? LS.user.idUser : 0,
			cropImagesArr : 16,
			shuffleImages : true,
		});
		//let ww = app.width > 375 ? 375 : app.width
		let ww = 375
		let dfW = Math.round(ww / 3)
		let dfH = Math.round(dfW * 1.6)
		//непосредственно запрос на сервер 
        
		$(document).ready(()=> {
			
		  requestGo('GET', apiURI +'/images/all/x?'+ GET, {})
		  .then((userArray) => {
			if(userArray.length > 0){
				let uo=[]
				userArray.forEach((d) => {
				GO.fn.getDynamicData(d);
				let cs = hexToRGB('#'+ d.csentiment);
				let src = d.spImage + '.th.' + d.extensionImage;
					uo +=   '<li id="imageID'+ d.idImage +'" class="anim-touchstart swiper-go-item">\
								<a href="/image/'+ d.idImage +'">\
									<div class=" swiper-go-block" style="background-image: url('+ src +');width:'+ dfW +'px;height:'+ dfH +'px;">\
										<div class="top-action  text-shadow  share-actions"><i class="icon fas fa-ellipsis-v"></i></div>\
										<div class="user-info">\
											<img src="'+ d.spu + d.avatar +'.s.jpg" class="swiper-avatar-user box-shadow" style="background: #'+ d.csentiment +';">\
											<span class="  text-shadow" style="">'+ cropText(d.nameUser, 10) +'</span>\
										</div>\
									</div>\
								</a>\
							</li>'
							
					/*		
					uo +=   '<li id="imageID'+ d.idImage +'" class="swiper-go-item">\
								<a href="/image/'+ d.idImage +'">\
									<div class="swiper-go-block" style="background-image: url('+ src +');width:'+ dfW +'px;height:'+ dfH +'px;">\
										<div class="top-action">999</div>\
										<img src="'+ d.spu + d.avatar +'.s.jpg" class="swiper-go-user-avatar   swiper-avatar-user box-shadow" style="background: #'+ d.csentiment +';top:'+ (dfH - 46) +'px">\
										<span class="swiper-go-user-name  text-shadow" style="top:'+ dfH +'px;">'+ cropText(d.nameUser, 7) +'</span>\
									</div>\
								</a>\
							</li>'
					*/		
				})
				$$('#imageArray').html( swiperBlock({data: uo, heigh:dfH}) );
			}
		});
	}
		)};

	
	
	if(app.device.ios){
		//старый IOS
		let iosOld = app.device.osVersion.replace( /\./g, "," ) < '12.4.8'.replace( /\./g, "," ) ;
		if(iosOld && app.device.iphone){
			$$('.navbar-inner').css('top', '15px');
			$$('.title-container ').css('top', '55px');
			$$('.navbar-bg').css('height', '55px');
			$$('.swiper-users-stores').css('padding-top', '15px');
		}	
		
		/*
		console.log(iosOld)
		console.log(app.device)
		let q = [];
		for(var index in app.device) {
		  //console.log( index + " : " + items[index])
		  q += '<div>'+ index + " : " + app.device[index] +' </div>'
		}
		$$('#detectDeviceApp').append( q );
		*/
	}
	
	

	
}	//исключения


// Load the fonction on app init
activeCardTouch();  
  
// Load the function on new elements when a page is opened
app.on('pageInit', function(page) {
	activeCardTouch();
});









// Create searchbar
var searchbar = app.searchbar.create({
    el: '.searchbar',
    searchContainer: '.list',
    searchIn: '.item-title',
    customSearch: true,
    on: {
        search(sb, query) {
            if (query == '') {
                $$('.search-results').hide();
            } else {
                $$('.search-preloader').show();
                // Emulate 0.5s loading for the demo
                // You can do an Ajax request here
                setTimeout(function() {
                    $$('.search-preloader').hide();
                    $$('.search-results').show();
                }, 500);
            }
        },
        clear(sb, previousQuery) {
            $$('.search-results').hide();
        },
        disable(sb) {
            $$('.search-results').hide();
        }
    }
});

// Automatically fill in the search field when you click on a suggestion
$$('.page-search .popular-tags li').on('click', function(e) {
    searchbar.search($$(this).find('span').text());
})
$$('.page-search .trending-search ul li').on('click', function(e) {
    searchbar.search($$(this).find('.item-title a').text());
})



// Common options to all sliders
var swiperOptions = {
    spaceBetween: 10,
    touchMoveStopPropagation: false,
    on: {
        touchStart: function(e) {
            $$(e.target.closest('.card')).addClass('card-scale');
        },
        touchEnd: function(e) {
            $$(e.target.closest('.card')).removeClass('card-scale');
        }
    }
};


// Create the Discover tab sliders
var discoverSwiper = new Swiper('#discover-swiper', Object.assign({}, swiperOptions, {
    width: 320,
    autoplay: {
        delay: 3000
    }
}));
var discoverSwiper2 = new Swiper('#discover-swiper2', Object.assign({}, swiperOptions, {
    width: 260
}));
var discoverSwiper3 = new Swiper('#discover-swiper3', Object.assign({}, swiperOptions, {
    width: 360
}));
var discoverSwiper4 = new Swiper('#discover-swiper4', Object.assign({}, swiperOptions, {
    width: 66
}));
var discoverSwiper5 = new Swiper('#discover-swiper5', Object.assign({}, swiperOptions, {
    //width: 320
    width: Width > 420 ? 320 :  Width - 40
}));

// Create the Single and Single-2 sliders
$$(document).on('page:init', '.page[data-name="single"]', function(e, page) {
    var swiperEl = page.$el.find('#single-swiper')[0];
    var rpSwiper = new Swiper(swiperEl, Object.assign({}, swiperOptions, {
        width: 280
    }));
});
$$(document).on('page:init', '.page[data-name="single-2"]', function(e, page) {
    var swiperEl = page.$el.find('#single-swiper-2')[0];
    var rpSwiper2 = new Swiper(swiperEl, Object.assign({}, swiperOptions, {
        width: 280
    }));
});







$$(document).on('page:init', '.page[data-name="start"]', function(e) {   });
	// Dummy Content
	var songs = ['Yellow Submarine', 'Don\'t Stop Me Now', 'Billie Jean', 'Californication'];
	var authors = ['Beatles', 'Queen', 'Michael Jackson', 'Red Hot Chili Peppers'];
	// Pull to refresh content
	var $ptrContent = $$('.ptr-content');
	// Add 'refresh' listener on it
	$ptrContent.on('ptr:refresh', function (e) {
	  // Emulate 2s loading
	  setTimeout(function () {
		var picURL = 'https://cdn.framework7.io/placeholder/abstract-88x88-' + (Math.floor(Math.random() * 10) + 1) + '.jpg';
		var song = songs[Math.floor(Math.random() * songs.length)];
		var author = authors[Math.floor(Math.random() * authors.length)];
		var itemHTML =
		  '<li class="item-content">' +
			'<div class="item-media"><img src="' + picURL + '" width="44"/></div>' +
			'<div class="item-inner">' +
			  '<div class="item-title-row">' +
				'<div class="item-title">' + song + '</div>' +
			  '</div>' +
			  '<div class="item-subtitle">' + author + '</div>' +
			'</div>' +
		  '</li>';
		// Prepend new list element
		$ptrContent.find('#ul-prt').prepend(itemHTML);
		// When loading done, we need to reset it
		app.ptr.done(); // or e.detail();
	  }, 1000);
	});




$$(document).on('page:init', '.page[data-name="home"]', function(e) {   });
	// Pull to refresh on Today tab
	$$('.ptr-content').on('ptr:refresh', function(e) {
		// Emulate 1s loading
		// You can do an Ajax request here to retrieve your posts from a database
		setTimeout(function() {
			var html =
				'<div class="title-container">' +
				'<span class="title-date">Tuesday 19 March</span>' +
				'<h1>Just Now</h1>' +
				'</div>' +
				'<a href="/single/">' +
				'<div class="card">' +
				'<img class="card-image" src="https://api.godialog.ru/content/storage/images/20.04/18/e/Gspc/Gspc.md.jpg" alt="">' +
				'<div class="card-infos">' +
				'<h2 class="card-title">How to Get Your First Tattoo Right</h2>' +
				'<div class="card-bottom">' +
				'<div class="card-author">' +
				'<img class="card-author-image" src="https://api.godialog.ru/content/storage/users/m/hZb/av_1579784419.jpg" alt="">' +
				'<div>Camille Aline</div>' +
				'</div>' +
				'<div class="card-comments"><i class="icon ion-ios-text"></i>3</div>' +
				'</div>' +
				'</div>' +
				'</div>' +
				'</a>';

			// Prepend new list element
			$$('.ptr-content').find('#today-content').prepend(html);
			// Active cards animation to the new elements
			activeCardTouch();
			// When loading done, we reset it
			app.ptr.done();
		}, 1000);
	});



// Infinite scroll on Today tab
var allowInfinite = true;

$$('.infinite-scroll-content').on('infinite', function() {
    // Exit, if loading in progress
    if (!allowInfinite) return;
    allowInfinite = false;

    // Emulate 1s loading
    // (You can do an Ajax request here to retrieve your next posts)
    setTimeout(function() {
        allowInfinite = true;

        // Generate new items HTML for the demo
        var html =
            '<li>' +
            '<a href="/single/">' +
            '<div class="item-content">' +
            '<div class="item-media"><img src="img/thumb-15.jpg" width="44"/></div>' +
            '<div class="item-inner">' +
            '<div class="item-subtitle">Fashion</div>' +
            '<div class="item-title">Archery at the 2024 Olympic Games</div>' +
            '<div class="item-subtitle bottom-subtitle"><img src="img/authors/author-3.jpg">Jess Roxana</div>' +
            '</div>' +
            '</div>' +
            '</a>' +
            '</li>' +
            '<li>' +
            '<a href="/single/">' +
            '<div class="item-content">' +
            '<div class="item-media"><img src="img/thumb-16.jpg" width="44"/></div>' +
            '<div class="item-inner">' +
            '<div class="item-subtitle">Fashion</div>' +
            '<div class="item-title">Most Beautiful Beach of the Costa Brava</div>' +
            '<div class="item-subtitle bottom-subtitle"><img src="img/authors/author-2.jpg">Zorka Ivka</div>' +
            '</div>' +
            '</div>' +
            '</a>' +
            '</li>';

        // Append new items
        $$('#infinite-content').append(html);

        // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
        app.infiniteScroll.destroy('.infinite-scroll-content');

        // Remove preloader
        $$('.infinite-scroll-preloader').remove();
    }, 1000);
});


/*********************************************
All the code below is for the Pages tab.
You can remove elements that you do not need.
*********************************************/


// Create the Pages tab sliders
$$(document).on('page:init', '.page[data-name="slider-1"]', function(e) {
    var pagesSwiper = new Swiper('#pages-swiper', Object.assign({}, swiperOptions, {
        width: 320
    }));
})
$$(document).on('page:init', '.page[data-name="slider-2"]', function(e) {
    var pagesSwiper2 = new Swiper('#pages-swiper2', Object.assign({}, swiperOptions, {
        width: 260
    }));
})
$$(document).on('page:init', '.page[data-name="slider-3"]', function(e) {
    var pagesSwiper3 = new Swiper('#pages-swiper3', Object.assign({}, swiperOptions, {
        width: 360
    }));
})
$$(document).on('page:init', '.page[data-name="slider-4"]', function(e) {
    var pagesSwiper4 = new Swiper('#pages-swiper4', Object.assign({}, swiperOptions, {
        width: 280
    }));
})


// Pull to Refresh on Pages tab
$$(document).on('page:init', '.page[data-name="pull-to-refresh"]', function(e) {
    $$('#pages-ptr').on('ptr:refresh', function(e) {
        // Emulate 1s loading
        // You can do an Ajax request here to retrieve your posts from a database
        setTimeout(function() {
            var html =
                '<li>' +
                '<a href="/single/">' +
                '<div class="item-content">' +
                '<div class="item-media"><img src="img/thumb-25.jpg" width="44"/></div>' +
                '<div class="item-inner">' +
                '<div class="item-subtitle">Fashion</div>' +
                '<div class="item-title">The Best Diet for a Flatter Belly</div>' +
                '<div class="item-subtitle bottom-subtitle"><i class="icon ion-md-time"></i>2 hours ago</div>' +
                '</div>' +
                '</div>' +
                '</a>' +
                '</li>';

            // Prepend new list element
            $$('#pages-ptr').find('#pages-ptr-list').prepend(html);
            // When loading done, we reset it
            app.ptr.done($$('#pages-ptr'));
        }, 1000);
    });
});


// Infinite Scroll on Pages tab
$$(document).on('page:init', '.page[data-name="infinite-scroll"]', function(e) {
    var allowInfinite = true;
    $$('#pages-infinite-scroll').on('infinite', function() {
        // Exit, if loading in progress
        if (!allowInfinite) return;
        allowInfinite = false;

        // Emulate 1s loading
        // (You can do an Ajax request here to retrieve your next posts)
        setTimeout(function() {
            allowInfinite = true;

            // Generate new items HTML for the demo
            var html =
                '<li>' +
                '<a href="/single/">' +
                '<div class="item-content">' +
                '<div class="item-media"><img src="img/thumb-26.jpg" width="44"/></div>' +
                '<div class="item-inner">' +
                '<div class="item-subtitle">Fashion</div>' +
                '<div class="item-title">The Best Diet for a Flatter Belly</div>' +
                '<div class="item-subtitle bottom-subtitle"><i class="icon ion-md-time"></i>2 hours ago</div>' +
                '</div>' +
                '</div>' +
                '</a>' +
                '</li>';

            // Append new items
            $$('#pages-infinite-scroll-list').append(html);

            // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
            app.infiniteScroll.destroy('#pages-infinite-scroll');

            // Remove preloader
            $$('#pages-infinite-scroll .infinite-scroll-preloader').remove();
        }, 800);
    });
});


// Share Dialog feature
var shareActions = app.actions.create({
    buttons: [
        [{
                text: 'Share this on:',
                label: true
            },
            {
                text: 'Facebook',
                bold: true,
                onClick: function() {
                    window.open('https://www.facebook.com/', '_blank');
                }
            },
            {
                text: 'Twitter',
                bold: true,
                onClick: function() {
                    window.open('http://twitter.com/', '_blank');
                }
            },
            {
                text: 'Mail',
                bold: true,
                onClick: function() {
                    window.open('mailto:someone@example.com?Subject=Hello', '_blank');
                }
            }
        ],
        [{
            text: 'Cancel',
            color: 'red'
        }]
    ]
});

// Attach the Share Dialog event to all elements that have the share-actions class
$$('.share-actions').on('click', function() {
    shareActions.open();
});


// Notification feature / Create the notification
var myNotification = app.notification.create({
    icon: '<i class="icon ion-ios-notifications"></i>',
    title: 'Yui Template',
    subtitle: 'This is a mobile notification',
    text: 'Click (x) button to close me',
    closeButton: true,
});

// Attach the notification event to all elements that have the open-notification class
$$('.open-notification').on('click', function() {
    myNotification.open();
});










//console.log( app.device);
//console.log( apiURI);



//let items = app.device;
// #change добавила код в функцию getStatistics
// getStatistics получает статистику, видимую на главной странице
function getStatistics() {
let items = LS.user;
let o = [];
for(var index in items) {
  //console.log( index + " : " + items[index])
  o += '<div>'+ index + " : " + items[index] +' </div>'
}
$('#consoleLog').html(o)
}
// #change end

//console.log( app.form.getFormData ( '#my-form-two' )  )





//ВЫПАДАЮЩИЙ
/*
<div id="sheetModalCodeConfirm" class="sheet-modal sheet-modal-top" style="">
	<div class="toolbar toolbar-bottom"></div>
	<div class="sheet-modal-inner">
	  <div class="block" style="padding:30px 30px; text-align:center;">
		<p>введите код полученный на указаннный почтовый адрес</p>
		<div class="input-code-post"><input id="f-code" type="num"></div>
		<div><a id="sendCodeConfirm"  class="link">отправить</a></div>
	  </div>
	</div>
</div>
let dynamicSheet = app.sheet.create({
  el: '#sheetModalCodeConfirm',
  swipeToClose: true,
  backdrop: true,
});
//dynamicSheet.open();
*/









function notiOpen(msg="toast", type="error"){
	let noti = app.notification.create({
		icon: '<i class="icon ion-ios-notifications"></i>',
		title: 'Yui Template',
		subtitle: 'This is a mobile notification',
		text: 'Click (x) button to close me',
		closeButton: true,
	});
	noti.open();
}


function toastOpen(msg="toast", type="error", p="bottom", time=3000){
	let a={};
	if(type==="error")	a = {ico:'smiley', color:'red'};
	if(type==="ok")		a = {ico:'info', color:'white'};
	let toast = app.toast.create({
	  //icon: app.theme === 'ios' ? '<i class="f7-icons  color-'+ a.color +'">'+ a.ico +'</i>' : '<i class="material-icons">'+ a.ico +'</i>',
	  icon: app.theme === 'ios' ? '<i class="f7-icons eva-avatar"><div></div></i>' : '<i class="material-icons">'+ a.ico +'</i>',
	  text: 'Ева: ' + msg,
	  position: p,
	  closeButton: false,
	  closeTimeout: time,
	});
	toast.open();
}	





/*##########################  SIGN UP   */
$$("#clickAuth").on( "click", function() {

	FO.login = document.getElementById("f-login").value;
	//F.fname = document.getElementById("f-fname").value;
	FO.area = document.getElementById("f-area").value;
	//F.policy = document.getElementById("f-policy"); // !f['policy'].checked ||

	if(!FO.login || !FO.area || FO.area==0) {
		toastOpen('упс! Не все поля заполнены, или не корректны. А возможно вы не согласны с условиями. В таком случае повторим все сначала', 'error', 'bottom', 11000);
	}else{
		FO.login = GO.fn.translitRusLat( FO.login );
		if( GO.fn.Validate('SmartLogin', FO.login) ){
			
			  app.dialog.preloader('ждем...');
			  setTimeout(function () {
				app.dialog.close();
			  }, 2000);

			requestGo('POST', apiURI +'/auth/smartauth/auth',  FO )
			  .then((r) => {
				console.log(r);
				
				switch (r.status_code) {
				  case 200:
						//toastOpen('Браво! теперь введите код.', 'ok', 'center');
						$$('#formSignup').toggleClass('display-none');
						
						if(r.success.linkCode){
							
							localStorage.setItem("codeConfirm", r.success.linkCode);
							console.log( window.localStorage.getItem("codeConfirm"));
							$$('#codeSMS').toggleClass('display-none');
							//dynamicSheet.open();
						}
						//console.log(r);
					break;
				  case 103:
						toastOpen('данные не подходят', 'error', 'bottom', 4000);
					break;
				  case 400:
						toastOpen('он ругается на эти действия. Стоит все перепроверить', 'error', 'bottom', 6000);
						console.log(r);
					break;
				  default:
						console.log("server not");
				}
				//process response server
			});
			//console.log( f );
		}else{
			toastOpen('этот login не валиден', 'error');
		}
	}
});




/*##########################  CONFIRM CODE   */
$$("#clickCodeConfirm").on( "click", function() {
	FO.code = document.getElementById("f-code").value;

	if(!FO.code && FO['code'].length != 6) {
		//console.log("form null");
		//myNotification.open();
		toastOpen('не так! Пишите цифры сплошным текстом - 000000', 'error');
	}else{
		if(FO['code'].length === 6 && window.localStorage.getItem("codeConfirm")){
			
			  app.dialog.preloader('прожарка...');
			  setTimeout(function () {
				app.dialog.close();
			  }, 3000);

			console.log( FO.code);
			let sendCode = {
					methodRequest : 'GET',
					object : 'auth',
					method : 'codemail',
					key	   : 'send-code/'+ window.localStorage.getItem("codeConfirm") +'&code='+ FO.code,
					dataRequest : {}
				};
			queryGo(sendCode);
		}else{
			toastOpen('этот код не валиден', 'error');
		}
	}
});























//LIKE CLICK
$$(document).on('click', '.click-like', function(e) {
	e.preventDefault();
    $$(this).toggleClass('color-red');
	let my		= this.classList.contains('color-red');
	let like	= $$(this).attr('data-like');
	let owner	= $$(this).attr('data-owner');
	let obj		= $$(this).attr('data-object');
	let triger	= $$(this).attr('data-triger') || LS.user.idUser;
	//let count	= document.getElementById('likeImageCount'+ owner).innerText;
	let cid	= '#'+ obj +'LikeCount'+ owner;//унивесльный идентификатор счетчика по обьектам на странице 
	let count	= $$(cid).text();
	
	let q = {
		methodRequest : 'POST',
		object : 'process',
		method : 'x',
		key	   : 'x',
		dataRequest	: {
			action	: my ? 'like' : 'dislike',
			object	: obj,
			id		: owner
		}
	};
	//console.log(q )
	/**
	 * @todo спросить про запрос x, object = processType, готов он или нет 	 */
	//queryGo(q); 
	$$(cid).text( my ? ++count : --count );
});



//FOLLOW CLICK
$$(document).on('click', '.action-follow', function(e) {
	e.preventDefault();
    $$(this).toggleClass('follow-on');
    $$(this).text($$(this).text() == LS.L10.youSubscribe ? LS.L10.subscribe : LS.L10.youSubscribe);
	let follow	= $$(this).attr('data-follow');
	let owner	= $$(this).attr('data-owner');
	let obj		= $$(this).attr('data-object');
	let triger	= $$(this).attr('data-triger') || LS.user.idUser;
	let s		= $$(this).text() == LS.L10.youSubscribe ? 'follow' : 'unfollow';
		follow	= s=='follow' ? true : false
	let cid	= '#'+ obj +'FollowCount'+ owner;//унивесльный идентификатор счетчика по обьектам на странице 
	let count	= $$(cid).text();
	let q = {
		methodRequest : 'POST',
		object : 'process',
		method : 'x',
		key	   : 'x',
		dataRequest   : {
			action : s,//follow  unfollow
			object : "user",
			id : owner// на кого подписываемся

		}
	};
	//console.log( $$(this).text() )
	//console.log( s )
	//console.log( follow )
	//console.log( owner )
	//console.log( L10)
	queryGo(q);
	$$(cid).text( follow ? ++count : --count );
});



//WEB SHARE
$(document).on("click", ".webshare", function(e) {
    e.preventDefault();
    if (navigator.share == undefined) {
		/**
		 * @todo Web Share not supported вместо Web Share only possible...
		 */
        app.dialog.alert("Web Share only possible with https web sites");
    } else {
        let wstitle = $(this).attr('data-webshare-title') || app.name;
        let wstext;
        let textref = $(this).attr('data-webshare-textref') || app.name;
        if (textref) {
            wstext = $(textref).text() || '';
        }
        let url = window.location.href;
        let imgref = $(this).attr('data-webshare-imgref');
        if (imgref) {
            url = $(imgref).attr('src') || '';
        }
        navigator.share({
            title: wstitle,
            url: url,
            text: wstext
        })
    }
});






// DATA TRIGER METHODS
//***************************************


// The handly data-trigger. It will trigger click for elements with data-trigger
$(document).on("click", "[data-trigger]", function(e) {
	let trigger = $(this).data("trigger"),
		$target = $(!trigger.match(/^\#|\./) ? "#"+trigger : trigger);
		$target.click();
});

//BACKGROUND BUTTON UPLOAD
$(document).on("change", "[data-content=user-background-upload-input]", function (e) {
	e.preventDefault();
	e.stopPropagation();
	let file = $(this)[0].files[0];
	let upf = new FormData();
	upf.append("action",	"upload");
	upf.append("type",		"file");
	upf.append("what",		"background");
	upf.append("owner",		LS.user.owner);
	upf.append("source",	file);
		if( GO.fn.validFileUpload(file)){
			queryGoProcessFile(upf)
		}
});

//AVATAR BUTTON UPLOAD
$(document).on("change", "[data-content=user-avatar-upload-input]", function (e) {
	e.preventDefault();
	e.stopPropagation();
	let file = $(this)[0].files[0];
	let upf = new FormData();
	upf.append("action",	"upload");
	upf.append("type",		"file");
	upf.append("what",		"avatar");
	upf.append("owner",		LS.user.owner);
	upf.append("source",	file);
		if( GO.fn.validFileUpload(file)){
			queryGoProcessFile(upf)
		}
});






