'use script';
var app = new Framework7({
    root: '#app',
    theme: 'ios',
    init: false,
    routes:[
      {
        path:'/login',
        componentUrl: "../../screens/login.html" 
      },
      {
          path:'/app',
          componentUrl:"../../screens/main.html"

      }
    ]
  }
); 
