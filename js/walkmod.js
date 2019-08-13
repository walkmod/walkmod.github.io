$(function() {
	$("button[data-href]").click(function() {
		location.href = $(this).attr("data-href");
	});
	
	$("#download-btn").css("width", $("#pullrequest-btn").css("width"));
	
	var maxWidth = 0;
	$(".btn-feature").each(function(index, elem){
		width = $(elem).css("width"); //eg. 50px
		widthNum = parseInt(width.substring(0, width.length -2));
		if(widthNum > maxWidth){
			maxWidth = widthNum; 
		}
	});
	$(".btn-feature").each(function(index, elem){
		$(elem).css("width", maxWidth+"px");
	});
	

	prettyPrint();
});

