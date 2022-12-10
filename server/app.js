const express = require('express');
const app = express();
const configRoutes = require('./routes');
const settings = require('./config/settings.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

configRoutes(app);

//const PORT = process.env.PORT || 80;
let server  = app.listen(settings.portConfig.localPort, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://' + 'localhost' + ':' + settings.portConfig.localPort);
});