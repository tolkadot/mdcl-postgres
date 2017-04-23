var express = require('express');
var router = express.Router();
var db = require('../database/database.js');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

router.use(bodyParser.json()); //parse json we are sent
router.use(bodyParser.urlencoded({extended: true})); //allow us to send data via postman


//make user pass jsonwebtoken in header - this will be used by ENDPOINTS
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


/////////////////////GET ENDPOINTS -----------------------------------------
//GET ME
router.get('/get_me', function(req, res){
  var query = "SELECT * from users WHERE id=" + req.user_id;
  db.query(query).spread(function(result, metadata){
  res.json({
    data: result
  });
 }).catch(function(err){
    res.status(500).send(err);
  })
});



//GET COLLEAGUES
router.get('/get_colleagues', function(req, res){
  var query = "SELECT colleague.colleague_id, colleague.date_colleagueship, u.username, u.email FROM user_colleagues colleague INNER JOIN users u ON(u.id = colleague.colleague_id) WHERE user_id=" + req.user_id;
 db.query(query).spread(function(result, metadata){
  res.json({
    data: result
  });
 }).catch(function(err){
    res.status(500).send(err);
  })
});
//GET COLLEAGUE REQUESTS
router.get('/get_colleague_requests', function(req, res){
  console.log("this is the user's ID " + req.user_id);
  var query = "SELECT user_colleague_requests.id, u.username FROM user_colleague_requests  INNER JOIN users u ON (u.id = user_colleague_requests.sender_id) WHERE user_colleague_requests.receiver_id=" + req.user_id + " AND status='pending'";
      db.query(query).spread(function(result, metadata){
        res.json({
          data: result
        });
      }).catch(function(err){
          res.status(500).send("Unable to get colleague requests at this time");
        })
      });

//GET All users on the system
router.get('/get_users_by_quantity', function(req, res){
      var query = "SELECT * from users WHERE id !=" + req.user_id;
      db.query(query).spread(function(result, metadata){
        res.json({
          data: result
        });
      }).catch(function(err){
          res.status(500).send("Unable to query db at this time");
        })
      });




///////////////////////POST ENDPOINTS-----------------------------------------

/// REQUEST colleague//
router.post('/request_colleague', function(req, res){
 // check if req has already been sent or you area already colleague.
 var query = "SELECT * FROM user_colleague_requests WHERE sender_id="
 + req.user_id  + " AND receiver_id=" + req.body.received_id;
 db.query(query).spread(function(result, metadata){
  if(result.length === 0){
    console.log("doing insert Request")
 insertRequest();
   }
  }).catch(function(err){
      res.status(500).send(err);
  });

  function insertRequest(){

    //sender_id from front end is the id of the user requesting the colleague//
    //received_id from front end is the id of the user they want to be colleagues with//
      var query = "INSERT INTO user_colleague_requests (sender_id, receiver_id, status) VALUES ("
      + req.user_id + "," + req.body.received_id +
       ", 'pending')";
      db.query(query).spread(function(result, metadata){
        res.status(200).send("colleague request created")
      }).catch(function(err){
          res.status(500).send(err)
        })
      }
});

/// RESPOND TO  COLLEAGUE REQUEST//
router.post('/request_colleague_respond', function(req, res){
  //check to see if the request exsists//
 var query = "SELECT * FROM user_colleague_requests WHERE id=" + req.body.request_id; //req.body.request_id - > this is the id of the table
 var senderId;
 var receivedId;

 db.query(query).spread(function(result, metadata){
 if (result.length > 0){
  senderId = result[0].sender_id;
  receivedId = result[0].receiver_id;
  updateRequest();
 }
 else {res.status(400).send("Request Doesn't Exist :(") }
 });

 function updateRequest(){ //
  var isAccepted = req.body.confirmation === 'confirmed';
  var query;
  if(isAccepted){
            query = "UPDATE user_colleague_requests SET status='confirmed' WHERE id=" + req.body.request_id;
        } else {
            query = "DELETE FROM user_colleague_requests WHERE id=" + req.body.request_id;
        }

  db.query(query).spread(function(){
    if (isAccepted){
                performSenderInsert(); //IF THEY ACCEPT THE COLLEAGUE REQUEST
            } else {
                res.status(200).send("We have successfully deleted the request.")
            }
 }).catch(function(){//IF THEY DECLINE THE COLLEAGUE REQUEST
            res.status(500).send("Unable to send a Colleague requests at this time.")
        })

 function performSenderInsert(){}
 var query = "INSERT INTO user_colleagues (user_id, colleague_id, date_colleagueship) VALUES (" + senderId + ", " + receivedId + ", now())";

 db.query(query).spread(function(){ //add the colleague to the user//
            performReceiverInsert();
        }).catch(function(){
            res.status(500).send("Unable to send a colleague request at this time.")
        })
    }

    function performReceiverInsert(){ //add the colleague to the user//
            var query = "INSERT INTO user_colleagues (user_id, colleague_id, date_colleagueship) VALUES (" + receivedId + ", " + senderId + ", now())";

            db.query(query).spread(function(){
                res.status(200).send("The user was successfully confirmed as a colleague")
            }).catch(function(){
                res.status(500).send("Unable to send a colleague request at this time.")
            })
        }


});

/// //
module.exports = router;
