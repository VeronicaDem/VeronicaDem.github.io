import React from 'react';
import {Page, Navbar, List, ListItem} from 'framework7-react';


/**
 * Это главный компонент. Юзеру будет показаны кнопки-ссылки
 * (ListItem link):
 *  - с регистрацией (зарегистрироваться)
 *  - с авторизацией (войти)
 * 
 */
export default class Home extends React.Component {
  
  
  
  render() {
   return (
     <Page >
       <Navbar title="Войдите в GO"></Navbar>
      
       <List>
          <ListItem link="/signIn" >Вход</ListItem>
          <ListItem link="/signUp">Регистрация</ListItem>
       </List>
       
     </Page>
   )
  }
}