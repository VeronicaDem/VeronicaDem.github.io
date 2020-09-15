var routes = [
    // Index page
    {
      path:'/example',
      url :'./pageslayouts/example_table.html'
    },
    {
        path:'/signin',
        componentUrl:'./pageslayouts/signin.html',
        name:'signin'
    },
    {
        path:'/signin/',
        componentUrl:'./pageslayouts/signin.html',
        name:'signin'
    },
    {
         path:'/comment',
         componentUrl: './pageslayouts/comment.html'
    },

    {
        path:'/signup',
        componentUrl: './pageslayouts/signup.html',
        name:'signup'
    },
    {
       path:'signup/',
        componentUrl: './pageslayouts/signup.html',
        name:'signup'

    },
    // Index page
   ,{
    path: '/explore',
    componentUrl: './pageslayouts/explore.html',
    name: 'explore',
},
    {
        path:'/upload',
        componentUrl: './pageslayout/upload.html',
        name : 'upload'
    },
	{
        path: '/user/:key',
        async: function(routeTo, routeFrom, resolve, reject) {
           let userName = routeTo.params.key;
                      //console.log(routeTo.params);
			var dataPage = {
				userID: userName,
				lastName: 'Kharlampidi',
			};

           this.app.request.json('https://api.godialog.ru/api/v1/333/users/mult/'+ userName, (data)=>{

             resolve(
                   {
						componentUrl:'./pageslayouts/author-page.html'
                   },
                   {
						context: {
							user : data,
							data : dataPage 
                       },
                                                                      
                   });
           })
       }    },










    // Category Main Listing page
    {
        path: '/categorylist',
        url: './pageslayouts/categories.html',
        name: 'categorylist',
    },
    // List Main Listing page
    {
        path: '/list',
        url: './pageslayouts/list.html',
        name: 'list',
    },
    // Profile page
    {
        path: '/profile',
        url: './pageslayouts/profile.html',
        name: 'profile',
    },

    // Profile page
    {
        path: '/detail-new',
        url: './pageslayouts/detail-page2.html',
        name: 'profile',
    },



    // Profile page
    {
        path: '/writearticle',
        url: './pageslayouts/write-article.html',
        name: 'profile',
    },

    // search1
    {
        path: '/search1',
        url: './pageslayouts/search1.html',
        name: 'profile',
    },


    // Pages page
    {
        path: '/pages',
        url: './pageslayouts/pages.html',
        name: 'pages',
    },

    // Post Detail page
    {
        path: '/postdetail',
        url: './pageslayouts/detail-page.html',
        name: 'postdetail',
    },

    // Category Main Listing Layout2  page
    {
        path: '/categorylist2',
        url: './pageslayouts/categories2.html',
        name: 'categorylist2',
    },

    // About Us page
    {
        path: '/about',
        url: './pageslayouts/about-us.html',
        name: 'list',
    },

    // videodetail

    {
        path: '/videodetail',
        url: './pageslayouts/videodetail-page.html',
        name: 'list',
    },

    {
        path: '/contributors',
        url: './pageslayouts/contributors-list.html',
        name: 'list',
    },






    // Write An Article

    {
        path: '/writearticle',
        url: './pageslayouts/write-article.html',
        name: 'list',
    },


    // channel

    {
        path: '/channel',
        url: './pageslayouts/channel.html',
        name: 'list',
    },


    // author

     {
        path: '/author',
        url: './pageslayouts/author-page.html',
        name: 'list',
    },     
   /*
	{
        path: '/user/:u',
        componentUrl: './profile',
        name: 'user',
    }, 


	{
		path: '/user/:userId',
		async: function(routeTo, routeFrom, resolve, reject) {
				// Router instance
				var router = this;
				// App instance
				var app = router.app;

				// Show Preloader
				app.preloader.show();

				// User ID from request
				var userId = routeTo.params.userId;

				// Simulate Ajax Request
				setTimeout(function() {
					// We got user data from request
					var dataPage = {
						firstName: 'Vladimir',
						lastName: 'Kharlampidi',
						about: 'Hello, i am creator of Framework7! Hope you like it!',
						links: [{
								title: 'Framework7 Website',
								url: 'http://framework7.io',
							},
							{
								title: 'Framework7 Forum',
								url: 'http://forum.framework7.io',
							},
						]
					};
					var user = [];
					// Hide Preloader
					app.preloader.hide();

					// Resolve route to load page
					resolve({
						componentUrl:'./pageslayouts/author-page.html'
					}, {
						context: {
							data: dataPage,
							user: user,
						}
					});
				}, 1000);
		},
	},
	

*/
    // author main

    {
        path: '/authoroot',
        url: './pageslayouts/author.html',
        name: 'list',
    },


    // Guide

    {
        path: '/guide',
        url: './pageslayouts/guide.html',
        name: 'list',
    },


    //  guide-navigation


    {
        path: '/guide-navigation',
        url: './pageslayouts/guide-navigation.html',
        name: 'list',
    },







    // Author list

    {
        path: '/authorlist',
        url: './pageslayouts/author-list.html',
        name: 'list',
    },


    // channel list

    {
        path: '/channellist',
        url: './pageslayouts/channel-list.html',
        name: 'list',
    },

    // Components

    {
        path: '/components',
        url: './pageslayouts/components.html',
        name: 'list',
    },


    // search mic

    {
        path: '/searchmic',
        url: './pageslayouts/search-mic.html',
        name: 'list',
    },



    // Profile page

    {
        path: '/Profilepage',
        url: './pageslayouts/profile-page.html',
        name: 'list',
    },

    // Contact us

    {
        path: '/Contactus',
        url: './pageslayouts/contact-us.html',
        name: 'list',
    },





    // Myprofile page

    {
        path: '/my-proflie',
        url: './pageslayouts/my-proflie.html',
        name: 'list',
    },

    // Search Result

    {
        path: '/searchresult',
        url: './pageslayouts/search-result.html',
        name: 'list',
    },


    // Search Result2

    {
        path: '/searchresultcata',
        url: './pageslayouts/search-result-cata.html',
        name: 'list',
    },

    // Today page

    {
        path: '/today',
        url: './pageslayouts/today.html',
        name: 'list',
    },

    // Time Line

    {
        path: '/timeline',
        url: './pageslayouts/time-line.html',
        name: 'list',
    },

    // walkthrough

    {
        path: '/walkthrough',
        url: './pageslayouts/walkthrough.html',
        name: 'list',
    },

    // Select interest

    {
        path: '/selectinterest',
        url: './pageslayouts/select-interest.html',
        name: 'list',
    }/*,

    // Login

    {
        path: '/login/',
        url: './pageslayouts/login.html',
        name: 'list',
    },

    // signup

    {
        path: '/signup/',
        url: './pageslayouts/signup.html',
        name: 'list',
    }*/,


    // Forgot Password

    {
        path: '/forgotpassword',
        url: './pageslayouts/forgotpassword.html',
        name: 'list',
    },


    // Category listing Pages

    {
        path: '/category/health',
        url: './pageslayouts/category/cat_health.html',
        name: 'cathealth',
    },
    {
        path: '/category/fashion',
        url: './pageslayouts/category/cat_fashion.html',
        name: 'cathealth',
    },

    {
        path: '/category/politics',
        url: './pageslayouts/category/cat_politics.html',
        name: 'catpolitics',
    },
    {
        path: '/category/sports',
        url: './pageslayouts/category/cat_sports.html',
        name: 'catsports',
    },
    {
        path: '/category/technology',
        url: './pageslayouts/category/cat_technology.html',
        name: 'cattechnology',
    },
    {
        path: '/category/world',
        url: './pageslayouts/category/cat_world.html',
        name: 'catworld',
    },


    // loader

    {
        path: '/loader',
        url: './pageslayouts/loader.html',
        name: 'loader',
    },



    // navigation1 login

    {
        path: '/navigation1',
        url: './pageslayouts/navigation-login-page.html',
        name: 'loader',
    },

    //walkthrough-navi linkpage

    {
        path: '/walkthrough-navi',
        url: './pageslayouts/walkthrough-navi.html',
        name: 'list',
    },



    // navigation1 selectinterest

    {
        path: '/navigation2',
        url: './pageslayouts/navigation2.html',
        name: 'navigation2',
    },


    // listview2 thumb 
    {
        path: '/listthumbb',
        url: './pageslayouts/list-thumbb.html',
        name: 'listthumbb',
    },


    // navigation1 signup

    {
        path: '/navigation3',
        url: './pageslayouts/navigation3.html',
        name: 'navigation2',
    },

    // navigation1 signup

    {
        path: '/navigation4',
        url: './pageslayouts/navigation4.html',
        name: 'navigation2',
    },


    // navigation1 signup

    {
        path: '/navigation5',
        url: './pageslayouts/navigation5.html',
        name: 'navigation2',
    },


    // navigation1 signup

    {
        path: '/profile-navigationlink',
        url: './pageslayouts/profile-navigationlink.html',
        name: 'navigation2',
    },





    //components section-------------------------------------------------




    {
        path: '/cards',
        url: './pageslayouts/components/cards.html',
        name: 'cards',
    },

    //timeline-slider

    {
        path: '/allslider',
        url: './pageslayouts/components/allslider.html',
        name: 'cardscomments',
    },


    //Listing view 
    {
        path: '/alllist',
        url: './pageslayouts/components/alllist.html',
        name: 'cardscomments',
    },



    //Listing view 
    {
        path: '/tabs-view',
        url: './pageslayouts/components/tabs-view.html',
        name: 'cardscomments',
    },





    //gallery 
    {
        path: '/allgallery',
        url: './pageslayouts/components/allgallery.html',
        name: 'cardscomments',
    },


    //Channel load
    {
        path: '/Channel-load',
        url: './pageslayouts/components/channel-load.html',
        name: 'cardscomments',
    },

    {
        path: '/',
        componentUrl: './pageslayouts/explore.html',
        name:'explore'
    },


    // Default route (404 page). MUST BE THE LAST
    {
        path: '(.*)',
        url: './pages/404.html',
    },
	
	 
	
	
];