import { Framework7StateKernel, framework7Reducer, syncFramework7WithStore } from 'framework7-redux';
import { createStore, combineReducers, applyMiddleware ,createStoreWithMiddleware} from 'redux';

import middleware from './middlewares/promises';
let initialState = {
    username:"",
    password:"",
    auth_token:""
  
  }
  export const stateKernel = new Framework7StateKernel();
 
function reducer(state = initialState,action) {
    switch(action.type) {
        case 'startSignIn': {
            return state;
        }
        case "changeUser": /* success signIn*/
            {
                
                let {username, password} = action.payload;
                 return {...state, ...{username, password}};
            }
        case "failureSignIn": 
        {
            return state;
        }
        case "SETTOKENSUCCESS": 
        {
           /* let auth_token = state.auth_token;
            Framework7.request.promise.get("https://cors-anywhere.herokuapp.com/https://api.godialog.ru/api/v1/333/users/auttoken/true", {
          "form-username": state.username,
          "form-pass": state.password,
        }).then((data)=> {*/
          let {auth_token} = action.payload;
          auth_token = objJSON.auth_token || state.auth_token;
        //})
        return {...state, ...{auth_token}};
        }
        case "SETTOKKENFAULURE":
            /* отдать страницу с регистрацией / авторизацией при failure*/
            console.log("something wrong");
           return state;
        default :
          return state;
    }
  }
  
export const store = createStore(
   combineReducers({
     framework7: framework7Reducer,
     reducer
   })
);

syncFramework7WithStore(store, stateKernel);