const https = require('https');
https.get('https://community.spline.design/file/0eb63f4a-1e7c-4016-95a2-f8f34a4018ac', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        const matches = data.match(/https:\/\/prod\.spline\.design\/[a-zA-Z0-9-]+\/scene\.splinecode/g);
        console.log(matches ? [...new Set(matches)] : 'No matches found');
    });
}).on('error', (err) => console.log('Error: ' + err.message));
