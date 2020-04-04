 'use strict';

 window.routes = [
    {
        path:'/forgot-password',
        url:'./partials/screens/forgot-password.html'
    },
    {
        path:'/user-page',
        url:'./partials/screens/user-page.html'
    },
    {
        path:'/signUp',
        componentUrl: './partials/screens/signUp.html'
    },
    {
        path:'/',
        componentUrl: './partials/screens/signIn.html',
        
    },

     {
         path: '(.*)',
         componentUrl: './partials/screens/404.html'
     }
 ];