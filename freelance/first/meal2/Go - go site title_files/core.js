
/*  ФОРМИРУЕМ ССЫЛКИ ДЛЯ ДИНАМИЧЕСКОГО PWA - обязательно до загрузки DOM и др.... */
/**/
jQuery(function($) {
/* удаляем лишние символы из показа массива 
var blockSistemInfo = $('.blockSistemInfo').html();
blockSistemInfo = blockSistemInfo.replace(/Array/g, '');
blockSistemInfo = blockSistemInfo.replace(/\)/g, '');
blockSistemInfo = blockSistemInfo.replace(/\(/g, '');
$('.blockSistemInfo').html(blockSistemInfo);
*/

	$('#iPhoneDetect').text( getiPhoneModel() );
	$('#randstr').text(GO.fn.generate_random_string(10) );
	


	//$('#randstr').text(get_browser_os() );
	//$('#timeme').text(GO.fn.getDateTime );
	//$('#randstr').text( GO.fn.get_url_vars );

	

	
});


/*###################################################################*/
//### BUTTON SPEC ANIMATE
$(function(){
  $('.mybuttonspec--animate-click-one, .mybuttonspec--animate-click-two, .mybuttonspec--animate-click-three')
    .click(function(){
      return _this = this,
      $(_this).stop().addClass('mybuttonspec--click'), setTimeout(function() {
        $(_this).removeClass('mybuttonspec--click');
      }, 600);
  });
});













/*###################################################################*/
//### GoTABS
var containerId = '#gotabs-container';
var tabsId = '#gotabs';
$(document).ready(function(){
	$('#gotabs li:first').addClass('current');
	// Preload tab on page load
	if($(tabsId + ' li.current a').length > 0){
		loadTab($(tabsId + ' li.current a'));
	}
	
    $(tabsId + ' a').click(function(){
    	if($(this).parent().hasClass('current')){ return false; }
    	
    	$(tabsId + ' li.current').removeClass('current');
    	$(this).parent().addClass('current');
    	
    	loadTab($(this));    	
        return false;
    });
});
function loadTab(tabObj){
    if(!tabObj || !tabObj.length){ return; }
    $(containerId).addClass('loading');
    //$(containerId).fadeOut('fast');
    
    $(containerId).load(tabObj.attr('href'), function(){
        $(containerId).removeClass('loading');
       // $(containerId).fadeIn('fast');
    });
}




/*###################################################################*/
//### ScrollMENU horizont menu tuch
$(document).ready(function(){//READY Start
$(window).resize(function() {
	var width = $(window).outerWidth();
	var width_minus = width - 1;
	$(".menuLimiter").css({'width': width_minus + 'px'}); // 
	});
});//READY Finish
// dragscroll lib
!function(e,n){"function"==typeof define&&define.amd?define(["exports"],n):n("undefined"!=typeof exports?exports:e.dragscroll={})}(this,function(e){var n=window,o=document,t="mousemove",l="mouseup",i="mousedown",r="EventListener",c="add"+r,f="remove"+r,m=[],s=function(e,r){for(e=0;e<m.length;)r=m[e++],r[f](i,r.md,0),n[f](l,r.mu,0),n[f](t,r.mm,0);for(m=o.getElementsByClassName("dragscroll"),e=0;e<m.length;)!function(e,o,r,f){e[c](i,e.md=function(e){f=1,o=e.clientX,r=e.clientY,e.preventDefault(),e.stopPropagation()},0),n[c](l,e.mu=function(){f=0},0),n[c](t,e.mm=function(n,t){t=e.scroller||e,f&&(t.scrollLeft-=-o+(o=n.clientX),t.scrollTop-=-r+(r=n.clientY))},0)}(m[e++])};"complete"==o.readyState?s():n[c]("load",s,0),e.reset=s});








/*###################################################################*/
//### DETECT iPhone iPad
// iPhone model checks.
function getiPhoneModel() {
	// iPhone X
	if ((window.screen.height / window.screen.width == 812 / 375) && 
	(window.devicePixelRatio == 3)) {
	return "iPhone X";
	}
	// iPhone 7
	if ((window.screen.height / window.screen.width == 667 / 375) && 
	(window.devicePixelRatio == 2)) {
	return "iPhone 7";
	}
	// iPhone 6 Plus
	if ((window.screen.height / window.screen.width == 736 / 414) && 
	(window.devicePixelRatio == 3)) {
	return "iPhone 6 Plus";
	}
	// iPhone 6
	else if ((window.screen.height / window.screen.width == 667 / 375) && 
	(window.devicePixelRatio == 2)) {
	return "iPhone 6";
	}
	// iPhone 5/5C/5S or 6 in zoom mode
	else if ((window.screen.height / window.screen.width == 1.775) && 
	(window.devicePixelRatio == 2)) {
	return "iPhone 5, 5C, 5S or 6 (display zoom)";
	}
	// iPhone 4/4S
	else if ((window.screen.height / window.screen.width == 1.5) && 
	(window.devicePixelRatio == 2)) {
	return "iPhone 4 or 4S";
	}
	// iPhone 1/3G/3GS
	else if ((window.screen.height / window.screen.width == 1.5) && 
	(window.devicePixelRatio == 1)) {
	return "iPhone 1, 3G or 3GS";
	} else {
	return "noiPhone";
	};
}
function getiPadVersion() {
	var pixelRatio = getPixelRatio();
	var return_string = "noiPad";
	if (pixelRatio == 1 ) {
	return_string = "iPad 1, iPad 2, iPad Mini 1";
	}
	if (pixelRatio == 2) {
	return_string = "iPad 3, iPad 4, iPad Air 1, iPad Air 2, iPad Mini 2, iPad Mini 3";
	}
	return return_string;
}















 

/*	
	
$(function () {	
	// ПО НАЖАТИЮ ПОЛУЧАЕМ
	// $var_if_admin_ajax = '<div><a href="#" class="var_if_admin_ajax go_ajax">оповестить <span class="go_ajax_ok"></span></a></div>';
    $('.go_ajax_get_one').click( function() {
        $.ajax({
          type: 'GET',
          url: '/ajax',
          data: 'getqueryr=123',
          success: function(data){
            $('.go_ajax_get_one_ok').html(data);
          }
        });

    });

//Method POST
    $('.go_ajax_post_one').click( function() {
        $.ajax({
		  type: "POST",
		  url: '/ajax?postquery',
          data: $(this).serialize(),
          success: function(data){
            $('.go_ajax_post_one_ok').html(data);
          }
        });

    });




});




/*
// ПОПРОБОВАТЬ ДЛЯ ПОДМЕНЫ <a
$('a:not(".testnojs a, .content-listing-pagination a")').bind('click',function(e) { 
  e.preventDefault();
  var site = /mysite\\.ru/;
  var url = $(this).attr('href');
  if (/^(http|https|ftp)/.test(url) && !site.test(url)) {
    window.location = url;
  }
  if (url == '/') {
    window.location = url;
  }
});



$('body').find('a').not($('.testnojs a, .content-listing-pagination a')).each(function() { 
	var data_href = $(this).attr('href');
	if(/^[a-zA-Z0-9- ]*$/.test(data_href) == false) { 
		var spec_href = ('document.location="'+data_href+'";');
		$(this).removeAttr('href');
		$(this).attr('onclick', spec_href);
	}else{}
});


*/


/*
$(document).ready(function(){//READY Start

	var varMinWidth = 990; // минимальная ширина клиента после которой выполняем условия
	// отслеживаем шириину клиента и выпоняем действия
	$(function() {
		$(window).resize(function() {
			var width = $(window).outerWidth();
			if (width < varMinWidth) {
				$("#righthidblock, #lefthidblock").addClass("dispnone");
			} else {
				$("#righthidblock, #lefthidblock").removeClass("dispnone");
			}
		});
		
		$(window).resize();
	});
	// отслеживаем шириину клиента и выпоняем действия
	$(function() {
		$(window).resize(function() {
			var width = $(window).outerWidth();
			if (width > varMinWidth) {
				$("#bottomNavi").addClass("dispnone");
			} else {
				$("#bottomNavi").removeClass("dispnone");
			}
		});
		
		$(window).resize();
	});

	// отслеживаем шириину клиента и выпоняем действия 
	$(function() {
		$(window).resize(function() {
			var width = $(window).outerWidth();
			if (width < 1500) {
				$(".person_blockbanner, #map-canvas").css({'height':'320px'}); // 
				$("#postLid h1").css({'font-size': '36px'}); // 
			}
			if (width > 1560) {
				$(".person_blockbanner, #map-canvas").css({'height':'500px'}); // 
				$("#postLid h1").css({'font-size': '55px'}); // 
			}	
			
			if (width > 1720) {
				$(".person_blockbanner, #map-canvas").css({'height':'620px'}); // 
				$("#postLid h1").css({'font-size': '70px'}); // 
			}

		});
		
		$(window).resize();
	});



});//READY Finish
*/