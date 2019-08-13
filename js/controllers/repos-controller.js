var app = angular.module('walkmodhubApp', ['frapontillo.bootstrap-switch']);
var login = getSessionCookie("REVEL_SESSION", "user");
var user =  login;
var accessToken = getSessionCookie("REVEL_SESSION", "access-token");


app.controller("GetReposCtrl", [ '$scope', '$http', '$location', function($scope, $http, $location) {
	
	if (accessToken == undefined || accessToken == null || accessToken == ""){
		document.location = '/';
		return;
	}
	
	user = location.pathname.replace(new RegExp("/", 'g'), "");
	
	$scope.updateFormat = function() {
		var format = $scope.selectedFormat;
		var branch = $('#branch').val();
		var url = "http://"+location.host+"/pulls/"+user+"/"+$scope.currentRepo+"/"+ branch+"/status.svg";
		if(format == "Image URL"){
			$scope.formatURL = url;
		}
		else if(format == "Markdown"){
			$scope.formatURL = "[![Code Status]("+url+")](http://"+location.host+"/"+user+"/)";
		}
		else if(format == "Textile"){
			$scope.formatURL = "!"+url+"!:http://"+location.host+"/"+user+"/"
		}
		else if(format == "Rdoc"){
			$scope.formatURL = '{<img src="'+url+'" alt="Code Status" />}[http://'+location.host+'/'+user+']';
		}
		else if(format == "AsciiDoc"){
			$scope.formatURL = 'image:'+url+'["Build Status", link="http://'+location.host+'/'+user+'"]';
		}
		
		
	};
	
	$scope.currentRepo ="";
	
	$scope.formats = ["Image URL",
	"Markdown",
	"Textile",
	"Rdoc",
	"AsciiDoc"
	];
	$scope.isLogged = login == user;
	$scope.user = undefined;
	
	$http({
		method:'GET', 
		url: "/users/"+user+"/",
		params: { "access-token":accessToken }
		}).then(function(response){
			if (response.data.name == undefined){
				response.data.name = user;
			}
			$scope.user = response.data;
		});
	
	function loadRepos(){
		$http({
			method : 'GET',
			url : "/repositories/"+user+"/",
			params: { "access-token":accessToken }
		}).then(function(response) {
			var j = 0;
			$scope.repositories = [];
			
			
			for (i = 0; i < response.data.length; i++) {			
				
					response.data[i].pushed_at = getTimeInterval(response.data[i].pushed_at);
					$scope.repositories[j] = response.data[i];	
					if(response.data[i].fork==true){
						$http({method:"GET", 
							url: "/repositories/"+user+"/"+response.data[i].name+"/parent", 
							params: { "access-token":accessToken }}
							).then(function(response){
							var url = response.config.url;
							var preffix = "/repositories/"+user+"/";
							var repo = url.substring(preffix.length, url.length - "/parent".length)
							var item = jQuery.grep( $scope.repositories, function( r ) {
								  return r.name == repo;
							});	
							
							var fork = $("#"+item[0].id+"_fork");
							$(fork).text('( forked from '+response.data.full_name+" )");
						});
					}
					
					j++;
				
			}
		
			for(i = 0; i < $scope.repositories.length; i++){
				var found = false;
				for(j = 0; j < $scope.subscriptions.length && !found; j++){
					found = $scope.repositories[i].name == $scope.subscriptions[j].Name;
				}
				$scope.repositories[i].hasSubscription = found;
			}
			
			
			if($scope.repositories.length == 0 ){
				for(i = 0; i < response.data.length && i < 10; i++){
					$scope.repositories[i] = response.data[i];	
					$scope.repositories[i].pushed_at = 
						Date.parseExact($scope.repositories[i].pushed_at, 'yyyy-MM-ddTHH:mm:ssZ').toString('HH:mm:s d-MMM-yyyy');
				}
				
				$("#repo-msg").text("Sorry, you don't have Java repositories to apply Walkmod.")
				$(".btn-configure-code").prop('disabled', true);
			}
			
			var size = $(response.data).size();
			
			
			if(size > 10){
				$(".btn-more").removeClass("hide");
				
				$(".btn-more").click(function(event){
					
					var hidden = $(".repo").filter(".hide");
					var lastHidden = null;
					for(i = 0; i < 10 && i < $(hidden).size();  i++){
						$(hidden[i]).removeClass('hide');
						lastHidden = hidden[i]; 
					}
					
					if($(hidden).size() - 10 <= 0){
						$(this).addClass('hide');
					}	
					
					$(lastHidden).animatescroll();
					
					event.preventDefault();
					return false;
				});
			}
			
		
			
			$scope.$watchCollection("repositories", function(oldV, newV) {
				var repos = $(".repo");
				var size = $(repos).size()
				if(size > 10){
					for(i = 10; i < size; i++){
						$(repos[i]).addClass('hide');
					}				
				}
				
				$("#branch").change(function() {
					$scope.updateFormat();
				});
				
				$('#stickerModal').on('show.bs.modal', function (e) {
					  var link = e.relatedTarget;
					  var id = $(link).attr('id');
						id = id.substring(0, id.length - '_status'.length)
						var item = jQuery.grep( $scope.repositories, function( r ) {
								  return r.id== id;
						});
						if (item != undefined){
							var repo = item[0];
							
							$scope.currentRepo = repo.name;
							$scope.formatURL = "http://"+location.host+"/pulls/"+user+"/"+$scope.currentRepo+"/master/status.svg";
							
							$http({	method : 'GET',
								url : " /repositories/"+user+'/'+item[0].name+"/branches",
								params: { "access-token":accessToken }})
								.then(
									function(response){
										var branches = response.data;
										var combo = $("#branch");
										
										$(combo).empty();
										for (i = 0; i < branches.length; i++) {	
											if (branches[i].name == "master"){
												$(combo).append('<option value="master" selected="selected">master</option>');
											}
											else{
												$(combo).append('<option value="'+branches[i].name+'">'+branches[i].name+'</option>');
											}
										}
										
										
										$('.selectpicker').selectpicker('render');
									}
								);
						
						}
					
				})
				
				if ($scope.isLogged){
					
					$('.btn-configure-code').each(function(index, elem) {
						$(elem).parent().removeClass('hide');
					});
					
					$('.btn-configure-code').on('switchChange.bootstrapSwitch', function(event, state) {
						
						var id = $(this).attr('id');
						id = id.substring(0, id.length - '-cfg-btn'.length)
						var item = jQuery.grep( $scope.repositories, function( r ) {
								  return r.id== id;
						});
						if (item != undefined){
							var repo = item[0];
							if(state){
								
								$http({	method : 'POST', url : "/subscriptions/"+user+'/'+item[0].name, params: { "access-token":accessToken }});
								$("#"+repo.id+"_status").fadeIn();
							}
							else{
								
								$http({	method : 'DELETE', url : "/subscriptions/"+user+'/'+item[0].name, params: { "access-token":accessToken }});
								$("#"+repo.id+"_status").fadeOut();
							}
							repo.previousState = state;
							
							
						}
						
						event.preventDefault();
						
						return false;	
						
					});
				}
				
				
				$('.pull-down').each(function() {
					$(this).css('margin-top', $(this).parent().height()-$(this).height())
				});
				
				$http({
					method : 'GET',
					url : "/pulls/"+user,
					params: { "access-token":accessToken }
				}).then(function(response) {
					
					function updateCommitData(elem, updateStatus) {
						var item = jQuery.grep( $scope.repositories, function( r ) {
							  return r.name== elem.Name;
						});	
						
						if(item.length > 0){
							var aux = $("#"+item[0].id+"_lastCommit");
							if(aux != undefined){
								$(aux).html("| Last Commit: <a title='Last processed commit ID' href='https://github.com/"+user+"/"+item[0].name+"/commit/"+elem.LastCommit+"'  target='_blank' style='color: #86cd4d'>" + elem.LastCommit.substring(0, 7)+"</a>");
							}
							aux = $("#"+item[0].id+"_lastPR");
							
							if(elem.NumberId > -1){
								if(aux != undefined){
									
									$(aux).html("| Last Pull Request: <a title='Last pull request ID' href='https://github.com/"+user+"/"+item[0].name+"/pull/"+elem.NumberId+"' target='_blank' style='color: #86cd4d'>#"+ elem.NumberId+"</a>");
								}
								aux = $("#"+item[0].id+"_pendingPR");
								if(aux != undefined){
									if(elem.Pending > 0){
										$(aux).text(" (Pending Pull Requests: "+elem.Pending+")");
									}
									else{
										$(aux).text("");
									}
								}
							}
							
							aux = $("#"+item[0].id+"_execTime");
							if(aux != undefined){
								var execTime = elem.ExecutionTime;
								if (execTime != 0) {
									execTime = execTime / 1000;
									execTime = execTime.toFixed(2);
								}
								$(aux).html("| <span class='octicon octicon-clock'></span> "+execTime+" s.");
							}
							if(updateStatus){
								aux = $("#"+item[0].id+"_img");
								var d = new Date()
								$(aux).attr("src", "/pulls/"+user+"/"+item[0].name+"?"+d.getTime());
							}
						}
					}
					
					$(response.data).each(function(index, elem) {
						
						
						updateCommitData(elem, false);
						
						
					});	
					
					function longPoll(){
						
						$http({
							method : 'GET',
							url : "/payload/feed/"+user
						}).then(function(response) {
							
							
							updateCommitData(response.data, true);
							longPoll();
						});
					}
					longPoll();
					
				});
	
			});
		});
	}
	if (user == login){
		$http({
			method:'GET', 
			url: "/subscriptions/"+user+"/"
			}).then(function(response){
				$scope.subscriptions = response.data;
				loadRepos();	
			});
	}
	else{
		$scope.subscriptions = [];
		loadRepos();	
	}
} ]);
