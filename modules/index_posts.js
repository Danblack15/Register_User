async function post_f(){

    const conn = await mysql.createConnection(config);
        const [rows, fields] = await conn.execute("SELECT * FROM posts");
        for (let i = 0; i < rows.length; i++) {

            str += `<div class="content_wrapper">
            <div class="author">
                <p class="code">[`+ rows[i]['ID'] +`]</p>
                <p class="name_post">`+ rows[i]['Name'] +`<p class="email_post">(`+ rows[i]['Email'] +`)</p></p>
            </div>
            <div class="text">
                <textarea class="post" disabled
                >`+ rows[i]['Post'] +`</textarea>
            </div>
        </div>`;
        }
        conn.end();
        console.log(str);
}