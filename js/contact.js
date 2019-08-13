function IsEmail(email) {
	var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return regex.test(email);
}
$(function() {
	$('.btn-contact')
			.click(
					function(event) {
						event.preventDefault();
						
						$('#contact-errors').empty();
						var errorList = $('<ul></ul>');
						var errors = false;

						
						$('#contactName')
								.each(
										function() {
											if ($(this).val() == '') {
												$(errorList)
														.append(
																'<li>The field name is required.</li>');
												errors = true;
											}
										});

						$('#contactEmail')
								.each(
										function() {
											if ($(this).val() == ''
													|| !IsEmail($(this).val())) {
												$(errorList)
														.append(
																'<li>The field email is an invalid email address.</li>');
												errors = true;
											}
										});

						if (errors) {
							$('#contact-errors').css('display', 'block');
							$('#contact-errors').append(errorList);
						} else {
							$('#contact-errors').css('display', 'none');
							$('#contact-info').css('display', 'block');
							$('#contact-info').append('Thanks for contacting us. You will receive briefly our response.');

							$.post('/contact', {
								'from' : $("#contactEmail").val(),
								'name' : $("#contactName").val(),
								'msg' : $("#contactMessage").val()
							}).done(function(data) {
								console.log(data);
							});

						}

					});
});
