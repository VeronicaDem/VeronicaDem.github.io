import React from 'react';
import {
    Page, 
    LoginScreenTitle, 
    List, 
    ListInput,
    ListButton,
    BlockFooter
} from 'framework7-react';

import Framework7 from 'framework7/framework7-lite.esm.js';
/**
 * Компонент с отображением страницы входа
 * Состоит из формы и компонента для авторизации
 * через соц сети
 * TODO:
 *  --- сделать вход через соц сети
 */

export default class signIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          username: "",
          password: ""
        }
      }
    onSignIn() {
        
      this.$f7ready((f7) => {
        let notificationFull = f7.notification.create({
          icon: '<i class="icon demo-icon">7</i>',
          title: 'Framework7',
          titleRightText: 'now',
          subtitle: 'This is a subtitle',
          text: 'This is a simple notification message',
          closeTimeout: 3000,
          cssClass: 'note'
        });
        notificationFull.open();
        // Call F7 APIs here
      });
        /*Framework7.request.promise.post('https://api.godialog.ru/api/v1/333/users/signin/true', {
          "form-username": this.state.username,
          "form-pass": this.state.password,
          
        }).then((data)=> {
          console.log(data);
        })*/
        /* cors-anywhere позволяет сделать get запрос обходя защиту CORS */
        /*Framework7.request.promise.get("https://cors-anywhere.herokuapp.com/https://api.godialog.ru/api/v1/333/users/auttoken/true", {
          "form-username": this.state.username,
          "form-pass": this.state.password,
        }).then((data)=> {
          
          console.log(this.props);
        })*/
       
       
    }
    
    render() {
        return (
            <Page noToolbar noNavbar noSwipeback loginScreen>
        <LoginScreenTitle>Вход через GO</LoginScreenTitle>
        <List form>
          <ListInput
            label="Username"
            type="text"
            placeholder="Имя Фамилия"
            value={this.state.username}
            onInput={(e) => {
              this.setState({ username: e.target.value});
            }}
          />
          <ListInput
            label="Password"
            type="password"
            placeholder="Пароль"
            value={this.state.password}
            onInput={(e) => {
              this.setState({ password: e.target.value});
            }}
          />
        </List>
        <List>
          <ListButton onClick={this.onSignIn.bind(this)}>Sign In</ListButton>
          <BlockFooter>Go</BlockFooter>
        </List>
      </Page>
        )
    }
}