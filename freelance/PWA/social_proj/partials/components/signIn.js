var tmpl = document.createElement('template');
tmpl.innerHTML = `
  <div class="view">
  <div class="page">
  <div class="navbar">
      <div class="navbar-inner">
          <div class="left ios-only">
              <a class="link popup-close" href="#">
                  <span class="" data-i18n="close">Close</span>
              </a>
          </div>
          <div class="title">Авторизируйтесь через 
              <span class="social-name"></span>
          </div>
      </div>
  </div>
  <div class="page-content">
<div class="block text-align-center">
  <img class="signIn-icon" src="" alt="" width="128"/>
</div>
<form class="signIn-form" action="#" method="POST" enctype="multipart/form-data">
  <div class="list no-hairlines-between no-margin-bottom">
      <ul>
          <li>
              <div class="item-content item-input item-input-with-info item-input-with-value">
                  <div class="item-media">
                      <i class="icon f7-icons ios-only">email</i>
                  </div>
                  <div class="item-inner">
                      <div class="item-input-wrap">
                          <input class="input-with-value" type="email" name="email" placeholder="Email" required/>
                          <div class="item-input-info input-error-message">

                          </div>
                      </div>
                  </div>
              </div>
          </li>

          <li>
            <div class="item-content item-input item-input-with-info item-input-with-value">
                  <div class="item-media">
                      <i class="icon f7-icons ios-only">lock</i>
                  </div>
                  <div class="item-inner">
                      <div class="item-input-wrap">
                          <input class="input-with-value" type="password" name="password" placeholder="Password" required/>
                          <div class="item-input-info input-error-message">

                          </div>
                      </div>
                  </div>
              </div>   
          </li>
      </ul>
  </div>

</form>
</div>
</div>

`;
/*class SignIn extends HTMLElement {
    constructor() {
        super();
        this.socialName = this.getAttribute('social-name') || "",
        this.popupClass = this.getAttribute('popup-class') || "",
        this.signInForm = this.getAttribute('signin-form') || "",
        this.signInIcon = this.getAttribute('signin-icon') || ""
    }
    connectedCallback() {
       

        this.attachShadow({mode:'open'});
        this.shadowRoot.append(tmpl.content.cloneNode(true));
        this.shadowRoot.querySelector('.popup').classList.add(this.popupClass);
        this.shadowRoot.querySelector('.social-name').innerHTML = this.socialName;
        this.shadowRoot.querySelector('.signIn-icon').setAttribute('src', this.signInIcon);
        this.shadowRoot.querySelector('.signIn-form').setAttribute('name', this.signInForm);
    }
}*/
if(!customElements.get('sign-in')) {
customElements.define('sign-in', class extends HTMLDivElement {
    constructor() {
        super();
        this.socialName = this.getAttribute('social-name') || "",
        this.popupClass = this.getAttribute('popup-class') || "",
        this.signInForm = this.getAttribute('signin-form') || "",
        this.signInIcon = this.getAttribute('signin-icon') || ""
    
    }
    connectedCallback() {
        
        this.classList.add('popup', 'popup-tablet-fullscreen', this.popupClass);
        

        
        
        this.append(tmpl.content.cloneNode(true));
        
        this.querySelector('.social-name').innerHTML = this.socialName;
        this.querySelector('.signIn-icon').setAttribute('src', this.signInIcon);
        this.querySelector('.signIn-form').setAttribute('name', this.signInForm);
    }
}, {extends: 'div'});
}