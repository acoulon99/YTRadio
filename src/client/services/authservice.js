app.factory('authService', ['$rootScope','$q', '$http','$cookies', 'chatService', 'mediaService', function($rootScope, $q, $http, $cookies, chatService, mediaService){

  var session;
  var userinfo;
  var auth_cookie = $cookies.get('ytrk_66');

  if(auth_cookie){
    $http.get('/api/auth/'+auth_cookie)
    .then(function(res){
      var data = res.data;
      if(data.Success && data.Data){
        session = data.Data.Session;
        userinfo = data.Data.User;
        chatService.emit('join', userinfo);
        $rootScope.$broadcast('session_resume');
      }
    }, function(error){
      console.log(error);
    });
  }

  function scorched_Earth(){
    $cookies.remove('ytrk_66');
    $cookies.remove('ytvolume');
    auth_cookie = null;
    mediaService.emit('leave');
    chatService.emit('leave');
    userinfo=null;
    session = null;
  }


  return {
    getSession:function(){
      return session;
    },
    getUser:function(){
      return userinfo;
    },
    hasAccess: function(){
      var deferred = $q.defer();
      if(!!userinfo){
        deferred.resolve(true);
      }
      else{
        deferred.reject({authenticated: false});
      }
      return deferred.promise;
    },
    logIn: function(creds){
      var deferred = $q.defer();
      if(creds && creds.Username && creds.Password){
        $http.post('/api/login', creds)
        .then(function(res){
          var data = res.data;
          if(data.Success){
            session = data.Data.Session;
            userinfo = data.Data.User;
            var future = new Date().getTime()+(52*7*24*60*60000);
            var eDate = new Date(future);
            $cookies.put('ytrk_66', session.Key, {expires: eDate});
            chatService.emit('join', userinfo);
            deferred.resolve(session);
          }
          else{
            deferred.reject(data.Error);
          }
        }, function(){
          deferred.reject('Could not reach Authentication Service');
        });
      }
      else{
        deferred.reject('No Credentials provided');
      }
      return deferred.promise;
    },
    signUp: function(creds){
      var deferred = $q.defer();
      if(creds && creds.Username && creds.Email && creds.Password){
        $http.post('/api/signup', creds)
        .then(function(res){
          var data = res.data;
          if(data.Success){
            deferred.resolve(data.Message);
          }
          else{
            deferred.reject(data.Error);
          }
        }, function (){
          deferred.reject('Failed to reach Authentication Service');
        });
      }
      else{
        deferred.reject('No Credentials Provided!');
      }
      return deferred.promise;
    },
    logOut: function(){
      $http.post('/api/logOut',{}).then(function(res){
        scorched_Earth();
      }, function(){
        scorched_Earth();
      });
    }
  };
}]);
