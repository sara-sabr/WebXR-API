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
        console.log(buffer.byteLength);
        const uint16Buf = new Uint16Array(buffer); 
        try{
        fs.writeFileSync('./test.mp3', uint16Buf);}
        catch(e){
            console.log(e);
        }

    });
