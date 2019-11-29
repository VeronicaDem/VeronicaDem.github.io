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
window.onpopstate((e)=> {
  if(current == "index") {
     $(".popup-container").hide();
  }
});
