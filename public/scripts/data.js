jQuery(function() {
    let button = $('.btn');

        button.click(function (){
            let old = $('input[name = "old"]').val(),
                pass = $('input[name = "password"]').val(),
                pass_2 = $('input[name = "password_2"]').val();

             if (old >100){//Проверка возраста
                event.preventDefault(); 
                console.log('Неверное указан возраст');
                $('input[name = "old"]').val('');
                $('input[name = "old"]').attr("placeholder", "НЕВЕРНО УКАЗАН ВОЗРАСТ");
             }else{
                event.returnValue = true;
             }

             if (pass != pass_2){//Сверка паролей
                event.preventDefault(); 
                console.log('Пароли не совпадают!');
                $('input[name = "password"]').val('');
                $('input[name = "password_2"]').val('');
                $('input[name = "password"]').attr("placeholder", "ПАРОЛИ НЕ СОВПАДАЮТ");
                $('input[name = "password_2"]').attr("placeholder", "ПАРОЛИ НЕ СОВПАДАЮТ");
             }else{
                event.returnValue = true;
             }
        })

})