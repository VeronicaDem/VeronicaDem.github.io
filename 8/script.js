let current = "index";
let current_fio = window.localStorage.getItem('fio');
let current_telephone = window.localStorage.getItem('telephone');
let current_region = window.localStorage.getItem('region');
let current_message = window.localStorage.getItem('message');
if(current_fio) {
   $("[name='fio']").val(current_fio);
}
if(current_telephone) {
  $('[name="telephone"]').val(current_telephone);
}
if(current_region) {
   $(`[value='${current_region}'`)[0].selected = true;
}
if(current_message) {
   $("[name='textarea']").val(current_message);
}
$("[name='fio']").bind('input',(e)=> {
  current_fio = e.target.value;
  window.localStorage.setItem('fio',current_fio);
})
$("[name='telephone']").bind('input',(e)=> {
  current_telephone =e.target.value;
  window.localStorage.setItem('telephone',current_telephone);
})
$('select').on('change',(e)=>{
  current_region = this.value;
  window.localStorage.setItem('region',current_region);
})
$('textarea').bind('input', (e)=> {
  current_message = this.value;
  window.localStorage.setItem('message',current_message);
})
$(".hamburger").click(function(ev) {
    $(".mobile-header-list").toggle();
})
$(".btn-menu").click(function() {
    $(".desk-menu").toggle();
})
$(".exit").click(function() {
    $(".popup-container").hide();
    document.body.style.overflow = "auto";
    current = "index";
    history.back();
})
$(".btn-call").click(()=>{
    $(".popup-container").show();
    curren = "contact";
    document.body.style.overflow = "hidden";
    history.pushState(null, null, "./contact");
})
window.onpopstate = (e)=> {
  if(current == "index") {
     $(".popup-container").hide();
  }
};
$(".btn-contact").click((e)=> {
  alert("Тут");
  let fio = document.forms["form-contact"]["fio"].value;
  let telephone = document.forms["form-contact"]["telephone"].value;
  let region = $("option:selected").val();
  let message = document.forms["form-contact"]["textarea"].value;
 alert(fio + " " + telephone + " " + region + " " + message);
  let request = $.ajax({
  url: "https://formcarry.com/s/493WjuAKEOf",
  method: "POST",
  data: { fio, telephone, region, message },
  dataType: "json"
});
 
request.done(function( msg ) {
  alert("ура");
});
 
request.fail(function( jqXHR, textStatus ) {
  alert( "Request failed: " + textStatus );
});
})
