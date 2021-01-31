/**
 * Файл логики всего приложения
 * в Go хранятся объекты типов:
 *  - obj - смысловые элементы
 *  - fn - функции
 */
// TODO :
// - доделать запросы
// - протестировать работу запросов с goRequest +
// - спросить по key
(
 function(G, U) {
     const MODE = 'DEV'; // 'DEV' || 'PROD'
     var Go = {};
     Go.obj = {};
     Go.fn = {};
     
      // ********************** // 
     // ******  FN ********* // 
     // ********************* //
     Go.fn.goRequest = function(api={} ) {
        
         console.log(api.uri);
        app.request({
        headers: {},//
        url: api.uri +'/'+ api.object +'/'+ api.method +'/'+ api.key,
        dataType: 'json',
        contentType: "application/json",
        method: api.methodRequest,
        data: api.dataRequest,//
        statusCode: {
        404: function (xhr) {
        console.log("URL not found");
        },
        400: function (xhr) {
        console.log("Bad request. Some of the inputs provided to the request aren't valid.");
        },
        401: function (xhr) {
        console.log("Not authenticated. The user session isn't valid.");
        },
        403: function (xhr) {
        console.log("The user isn't authorized to perform the specified request.");
        },
        500: function (xhr) {
        console.log("Internal server error. Additional details will be contained on the server logs.");
        },
        201: function (xhr) {
        console.log("The requested resource has been created.");
        }
        },
        success: api.onSuccess
        ,
        error: api.onFailure
        
        })    
        
        }
    
     Go.fn.validate = function(self, parent) {
         /*
        let {indicatorValidate, invalidFieldElem, errorMessageElem }= Go.obj.constants.forms;
        if(self[indicatorValidate]) {
           $(parent.root + " " + invalidFieldElem).removeClass(invalidFieldElem.substr(1));
           $(parent.root + " :invalid").addClass(invalidFieldElem.substr(1));
           $(parent.root + " " + errorMessageElem).hide();
           $(parent.root + " " + invalidFieldElem).parent().children(errorMessageElem);
           $(parent.root + " " + invalidFieldElem).parent().parent().children(errorMessageElem);
        }*/
        
        
        $(parent.selectors.root).valid();
       
    }
    Go.fn.createValidator = function(form, params) {
        
       $(form).validate(params);
    }
     // ********************** // 
     // ******  OBJ ********* // 
     // ********************* //


      /* ******** requests ****** */
    Go.obj.requests = {
        host : 'https://api.godialog.ru/api/',
        version : 'v1',
        keyDev : '333',
        keyProd: '', // генерируется на сервере
        requestsNames: {
          signIn: {
              object: 'users',
              method: 'signin'
          },
          signUp : {
              object: 'users',
              method: 'signup'
              
          },
          showAllAreas: {
            object: 'areas',
            method: 'all'
          }
        },
        partsOtherRequests: {
            afterLinkConfirmation: '&code=' // linkConfirmation + afterLinkConfirmation + value : value - вводится пользователем
 
        }
     }
     /*** constants **** */
     Go.obj.constants = {
        forms: {
            invalidFieldElem: '.invalid-field',
            errorMessageElem: '.input-error-message',
            acceptFieldElem: '.accept'
        },
        requests: {
            apiURI : Go.obj.requests.host + Go.obj.requests.version + '/' + 
                     (MODE === "DEV" ? Go.obj.requests.keyDev : Go.obj.requests.keyProd )
         
        }
     }
     

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
         }
        
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
     Go.obj.signIn.onSuccessValidation = function(self) {
         var $$ = self.$$;
         function onSuccess() {
            app.toast.show({
                icon: '<i class="icon fas fa-lg fa-check"></i>',
                text: 'Вы вошли в систему',
                closeTimeout:3000,
                position: Go.obj.toasts.defaultPosition,
                cssClass: Go.obj.toasts.defaultClass +  ' ' + Go.obj.toasts.background.success

            })
         }
         function onFailure() {
            app.toast.show({
                icon: '<i class="icon fas fa-lg fa-times"></i>',
                text: JSON.parse(error.response).error.message,
                closeTimeout:3000,
                position: Go.obj.toasts.defaultPosition,
                cssClass: Go.obj.toasts.defaultClass +  ' ' + Go.obj.toasts.background.error
            })
         }
         console.log("before");
         Go.fn.goRequest({
             onSuccess,
             onFailure,
             methodRequest: "POST",
             object:Go.obj.requests.requestsNames.signIn.object,
             method: Go.obj.requests.requestsNames.signIn.method,
             uri: Go.obj.constants.requests.apiURI,
             dataRequest : {
                [Go.obj.signIn.fieldsName.username_or_email]: $$(Go.obj.signIn.selectors.root  + ' ' + Go.obj.signIn.selectors.fields.username_or_email).val(),
                [Go.obj.signIn.fieldsName.password]: $$(Go.obj.signIn.selectors.root  + ' ' + Go.obj.signIn.selectors.fields.password).val()
             },

         });
         
      }
     
    
     Go.obj.signIn.onFailureValidation = function(self) {
        app.toast.show({
            icon: '<i class="icon fas fa-lg fa-times"></i>',
            text: 'Проверьте правильность введенных данных',
            closeTimeout:3000,
            position: Go.obj.toasts.defaultPosition,
            cssClass: Go.obj.toasts.defaultClass + ' ' + Go.obj.toasts.background.error 
        })
     }
     Go.obj.signIn.initValidate = function(self) {
        
        Go.fn.createValidator(Go.obj.signIn.selectors.root, {
           ignore: "",
           errorElement: 'em',
          
           submitHandler: () => Go.obj.signIn.onSuccessValidation(self),
           invalidHandler: () =>  Go.obj.signIn.onFailureValidation(self)
        },);
    }
     Go.obj.signIn.onInit = function(self) {
         Go.obj.signIn.initValidate(self);
         
     }
     
     Go.obj.signIn.onClick = function(self,app) {
         Go.obj.signIn.onValidate(self);
              
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
         numpad : {
             valueMaxLength: 6,
             class : 'otp-verification'
          }
     }
     Go.obj.signUp.initValidate = function(self) {
        
         Go.fn.createValidator(Go.obj.signUp.selectors.root, {
            ignore: "",
            errorElement: 'em',
            errorPlacement: function(error, element) {
                if (element.attr("id") == "accept") {
                    error.appendTo(Go.obj.constants.forms.acceptFieldElem);
                } 
                else {
                  
                    error.appendTo(`${Go.obj.constants.forms.errorMessageElem}[for=${element.attr("id")}]`);
                }
            } ,
            submitHandler: () => Go.obj.signUp.onSuccessValidation(self),
            invalidHandler: () =>  Go.obj.signUp.onFailureValidation(self)
         },);
     }
     Go.obj.signUp.onSuccessValidation = function(self) {

        var $$ = self.$$;
        function onSuccess(data) {
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
        }
        function onFailure(error) {
            // вывести toast с ошибкой
            console.log(error);
        }
       Go.fn.goRequest({
           onSuccess,
             onFailure,
             methodRequest: "POST",
             object:Go.obj.requests.requestsNames.signIn.object,
             method: Go.obj.requests.requestsNames.signIn.method,
             uri : Go.obj.constants.requests.apiURI,
             dataRequest : {
                [Go.obj.signUp.fieldsName.username]: $$(Go.obj.signUp.selectors.root + ' ' + Go.obj.signUp.selectors.fields.username).val(),
                [Go.obj.signUp.fieldsName.password]: $$(Go.obj.signUp.selectors.root + ' ' + Go.obj.signUp.selectors.fields.password).val(),
                 [Go.obj.signUp.fieldsName.email]: $$(Go.obj.signUp.selectors.root  + ' ' + Go.obj.signUp.selectors.fields.email).val(),
                 [Go.obj.signUp.fieldsName.area]: $$(Go.obj.signUp.selectors.root + ' ' +  Go.obj.signUp.selectors.fields.area).val()
           },
       })
     }
     Go.obj.signUp.onFailureValidation = function() {
        app.toast.show({
            icon: '<i class="icon fas fa-lg fa-times"></i>',
            position: Go.obj.toasts.defaultPosition,
            cssClass: Go.obj.toasts.defaultClass + " " + Go.obj.toasts.background.error,
            text: 'Проверьте правильность введенных данных',
            closeTimeout:3000

          })

     }
     Go.obj.signUp.onClick = function(app, self) {
       if($(Go.obj.signUp.selectors.root).valid()) $(Go.obj.signUp.selectors.root).submit();
        
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
        Go.obj.signUp.initValidate(self);
       
        let areas = [];
        let first_area = "";
        function onSuccess(data) {
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
               
            
               
            
        }
        
        Go.fn.goRequest({
            onSuccess,
             onFailure: ()=>{},
             methodRequest: "GET",
             object:Go.obj.requests.requestsNames.showAllAreas.object,
             method: Go.obj.requests.requestsNames.showAllAreas.method,
             uri: Go.obj.constants.requests.apiURI,
             dataRequest : {
                
           },
        })
        
            Go.obj.signUp.createNumpad(app, self);
            
     }
     
     G.Go = Go;

 }
)(this,undefined);
