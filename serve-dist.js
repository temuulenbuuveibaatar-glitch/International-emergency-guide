const http = require('http');
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 5000;
const root = path.join(process.cwd(),'dist','public');
const mime = {'.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.json':'application/json','.ico':'image/x-icon'};
const server = http.createServer((req,res)=>{
  let p = decodeURIComponent(req.url.split('?')[0]);
  if(p === '/' || p === '') p = '/index.html';
  const filePath = path.join(root, p);
  if(!filePath.startsWith(root)) { res.statusCode = 403; res.end('Forbidden'); return; }
  fs.stat(filePath,(err,stat)=>{
    if(err || !stat.isFile()){ res.statusCode = 404; res.end('Not found'); return; }
    const ext = path.extname(filePath).toLowerCase();
    res.setHeader('Content-Type', mime[ext] || 'application/octet-stream');
    fs.createReadStream(filePath).pipe(res);
  });
});
server.listen(port, ()=> console.log('Static server running at http://127.0.0.1:'+port));
