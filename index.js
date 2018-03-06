console.log("Hello!!!");

var express = require('express');
var basicAuth = require('express-basic-auth')
const http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

app.use(basicAuth({
    users: { 'compro': 'c0mpr0' },
    challenge: true,
    unauthorizedResponse: getUnauthorizedResponse,
    realm: 'Leo Credential'
}))

function getUnauthorizedResponse(req) {
    return req.auth ?
        ('Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected') :
        'No credentials provided'
}

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/release/:ver', (req, res) => {
    var ver = req.params.ver;
res.sendFile(path.join(__dirname, 'public/release/'+ver+'/launch.html'));
});
app.get('/release/:ver/*', (req, res) => {
    var ver = req.params.ver;
res.sendFile(path.join(__dirname, 'public/release/'+ver+'/launch.html'));
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(process.env.PORT || 8080, function () {
    console.log('Example app listening on port 8080!')
})

module.exports = app;
