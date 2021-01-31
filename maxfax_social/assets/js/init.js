"use strict";

var $$ = Dom7;

// App configuration
var app = new Framework7({
    root: '#app',
    theme: 'ios',
	routes: routes,
	stackPages: true,
    tapHold: true,
	lazy: {
	threshold: 2, 
	sequential: false,
	},
	lazy: {
		placeholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNU9AEAAJQAb6gDc6MAAAAASUVORK5CYII=",//https://png-pixel.com/
		threshold: 50,
		sequential: false,
	},
	toast: {
		closeTimeout: 3000,
		closeButton: true,
	},
	dialog: {
	title: 'Go App',
	buttonOk: 'ясн..',
	},
	smartSelect: {
		closeOnSelect: true,
		virtualList: true,
		//virtualListHeight: 20,
		sheetCloseLinkText: "",
	},
    view: {
		//stackPages: true,
        pushState: true,
        pushStateAnimate: true,
        pushStateAnimateOnLoad: true,
        pushStateSeparator: "#!",
    }
    // Create routes for all pages

});

/*
app.request.setup({
  headers: {
    'Authorization': GO.fn.responseToken()
  }
});
*/



if(app.width > 768){
	//$$('.page-content').css('width', '375px');
	//$$(app.root).addClass('page-content--786');
	$$(app.root).css('width', '768px');
}



/*
|------------------------------------------------------------------------------
| Initialize Service Worker
|------------------------------------------------------------------------------
*/

function initializeServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js');
    }
}