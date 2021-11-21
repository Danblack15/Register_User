const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),//Для парсинга формы
    fs = require('fs'),
    urlencodedParser = bodyParser.urlencoded({ extended: false }),//Для форм
    mysql = require('mysql2/promise'),//Ждя подключения к mysql
    Cookies = require('cookies'),
    nodemailer = require('nodemailer'),
    multer = require('multer');//Для файлов(картинки)

const cookieParser = require('cookie-parser');
const config = require('./config');//Подключение внешнего файла для sql

    app.use(cookieParser());


const upload = multer({dest:"images"});//Для загрузки файла в папку

app.use('/public', express.static('public'));//Для использования статических файлов

app.set('view engine', 'ejs');//Движок ejs для подгрузки файлов ejs

app.get('/', function (req, res) {
    index(req, res);
});

    /*Загрузка и проверка index.ejs*/
function index(req, res){
    let str='';

    async function post_f(){

        const conn = await mysql.createConnection(config);
            const [rows, fields] = await conn.execute("SELECT * FROM posts");
            for (let i = 0; i < rows.length; i++) {

                str += `<div class="content_wrapper">
                <div class="author">
                    <p class="code">[`+ rows[i]['ID'] +`]</p>
                    <p class="name_post">`+ rows[i]['Name'] +`<p class="email_post">`+ rows[i]['Email'] +`</p></p>
                </div>
                <div class="text">
                    <textarea class="post" disabled
                    >`+ rows[i]['Post'] +`</textarea>
                </div>
            </div>`;
            }
            conn.end();
    }

    async function dop(){
        await post_f();
        res.render('index', {data: str});
        
    }   
    dop();
}
    /*Посты в кабинете*/
function person_post(req, res){
    let str='';
    async function post_kb(){

        const conn = await mysql.createConnection(config);
            const [rows, fields] = await conn.execute("SELECT * FROM posts");
            for (let i = 0; i < rows.length; i++) {
                if (rows[i]['ID'] == req.cookies.code){
                    str += `<div class="content_wrapper" ">
                    <div class="author">
                        
                         <p class="code">[`+ rows[i]['ID'] +`]</p>
                            <p class="name_post">`+ rows[i]['Name'] +`<p class="email_post">`+ rows[i]['Email'] +`</p></p>

                        <form action="/delete_post" method="post">
                            <input type="text" name="inc" value="`+rows[i]['inc']+`"></input>
                            <input class="del_post" type="submit" value="&#10006;"></input>
                        </form>

                    </div>
                    <div class="text">
                        <textarea class="post" disabled
                        >`+ rows[i]['Post'] +`</textarea>
                    </div>
                    </div>`;
                }
            }
            conn.end();
    }
 
    async function dop(){
        await post_kb();
        res.render('news', {data: str});
    }
    dop();
}


app.get('/login', function (req, res) {
    res.render('login');
});

app.get('/data', function (req, res) {
    res.render('data');
});

app.get('/news', function (req, res) {
    if (req.cookies.Name) {
        person_post(req, res);

    } else {
        res.render('login');
    }
});



app.post('/data', urlencodedParser, function (req, res) {//POST формы регистарции
    if (!req.body) {
        return res.sendStatus(400);
    }
    console.log(req.body);
    let date = new Date(),
        year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate(),
        time = date.getHours() + ':' + date.getMinutes();



    let bol = new Boolean;
    let bol_2 = new Boolean;
    bol_2 = true;
    async function serth() {
        if (!!req.cookies.Name){
            console.log('Вы уже вошли!');
            res.render('dubl_enter');
            bol = true;
            bol_2 = false;
        }else{
        const conn = await mysql.createConnection(config);//Подключение к БД
        const [rows, fields] = await conn.execute("SELECT * FROM data");
        for (let i = 0; i < rows.length; i++) {
            if (rows[i]['Email'] == req.body.email) {
                bol = true;
                console.log('Повтороние Email при регистр: ', rows[i]['Email']);
                break;
            } else {
                bol = false;
            }
        }
    }
        return bol;
    }

    async function f() {
        let a = await serth();
        //console.log(a);
        if (!bol) {
            f_1();
        } else if (bol_2){
            res.render('not_correct_data');
        }
    }
    f();

    async function main() {
        const conn = await mysql.createConnection(config);
        const [rows, fields] = await conn.execute("INSERT INTO `data`( `Name`, `Surname`, `Old`, `Email`, `Password`, `Reg_Year`, `Reg_Mouth`, `Reg_Day`, `Reg_Time`) VALUES ('" + req.body.name + "','" + req.body.surname + "'," + req.body.old + ",'" + req.body.email + "','" + req.body.password + "', '" + year + "', '" + month + "', '" + day + "', '" + time + "')");

        res.render('succsess_data', { data: req.body });
        console.log('Данные записаны!');
        conn.end();
        return rows;
    }

    async function f_1() {
        let a = await main();
        //console.log(a);
    }


});


app.post('/login', urlencodedParser, function (req, res) {//POST формы входа
    if (!req.body) {
        return res.sendStatus(400);
    }
    let id = '';
    let name = '';
    let code = '';
    console.log(req.body);
    console.log('Cookies: ', req.cookies);


    let bol = new Boolean;
    let bol_2 = new Boolean;
    bol_2 = true;
    async function serth() {
        if (!!req.cookies.Name){
            console.log('Вы уже вошли!');
            res.render('dubl_enter');
            bol = false;
            bol_2 = false;
        }else{
        const conn = await mysql.createConnection(config);//Подключение к БД
        const [rows, fields] = await conn.execute("SELECT * FROM data");
        for (let i = 0; i < rows.length; i++) {
            if (rows[i]['Email'] == req.body.email & rows[i]['Password'] == req.body.password) {
                bol = true;
                id = '' + rows[i]['Email'] + '';
                name = '' + rows[i]['Name'] + '';
                code = '' + rows[i]['ID'] + '';
                break;
            } else {
                bol = false;
            }
        }
    }
    return bol;
    }

    async function f() {
        let a = await serth();
        //console.log(a);
            if (bol) {
                console.log('Email: ', id);
                console.log('Name: ', name);
                console.log('ID: ', code);
                name = `${encodeURIComponent(name)}`;
                console.log('Закодированое имя: ', name);//Кодировка русских символов
                console.log('Раскодированое имя: ', decodeURIComponent(name));//Декодировка
                res.setHeader('Set-Cookie', ['id=' + id + '', 'Name=' +`${encodeURIComponent(name)}` + '', 'code=' + code + '']);//Запись кукис
                //person_post(req, res);
                res.redirect('/news');
            } else if (bol_2){
                res.render('not_correct_enter');
            }
    }
    f();


});


app.post('/post', urlencodedParser, function (req, res) {
    if (!req.body){
        return res.sendStatus(400);
    }

    id = req.cookies.code;
    Name = decodeURIComponent(req.cookies.Name);
    text = "" + req.body.text +"";
    email = req.cookies.id;

    async function post(){
        const conn = await mysql.createConnection(config);
        const [rows, fields] = await conn.execute("INSERT INTO `posts`( `ID`, `Name`, `Post`, `Email`) VALUES ('" + id + "','" + Name + "','" + text + "','"+ email +"')");
        console.log('Пост записан!');
        conn.end();
        return rows;
    }

    async function cb(){
        let a = await post();
        console.log(a);
        //index(req, res);
        res.redirect('/news');
    }
    cb();
});


app.post('/delete_post', urlencodedParser, function(req, res){
    if (!req.body){
        return res.sendStatus(400);
    }

    var id = req.body.inc;
        console.log(id);

    


        async function serth_2(){
            const conn = await mysql.createConnection(config);
            const [rows, fields] = await conn.execute("DELETE FROM `posts` WHERE inc='"+ id +"'");
            console.log('Данные удалены!');
            conn.end();
            return rows;
        }
    
        async function cb(){
            let a = await serth_2();
            console.log(a);
            //person_post(req, res);
            res.redirect('/news');
        }
        cb();

});


app.post('/load_img', upload.single('filedata'), function(req, res){
    
    let filedata = req.file;
    

    console.log(filedata);
    if(!filedata)
        res.send("Ошибка при загрузке файла");
    else
        res.send("Файл загружен");
});



app.listen(3000, function () {
    console.log('Сервер запущен..');
});

