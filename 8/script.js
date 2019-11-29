$(".hamburger").click(function(ev) {
    $(".mobile-header-list").toggle();
})
$(".btn-menu").click(function() {
    $(".desk-menu").toggle();
})
$(".exit").click(function() {
    $(".popup-container").hide();
    document.body.style.overflow = "auto";
})
$(".btn-call").click(()=>{
    $(".popup-container").show();
    document.body.style.overflow = "hidden";
    history.pushState(null, null, "./contact");
})
