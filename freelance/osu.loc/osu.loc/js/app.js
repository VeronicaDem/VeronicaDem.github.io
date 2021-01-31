// Theme
var theme = 'ios';
if (location.href.indexOf('theme=md') >= 0) theme = 'md';
if (location.href.indexOf('theme=aurora') >= 0) theme = 'aurora';
var plugin = {
    params: {
        theme: theme,
        root: '#app',
    }
};
if (Framework7.use) Framework7.use(plugin);
else if (Framework7.Class && Framework7.Class.use) Framework7.Class.use(plugin);



// Init App
var app = new Framework7({
    id: 'io.framework7.testapp',
    root: '#app',
    theme: theme,
    routes: routes,
    popup: {
        closeOnEscape: true,
    },
    sheet: {
        closeOnEscape: true,
    },
    popover: {
        closeOnEscape: true,
    },
    actions: {
        closeOnEscape: true,
    },
    vi: {
        placementId: 'pltd4o7ibb9rc653x14',
    },
});


app.on('pageBeforeIn', function(page) {

    var $$ = Dom7;
    if (page.$el.hasClass('catagories-list-root')) {
        $$('.toolbar-bottom .tab-link').removeClass('tab-link-active');
        $$('.toolbar-bottom .tab-link.categorylist').addClass('tab-link-active');
    } else if (page.$el.hasClass('author-root')) {
        //	$$('.toolbar-bottom .tab-link').removeClass('tab-link-active');
        //	$$('.toolbar-bottom .tab-link.explore').addClass('tab-link-active');
        $$('.toolbar-bottom .tab-link').removeClass('tab-link-active');
        $$('.toolbar-bottom .tab-link.profilelist').addClass('tab-link-active');

    } else if (page.$el.hasClass('profilepagelist-root')) {

        $$('.toolbar-bottom .tab-link').removeClass('tab-link-active');
        $$('.toolbar-bottom .tab-link.pageslist').addClass('tab-link-active');

    }

    if (page.$el.hasClass('explore-root')) {
        if ($$('body').hasClass('loaded')) {
            $$('body .guidetab').css('display', 'none');
        } else {
            $$('body .guidetab').css('display', 'block');
        }

    }



});

app.on('pageAfterIn', function(page) {

    var $$ = Dom7;

    if ($$(".search-wrap")[0] && $$('.toggle input')[0]) {


        if ($$('.toggle input')[0].checked) {
            var ch = 'checked="checked"';
        } else {
            var ch = "";
        }

        $$('.search-wrap').empty();
        $$(".search-wrap").addClass("hidekaro");
        $$('.page-current .search-wrap').html('<div class="search-block"><div id="search-bar" class="searchbar customsearchbar"  ><span class="search-ic"></span><div class="searchbar-input"><input type="text" placeholder="Search" class="customsearchbar"><a style="display: none" class="searchresultlink" href="/searchresult/"></a><a href="#" class="searchbar-clear"></a></div><span class="search-mic"><a href="/searchmic/"> <i class="f7-icons">mic</i></a></span>	</div></div><div class="switch-toggle"><span id="swither"><label class="toggle toggle-init"><input type="checkbox" ' + ch + '><span class="toggle-icon"> </span></label></span></div> ');


    }

    if (!$$(".search-wrap #search-bar")[0]) {

        $$('.search-wrap').html('<div class="search-block"><div id="search-bar" class="searchbar customsearchbar"  ><span class="search-ic"></span><div class="searchbar-input"><input type="text" placeholder="Search" class="customsearchbar"><a style="display: none" class="searchresultlink" href="/searchresult/"></a><a href="#" class="searchbar-clear"></a></div><span class="search-mic"><a href="/searchmic/"> <i class="f7-icons">mic</i></a></span>	</div></div><div class="switch-toggle"><span id="swither"><label class="toggle toggle-init"><input type="checkbox" ' + ch + '><span class="toggle-icon"> </span></label></span></div> ');


    }

    $$('.toggle input').on('change', function() {

        if (this.checked) {
            $$('.view').addClass('theme-dark');
        } else {
            $$('.view').removeClass('theme-dark');
        }
    });



    /* Custom Search Functionality Integration .customsearchbar */

    $$('.customsearchbar').on('keypress', function(event) {

        if (event.keyCode == 13) {
            $$(".searchresultlink").trigger("click");
        }
    });


});
app.on('pageInit', function(page) {




    /* This JS Code works when each page load onclick */

    var $$ = Dom7;
    /* $$('input[name="color-radio"]').on('change', function () {
                 if (this.checked) {
             $$('.view').attr('class', 'view view-main view-init');
             $$('.view').addClass('color-theme-' + $$(this).val());
             if ($$('.toggle input')[0].checked) {
               $$('.view').addClass('theme-dark');
             }
           }
         });
         $$('.toggle input').on('change', function () {
			
           if (this.checked) {
             $$('.view').addClass('theme-dark');
           } else {
             $$('.view').removeClass('theme-dark');
           }
         });*/

    $$('.toolbar-bottom .tab-link').on('click', function() {

        $$('.toolbar-bottom .tab-link').removeClass('tab-link-active');
        $$(this).addClass('tab-link-active');

    });



    $$('.scaleffect').on('touchstart', function() {

        $$(this).addClass('box-scale');
    });

    $$('.scaleffect').on('touchend', function() {

        $$(this).removeClass('box-scale');
    });

    $$('.show-custom-tab').on('click', function() {

        var tabid = $$(this).attr('data-tab-id');
        $$('.show-custom-tab').removeClass('active');
        $$(this).addClass('active');
        app.showTab(tabid);
    });


    $$('.walkthroughskip').on('click', function() {

        var swiper = app.swiper.get('.swiper-container');
        swiper.slideNext();

    });





    var menu = ['Health', 'Sports', 'Politics', 'World']
    var mySwiper = new Swiper('.swiper-timeline', {
        autoplay: true,
        // If we need pagination
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            renderBullet: function(index, className) {
                return '<span class="' + className + '"> <span class="text-nv">' + (menu[index]) + '</span></span>';
            },
        },

    })

    $$('#bchips > div.chip').click(function() {
        $$(this).toggleClass('current-click');
    });





    $$('.reply-back-like ').click(function() {
        $$(this).toggleClass('fill-heart');
    });


    $$('.reply-back-back ').click(function() {
        $$(this).toggleClass('fill-relpy');
    });

    $$('.tag-c ').click(function() {
        $$(this).toggleClass('fill-relpy');
    });




    $$('.tri').on('click', function(e) {

        $$('.w3mission').css('display', 'block');
        $$(".w3mission").focus();
        //$$('#w3mission').addClass('input-focused')
    });

    /* Guide Window styling */

    $$('.guidetab').on('click', function() {
        $$(this).css('display', 'none');
        $$('body').addClass('loaded');

    });



    /* Popup Gallery */

    /*=== Default standalone ===*/
    var myPhotoBrowserStandalone = app.photoBrowser.create({
        photos: [
            'img/nws-gallery1.jpg',
            'img/nws-gallery2.jpg',
            'img/nws-gallery3.jpg',
            'img/nws-gallery4.jpg',
            'img/slide2.jpg',

        ]
    });

    //Open photo browser on click
    $$('.pb-standalone').on('click', function() {
        var index = $$(this).data('id');
        if (index == 0) {
            myPhotoBrowserStandalone.open();
        } else {
            myPhotoBrowserStandalone.open(index);
        }
    });

    /*News Listing Pull to refresh */
    // Pull to refresh content
    var $ptrContent = $$('.ptr-content');
    // Add 'refresh' listener on it
    $ptrContent.on('ptr:refresh', function(e) {

        // Emulate 2s loading
        setTimeout(function() {
            var picURL = 'https://cdn.framework7.io/placeholder/abstract-88x88-' + (Math.floor(Math.random() * 10) + 1) + '.jpg';
            var picURL2 = 'https://cdn.framework7.io/placeholder/abstract-88x88-' + (Math.floor(Math.random() * 10) + 1) + '.jpg';

            var parentid = $$(".tab.tab-active").attr("id");

            if (parentid == 'listview') {

                var itemHTML = '<div class="wrap2"><div class="post-wraper flx-direction"><a href="/videodetail/" class="flx-anc "><div class="post-thumb video-thumb"><img class="lazy-fade-in img-responsive lazy-loaded" src="img/2.jpg" alt=""><i class="f7-icons video-thumb-icon">play_fill</i></div><div class="post-text-outer"><div class="post-user-info"> <span class="author-profile"><img class="lazy-fade-in img-responsive lazy-loaded" src="img/profile2.jpg"></span><span class="author-name">Jennifer Reid <span class="post-time">1m ago</span></span></div><div class="post-text"><p>24 Things to See and Do in Italy this Season.</p></div></div></a></div><div class="post-wrap-border"></div><div class="post-wraper flx-direction"><a href="/postdetail/"><div class="post-thumb"><img class="lazy-fade-in img-responsive lazy-loaded" src="img/3.jpg" alt=""></div><div class="post-text-outer"><div class="post-user-info"> <span class="author-profile"><img class="lazy-fade-in img-responsive lazy-loaded" src="img/profile2.jpg"></span><span class="author-name">Jennifer Reid <span class="post-time">1m ago</span></span></div><div class="post-text"><p>24 Things to See and Do in Italy this Season.</p></div></div></a></div><div class="post-wrap-border"></div></div>';
            } else {
                var itemHTML = '<div class="flex2"><div class="post-wraper flx-direction"><a href="/videodetail/"><div class="post-thumb video-thumb"><img class="lazy-fade-in img-responsive lazy-loaded" src="img/2.jpg" alt=""><i class="f7-icons video-thumb-icon">play_fill</i></div><div class="post-text-outer"><div class="post-user-info"> <span class="author-profile"><img class="lazy-fade-in img-responsive lazy-loaded" src="img/profile2.jpg"></span><span class="author-name">Jennifer Reid <span class="post-time">1m ago</span></span></div><div class="post-text"><p>24 Things to See and Do in Italy this Season.</p></div></div></a></div><div class="post-wraper flx-direction"><a href="/postdetail/"><div class="post-thumb"><img class="lazy-fade-in img-responsive lazy-loaded" src="img/3.jpg" alt=""></div><div class="post-user-info"> <span class="author-profile"><img class="lazy-fade-in img-responsive lazy-loaded" src="img/profile2.jpg"></span><span class="author-name">Jennifer Reid <span class="post-time">1m ago</span></span></div><div class="post-text-outer"><div class="post-text"><p>24 Things to See and Do in Italy this Season.</p></div></div></a></div></div>';
            }

            // Prepend new list element
            $ptrContent.find('.tab.tab-active .margin0-top').prepend(itemHTML);
            // When loading done, we need to reset it
            app.ptr.done(); // or e.detail();
        }, 2000);
    });









    //channel data 

    $$('a.refreshautnw').on('click', function(e) {
        //app.ptr.refresh(); 

        $$(this).html('<div class="preloader color-white"><span class="preloader-inner"><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span></span></div>');


        // Emulate 2s loading
        setTimeout(function() {
            var picURL = 'https://cdn.framework7.io/placeholder/abstract-88x88-' + (Math.floor(Math.random() * 10) + 1) + '.jpg';
            var picURL2 = 'https://cdn.framework7.io/placeholder/abstract-88x88-' + (Math.floor(Math.random() * 10) + 1) + '.jpg';

            var parentid = $$(".tab.tab-active").attr("id");
            if (parentid == 'listc') {

                var itemHTML = '<div class="nw-row"> <div class="channel-row"> <div class="channel-thumb"> <span class="overly-channel"></span> <img class="lazy-fade-in img-responsive lazy-loaded" src="img/10.jpg" alt=""> </div><div class="channel-content"> <h4>CNN</h4> <p>Dally News Globally <span class="channel-co">23.7K Users</span></p></div><div class="Follow-button-wrpper"> <a href="#"><button class="follow-b scaleffect">Follow</button></a> </div></div><div class="channel-row"> <div class="channel-thumb"> <span class="overly-channel"></span> <img class="lazy-fade-in img-responsive lazy-loaded" src="img/7.jpg" alt=""> </div><div class="channel-content"> <h4>Discovery</h4> <p>Automobile News <span class="channel-co">32.2K Users</span></p></div><div class="Follow-button-wrpper"> <a href="#"><button class="follow-b scaleffect">Follow</button></a> </div></div></div>';
            } else {
                var itemHTML = '<div class="nw-row"> <div class="channel-row"> <div class="channel-thumb"> <span class="overly-channel"></span> <img class="lazy-fade-in img-responsive lazy-loaded" src="img/10.jpg" alt=""> </div><div class="channel-content"> <h4>CNN</h4> <p>Dally News Globally <span class="channel-co">23.7K Users</span></p></div><div class="Follow-button-wrpper"> <a href="#"><button class="follow-b scaleffect">Follow</button></a> </div></div><div class="channel-row"> <div class="channel-thumb"> <span class="overly-channel"></span> <img class="lazy-fade-in img-responsive lazy-loaded" src="img/7.jpg" alt=""> </div><div class="channel-content"> <h4>Discovery</h4> <p>Automobile News <span class="channel-co">32.2K Users</span></p></div><div class="Follow-button-wrpper"> <a href="#"><button class="follow-b scaleffect">Follow</button></a> </div></div></div>';
            }

            // Prepend new list element
            $ptrContent.find('#listc').append(itemHTML);
            $ptrContent.find('a.refreshautnw').html('See All');
            // When loading done, we need to reset it
            app.ptr.done(); // or e.detail();

            /* $$('.follow-b').on('click',function(){
        $$(this).toggleClass('follow-h');
		            $$(this).text($$(this).text() == 'Followed' ? 'Follow' : 'Followed');
			
     }); */
        }, 1000);
    });

    //channel










    //author data 

    $$('a.refreshaut').on('click', function(e) {
        //app.ptr.refresh(); 

        $$(this).html('<div class="preloader color-white"><span class="preloader-inner"><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span></span></div>');

        // Emulate 2s loading
        setTimeout(function() {
            var picURL = 'https://cdn.framework7.io/placeholder/abstract-88x88-' + (Math.floor(Math.random() * 10) + 1) + '.jpg';
            var picURL2 = 'https://cdn.framework7.io/placeholder/abstract-88x88-' + (Math.floor(Math.random() * 10) + 1) + '.jpg';

            var parentid = $$(".tab.tab-active").attr("id");
            if (parentid == 'listb') {

                var itemHTML = '<div class="author-flx"><div class="channel-row author-bg"><div class="channel-thumb"><img class="lazy-fade-in img-responsive lazy-loaded author-img-radius" src="img/nws-gallery1.jpg" alt=""></div><div class="channel-content author-addtions"><h4>Author Name</h4><p>Company &amp; Post</p><div class="followed-by-wrap news-flx"><span class="follow-icon1 "><img class="lazy-fade-in img-responsive lazy-loaded author-img-radius" src="img/nws-gallery3.jpg"> </span><span class="follow-icon1 ua-img"><img class="lazy-fade-in img-responsive lazy-loaded" src="img/author-img.png"> </span> <span class="follow-name">Followed 1231 </span></div></div><div class="Follow-button-wrpper follow-btn-width"><a href="#"><button class="follow-b scaleffect no-active-state">Follow</button></a></div></div><div class="channel-row author-bg"><div class="channel-thumb"><img class="lazy-fade-in img-responsive lazy-loaded author-img-radius" src="img/profile2.jpg" alt=""></div><div class="channel-content author-addtions"><h4>Author Name</h4><p>Company &amp; Post</p><div class="followed-by-wrap news-flx"><span class="follow-icon1 "><img class="lazy-fade-in img-responsive lazy-loaded" src="img/nws-gallery3.jpg"> </span><span class="follow-icon1 ua-img"><img class="lazy-fade-in img-responsive lazy-loaded" src="img/author-img.png"> </span> <span class="follow-name">Followed 1231 </span></div></div><div class="Follow-button-wrpper follow-btn-width"><a href="#"><button class="follow-b scaleffect no-active-state">Follow</button></a></div></div></div>';
            } else {
                var itemHTML = '<div class="author-flx"><div class="channel-row author-bg"><div class="channel-thumb"><img class="lazy-fade-in img-responsive lazy-loaded author-img-radius" src="img/nws-gallery1.jpg" alt=""></div><div class="channel-content author-addtions"><h4>Author Name</h4><p>Company &amp; Post</p><div class="followed-by-wrap news-flx"><span class="follow-icon1 "><img class="lazy-fade-in img-responsive lazy-loaded author-img-radius" src="img/nws-gallery3.jpg"> </span><span class="follow-icon1 ua-img"><img class="lazy-fade-in img-responsive lazy-loaded" src="img/author-img.png"> </span> <span class="follow-name">Followed 1231 </span></div></div><div class="Follow-button-wrpper follow-btn-width"><a href="#"><button class="follow-b scaleffect no-active-state">Follow</button></a></div></div><div class="channel-row author-bg"><div class="channel-thumb"><img class="lazy-fade-in img-responsive lazy-loaded author-img-radius" src="img/profile2.jpg" alt=""></div><div class="channel-content author-addtions"><h4>Author Name</h4><p>Company &amp; Post</p><div class="followed-by-wrap news-flx"><span class="follow-icon1 "><img class="lazy-fade-in img-responsive lazy-loaded" src="img/nws-gallery3.jpg"> </span><span class="follow-icon1 ua-img"><img class="lazy-fade-in img-responsive lazy-loaded" src="img/author-img.png"> </span> <span class="follow-name">Followed 1231 </span></div></div><div class="Follow-button-wrpper follow-btn-width"><a href="#"><button class="follow-b scaleffect no-active-state">Follow</button></a></div></div></div>';
            }

            // Prepend new list element
            $ptrContent.find('#listb').append(itemHTML);
            $ptrContent.find('a.refreshaut').html('See All');
            // When loading done, we need to reset it
            //app.ptr.done(); // or e.detail();


            /* $$('.follow-b').on('click',function(){
        $$(this).toggleClass('follow-h');
		            $$(this).text($$(this).text() == 'Followed' ? 'Follow' : 'Followed');
					
			
					
				
		
     });*/




        }, 2000);
    });

    //authordata




    //Contibutors

    $$('a.refreshautt').on('click', function(e) {
        //app.ptr.refresh(); 

        $$(this).html('<div class="preloader color-white"><span class="preloader-inner"><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span></span></div>');

        // Emulate 2s loading
        setTimeout(function() {
            var picURL = 'https://cdn.framework7.io/placeholder/abstract-88x88-' + (Math.floor(Math.random() * 10) + 1) + '.jpg';
            var picURL2 = 'https://cdn.framework7.io/placeholder/abstract-88x88-' + (Math.floor(Math.random() * 10) + 1) + '.jpg';

            var parentid = $$(".tab.tab-active").attr("id");
            if (parentid == 'Contributors-block') {

                var itemHTML = ' <div class="follow-us-row"> <div class="News-story-info"> <div class="News-profile"><img class="lazy-fade-in img-responsive lazy-loaded" src="img/user-b.jpg"></div><div class="News-title"> <a href="/authoroot/"> <span class="News-head">Erin Green</span> <span class="News-date">Ireland</span><span class="seprator">|</span><span class="News-time">2.5k Followers</span> </a> </div></div><div class="follow-us-btn"><button class="follow-b scaleffect no-active-state">Follow</button></div></div><div class="post-wrap-border"></div><div class="follow-us-row"> <div class="News-story-info"> <div class="News-profile"><img class="lazy-fade-in img-responsive lazy-loaded" src="img/user-b.jpg"></div><div class="News-title"> <a href="/authoroot/"> <span class="News-head">Mathijn Agter</span> <span class="News-date">India</span><span class="seprator">|</span><span class="News-time">3k Followers</span> </a> </div></div><div class="follow-us-btn"><button class="follow-b scaleffect no-active-state">Follow</button></div></div><div class="post-wrap-border"></div>';
            } else {
                var itemHTML = ' <div class="follow-us-row"> <div class="News-story-info"> <div class="News-profile"><img class="lazy-fade-in img-responsive lazy-loaded" src="img/user-b.jpg"></div><div class="News-title"> <a href="/authoroot/"> <span class="News-head">Erin Green</span> <span class="News-date">Ireland</span><span class="seprator">|</span><span class="News-time">2.5k Followers</span> </a> </div></div><div class="follow-us-btn"><button class="follow-b scaleffect no-active-state">Follow</button></div></div><div class="post-wrap-border"></div><div class="follow-us-row"> <div class="News-story-info"> <div class="News-profile"><img class="lazy-fade-in img-responsive lazy-loaded" src="img/user-b.jpg"></div><div class="News-title"> <a href="/authoroot/"> <span class="News-head">Mathijn Agter</span> <span class="News-date">India</span><span class="seprator">|</span><span class="News-time">3k Followers</span> </a> </div></div><div class="follow-us-btn"><button class="follow-b scaleffect no-active-state">Follow</button></div></div><div class="post-wrap-border"></div>';
            }

            // Prepend new list element
            $ptrContent.find('#Contributors-block').append(itemHTML);
            $ptrContent.find('a.refreshaut').html('See All');
            // When loading done, we need to reset it
            //app.ptr.done(); // or e.detail();


            /* $$('.follow-b').on('click',function(){
        $$(this).toggleClass('follow-h');
		            $$(this).text($$(this).text() == 'Followed' ? 'Follow' : 'Followed');
					
			
					
				
		
     });*/




        }, 2000);
    });

    //Contibutors



    $$('a.refreshPage').on('click', function(e) {
        //app.ptr.refresh(); 


        $$(this).html('<div class="preloader color-white"><span class="preloader-inner"><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span><span class="preloader-inner-line"></span></span></div>');

        // Emulate 2s loading
        setTimeout(function() {
            var picURL = 'https://cdn.framework7.io/placeholder/abstract-88x88-' + (Math.floor(Math.random() * 10) + 1) + '.jpg';
            var picURL2 = 'https://cdn.framework7.io/placeholder/abstract-88x88-' + (Math.floor(Math.random() * 10) + 1) + '.jpg';

            var parentid = $$(".tab.tab-active").attr("id");

            if (parentid == 'listview') {

                var itemHTML = '<div class="wrap2"><div class="post-wraper flx-direction"><a href="/videodetail/" class="flx-anc "><div class="post-thumb video-thumb"><img class="lazy-fade-in img-responsive lazy-loaded" src="img/2.jpg" alt=""><i class="f7-icons video-thumb-icon">play_fill</i></div><div class="post-text-outer"><div class="post-user-info"> <span class="author-profile"><img class="lazy-fade-in img-responsive lazy-loaded" src="img/profile2.jpg"></span><span class="author-name">Jennifer Reid <span class="post-time">1m ago</span></span></div><div class="post-text"><p>24 Things to See and Do in Italy this Season.</p></div></div></a></div><div class="post-wrap-border"></div><div class="post-wraper flx-direction"><a href="/postdetail/"><div class="post-thumb"><img class="lazy-fade-in img-responsive lazy-loaded" src="img/3.jpg" alt=""></div><div class="post-text-outer"><div class="post-user-info"> <span class="author-profile"><img class="lazy-fade-in img-responsive lazy-loaded" src="img/profile2.jpg"></span><span class="author-name">Jennifer Reid <span class="post-time">1m ago</span></span></div><div class="post-text"><p>24 Things to See and Do in Italy this Season.</p></div></div></a></div><div class="post-wrap-border"></div></div>';
            } else {
                var itemHTML = '<div class="flex2"><div class="post-wraper flx-direction"><a href="/videodetail/"><div class="post-thumb video-thumb"><img class="lazy-fade-in img-responsive lazy-loaded" src="img/2.jpg" alt=""><i class="f7-icons video-thumb-icon">play_fill</i></div><div class="post-text-outer"><div class="post-user-info"> <span class="author-profile"><img class="lazy-fade-in img-responsive lazy-loaded" src="img/profile2.jpg"></span><span class="author-name">Jennifer Reid <span class="post-time">1m ago</span></span></div><div class="post-text"><p>24 Things to See and Do in Italy this Season.</p></div></div></a></div><div class="post-wraper flx-direction"><a href="/postdetail/"><div class="post-thumb"><img class="lazy-fade-in img-responsive lazy-loaded" src="img/3.jpg" alt=""></div><div class="post-user-info"> <span class="author-profile"><img class="lazy-fade-in img-responsive lazy-loaded" src="img/profile2.jpg"></span><span class="author-name">Jennifer Reid <span class="post-time">1m ago</span></span></div><div class="post-text-outer"><div class="post-text"><p>24 Things to See and Do in Italy this Season.</p></div></div></a></div></div>';
            }

            // Prepend new list element
            $ptrContent.find('.tab.tab-active .margin0-top').append(itemHTML);
            // When loading done, we need to reset it
            //app.ptr.done(); // or e.detail();

            $ptrContent.find('a.refreshaut').html('See All');
        }, 2000);
    });





});


//list data


/* This JS Code works when first load */
var $$ = Dom7;

$$('.toolbar.customtoolbar.toolbar-bottom ').addClass('toolbar-hidden');

$$(document).on('change', 'input[name="color-radio"]', function() {
    if (this.checked) {
        $$('.view').attr('class', 'view view-main view-init');

        if ($$('.toggle input')[0].checked) {
            $$('.view').addClass('theme-dark color-theme-' + $$(this).val());
            //$$('.view').addClass('theme-dark');
        } else {
            $$('.view').addClass('color-theme-' + $$(this).val());
        }

    }
});

$$(document).on('change', '.toggle input', function() {
    if (this.checked) {
        $$('.view').addClass('theme-dark');
    } else {
        $$('.view').removeClass('theme-dark');
    }
});



$$('.toolbar-bottom .tab-link').on('click', function(e) {
    //e.preventDefault();
    $$('.toolbar-bottom .tab-link').toggleClass('tab-link-active');
    //$$(this).addClass('tab-link-active');
    //return false;
});

$$('.scaleffect').on('touchstart', function() {

    $$(this).addClass('box-scale');
});

$$('.scaleffect').on('touchend', function() {

    $$(this).removeClass('box-scale');
});

var delay = 1000;
setTimeout(function() {
    $$('.Cpreloader').addClass('loadedComplete');

}, delay);


$$(document).on('click', '.follow-b', function() {

    $$(this).toggleClass('follow-h');
    $$(this).text($$(this).text() == 'Followed' ? 'Follow' : 'Followed');

});

$$(document).on('click', '.followe-now', function() {
    $$(this).toggleClass('followdd');
    $$(this).text($$(this).text() == 'Followed' ? 'Follow' : 'Followed');


});




/*   $$('.button').click(function () {
                $$('#w3mission').css('display', 'block');
            }); */