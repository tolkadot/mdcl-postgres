var express = require('express');
var router = express.Router();
var db = require('../database/database.js');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

router.use(bodyParser.json()); //parse json we are sent
router.use(bodyParser.urlencoded({extended: true})); //allow us to send data via postman


//make user pass jsonwebtoken in header - this will be used by ENDPOINTS  SECURITY
router.use(function(req, res, next){
  var token = req.headers['auth-token'];
  jwt.verify(token, process.env.SECRET, function(err, decoded){
    if(err) {
       res.status(400).send("the token is invalid");
    }
    else {
      console.log("this is the user's id" , decoded.id);
      req.user_id = decoded.id;
      next();
    }
  })
});

//GET ENDPOINTS
router.get('/get_colleagues_posts', function(req, res){
    query ="SELECT u.username, post.post_content, post.id, post.date_posted FROM  users u INNER JOIN user_colleagues colleague ON (u.id = colleague.colleague_id) INNER JOIN user_posts post ON (post.user_id = colleague.colleague_id) WHERE colleague.user_id=" + req.user_id;

    db.query(query).spread(function(result, metadata){
        res.json({
            data: result
        })
    }).catch(function(err){
        res.status(500).send("Unable to get Colleague posts at this time");
    })
})




//POST ENDPOINTS
router.post('/create_post', function(req, res){
var query = " INSERT INTO user_posts (user_id, post_content, date_posted) values (" + req.user_id + ", '" + req.body.content + "', now())";
  db.query(query).spread(function(){
    res.status(200).send("User status was updated");
  }).catch(function(err){res.status(500).send(err);})
});



//EXPORT THE ROUTERS
module.exports = router;
