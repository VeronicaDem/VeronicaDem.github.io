import React from 'react';

import {
  App,
  View
} from 'framework7-react';


import routes from '../js/routes';
import Home from '../pages/home.jsx';

class MainApp extends React.Component {
  constructor() {
    super();

    this.state = {
      // Framework7 Parameters
      f7params: {
        name: 'social_proj', // App name
        theme: 'auto', // Automatic theme detection
        
        autoDarkTheme:true,
        // App routes
        
        routes: routes,
        view : {
          pushState:true,
          pushStateSeparator:""
        }
      },
      // Login screen demo data
      
    }
    console.log(self);
  }
  render() {
    return (
      
      <App  params={ this.state.f7params } >
          
        {/* Left panel with cover effect*/}
        


        {/* Your main view, should have "view-main" class */}
        <View main url="/" />
        <Home/>
        
       
      
      </App>
      
    )
  }
  alertLoginData() {
    this.$f7.dialog.alert('Username: ' + this.state.username + '<br>Password: ' + this.state.password, () => {
      this.$f7.loginScreen.close();
    });
  }
  componentDidMount() {
    this.$f7ready((f7) => {
      /*let notificationFull = f7.notification.create({
        icon: '<i class="icon demo-icon">7</i>',
        title: 'Framework7',
        titleRightText: 'now',
        subtitle: 'This is a subtitle',
        text: 'This is a simple notification message',
        closeTimeout: 3000,
      });
      notificationFull.open();*/
      // Call F7 APIs here
    });
  }
}
export default MainApp;