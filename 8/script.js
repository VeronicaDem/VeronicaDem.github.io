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
   $('select').val(current_region);
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
  current_region = $("option:selected").val();
  window.localStorage.setItem('region',current_region);
})
$('textarea').bind('input', (e)=> {
  current_message = e.target.value;
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
$(".btn-call").click((e)=>{
  alert(e.target);
  alert($(e.target).hasClass("mobile"));
   if($(e.target).hasClass("mobile")) {
      
      $(".popup").css({"left":0});
 }
    $(".popup-container").show();
    current = "contact";
    document.body.style.overflow = "hidden";
    history.pushState(null, null, "./contact");
})
window.onpopstate = (e)=> {
  if(current == "contact") {
     $(".popup-container").hide();
  }
};
$(".btn-contact").click((e)=> {
  
  let fio = document.forms["form-contact"]["fio"].value;
  let telephone = document.forms["form-contact"]["telephone"].value;
  let region = $("option:selected").val();
  let message = document.forms["form-contact"]["textarea"].value;
 
  let request = $.ajax({
  url: "https://formcarry.com/s/493WjuAKEOf",
  method: "POST",
  data: { fio, telephone, region, message },
  dataType: "json"
});
 
request.done(function( msg ) {
  alert("ура");
  window.localStorage.removeItem("fio");
  window.localStorage.removeItem("telephone");
  window.localStorage.removeItem("region");
  window.localStorage.removeItem("message");
  $("[name='fio']").val("");
  $('[name="telephone"]').val("");
 $('select').val("Регион");
 $("[name='textarea']").val("")
});
 
request.fail(function( jqXHR, textStatus ) {
  alert( "Request failed: " + textStatus );
});
})