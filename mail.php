<?php
	include("/home/users/pjanusz/data.php");

	$data = json_decode(file_get_contents('php://input'));
	$name = $data->name;
	$email = $data->email;
	$text = $data->text;
	$from = "From: $name<$email>\r\nReturn-path: $email";
	$captcha = $data->captchaResponse;

	var_dump($captcha);

	if( $captcha !== NULL && !empty($captcha)):
		// Verify with Google Servers
		$verify = file_get_contents('https://www.google.com/recaptcha/api/siteverify?secret='.$captchaSecret.'&response='.$captcha);
		$response = json_decode($verify);
		if($response->success === true):
			mail($to, $subject, $text, $from);
		else:
			printf("Verification failed!");
		endif;
	else:
		printf("Bad request!");
	endif;
?>