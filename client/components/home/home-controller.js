(function(window, angular, undefined){
  angular.module('app') //need to pass in the dependencies for the function or angular will not recognise them after minification
  .controller('homeCtrl', ['$scope', '$http', '$state', 'userSvc',  function($scope, $http, $state, userSvc){

//CREATE USER FUNCTION//
          $scope.createUser = function(user){
                      $http.post('/api/user/create', user).then(function(response){
                        // userSvc.token = response.data.token;
                        // userSvc.user = response.data.userData;
                        // //user refreshes the page, don't want to have to continue to login
                        // localStorage.setItem('token', JSON.stringify(userSvc.token));
                        // localStorage.setItem('user', JSON.stringify(userSvc.user));
                        // $state.go('main');
                          console.log(response)
                      }, function(err){
                          console.error(err);
                      })
                  };

//Login NEW USER FUNCTION//
          $scope.loginNewUser = function(user){
                    $http.post('/api/user/loginNew', user).then(function(response){
                      userSvc.token = response.data.token;
                      userSvc.user = response.data.userData;
                      //user refreshes the page, don't want to have to continue to login
                      localStorage.setItem('token', JSON.stringify(userSvc.token));
                      localStorage.setItem('user', JSON.stringify(userSvc.user));
                      $state.go('main');
                      console.log(response)
                  }, function(err){
                      console.error(err);
                  })

                };



//LOGIN  EXISTING USER FUNCTION//
        $scope.logUserIn = function(user){
                $http.post('/api/user/login', user).then(function(response){
                  userSvc.token = response.data.token;
                  userSvc.user = response.data.userData;
                  //user refreshes the page, don't want to have to continue to login
                  localStorage.setItem('token', JSON.stringify(userSvc.token));
                  localStorage.setItem('user', JSON.stringify(userSvc.user));
                  $state.go('main');
                    console.log(response)
                      }, function(err){
                            console.error(err);
                        })
                };
}])
})(window, window.angular); //this is for minification
