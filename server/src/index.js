// enable es6 syntax
require('babel-register')({
  "presets": ["es2015"]
});

import express    from 'express';
import morgan     from 'morgan';
import path       from 'path';
import bodyParser from 'body-parser';

// initialise app
let port = process.env.PORT || 8080; 
let app  = express();

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '../../client/build')));
app.use(bodyParser.json());
app.use(morgan('dev'));

// set up routes
import auth from './controllers/auth';
import nts  from './controllers/nts';

app.use('/api/auth', auth);
app.use('/api/nts', nts);

// serve web application
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

// set up server
let server = app.listen(port, (err) => {
  if(err) {
    console.error(err);
  } else {
    let host = (server.address().address === "::") ? ("localhost") : (server.address().address);
    let port = server.address().port;
    console.info("🌎  Server listening at http://%s:%s", host, port);
  }
});

export default app;