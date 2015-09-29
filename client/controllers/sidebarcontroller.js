app.controller('SidebarCtrl', function ($scope, $http) {
  $scope.activeTab=0;

});

app.directive('queue', function() {
  return {
    restrict: 'E',
    controller: 'RadioCtrl',
		templateUrl: 'views/queue.html'
	}
});

app.directive('userlist', function() {
  return {
    restrict: 'E',
    controller: 'UsersCtrl',
		templateUrl: 'views/users.html'
	}
});

app.directive('chat', function() {
  return {
    restrict: 'E',
    controller: 'ChatCtrl',
		templateUrl: 'views/chat.html'
	}
});

app.directive('settings', function() {
  return {
    restrict: 'E',
    controller: 'SettingsCtrl',
		templateUrl: 'views/settings.html'
	}
});