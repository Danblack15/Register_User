jQuery(function() {
    let arr = $('.pod_header p').length;
    let i = 1;
    function text(){
        $('.pod_header p:nth-child('+ i +')').animate({
            'opacity':'1',
        },1500,function (){
            $('.pod_header p:nth-child('+ i +')').animate({
                'opacity':'0',
            },1500);
            i++;
        });
    }
    setInterval(function (){
        text();
        if (i === arr){
            $('.pod_header p:nth-child('+ i +')').animate({
                'opacity':'0',
            },1500);
            i = 1;
        }
    },3000);

    
        
});