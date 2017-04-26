var express = require('express');
var app = express(); //create instance of app
var bodyParser = require('body-parser');
var db = require('./server/database/database.js');
var jwt = require('jsonwebtoken'); //npmjs.com

process.env.SECRET ="mdcl social network rocks";


app.use(bodyParser.json()); //parse json we are sent
app.use(bodyParser.urlencoded({extended: true})); //allow us to send data via postman
app.use('/client', express.static(__dirname + '/client')) // need this to get the thing to work!

//CONTROLLERS
var userController = require('./server/controllers/user-controller.js');


//ROUTERS
var secureUserRouter = require('./server/routes/user.js');
var securePostRouter = require('./server/routes/post.js');

app.use('/secure-api/user/', secureUserRouter);
app.use('/secure-api/post/', securePostRouter);

//ROUTES
app.get('/', function(req, res){
    res.sendFile(__dirname + '/client/index.html');
})

app.post('/api/user/create', userController.createUser);
app.post('/api/user/login', userController.logIn);
app.post('/api/user/loginNew', userController.loginNewUser);

db.sync().then(function(){
    app.listen(3000, function(){
        console.log("Listening to port " + 3000);
    })
})
