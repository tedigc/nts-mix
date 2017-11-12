require('babel-register')({
  "presets": ["es2015"]
});

import express    from 'express';
import morgan     from 'morgan';
import path       from 'path';
import bodyParser from 'body-parser';

let port = process.env.PORT || 8080; 
let app  = express();

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '../../client/build')));

// serve up web application
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

let server = app.listen(port, (err) => {
  if(err) {
    console.error(err);
  } else {
    let host = server.address().address;
    let port = server.address().port;
    console.info("🌎  Server listening at http://%s:%s", host, port);
  }
});

export default app;