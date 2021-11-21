jQuery(function() {
    let name = $.cookie('Name');

    name = decodeURIComponent(name);

    $('.kab').html(name);

    if (!$.cookie('Name')){
        $('.kab').html('Войти');
    }
})