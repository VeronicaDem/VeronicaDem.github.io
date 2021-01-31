import Framework7 from 'framework7/framework7-lite.esm.js';
export function getPromiseSignInGo({username, password}) {
    return Framework7.request.promise.post('https://api.godialog.ru/api/v1/333/users/signin/true', {
        "form-username": username,
        "form-pass": password,
        
      })
}
export function getPromiseSetTokenGo({username, password}) {
    return Framework7.request.promise.get("https://cors-anywhere.herokuapp.com/https://api.godialog.ru/api/v1/333/users/auttoken/true", {
        "form-username": username,
        "form-pass": password,
      })
}