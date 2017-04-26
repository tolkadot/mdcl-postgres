var db = require('../database/database');
var jwt  = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(5);



module.exports.createUser = function(req, res){
    var hashedPassword = bcrypt.hashSync(req.body.user_password, 10);
    console.log(hashedPassword);
    var hashedEmailAddress = bcrypt.hashSync(req.body.email, 10);
    //var password = req.body.user_password;
    var queryInsert = "INSERT INTO users (username, user_password, email) VALUES ('" + req.body.username + "', '" + hashedPassword + "', '" + hashedEmailAddress + "')";

    db.query(queryInsert).spread(function(result, metadata){
        res.status(200).send("User was successfully created.");
    }).catch(function(err){
        res.status(500).send("User was not created");
    })
  }


module.exports.loginNewUser = function(req, res){
    var query = "SELECT * FROM users WHERE username='" + req.body.username  + "'";
    console.log(req.body.username);
    db.query(query).spread(function(result, metadata){
      console.log(result.length);
        if (result.length > 0){
            var userData = result[0];
            console.log("here is the user data",  userData);
            var token = jwt.sign(userData, process.env.SECRET, {
              expiresIn: 60*60*24
            })
            res.json({
                userData: userData,
                token: token
            })
          }
        }).catch(function(err){
            res.status(500).send("Unable to process the query.");
        })

}



module.exports.logIn = function(req, res){
    var submittedPassword = req.body.password;
    console.log(req.body.loginName,req.body.password);

    var query = "SELECT * FROM users WHERE username='" + req.body.loginName + "' OR email='" + req.body.loginName + "'";

    db.query(query).spread(function(result, metadata){
console.log(result.length);
        if (result.length > 0){
            var userData = result[0]; //result[0] = user id
console.log(userData, "user data");
console.log(submittedPassword, userData.user_password);
            var isVerified = bcrypt.compareSync(submittedPassword, userData.user_password);
console.log("before verified here");
            var token = jwt.sign(userData, process.env.SECRET, {
              expiresIn: 60*60*24
            })
console.log(token);
            if (isVerified){
               delete userData.user_password;
                res.json({
                    userData: userData,
                    token: token
                })
            } else {
                res.status(400).send("User entered the wrong password");
            }
        }
    }).catch(function(err){
        res.status(500).send("Unable to process the query.");
    })
}
