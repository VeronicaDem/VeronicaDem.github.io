 'use strict';

 window.routes = [
    
   
    {
        path:'/',
        componentUrl: './partials/screens/enter.html',
        
    },

     {
         path: '(.*)',
         componentUrl: './partials/screens/404.html'
     }
 ];