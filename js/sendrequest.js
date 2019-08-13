$(function() {

	var click = function(event) {
						event.preventDefault();
						
						$('#tryit-errors').empty();
						var errorList = $('<ul></ul>');
						var errors = false;

						$('#requestName')
								.each(
										function() {
											if ($(this).val() == '') {
												$(errorList)
														.append(
																'<li>The field name is required.</li>');
												errors = true;
											}
										});

						$('#requestEmail')
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
							$('#tryit-errors').css('display', 'block');
							$('#tryit-errors').append(errorList);
						} else {
							$('#tryit-errors').css('display', 'none');
							$('#tryit-errors').modal('hide');
							

							$('#signin-modal').modal('hide');							
							$.post('/signin', {
								'from' : $("#requestEmail").val(),
								'name' : $("#requestName").val(),
								'product' : $(this).attr('product')
							}).done(function(data) {
								console.log(data);
							});

						}

					};

	$('.btn-request-cloud')
			.click(click);
    $('.btn-request-enterprise')
			.click(click);
	$('.btn-request-docker')
			.click(click);

   $('#try-cloud')
			.click(function(event){
				$('.btn-request-cloud').show();
				$('.btn-request-enterprise').hide();
				$('.btn-request-docker').hide();
				$('#signin-modal').modal('show'); 
			});

	$('#try-enterprise')
			.click(function(event){
				$('.btn-request-docker').hide();
				$('.btn-request-cloud').hide();
				$('.btn-request-enterprise').show();
				$('#signin-modal').modal('show'); 
			});

	$('#download-hub').click(function(event){
				$('.btn-request-docker').show();
				$('.btn-request-cloud').hide();
				$('.btn-request-enterprise').hide();
				$('#signin-modal').modal('show'); 
			});
});