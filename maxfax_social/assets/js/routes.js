let routes =  [{
	/**/	
            path: '/',
            url: '/',
		
        },
	
        {
            path: '/single/',
            url: 'pages/single.html',
        },
        {
            path: '/single-2/',
            url: 'pages/single-2.html',
        },
        {
            path: '/single-elements/',
            url: 'pages/single-elements.html',
        },
        {
            path: '/author/:idUser',
            url: 'pages/author.html',
        },
		
		
		/*
		{
			path: '/login/',
			// Component Object
			component: {
			  template: `
				<div class="page">
					<div class="navbar">
						<div class="navbar-bg"></div>
						<div class="navbar-inner sliding">
							<div class="left">
								<a href="#" class="link back">
									<i class="icon icon-back"></i>
									<span></span>
								</a>
							</div>
							<div class="title">{{title}}</div>
						</div>
					</div>
				  
				  <div class="page-content">
					<a @click="openAlert" class="red-link">Open Alert</a>
					<div class="list simple-list">
					  <ul>
						{{#each names}}
						  <li>{{this}}</li>
						{{/each}}
					  </ul>
					</div>
				  </div>
				</div>
			  `,
			  style: `
				.red-link {
				  color: orange;
				}
			  `,
			  data: function () {
				return {
				  title: 'Component Page',
				  names: ['John', 'Vladimir', 'Timo'],
				  username: 'john.Doe',
				}
			  },
			  
			  methods: {
				openAlert: function () {
				  var self = this;
				  self.$app.dialog.alert('Hello world!');
				},
			  },
				on: {
				  pageMounted: function (e, page) {
					console.log('page mounted');
				  },
				  pageInit: function (e, page) {
					console.log(this.username); // -> 'johndoe'
				  },
				  pageBeforeIn: function (e, page) {
					console.log('page before in');
				  },
				  pageAfterIn: function (e, page) {
					console.log('page after in');
				  },
				  pageBeforeOut: function (e, page) {
					console.log('page before out');
				  },
				  pageAfterOut: function (e, page) {
					console.log('page after out');
				  },
				  pageBeforeUnmount: function (e, page) {
					console.log('page before unmount');
				  },
				  pageBeforeRemove: function (e, page) {
					console.log('page before remove');
				  },
				}
			},
		  },
		*/
		
		
		
        {
            path: '/signup/',
            componentUrl: 'signup',
        },
        {
             path:'/comments',
             componentUrl: './pages/comments.php'
         },
        {
            path:'/comments/:id',
            componentUrl : './pages/comments.php'
        },
		{
            path: '/login/',
            componentUrl: 'login',
        },
		
		
		
		
		{
			path: '/login-screen/',
		/*
		We can load it from url like:
		url: 'login-screen.html'
		But in this example we load it just from content string
		*/
		content: '\
		  <div class="page no-navbar no-toolbar no-swipeback">\
			<div class="page-content login-screen-content">\
			  <div class="login-screen-title">My App</div>\
			  <form>\
				<div class="list">\
				</div>\
				<div class="list">\
				  <ul>\
					<li><a href="#" class="list-button">Sign In</a></li>\
				  </ul>\
				  <div class="send-block"><textarea></textarea></div>\
				  <div class="block-footer">\
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. ###</p>\
					<p><a href="#" class="link back">Close Login Screen</a></p>\
				  </div>\
				</div>\
			  </form>\
		  </div>'
		},
		
		
		
		
		
		
		/*
        {
            path: '/user/:idUser',
            url: 'user',
        },
		*/
//USER PAGE
		{
			path: '/user/:key',
			async: function(routeTo, routeFrom, resolve, reject) {
			   let userName = routeTo.params.key;
			   //console.log(userName);
			   //console.log(routeTo);
			    let usp = false;
				let da = {
					userID: userName,
					triger: LS.user.idUser,
					storage: {
						user : pathUSP,
						image : pathIMAGE,
					},
					shareLink: appLink +'user/'+ userName,
				};
				//РіРѕС‚РѕРІРёРј СЃС‚СЂРѕРєСѓ Р·Р°РїСЂРѕСЃР°
				let GET = GO.fn.objToGET({
					get		: "images,followers",
					triger	: LS.user.idUser,
					cropImagesArr : 4,
					shuffleImages : true,
				});
				//РЅРµРїРѕСЃСЂРµРґСЃС‚РІРµРЅРЅРѕ Р·Р°РїСЂРѕСЃ РЅР° СЃРµСЂРІРµСЂ 
				requestGo('GET', apiURI +'/users/data-user-page/'+ userName +'?'+ GET, {}) 
				  .then((data) => {
					da.L10 = LS.L10
					usp = da.storage.user + data.spUser + '/'
					data.bg		= data.bg==false ? apiHost +'/content/storage/system/ubg-3.png' : usp + data.bg
					data.images	= data.images ? data.images : false
					da.followON	= data.triger.follow ? 'follow-on' : false
					da.iOwner	= da.triger == data.idUser ? true : false
					da.followTEXT	= da.followON ? da.L10.youSubscribe : da.L10.subscribe
					data.follows = data.followers + data.following
					
					data.imagesUser = data.imagesUser ? data.imagesUser : '<span style="opacity:0.5">'+ data.imagesUser +'</span>'
					data.follows = data.follows ? data.follows : '<span style="opacity:0.5">'+ data.follows +'</span>'
					
					resolve(
					   {
							componentUrl:'./pages/user'
					   },
					   {
							context: {
								d		: data,
								da		: da,
								storage	: {
									user  : usp,
									image : da.storage.image,
								},
						   }
					   }
					);
				})
		   },
			name: 'pages/user',
		},
		
//AREA PAGE		
		{
			path: '/area/:key',
			async: function(routeTo, routeFrom, resolve, reject) {
			   let keyArea = routeTo.params.key;
				let da = {
					storage: pathUSP,
					triger: LS.user.idUser,
					//shareLink: appLink +'image/'+ idIMG,
					teastArea: 'Area Name',
				};
				requestGo('GET', apiURI +'/areas/single/'+ keyArea, {})
				  .then((data) => {
					da.L10 = LS.L10
					da.nickCrop = cropText(data.nickName, 8)
					//console.log(da.deltaH)
					//console.log(app.width)
					resolve(
						{
							componentUrl:'./pages/area'
						},
						{
							context: {
								d  : data,
								da : da,
						   }
						}
					);
			   })
		   },
			name: 'pages/area',
		},

//IMAGE PAGE		
		{
			path: '/image/:key',
			async: function(routeTo, routeFrom, resolve, reject) {
			   let idIMG = routeTo.params.key;
				let da = {
					storage: pathUSP,
					triger: LS.user.idUser,
					shareLink: appLink +'image/'+ idIMG,
				};
				requestGo('GET', apiURI +'/images/single/'+ idIMG, {})
				  .then((data) => {
					da.coverIMG = data.spImage +'.md.'+ data.extensionImage
					da.deltaH = app.width / (data.wImage / data.hImage)
					da.deltaW = app.width
					data.triger.like = 1
					
					//console.log(da.deltaH)
					//console.log(app.width)
					resolve(
						{
							componentUrl:'./pages/image'
						},
						{
							context: {
								d  : data,
								da : da,
						   }
						}
					);
			   })
		   },
			name: 'pages/image',
		},
		
//USERALLIMAGES PAGE
		{
			path: '/userallimages/:key',
			async: function(routeTo, routeFrom, resolve, reject) {
			   let userName = routeTo.params.key;
			    let usp = false;
				let da = {
					userID: userName,
					triger: LS.user.idUser,
					storage: {
						user : pathUSP,
						image : pathIMAGE,
					},
					shareLink: appLink +'user/'+ userName,
				};
				//РіРѕС‚РѕРІРёРј СЃС‚СЂРѕРєСѓ Р·Р°РїСЂРѕСЃР°
				let GET = GO.fn.objToGET({
					get		: "images",
					triger	: LS.user.idUser,
					cropImagesArr : 999,
				});
				//РЅРµРїРѕСЃСЂРµРґСЃС‚РІРµРЅРЅРѕ Р·Р°РїСЂРѕСЃ РЅР° СЃРµСЂРІРµСЂ 
				requestGo('GET', apiURI +'/users/data-user-page/'+ userName +'?'+ GET, {}) 
				  .then((data) => {
					da.L10 = LS.L10
					usp = da.storage.user + data.spUser + '/'
					data.nameUser = cropText(data.nameUser, 16)
					
					resolve(
					   {
							componentUrl:'./pages/userallimages'
					   },
					   {
							context: {
								d		: data,
								da		: da,
								storage	: {
									user  : usp,
									image : da.storage.image,
								},
						   }
					   }
					);
				})
		   },
			name: 'pages/userallimages',
		},
		

		
//FOLLOW PAGE  TABS
		{
			path: '/follows/:key',
			async: function(routeTo, routeFrom, resolve, reject) {
			   let userName = routeTo.params.key;
			    let usp = false;
				let da = {
					userID: userName,
					triger: LS.user.idUser,
					storage: {
						user : pathUSP,
						image : pathIMAGE,
					},
					shareLink: appLink +'user/'+ userName,
				};
				//РіРѕС‚РѕРІРёРј СЃС‚СЂРѕРєСѓ Р·Р°РїСЂРѕСЃР°
				let GET = GO.fn.objToGET({
					get		: "followers,following",
					triger	: LS.user.idUser,
				});
				//РЅРµРїРѕСЃСЂРµРґСЃС‚РІРµРЅРЅРѕ Р·Р°РїСЂРѕСЃ РЅР° СЃРµСЂРІРµСЂ 
				requestGo('GET', apiURI +'/users/data-user-page/'+ userName +'?'+ GET, {}) 
				  .then((data) => {
					da.L10 = LS.L10
					usp = da.storage.user + data.spUser + '/'
					data.nameUser = cropText(data.nameUser, 16)
					data.countFollows = data.followers + data.following
					console.log(data)
					
					resolve(
					   {
							componentUrl:'./pages/follows'
					   },
					   {
							context: {
								d		: data,
								da		: da,
								storage	: {
									user  : usp
								},
						   }
					   }
					);
				})
		   },
			name: 'pages/follows',
		},


		
		  {
			path: '/comments/:key',
			// Component Object
			component: {
			  template: `
				<div class="page">
					<div class="navbar no-hairline">
						<div class="navbar-bg"></div>
						<div class="navbar-inner sliding">
							<div class="left">
								<a href="#" class="link back">
									<i class="icon icon-back"></i>
								</a>
							</div>
							<div class="title">1111</div>
							<div class="right">
							  <a href="#"><i class="fas fa-ellipsis-v"></i></a>
							</div>
						</div>
					</div>
				  <div class="page-content">
					<a @click="openAlert" class="red-link">Open Alert</a>
					<div class="list simple-list">
					  <ul>
						{{#each names}}
						  <li>{{this}}</li>
						{{/each}}
					  </ul>
					</div>
				  </div>
				</div>
			  `,
			  style: `
				.red-link {
				  color: red;
				}
			  `,
			  data: function () {
				return {
				  title: 'Component Page',
				  names: ['John', 'Vladimir', 'Timo'],
				}
			  },
			  methods: {
				openAlert: function () {
				  var self = this;
				  self.$app.dialog.alert('Hello world!');
				},
			  },
			  on: {
				pageInit: function (e, page) {
				  // do something on page init
				},
				pageAfterOut: function (e, page) {
				  // page has left the view
				},
			  }
			},
		  },
		
		
		
        {
            path: '/cards-author-comments/',
            url: 'pages/cards-author-comments.html',
        },
        {
            path: '/cards-category/',
            url: 'pages/cards-category.html',
        },
        {
            path: '/cards-chip/',
            url: 'pages/cards-chip.html',
        },
        {
            path: '/cards-footer/',
            url: 'pages/cards-footer.html',
        },
        {
            path: '/cards-medium/',
            url: 'pages/cards-medium.html',
        },
        {
            path: '/cards-columns/',
            url: 'pages/cards-columns.html',
        },
        {
            path: '/list-category/',
            url: 'pages/list-category.html',
        },
        {
            path: '/list-category-author/',
            url: 'pages/list-category-author.html',
        },
        {
            path: '/list-category-date/',
            url: 'pages/list-category-date.html',
        },
        {
            path: '/slider-1/',
            url: 'pages/slider-1.html',
        },
        {
            path: '/slider-2/',
            url: 'pages/slider-2.html',
        },
        {
            path: '/slider-3/',
            url: 'pages/slider-3.html',
        },
        {
            path: '/slider-4/',
            url: 'pages/slider-4.html',
        },
        {
            path: '/categories-cards/',
            url: 'pages/categories-cards.html',
        },
        {
            path: '/categories-columns/',
            url: 'pages/categories-columns.html',
        },
        {
            path: '/category/',
            url: 'pages/category.html',
        },
        {
            path: '/author-list/',
            url: 'pages/author-list.html',
        },
        {
            path: '/contact/',
            url: 'pages/contact.html',
        },
        {
            path: '/pull-to-refresh/',
            url: 'pages/pull-to-refresh.html',
        },
        {
            path: '/infinite-scroll/',
            url: 'pages/infinite-scroll.html',
        },
        {
            path: '/promo-banner/',
            url: 'pages/promo-banner.html',
        }
    ];