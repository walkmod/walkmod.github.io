$( function() {
	//https://search.maven.org/remotecontent?filepath=org/walkmod/walkmod-core/1.0.4/walkmod-core-1.0.4.pom

	var container = $('#plugins-list');
	$.getJSON('/plugins', function(data){
		var container = $('#plugins-list');
		$(container).empty();
		$(data.response.docs).each(function(i, elem){
			if(elem.a.match(/-plugin$/) && elem.a.indexOf('walkmod-') === 0){
				if(elem.g.indexOf('com.walkmod') === -1){
					var label = elem.g+':'+elem.a+':'+elem.latestVersion;
					var url= 'http://github.com/walkmod/'+ elem.a;
					var plugin = $('<div class="plugin" groupId="'+elem.g+'" artifactId="'+elem.a+'" version="'+elem.latestVersion+'" />' );
					var link = $('<a href="'+url+'" target="_blank" rel="nofollow"/>');
					$(link).append('<h3><small>'+elem.g+':walkmod-</small>'+elem.a.substring(8,elem.a.length - 7)+'<small>-plugin:'+elem.latestVersion+'</small></h3>');
					$(plugin).append(link);
					$(container).append(plugin);
			    }
			}
		});
		$(".plugin").each(function(i, elem){
			var groupId = $(elem).attr('groupId');
			var artifactId = $(elem).attr('artifactId');
			var version = $(elem).attr('version');
			
			$.getJSON('/plugins/'+groupId+'/'+artifactId+'/'+version+'/pom',function(data){
				var id = data.GroupId+'_'+data.ArtifactId+'_'+data.Version;
				var pluginContainer = $('.plugin[groupId="'+data.GroupId+'"][artifactId="'+data.ArtifactId+'"]');
				$(pluginContainer).append('<p>'+data.Description+'</p>');
				if(data.scm){
					$(pluginContainer).append('<p><a href="'+data.Url+'" target="_blank" rel="nofollow">'+data.Connection+'</a> </p>');
				}
				
				
			});
		});
	
	});

});
