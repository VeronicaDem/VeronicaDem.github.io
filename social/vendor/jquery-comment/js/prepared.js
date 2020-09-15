

async function requestGo(method, url=false, data={}) {
    // Default options are marked with *
    
    
    
    const response = await fetch(url, Object.assign( {
    method: method, // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
    'Content-Type': 'application/json',
    'Authorization': localStorage.authToken,
    //'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *client
    //credentials: 'include',
    
    
    }, method=='GET' ? {} : {body: JSON.stringify(data)}));
    let JWT = response.headers.get('Expires');
    console.log(JWT);
    if (response.ok) {
    //process jwt
    if(JWT){
    if(JWT == 'end'){
    console.log('jwt-end');
    delete localStorage.authToken;
    delete localStorage.loginData;
    //window.location.replace("/gen.html");//go login
    }else{
    localStorage.authToken = JWT;
    console.log(JWT);
    console.log('jwt-good');
    }
    }else{
    console.log('server-bad-request');
    localStorage.authToken = localStorage.authToken;
    }
    } else {//if server-error
    localStorage.authToken = localStorage.authToken;
    console.log("error HTTP: " + response.status);
    }
    console.log(response);
    return await response.json(); // parses JSON response into native JavaScript objects
    }
    
  
  async function queryGo(api=[]){
      let uri = apiURI +'/'+ api.object +'/'+ api.method +'/'+ api.key;
      console.log(api);
      requestGo(api.methodRequest, uri, api.dataRequest)
        .then((data) => {
              if(data.name_user){
                  //$("#user").html('<div>'+ data.name_user +'</div><div><img src="'+ data.avatar_user +'.s.jpg" /></div>');
                  //СЃРѕС…СЂР°РЅРёРј РґР°РЅРЅС‹Рµ СЋР·РµСЂР° 
                  localStorage.setItem("loginData", JSON.stringify( data ));
                  
              }
          console.log(data);
        });
  }
  
  
  
  
  
  
  
  
  
  /*
  async function requestGo(method, url=false, data={}) {
      // Default options are marked with *
      const response = await fetch(url, Object.assign({
          method: method, // *GET, POST, PUT, DELETE, etc.
          mode: 'cors', // no-cors, *cors, same-origin
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          credentials: 'same-origin', // include, *same-origin, omit
          headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': localStorage.authToken,
          },
          redirect: 'follow', // manual, *follow, error
          referrerPolicy: 'no-referrer', // no-referrer, *client
          //credentials: 'include',
          // body data type must match "Content-Type" header
      }, method=='GET' ? {} : {body: JSON.stringify(data)}));
      let JWT = response.headers.get('Expires');
      console.log(JWT);
      if (response.ok) {
          //process jwt
          if(JWT){
              if(JWT == 'end'){
                  console.log('jwt-end');
                  delete localStorage.authToken;
                  delete localStorage.loginData;
                  window.location.replace("/gen.html");//go login
              }else{
                  localStorage.authToken = JWT;
                  console.log(JWT);
                  console.log('jwt-good');
              }
          }else{
              console.log('server-bad-request');
              localStorage.authToken = localStorage.authToken;
          }
      } else {//if server-error
          localStorage.authToken = localStorage.authToken;
          console.log("error HTTP: " + response.status);
      }
      console.log(response);
      return await response.json(); // parses JSON response into native JavaScript objects
  }
  
  
  
  
  async function queryGo(api=[]){
  let uri = apiURI +'/'+ api.object +'/'+ api.method +'/'+ api.key;
      console.log(api);
      requestGo(api.methodRequest, uri, api.dataRequest)
      .then((data) => {
          if(data.name_user){
              //$("#user").html('<div>'+ data.name_user +'</div><div><img src="'+ data.avatar_user +'.s.jpg" /></div>');
              //РЎРѓР С•РЎвЂ¦РЎР‚Р В°Р Р…Р С‘Р С Р Т‘Р В°Р Р…Р Р…РЎвЂ№Р Вµ РЎР‹Р В·Р ВµРЎР‚Р В°
              localStorage.setItem("loginData", JSON.stringify( data ));
              window.location.replace("/");
          }
          //console.log(data);
      });
  }
  
  */
  
  
  
  
  
  
  
  
  
  
  
  
  /*
  let postOK = {
  methodRequest : 'POST',
  object : 'users',
  method : 'test',
  key	   : 'ok',
  dataRequest   : {go:"999"}
  };
  
  queryGo(postOK);*/