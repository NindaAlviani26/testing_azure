<% java.util.Map<String, String> envVariables = System.getenv();
String envHome = envVariables.get("HOST_BACKEND");
%>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>SIMIAN Administration Console</title>
  <script language="JavaScript" type="text/javascript">
    var txt = " SIMIAN Administration Console";
    var speed = 100;
    var refresh = null;
    function move() {
      document.title=txt;
      txt=txt.substring(1,txt.length)+txt.charAt(0);
      refresh=setTimeout("move()",speed);
    }
    move();
  </script>
  <link rel="shortcut icon" href="img/logo_mini.png?v=3"/>
  <!-- Tell the browser to be responsive to screen width -->
  <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
  <!-- Bootstrap 3.3.6 -->
  <link rel="stylesheet" href="css/bootstrap.min.css">
  <!-- ANIMATE -->
  <link rel="stylesheet" href="css/animate.min.css">
  <script src="js/wow.min.js"></script>
  <script>
	new WOW().init();
  </script>
  <!-- Font Awesome -->
  <link rel="stylesheet" href="plugins/font-awesome/4.5.0/css/font-awesome.min.css">
  <!-- Ionicons -->
  <link rel="stylesheet" href="plugins/ionicons/2.0.1/css/ionicons.min.css">
  <!-- Theme style -->
  <link rel="stylesheet" href="css/AdminLTE.min.css">
  <link rel="stylesheet" href="./css/custom.css?v=1">
  <script src="plugins/jquery/jquery-2.2.3.min.js"></script>
  <script src="js/bootstrap.js"></script>
  
  <!--[if lt IE 9]>
  <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
  <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
  <![endif]-->
<script type="text/javascript">
	// Disable frame hijacking  
	if (top != self) top.location.href = location.href;  
</script>

<style type="text/css">
	.login-box-msg, .register-box-msg {
	    padding: 0 0 0 0;
	}
	.logo-login{
		margin: 10px 0 5px 0;
    	max-width: 160px;
	}
	.login-box-body, .register-box-body {
		background: rgba(255, 255, 255, 1);
	    border-radius: 7px;
	}
	.eye-pass{
		right:0;
		cursor: pointer;
		pointer-events: painted;
		opacity: .5;
	}
	.eye-pass:hover{
		opacity: 1;
	}
	.bg-img-login{
      width: 100%;
      height: 100%;
      background:url('./img/bg-login.jpg');
      position: fixed;
      top: 0;
      z-index: 0;
      background-position: center;
      background-size: cover;
    }
	.login-box-body .form-control-feedback{
		color: #a0a0a0;
	}
</style>
</head>
<!-- <body bgcolor="#f5811e"  style="width: 100%;height: auto;background:url('img/bg_blue2.png');"  > -->
<body>
	<div class="container" >
		<div class="login-box animated wow fadeIn" data-wow-delay=".3s" style="z-index:2 ;position: relative;">
			<!--<div class="login-logo">
					<img src="img/logo_client.png" width="200">	
			</div>-->
			
			<!-- /.login-logo -->
			<div class="login-box-body">
			<!--div class="login-box-body" style="opacity: 0.9;filter: alpha(opacity=80);background-color: transparent;" -->  
				<div class="logo animated wow bounceIn" data-wow-delay=".3s" style="justify-content: center; display: flex;margin-bottom: 10px;">
					<!-- <img src="img/logo_client.png" width="150"> -->
					<img src="img/logo.png?v=2" class="logo-login">
				</div>
				<div class="login-box-msg"  style="color:#585858">
					<p class="text-center" style="font-size:18px"><b>Welcome</b>
					<p class="text-center">Log in to work with the<br>Simian Data Platform</p>
				</div>
				<form action="#" id="validator" method="post" onSubmit="return false;">
					<fieldset>
					
						<div class="row">&nbsp;</div>
						
						<div class="form-group has-feedback animated wow " data-wow-delay=".5s">
							<span class="glyphicon glyphicon-user form-control-feedback"></span>
							<input name="username" type="text" id="j_username" class="form-control" placeholder="Username">
						</div>
						<div class="form-group has-feedback animated wow " data-wow-delay=".5s">
							<span class="glyphicon glyphicon-lock form-control-feedback"></span>
							<input name="password" type="password" id="j_password" class="form-control" placeholder="Password">
							<span class="glyphicon glyphicon-eye-close form-control-feedback eye-pass" onclick="showHide()"></span>
						</div>
						<div class="row"><font color="#FF0000" style="font-size: 14px;"><i><b><div class="col-xs-12"><center id="errMsg"></center></div></b></i></font></div>
						
						<div class="row" >  
							<div  class="col-xs-12"> 
								<button type="submit" id="submit" name="submit" class="btn btn-primary btn-block"  data-loading-text="<i class='fa fa-spinner fa-spin'></i> ... Checking User">SIGN IN <!--<span class="glyphicon glyphicon-share"></span>--></button> 
							</div> 
						</div>
						<div class="row">&nbsp;</div>
					</fieldset>
					<!-- <div class="logo animated wow bounceIn" data-wow-delay=".5s" style="justify-content: center; display: flex">
						<img src="img/logo.png" width="150" style="margin:20px 0 0 17px">
					</div> -->
					
				</form> 
				<div align="center">
					<footer align="center" style="font-size: 10px;">SIMIAN Application Framework<br/>
					Copyright 2020, SIMIAN and/or its affiliates. All rights reserved.</footer>
				</div>
				
			</div>
			<!-- /.login-box-body -->
		</div>
		<!-- /.login-box --> 
		<!-- <div class="animated wow zoomIn" data-wow-delay="0.5s" align="center">
			<footer align="center" style="font-size: 10px;">SIMIAN Version: 1.0.0<br/>
			Copyright 2020, SIMIAN and/or its affiliates. All rights reserved.</footer>
		</div> -->
		
		
	</div>
	<div class="bg-img-login"></div>
</body>
</html> 

<!-- ./wrapper -->
<script src="./config.js?v=1"></script>
<!-- <script>
var serverHost = "<%= envHome %>";
</script> -->

<script type="text/javascript"> 
	//show hide password 
	function showHide(){
		
		var input_pass = document.getElementById("j_password");
		if(input_pass.type ==='password'){
			input_pass.type ='text';
			$('.eye-pass').removeClass('glyphicon-eye-close');
    		$('.eye-pass').addClass('glyphicon-eye-open');
		}else{
			input_pass.type ='password';
			$('.eye-pass').removeClass('glyphicon-eye-open');
    		$('.eye-pass').addClass('glyphicon-eye-close');
		}
	}
	//make autofocus input
	window.onload = function() {
	  $("#j_username").focus();
	};

		$(document).ready(function() {
			$('#submit').click(function() {
				var $this = $(this);
				
				
				if($('#j_username').val() == ''){
					$('#errMsg').html("Provide your username");  
				}
				else if($('#j_password').val() == ''){
					$('#errMsg').html("Enter your password"); 
					$('#j_password').focus();
				}
				else {
					//alert("xxxx");
					$this.button('loading'); 
					
					var loginAct = $.ajax({
						url: serverHost + 'login_act.api',
						type: 'post',
						data: $('#validator').serialize(),
						success: 
							function (msg) {

							   var data = null;	 
							   if(msg==null){
									$('#errMsg').html("Login failed, invalid response from server try again later!"); 
								}else{
									data = $.parseJSON(msg);
								}

								console.log(data);
								
								
								if(data!=null){
									if(data.result == "false"){ 
										$('#errMsg').html(data.message); 
									}else { 
										sessionStorage.setItem("token",data.token.current);
										window.location.replace("index.jsp");
									}
								}else{ 
									$('#errMsg').html("Login failed, invalid response from server try again later!"); 
								}
								$this.button('reset');
							},
						error: function (xhr,status,error) { 
							   $('#errMsg').html(status + " " + error + " " + xhr.readyState); 
							   $this.button('reset');
							},
						statusCode: {
							   404: function() { 
								   $('#errMsg').html("Page not Found"); 
								   $this.button('reset');
							   }
							} 
					});
					 
				}
			}
			
			);
		
		$('#j_username').focus();
		});	
	</script>