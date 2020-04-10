/**
 * Файл логики всего приложения
 * в Go хранятся объекты типов:
 *  - obj - смысловые элементы
 *  - fn - функции
 */
(
 function(G, U) {
     const MODE = 'DEV'; // 'DEV' || 'PROD'
     var Go = {};
     Go.obj = {};
     Go.fn = {};
     
      // ********************** // 
     // ******  FN ********* // 
     // ********************* //
     Go.fn.validate = function(self, parent) {
        let {indicatorValidate, invalidFieldElem, errorMessageElem }= Go.obj.constants.forms;
        if(self[indicatorValidate]) {
           $(parent.root + " " + invalidFieldElem).removeClass(invalidFieldElem.substr(1));
           $(parent.root + " :invalid").addClass(invalidFieldElem.substr(1));
           $(parent.root + " " + errorMessageElem).hide();
           $(parent.root + " " + invalidFieldElem).parent().children(errorMessageElem);
           $(parent.root + " " + invalidFieldElem).parent().parent().children(errorMessageElem);
        }
    }
     // ********************** // 
     // ******  OBJ ********* // 
     // ********************* //
     Go.obj.constants = {
        forms: {
            invalidFieldElem: '.invalid-field',
            errorMessageElem: '.input-error-message',
        }
     }
      /* ******** requests ****** */
    Go.obj.requests = {
        domain : 'https://api.godialog.ru/api/',
        version : 'v1',
        keyDev : '333',
        keyProd: '', // генерируется на сервере
        requestsNames: {
          signIn: '/users/signin/true',
          signUp : '/users/signup/true',
          showAllAreas: '/areas/all/true'
        },
        partsOtherRequests: {
            afterLinkConfirmation: '&code=' // linkConfirmation + afterLinkConfirmation + value : value - вводится пользователем
 
        }
     }
     let key = MODE == 'DEV' ? Go.obj.requests.keyDev : Go.obj.requests.keyProd;
     /* ******* signIn ******* */
     Go.obj.signIn = {
         selectors : {
             root: '[name="signInGo"]',
             showHidePasswordInputElem: 'input[data-toggle=show-hide-password]',
             fields: {
                username_or_email : '[name="form-login"]',
                password: '[name="form-pass"]'
             }
         },
         fieldsName: {
            username_or_email: 'form-login',
            password: "form-pass"
         },
         indicatorValidate: 'wasFirstSignIn',
        
     }
     Go.obj.signIn.showHidePassword = function(self) {
        var input = self.$(Go.obj.signIn.selectors.showHidePasswordInputElem);
                
        if (input.attr('type') == 'password') {
            input.attr('type', 'text');
            self.$setState({
                isPasswordVisible: true
            });
        } else {
            input.attr('type', 'password');
            self.$setState({
                isPasswordVisible: false
            });
        }
     } 
     Go.obj.signIn.onValidate = function(self) {
         Go.fn.validate(self, Go.obj.signIn);
     }
     Go.obj.signIn.onInit = function() {
  
         $(Go.obj.signIn.selectors.root + " " + Go.obj.constants.forms.errorMessageElem).hide();
     }
     Go.obj.signIn.onClick = function(self,app) {
         var $$ = self.$$;
          if($$(Go.obj.signIn.selectors.root + " :invalid").length != 0) {
              if(!self.wasFirstSignIn) {
                  Go.obj.signIn.onValidate(self);
                  self.$setState({
                    wasFirstSignIn: true
                  })
                }
                  app.toast.show({
                    icon: '<i class="icon fas fa-lg fa-times"></i>',
                    text: 'Проверьте правильность введенных данных',
                    closeTimeout:3000,
                    position: Go.obj.toasts.defaultPosition,
                    cssClass: Go.obj.toasts.defaultClass + ' ' + Go.obj.toasts.background.error 
                })
          return;
              
          }
          else {
              Framework7.request.post(Go.obj.requests.domain + 
                Go.obj.requests.version + '/' +
                key + '/' + Go.obj.requests.requestsNames.signIn, {
                    [Go.obj.signIn.fieldsName.username_or_email]: $$(Go.obj.signIn.selectors.root  + ' ' + Go.obj.signIn.selectors.fields.username_or_email).val(),
                    [Go.obj.signIn.fieldsName.password]: $$(Go.obj.signIn.selectors.root  + ' ' + Go.obj.signIn.selectors.fields.password).val()
                }, (data)=> {
                    app.toast.show({
                        icon: '<i class="icon fas fa-lg fa-check"></i>',
                        text: 'Вы вошли в систему',
                        closeTimeout:3000,
                        position: Go.obj.toasts.defaultPosition,
                        cssClass: Go.obj.toasts.defaultClass +  ' ' + Go.obj.toasts.background.success

                    })
                }, (error)=> {
                    app.toast.show({
                        icon: '<i class="icon fas fa-lg fa-times"></i>',
                        text: JSON.parse(error.response).error.message,
                        closeTimeout:3000,
                        position: Go.obj.toasts.defaultPosition,
                        cssClass: Go.obj.toasts.defaultClass +  ' ' + Go.obj.toasts.background.error
                    })
                })
          }
     }
     /* ******* toasts ****** */
     Go.obj.toasts = {
        defaultPosition: 'bottom',
        defaultClass : 'toast-round',
        background: {
            error: 'bg-color-red',
            success: 'bg-color-green'
        } 
     }
     /* ******* numpad ******  */
     Go.obj.numpad = {
         containerElem : '.numpad',
         inputElem: 'input[name=otp]',
         digitElem: '.otp-digit',
         classWhenFilledDigit: 'filled'
     }
     Go.obj.numpad.onCreate = function(app, valueMaxLength, func) {
         app.keypad.create({
             containerEl : Go.obj.numpad.containerElem,
             dotButton: false,
             inputEl : Go.obj.numpad.inputElem,
             toolbar : false,
             valueMaxLength,
             on : {
                change: function(keypad, value) {
                    var value = value.toString();
                    var length = value.length;
                    $(Go.obj.numpad.digitElem).text('');
                    $(Go.obj.numpad.digitElem).removeClass(Go.obj.numpad.filled);
                    if (length >= 1 && length <= valueMaxLength) {
                       for (var i = 1; i <= length; i++) {
                           $(Go.obj.numpad.digitElem + ':nth-child(' + i + ')').text(value.charAt(i - 1));
                           $(Go.obj.numpad.digitElem + ':nth-child(' + i + ')').addClass(Go.obj.numpad.classWhenFilledDigit);
                       }
                       func(value);

             }
         }
        }
    })
}
     /* ******* signUp ******  */
     Go.obj.signUp = {
         selectors: {
             root:'[name="loginGo"]',
             fields: {
                username: '[name="form-fname"]',
                password: '[name="form-pass"]',
                email: '[name="form-email"]',
                area : '[name="form-area"]'
             },
             
         },
         fieldsName: {
            username: "form-fname",
            password: "form-pass",
            email : "form-email",
            area: "form-area"
         },
         indicatorValidate: 'wasFirstSignUp',
         numpad : {
             valueMaxLength: 6,
             class : 'otp-verification'
          }
     }
     Go.obj.signUp.onClick = function(app, self) {
         var $$ = self.$$;
        if($$(Go.obj.signUp.root + " :invalid").length != 0) {
            if(!self.wasFirstSignUp) {
                Go.obj.signUp.onValidate(self);
                self.$setState({
                    wasFirstSignUp:true
                })
            }
                app.toast.show({
                    icon: '<i class="icon fas fa-lg fa-times"></i>',
                    position: Go.obj.toasts.defaultPosition,
                    cssClass: Go.obj.toasts.defaultClass + " " + Go.obj.toasts.background.error,
                    text: 'Проверьте правильность введенных данных',
                    closeTimeout:3000

                  })
    
               return;
            
        }
        else {
            console.log(
                {
                    [Go.obj.signUp.fieldsName.username]: $$(Go.obj.signUp.selectors.root + ' ' + Go.obj.signUp.selectors.fields.username).val(),
                    [Go.obj.signUp.fieldsName.password]: $$(Go.obj.signUp.selectors.root + ' ' + Go.obj.signUp.selectors.fields.password).val(),
                     [Go.obj.signUp.fieldsName.email]: $$(Go.obj.signUp.selectors.root  + ' ' + Go.obj.signUp.selectors.fields.email).val(),
                     [Go.obj.signUp.fieldsName.area]: $$(Go.obj.signUp.selectors.root + ' ' +  Go.obj.signUp.selectors.fields.area).val()
                }
            );
            Framework7.request.post(
                Go.obj.requests.domain + 
                Go.obj.requests.version + '/' +
                key  + Go.obj.requests.requestsNames.signUp, 
                {
                    [Go.obj.signUp.fieldsName.username]: $$(Go.obj.signUp.selectors.root + ' ' + Go.obj.signUp.selectors.fields.username).val(),
                    [Go.obj.signUp.fieldsName.password]: $$(Go.obj.signUp.selectors.root + ' ' + Go.obj.signUp.selectors.fields.password).val(),
                     [Go.obj.signUp.fieldsName.email]: $$(Go.obj.signUp.selectors.root  + ' ' + Go.obj.signUp.selectors.fields.email).val(),
                     [Go.obj.signUp.fieldsName.area]: $$(Go.obj.signUp.selectors.root + ' ' +  Go.obj.signUp.selectors.fields.area).val()
               }, (data)=> {
                  data = JSON.parse(data);
                  console.log(data);
                  link = data.success.link_confirm;
                  self.$setState({link});
                  if(link) {
                      app.popup.open('.' + Go.obj.signUp.numpad.class);
                  }
                  else {
                      app.toast.show({
                        icon: '<i class="icon fas fa-lg fa-times"></i>',
                        position: Go.obj.toasts.defaultPosition,
                        cssClass: Go.obj.toasts.defaultClass + " " + Go.obj.toasts.background.error,
                        text: data.success.error_message,
                        closeTimeout:3000

                      })
                  }
               }, (error)=>{
                   // вывести toast с ошибкой
                   console.log(error);
               }
             )
        }
     }
     Go.obj.signUp.onValidate = function(self) {
         Go.fn.validate(self, Go.obj.signUp);
     }
     Go.obj.signUp.createNumpad = function(app, self){
       
                   /* проверка на правильность */
                   // func(self, value)
        function sendRequest(value) {
            let length = value.length;
             if(length == Go.obj.signUp.numpad.valueMaxLength) {
                    
                    Framework7.request.get(`${self.link}` + Go.obj.requests.partsOtherRequests.afterLinkConfirmation + value, {}, (data)=> {
                    $(Go.obj.numpad.digitElem).text('');
                    $(Go.obj.numpad.digitElem).removeClass(Go.obj.numpad.classWhenFilledDigit);
                            app.toast.show({
                                icon: '<i class="icon fas fa-lg fa-check"></i>',
                                text: 'Вы успешно зарегистрированы',
                                closeTimeout:3000,
                                position: Go.obj.toasts.defaultPosition,
                                cssClass: Go.obj.toasts.defaultClass + " " + Go.obj.toasts.background.success
                            })
                         

                            app.views.main.router.navigate('/user-page');

                            app.popup.close("." + Go.obj.signUp.numpad.class);
                            app.popup.destroy('.' + Go.obj.signUp.numpad.class);
                            
                    }, (error)=> {
                        $(Go.obj.numpad.digitElem).text('');
                        $(Go.obj.numpad.digitElem).removeClass(Go.obj.numpad.classWhenFilledDigit);
                            
                            app.toast.show({
                              icon: '<i class="icon fas fa-lg fa-times"></i>',
                              position: Go.obj.toasts.defaultPosition,
                                cssClass: Go.obj.toasts.defaultClass + " " + Go.obj.toasts.background.error,
                                text: 'Неправильный код',
                                closeTimeout:3000

                            })
                            
                    })
                   }
                }
                
                       
            Go.obj.numpad.onCreate(app, Go.obj.signUp.numpad.valueMaxLength, sendRequest);
    
     }
     Go.obj.signUp.onInit = function(self,app) {
        $(Go.obj.signUp.selectors.root + " " + Go.obj.constants.forms.errorMessageElem).hide();
        let areas = [];
        let first_area = "";
        console.log(Go.obj.requests.domain + 
            Go.obj.requests.version + '/' +
            key  + 
            Go.obj.requests.requestsNames.showAllAreas);
        Framework7.request.json(Go.obj.requests.domain + 
                               Go.obj.requests.version + '/' +
                               key  + 
                               Go.obj.requests.requestsNames.showAllAreas, {},
        (data)=>{
           Object.keys(data).map((key, index)=> {
            areas.push(
                {
                    area_id: data[key].id,
                    name: data[key].name
                }
            )
            })
            
            self.$setState({areas, first_area: areas[0].name});
         // вставить numpad
           
        });
            Go.obj.signUp.createNumpad(app, self);
        
        
     }
     
     G.Go = Go;

 }
)(this,undefined);
