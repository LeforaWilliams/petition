let registrationWrap = $("div.registration-page-wrap"),
    registrationWrapOffset = registrationWrap.offset().top / 3,
    documentEl = $(document);

documentEl.on("scroll", function() {
    if (
        documentEl.scrollTop() > registrationWrapOffset //&&
        // registrationWrap.hasClass("together")
    ) {
        // registrationWrap.removeClass("together");
        $(".fly-in-letters").addClass("hidden");
        $(".img-1").addClass("img-ex-1");
        $(".img-2").addClass("img-ex-2");
        $(".img-3").addClass("img-ex-3");
        $(".img-4").addClass("img-ex-4");
        $(".img-5").addClass("img-ex-5");
        $(".img-6").addClass("img-ex-6");
    } else {
        // $(".fly-in-letters").removeClass("hidden");
        $(".fly-in-letters").removeClass("hidden");
        $(".img-1").removeClass("img-ex-1");
        $(".img-2").removeClass("img-ex-2");
        $(".img-3").removeClass("img-ex-3");
        $(".img-4").removeClass("img-ex-4");
        $(".img-5").removeClass("img-ex-5");
        $(".img-6").removeClass("img-ex-6");
    }
});
