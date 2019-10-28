let JSON = {
    "deserts": {
        "tovari": [
            {
                "name":"сердечки",
                "cost": 250
            }
        ],
        "options":false,
        "properties":null
    },
    "vegan_meat": {
        "tovari": [
            {
                "name": "весна",
                "cost" : 100
            },
            {
                "name":"морковный поцелуй",
                "cost": 150
            },
            {
                "name":"сырный",
                "cost": 200
            },
            {
                "name":"киш",
                "cost": 250
            },
            {
                "name":"с ветчиной",
                "cost": 150
            }
            
        ],
        "options":true,
        "properties":null

    },
    "your": {
        "tovari": null,
        "options":false,
        "properties":[
            {
                "name" : "Добавить лучок",
                "cost" : 50},
            {
                "name":"ветчина",
                "cost" : 20},
            {"name": "курица",
             "cost" :100},
            {"name":"соус красный",
             "cost" :2},
            {"name": "соус белый",
             "cost" : 2},
            {"name":"сыр" ,
             "cost": 20},
            {"name":"салат",
             "cost": 10}
        ]
    }
}

let our_obj = {};
window.addEventListener("DOMContentLoaded", function(e) {
    // это для добавления товара в форму(смотри "Закажите доставкой")
     let add_btns = document.getElementsByClassName("add");

     Array.prototype.forEach.call(add_btns,function(btn) {
         btn.addEventListener("click", function(ev)  {
             let tovar = ev.target.parentNode.dataset.name;
             if(document.getElementsByClassName(tovar).length > 0) return; 
             let div = document.createElement("div");

             div.className = tovar;
             div.innerHTML = tovar;
             div.innerHTML += "<label><input type='number' /></label>"
             let basket = document.getElementById("basket");
             basket.appendChild(div);
         })
     }) 
     let kolvo_field = document.getElementById("kolvo");
     kolvo_field.addEventListener("input", function(ev) {
         our_obj["kolvo"] = ev.target.value;
         if(our_obj["option"] || our_obj["properties"]) {
             // вызвать функцию изменения itog
             let itog = document.getElementById("itog");
             itog.innerHTML = our_obj["kolvo"] * our_obj["sum"];
         }
     })
     let radios = document.getElementsByClassName("type_radio");
     Array.prototype.forEach.call(radios, function(radio) {
         radio.addEventListener("click", function(ev) {
             our_obj["options"] = JSON[ev.target.value];
             console.log(ev.target.value);
             let itog = document.getElementById("itog");
             itog.innerHTML = 0;
             let old_div = document.getElementsByClassName("options");
                console.log(old_div);
                if(old_div.length != 0) {
                    old_div[0].remove();
                }
            old_div = document.getElementsByClassName("props");
            if(old_div.length != 0) {
                old_div[0].remove();
            }
             if(our_obj["options"]["options"]) {
                let old_div = document.getElementsByClassName("options");
                console.log(old_div);
                if(old_div.length != 0) {
                    old_div[0].remove();
                }
                let div = document.createElement("div");
                div.className="options";
                let inner = "";
                our_obj["options"]["tovari"].forEach((item)=> {
                   inner += "<label>"+item.name + "<input type='radio' class='option_radio' name='option' value='" + item.cost + "'/></label><br>"
                })
                div.innerHTML = inner;
                let form = document.getElementById("form_calc");
                form.appendChild(div);
                let radio_options = document.getElementsByClassName("option_radio");
                Array.prototype.forEach.call(radio_options, (option) => {
                   option.addEventListener("click", (ev2)=> { 
                    
                    our_obj["option"] = ev2.target.value;
                    console.log(our_obj["option"]);
                    let sum = 0;
                   
                    our_obj["kolvo"] = document.getElementById("kolvo").value || document.getElementById("kolvo").getAttribute("placeholder");
                    our_obj["sum"] = sum + our_obj["option"];
                    sum = our_obj["sum"];
                    sum *= our_obj["kolvo"];
                    let itog = document.getElementById("itog");
                    itog.innerHTML = sum;
                })
                })
            }
              else {
                  if(our_obj["options"]["tovari"]) {
                      our_obj["option"] = our_obj["options"]["tovari"][0].cost;
                      our_obj["sum"] = our_obj["option"];
                      our_obj["kolvo"] = document.getElementById("kolvo").value || document.getElementById("kolvo").getAttribute("placeholder");
                      let sum = our_obj["sum"];
                      sum *= our_obj["kolvo"];
                      let itog = document.getElementById("itog");
                      itog.innerHTML = sum;
  
                  }

              }
              if(our_obj["options"]["properties"]) {
                  let old_div = document.getElementsByClassName("props");
                  if(old_div.length != 0){
                      old_div[0].remove();
                  }
                   let div = document.createElement("div");
                  div.className="props";
                  let inner = "";
                  our_obj["options"]["properties"].forEach((prop) => {
                      inner +=  "<label><input type='checkbox' class='prop_check' name='prop_check' value='" + prop["name"] + "' data-cost='" + prop["cost"] + "'/>" + prop["name"] + "</label>";
                      inner += "<br>";
                  })
                  div.innerHTML = inner;
                  let form = document.getElementById("form_calc");
                  form.appendChild(div);
                  let props_check = document.getElementsByClassName("prop_check");
                  
                  
                  if(!our_obj["properties"]) {
                      console.log("тута были");
                      our_obj["properties"] = {};
                  }
                  Array.prototype.forEach.call(props_check, (check) => {
                      check.addEventListener("click", function(ev3) {
                          if(!ev3.target.checked) {
                              delete our_obj["properties"][ev3.target.value];
                          }
                          else {
                              our_obj["properties"][ev3.target.value] = ev3.target.dataset.cost;

                          }
                          our_obj["sum"] = 0;
                          Object.keys(our_obj["properties"]).forEach((prop) => {
                              console.log(our_obj["properties"][prop]);
                              
                              our_obj["sum"] += Number(our_obj["properties"][prop]);
                          })
                          let sum = our_obj["sum"];
                          console.log(sum);
                          our_obj["kolvo"] = document.getElementById("kolvo").value || document.getElementById("kolvo").getAttribute("placeholder");
                          sum *= Number(our_obj["kolvo"]);
                          console.log(sum);
                          let itog = document.getElementById("itog");
                          itog.innerHTML = sum;
                      })
                  })
              }
             
          })
     })
});
