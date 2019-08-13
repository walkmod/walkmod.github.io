$(function() {
	$("button[data-href]").click(function() {
		location.href = $(this).attr("data-href");
	});
	
});

