const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3002,
  path: '/api/messages/dummy_id/pin',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => console.log('Status:', res.statusCode, 'Body:', data));
});
req.on('error', (e) => console.error(e.message));
req.end();
