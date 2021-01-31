var tmlp = document.createElement('template');
tmpl.innerHTML = `
<div class="page">
        <div class="page-content">
            <div class="block-title text-align-center">
              Регистрация через Go
            </div>
          <form name="loginGo" id="loginGo" action="#" method="POST" enctype="multipart/form-data">
             <div class="list no-hairlines no-hairlines-between no-margin-bottom">
                 <div class="list">
                <ul>
                     
                         <li>
                             <a href="#" class="item-link smart-select">
                                 <select name="form-area">
                                    
                                 </select>
                                 <div class="item-content">
                                     <div class="item-inner">
                                         <div class="item-title">
                                             Площадка
                                         </div>
                                         <div class="item-after">
                                            
                                         </div>
                                     </div>
                                 </div>
                             </a>
                         </li>
                        <li>
                            <div class="item-content item-input item-input-with-info">
                                
                                <div class="item-inner">
                                    <div class="item-title item-floating-label">Email</div>
                                    <div class="item-input-wrap">
                                        <input type="email" name="form-email" placeholder="Email" required>
                                        <div class="item-input-info input-error-message"></div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content item-input item-input-with-info">
                                
                                <div class="item-inner">
                                    <div class="item-title item-floating-label">You name Fan</div>
                                    <div class="item-input-wrap">
                                        <input type="text" name="form-fname" placeholder="You Name Fan" pattern="\S.{4,}\S" required>
                                        <div class="item-input-info input-error-message"></div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content item-input item-input-with-info">
                                
                                <div class="item-inner">
                                    <div class="item-title item-floating-label">Пароль</div>
                                    <div class="item-input-wrap">
                                        <input type="password" name="form-pass" placeholder="Пароль"  pattern="\S.{8,}\S" required>
                                        <div class="item-input-info input-error-message"></div>
                                    </div>
                                </div>
                            </div>
                        </li>
                 </ul>
                 
                </div>
                <a class="button button-raised button-fill send button-large color-gray" href="#">Зарегистрироваться</a>
          </form>
        </div>
    </div>
          </div>`;
if(!customElements.get('signin-go')) {
    customElements.define('signin-go', class extends HTMLElement {
        constructor() {
            super();
            this.areas = [];
            this.currentArea = "";
            this.first_area = "";
            this.pullAreas = this.pullAreas.bind(this);
            this.onSelect = this.onSelect.bind(this);
            this.pullAreas();

        }
        onSelect(e) {
           this.currentArea = this.areas[e.target.selectedIndex];
        }
       async pullAreas() {
           
        let data = await  Framework7.request.get("https://api.godialog.ru/api/v1/333/areas/all/true",{} );
                data = JSON.parse(data);
               console.log(data);
             Object.keys(data).map((key, index)=> {
                   
                 
                 
                  this.areas.push(
                       {
                           area_id: data[key].id,
                           name: data[key].name
                       }
                   )
                })
                
                this.first_area = this.areas[0].name;
               
            
            
        }
        onSignUp() {
            Framework7.request.promise.post('https://api.godialog.ru/api/v1/333/users/signup/true', {
                "form-fname": this.querySelector('[name="form-fname"]').value,
                "form-pass": this.querySelector('[name="form-pass"]').value,
                "form-email": this.querySelector('[name="form-email"]').value,
                "form-area": this.currentArea
            }).then((data)=> {
                console.log(data);
            });
        }
        disconnectedCallback() {
            this.querySelector('[name="form-area"]').removeEventListener('change', this.onSelect);
        }
        connectedCallback() {
            console.log("connectedCallback");
            this.append(tmpl.content.cloneNode(true));
            this.querySelector('.item-after').innerHTML = this.first_area;
            let options = "";
            this.areas.map((item,index)=>{
               if(index == 0) {
                  options += `<option selected value='${item.area_id}'>${item.name}</option>`;
               }
               else {
                   options += `<option value='${item.area_id}'>${item.name}</option>`;
               }

            })
            this.querySelector('[name="form-area"]').innerHTML = options;
            this.querySelector('[name="form-area"]').addEventListener("change", this.onSelect);
        }
    })
}