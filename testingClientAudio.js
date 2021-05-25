const fetch = require('node-fetch');
const https = require('https');
const fs = require('fs');

let browserAgent = new https.Agent({
    rejectUnauthorized: false,
})
let fetchOptions = {
    method: 'GET',
    agent: browserAgent,
}
fetch('https://localhost:8000/audio/test', fetchOptions).then(data => {
    //console.log(data);
    return data.arrayBuffer();
}).then(buffer => {
        try{
        fs.writeFileSync('./test.mp3', Buffer.from(buffer));}
        catch(e){
            console.log(e);
        }

    });
