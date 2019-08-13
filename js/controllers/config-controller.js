var app = angular.module('walkmodhubApp', []);
var user = getSessionCookie("REVEL_SESSION", "user");
	
app.config( ['$locationProvider', function AppConfig( $locationProvider) {
    // enable html5Mode for pushstate ('#'-less URLs)
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
}]);

app.controller("GetConfigCtrl", [ '$scope', '$http', '$location', function($scope, $http, $location) {
	$scope.user = {'name': user, 'url': '/'+user };
	$scope.currentURL = window.location;
	$http({
		method : 'GET',
		url : "/repositories"+ $location.path()
	}).then(function(response) {
		response.data.updated_at = getTimeInterval(response.data.updated_at);
		$scope.repo = response.data;
	});	
	
	
	$http({method:"GET", url: "/repositories"+$location.path()+"/branches"}).then(function(response){
			
		var select = $("#branches");			
		
		$(response.data).each(function(index, elem){
			$(select).append('<option value="'+elem.name+'">'+elem.name+'</option>');
		});
		var master = jQuery.grep(response.data, function(b){ return b.name =='master'});
		if(master.length == 0){
			$(select).append('<option value="master">master</option>');
		}
		$(select).val('master');
		
		$(select).selectpicker('refresh');
	});
	
	$scope.$watch("repo", function(oldV, newV) {
		
		$("[type='checkbox']").bootstrapSwitch({'size':'mini'});
		
		
		
		$(".btn-clean-code").click(function(event){
			$http({	method : 'POST', url : "/pulls"+$location.path(), params: 
				{
					'branch': $scope.repo.default_branch,
					'config': JSON.stringify({'formatter': $("#formatter").val()})
				}
			});
			window.location = '/'+user;
			event.preventDefault();
			return false;			
		});

		$(".btn-hook").click(function(event){
			$http({	method : 'POST', url : "/subscriptions"+$location.path(), params: 
				{
					'branch': $scope.repo.default_branch,
					'config': JSON.stringify({'formatter': $("#formatter").val()})
				}
			});
			
			event.preventDefault();
			return false;			
		});
		
	});
}]);
	