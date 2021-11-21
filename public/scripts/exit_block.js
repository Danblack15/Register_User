jQuery(function() {
    let name = $.cookie('Name');
    let code = $.cookie('code');


        name = decodeURIComponent(name);
       $('.name').html(name);
       //$('.code').html(code);

       $('.exit_txt').click(() =>{
        $.cookie('Name', null);
        //$.cookie('code', null);
        window.location.replace('http://localhost:3000/news');
        //redirect('http://localhost:3000/news');
       });



       if (!$.cookie('Name')){
           $('.exit_wrapper').css({
               'display': 'none'
           });
       }




})