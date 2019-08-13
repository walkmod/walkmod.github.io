$(function() {
	$('.code-tab').click(function(event) {
		event.preventDefault();
		var active_li = $(this).parent().parent().find(".active");
		console.log(active_li);
		$(active_li).removeClass("active");

		$(this).parent().addClass("active");
		var new_target = $(this).attr('target-data');
		console.log($("#" + new_target));
		$("#" + new_target).siblings().css('display', 'none');

		$("#" + new_target).css('display', 'block');

	});

	CodeMirror.fromTextArea(document
			.getElementById("java-code-original"), {
		lineNumbers : true,
		matchBrackets : true,
		mode : "text/x-java",
		readOnly : true,
		theme: "zenburn"
	});
	
	CodeMirror.fromTextArea(document
			.getElementById("java-code-final"), {
		lineNumbers : true,
		matchBrackets : true,
		mode : "text/x-java",
		readOnly : true,
		theme: "zenburn"
	});
});