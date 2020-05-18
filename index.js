const express     = require('express');
const app         = express();
const bodyParser  = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({
  limit: '100mb',
  extended: true
})); 



require('./src/route.js')(app);


let port = process.env.PORT || 3001;
app.listen(port, function () {
    console.log('Test app listening on port '+port+'!');
  });
  
