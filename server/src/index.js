import express from 'express';
import morgan from 'morgan';
import path from 'path';
import bodyParser from 'body-parser';
import nts from './controllers/nts';

// Initialise app.
const port = process.env.PORT || 8080;
const app = express();

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '../../client/build')));
app.use(bodyParser.json());
app.use(morgan('dev'));

// Set up routes.
app.use('/api/nts', nts);

// Serve web application.
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

// Set up server.
const server = app.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    const host = (server.address().address === '::') ? ('localhost') : (server.address().address);
    console.info('🌎  Server listening at http://%s:%s', host, port);
  }
});

export default app;
