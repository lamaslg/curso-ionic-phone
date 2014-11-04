angular.module('starter.controllers', [])

    .controller('SignInCtrl', function($scope, $state,$http,Usuario,$ionicPopup,$ionicLoading) {


        $http.defaults.headers.common = { 'X-ZUMO-APPLICATION' : 'GCeUskVUmhdxQdGGxWAnJSTvKvKOCC52','Access-Control-Allow-Origin' : '*' };

      $scope.user={};
      $scope.signIn = function() {
        console.log('Sign-In', JSON.stringify($scope.user));

          $ionicLoading.show({
              template: 'Cargando...'
          });
          var url="https://cursoph.azure-mobile.net/tables/usuario?$filter=login eq '"+$scope.user.login+"' and password eq '"+$scope.user.password+"'";
          $http.get(url).then(function(resp) {
              console.log('Success', resp);

              if(resp.data && resp.data.length>0) {

                  Usuario.set(resp.data[0]);
                  var token={idUsuario:resp.data[0].id};

                  $http.post('https://cursoph.azure-mobile.net/tables/tokens', token).then(
                      function(data, status, headers, config) {

                          localStorage.setItem("token",JSON.stringify(data.data));

                          $ionicLoading.hide();
                          $state.go("tab.dash");
                      },function(data, status, headers, config) {
                          console.log("Error token",JSON.stringify(data));
                          $ionicLoading.hide();
                      });



              }
              else{
                      var alertPopup = $ionicPopup.alert({
                          title: 'Error',
                          template: 'Datos de acceso incorrectos'
                      });


                  }



              // For JSON responses, resp.data contains the result
          }, function(err) {
              console.error('ERR', err);
              $ionicLoading.hide();
              // err.status will contain the status code
          });


      };
        $scope.checkStatus=function(){


            if(localStorage.getItem("token")){

                var token=eval('('+localStorage.getItem("token")+')');
                $http.get("https://cursoph.azure-mobile.net/tables/tokens?$filter=id eq '"+token.id+"'").then(function(resp){
                    if(resp.data && resp.data.length>0){
                        $http.get("https://cursoph.azure-mobile.net/tables/usuario?$filter=id eq '"+resp.data[0].idUsuario+"'").then(function(r){

                                if(r.data && r.data.length>0){

                                    Usuario.set(r.data[0]);
                                    $state.go("tab.dash");


                                }



                            },



                            function(err){




                        });


                    } else{


                    }




                    }


                    ,


                    function(err){});

            }

        };
        $scope.checkStatus();
    })
    .controller('DashCtrl', function($scope) {
    })
.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
});
