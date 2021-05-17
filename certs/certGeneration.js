const fs = require('fs');
var selfsigned = require('selfsigned');

var attrs = [{ name: 'commonName', value: 'localhost' }];
var pems = selfsigned.generate(attrs, { days: 365 });

fs.writeFile('./privateKey.pem', String(pems.private), (err) =>{
    if (err) throw err;
    console.log('Private key has been saved');
});
fs.writeFile('./certificate.pem', String(pems.cert), (err) =>{
    if (err) throw err;
    console.log('Public cert has been saved');
});

