const express = require('express');
var basicAuth = require('express-basic-auth');
const path = require('path');
const PORT = process.env.PORT || 5000 ;
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

/*app.use(basicAuth({
  users: { 'compro': 'c0mpr0' },
  challenge: true,
  unauthorizedResponse: getUnauthorizedResponse,
  realm: 'Leo Credential'
}))

function getUnauthorizedResponse(req) {
  return req.auth ?
      ('Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected') :
      'No credentials provided'
}*/


    /*.use(logger('dev'))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: false }))
    .use(cookieParser())*/
app
    .use(express.static(path.join(__dirname, 'public')))
    .get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'launch.html'));
    })
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));

/*express()
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index1'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))*/
