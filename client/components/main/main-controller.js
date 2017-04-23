(function(window, angular, undefined){
  angular.module('app').controller('mainCtrl', ['$scope', '$state', '$http', 'userSvc',
  function($scope, $state, $http, userSvc){
  $scope.userData = userSvc.user;
  $scope.userColleagues = [];
  $scope.users = [];
  $scope.newPost = undefined;
  $scope.colleaguePosts =[];

//use an auth token from here on in.
var config = {
    headers: {
    'auth-token': userSvc.token
  }
}

//GLOBAL functions ----------------------------------------


//get your profile
$http.get('/secure-api/user/get_me',
 config).then(function(response){
  $scope.getMe = response.data.data;
  console.log(response.data.data)
 }, function(err){
  console.err(err);
})

//Request colleagues connections
$scope.addUser =function(userId){
    var requestData= {
      'received_id':userId
    }

  $http.post('/secure-api/user/request_colleague', requestData,
  config).then(function(response){
    console.log("request sent");
  }, function(err){
    console.err(err);
  })
}
// get  your colleagues requests
$http.get('/secure-api/user/get_colleague_requests',
 config).then(function(response){
  $scope.colleagueRequests = response.data.data;
  console.log(response.data.data)
 }, function(err){
  console.err(err);
})

//Respond to coleague requests
$scope.respondToRequest = function(requestId, confirmation){
  var requestData ={
    'request_id' :requestId,
    'confirmation': confirmation
  }
  $http.post('/secure-api/user/request_colleague_respond', requestData,config).then(function(response){
  console.log("accepted coleague ");
 }, function(err){
  console.err(err);
 })

}

//publish a post
$scope.submitPost = function(content){
 requestData = {
  content: content
 }
 $http.post('/secure-api/post/create_post', requestData, config).then(function(response){
  $scope.newPost = ""; //prevent user from submitting post multipe times
  console.log("Post was submitted")
 }, function(err){
 console.err(err);
 })
}

//get your colleague posts
$http.get('/secure-api/post/get_colleagues_posts',
 config).then(function(response){
  $scope.colleaguePosts = response.data.data;
 }, function(err){
  console.err(err);
})



// get your current list of colleagues
$http({
    method: "GET",
    url: '/secure-api/user/get_colleagues',
    headers: {
        'auth-token': userSvc.token
    }
  }).then(function(response){
    $scope.userColleagues = response.data.data;
  }, function(err){
    console.err(err)
  })


//get a list of all users of the network
$http({
    method: "GET",
    url: '/secure-api/user/get_users_by_quantity',
    headers: {
        'auth-token': userSvc.token
    }
  }).then(function(response){
    $scope.users = response.data.data;
  }, function(err){
    console.err(err)
  })

   }]);
})(window, window.angular)
