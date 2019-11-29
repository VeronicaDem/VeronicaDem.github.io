let current = "index";
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
