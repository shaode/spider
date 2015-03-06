
var timer = null;
var instance = new gmu.Toolbar('#J_toolbar1');
instance.position({ top: window.innerHeight + window.scrollY - Zepto("#J_toolbar1").height() });

Zepto(document).on('touchstart', function() {
    Zepto("#J_toolbar1").hide();
});

Zepto(document).on('touchmove', function() {
    Zepto("#J_toolbar1").hide();
});

Zepto(document).on('touchend', function() {
    if (timer) { clearTimeout(timer); }

    timer = setTimeout(function() {
        Zepto("#J_toolbar1").show().css({
            position: 'absolute',
            top: window.innerHeight + window.scrollY
        }).animate({
            top: window.innerHeight + window.scrollY - Zepto("#J_toolbar1").height()
        });
    }, 1000);
});
