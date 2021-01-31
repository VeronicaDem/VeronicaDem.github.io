import HomePage from '../pages/home.jsx';
import NotFoundPage from '../pages/404.jsx';
import signInPage from '../pages/signIn.jsx';
import SignUpPage from '../pages/signUp.jsx';
import VerifyPage from '../components/Verification';
import App from '../components/app.jsx';
var routes = [
  {
    path:'/signIn',
    component: signInPage
  },
  {
    path:'/signUp',
    component:SignUpPage
  },
  {
    path:'/verify',
    component: VerifyPage
  },
  {
    path: '/',
    component: HomePage,
  },
 


  
  /*{
    path: '/request-and-load/user/:userId/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var userId = routeTo.params.userId;

      // Simulate Ajax Request
      setTimeout(function () {
        // We got user data from request
        var user = {
          firstName: 'Vladimir',
          lastName: 'Kharlampidi',
          about: 'Hello, i am creator of Framework7! Hope you like it!',
          links: [
            {
              title: 'Framework7 Website',
              url: 'http://framework7.io',
            },
            {
              title: 'Framework7 Forum',
              url: 'http://forum.framework7.io',
            },
          ]
        };
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            component: RequestAndLoad,
          },
          {
            context: {
              user: user,
            }
          }
        );
      }, 1000);
    },
  },*/
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;
