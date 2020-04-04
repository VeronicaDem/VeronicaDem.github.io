 'use strict';

 window.routes = [
    {
        path:'/forgot-password',
        url:'./partials/screens/forgot-password.html'
    },
   
    {
        path:'/',
        componentUrl: './partials/screens/enter.html',
        
    },

     {
         path: '(.*)',
         componentUrl: './partials/screens/404.html'
     }
 ];