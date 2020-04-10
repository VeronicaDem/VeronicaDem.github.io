 'use strict';

 window.routes = [
     // 'partials/screens/author.html'
     {
       path:'/author',
       async : function(routeTo, routeFrom, resolve, reject) {
           let userName = 'balu';
           this.app.request.json('https://api.godialog.ru/api/v1/333/users/mult/'+ userName, (data)=>{

             resolve(
                   {
                       componentUrl:'partials/screens/author.html'
                   },
                   {
                       context: {
                           user : {
                               name_area: data[0].name_area,
                               name_user: data[0].name_user,
                               background_user: data[0].background_user
                           }
                       }
                   });
           })
       }
     },
     {
       path:'/user-page/:id',
       componentUrl:'partials/screens/user-page.html'
     },
    {
        path:'/forgot-password',
        url:'partials/screens/forgot-password.html'
    },
    
    {
        path:'/signUp',
        componentUrl: 'partials/screens/signUp.html'
    },
    {
        path:'/',
        componentUrl: 'partials/screens/signIn.html',
        
    },

     {
         path: '(.*)',
         componentUrl: 'partials/screens/404.html'
     }
 ];