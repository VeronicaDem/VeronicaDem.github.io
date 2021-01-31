import React from 'react';
import {
    Page, 
    LoginScreenTitle, 
    List, 
    ListInput,
    ListButton,
    BlockFooter,
    ListItem
} from 'framework7-react';


import Framework7 from 'framework7/framework7-lite.esm.js';

export default class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username:"",
            password:"",
            email:"",
            area:"",
            areas:[]
        }

    }
    componentDidMount() {
        let areas = [];
        let first_area = "";
        Framework7.request.get("https://api.godialog.ru/api/v1/333/areas/all/true",{} ,(data)=> {
           data = JSON.parse(data);
          
        Object.keys(data).map((key, index)=> {
              
            
            
              areas.push(
                  {
                      area_id: data[key].id,
                      name: data[key].name
                  }
              )
           })
          
           this.setState({areas})
        })
    }
    onSignUp() {
     
       Framework7.request.promise.post('https://api.godialog.ru/api/v1/333/users/signup/true', {
            "form-fname": this.state.username,
            "form-pass": this.state.password,
            "form-email":this.state.email,
            "form-area": this.state.areas[this.state.area].area_id
          }).then((data)=> {
            console.log(data);
          })
    }
    render() {
        return (
            <Page noToolbar noNavbar noSwipeback loginScreen>
        <LoginScreenTitle>Регистрация через GO</LoginScreenTitle>
        <List form>
          <ListInput
            label="Username"
            type="text"
            validate
            pattern="\S.{4,}\S"
            errorMessage="Введите > 5 символов"
            placeholder="Имя Фамилия"
            value={this.state.username}
            min="6"
            onInput={(e) => {
              this.setState({ username: e.target.value});
            }}
          />
           <ListInput
            label="Email"
            type="email"
            
            validate
            placeholder="Имя Фамилия"
            value={this.state.email}
            onInput={(e) => {
              this.setState({ email: e.target.value});
            }}
          />
          <ListInput
            label="Password"
            type="password"
            validate
            placeholder="Пароль"
            pattern="\S.{8,}\S"
            errorMessage="Введите > 10 символов"
            value={this.state.password}
            onInput={(e) => {
              this.setState({ password: e.target.value});
            }}
          />
        </List>
        <List>
            <ListItem title="Площадка"
                      smartSelect
                      smartSelectParams={{searchbar: true, searchbarPlaceholder: 'Найди свою площадку'}}
            >
            <select name="form-area" onChange={(e)=>{this.setState({area: e.target.selectedIndex})}}>
                {
                    this.state.areas.map((item, index)=> {
                    
                    return <option value={item.area_id} data-name={item.name}>{item.name}</option>
                    })
                }
            </select>
            </ListItem>
        </List>
        <List>
          <ListButton onClick={this.onSignUp.bind(this)}>Sign Up</ListButton>
          <BlockFooter>Go</BlockFooter>
        </List>
      </Page>
        )
    }
}