const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3002,
  path: '/api/messages/123/pin',
  method: 'PUT'
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => console.log('Status:', res.statusCode, 'Body:', data));
});
req.on('error', (e) => console.error(e.message));
req.end();
