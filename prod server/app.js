const express = require('express');
const app = express();
const configRoutes = require('./routes');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));


configRoutes(app);

const PORT = process.env.PORT || 80;
let server = app.listen(PORT, () => {
  console.log("We've now got a server!");
});