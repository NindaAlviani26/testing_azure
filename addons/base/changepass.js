function getForm(urlServer){
    $("#loading").removeClass('hide');
    $.ajax({
        beforeSend: function(xhr){xhr.setRequestHeader('Authorization', "Bearer " + sessionStorage.token);},
        url : urlServer,
        dataType : "json",
        method : "GET",
        success : function(msg){
            $("#loading").addClass('hide');
            // console.log(msg);

            if(msg.status == 'success'){

                $.get( "./templates/base/changepass.template?v=1", function( data ) {

                    $.ajaxSetup({
                        headers : {
                            'Authorization' : "Bearer " + sessionStorage.token
                        }
                    });

                    // if(typeof msg.structure.act1 !== 'undefined'){
                        function checklogin(theForm){
                          if (theForm.oldpassword.value==''){
                             alert("Old Password must have value ... !");
                             theForm.oldpassword.focus();
                             return false;
                          }
                          else if (theForm.newpassword.value==''){
                             alert("New Password must have value ... !");
                             theForm.newpassword.focus();
                             return false;
                          }
                          else if (theForm.confirmpassword.value==''){
                             alert("Confirm Password must have value ... !");
                             theForm.confirmpassword.focus();
                             return false;
                          }
                          else if (theForm.confirmpassword.value!=theForm.newpassword.value){
                             alert("Confirm Password must be equal  with New Password... !");
                             theForm.newpassword.focus();
                             return false;
                          }
                          else if (theForm.oldpassword.value==theForm.newpassword.value){
                             alert("Old Password must be different with New Password... !");
                             theForm.oldpassword.focus();
                             return false;
                          }
                          return true;
                        }
                        $(document).ready(function() {
                           $('#changepass').submit(function() {   
                                if(checklogin(this)){
                                    jQuery.ajax({ 
                                        type: "POST",
                                        data: $(this).serialize(), // assuming this == the form
                                        url: msg.structure.saveData,
                                        timeout: 45000, 
                                        success: function(data) {
                                            if(data == null){
                                                alert("Invalid response from server");
                                            } else {
                                                var datajson = $.parseJSON(data);
                                                if(datajson.result == false)
                                                    alert('Oops change password fail, '+datajson.message);
                                                else {
                                                    alert(datajson.message);
                                                    // location.reload();
                                                    if(datajson.result !=='false'){
                                                        $.ajax({
                                                            beforeSend: function(xhr){xhr.setRequestHeader('Authorization', "Bearer " + sessionStorage.token);},
                                                            url : serverHost + "logout.api",
                                                            method : "GET",
                                                            success : function(result){
                                                                $("#loading").addClass('hide');
                                                                sessionStorage.clear();
                                                                location.replace('./login.jsp');
                                                            },
                                                            error : function(err){
                                                              console.log(err);
                                                            }
                                                        });
                                                    }
                                                
                                                    
                                                    
                                                    // window.location.href = './login.jsp';
                                                }
                                            }
                                        }
                                    });
                                    return false;           
                                }else{
                                    return false;
                                }
                            });
                        });
                    // }else{
                    //     $(document).ready(function() {
                    //         $('#submit').click(function() {

                    //             if($('#newpassword').val() == ''){
                    //                 alert('Password is empty!');
                    //             }
                    //             else if($('#newpassword').val() != $('#confirmpassword').val()){
                    //                 alert('Password confirmation does not match!');
                    //             }
                    //             else { 
                    //                 var changepass = $.ajax({
                    //                     url: msg.structure.saveData,
                    //                     type: 'post',
                    //                     dataType: 'json',
                    //                     data: $('#changepass').serialize()
                    //                 });

                    //                 changepass.done(function(msg) {
                    //                     if(msg==null){
                    //                         alert("Invalid response from server");
                    //                     }else{
                    //                         console.log(msg.result);
                    //                         if(msg.result == "false"){
                    //                             alert('Oops change password fail,'+msg.message+', please contact your administrator!');
                    //                         } else {
                    //                             alert(msg.message);
                    //                             $('#redir').attr('action', './').submit();
                    //                         }
                    //                     }
                    //                 });
                    //             }
                    //         });
                    //     });
                    // }
                    var notification ='';
                    if(msg.structure.result_condition == true){
                        notification = `<div class="col-md-12">
                            <div class="callout callout-warning">
                                <p><i class="fa fa-info-circle"></i> Please change your password for first login</p>
                            </div>
                        
                        </div>`;
                    }

                    var template = data.replaceAll("{{formtitle}}", msg.structure.formtitle);
                        template = template.replaceAll("{{notification}}",notification );
                    

                    // if(typeof msg.structure.act1 !== 'undefined'){
                        template = template.replaceAll("{{form1}}" , 
                            '<form id="changepass" name="changepass" method="POST" autocomplete="off">'+
                            '<input type="hidden" id="userid" name="userid" class="form-control" value="msg.structure.userId">'+
                            '<div class="form-group row">'+
                            '    <label class="col-sm-4 col-form-label">Old Password</label>'+
                            '    <div class="col-sm-8">'+
                            '    <input type="password" id="oldpassword" name="oldpassword" class="form-control" " autocomplete="off" ><span class="glyphicon glyphicon-eye-close form-control-feedback eye-pass-change oldpassword"></span>'+
                            '    </div>'+
                            '</div>'+
                            '<div class="form-group row">'+
                            '    <label class="col-sm-4 col-form-label">New Password</label>'+
                            '    <div class="col-sm-8">'+
                            '    <input type="password" id="newpassword" name="newpassword" class="form-control"  autocomplete="off" ><span class="glyphicon glyphicon-eye-close form-control-feedback eye-pass-change newpassword"></span>'+
                            '    </div>'+
                            '</div>'+
                            '<div class="form-group row">'+
                            '    <label class="col-sm-4 col-form-label">Confirm Password</label>'+
                            '    <div class="col-sm-8">'+
                            '    <input type="password" id="confirmpassword" name="confirmpassword" class="form-control"  autocomplete="off"><span class="glyphicon glyphicon-eye-close form-control-feedback eye-pass-change confirmpassword"></span>'+
                            '    </div>'+
                            '</div>'+
                            '<div class="form-group row">'+
                            '    <div class="col-sm-8 col-">'+
                            '    <input type="hidden" name="tokenizer" id="tokenizer" value=""/>'+
                            '    <button type="submit" class="btn btn-success" ><span class="glyphicon glyphicon-floppy-disk"></span> Save </button>'+
                            '    <button type="reset" class="btn btn-reset" ><span class="glyphicon glyphicon-refresh"></span> Reset </button>'+
                            '    </div>'+
                            '</div>'+
                            '</form>'
                        );
                        // template = template.replaceAll("{{form1}}" , 
                        //     '<form id="changepass" name="changepass" method="POST" autocomplete="off">'+
                        //     '<input type="hidden" id="userid" name="userid" class="form-control" value="msg.structure.userId">'+
                        //     '<div class="form-group row">'+
                        //     '    <label class="col-sm-4 col-form-label">Old Password</label>'+
                        //     '    <div class="col-sm-8">'+
                        //     '    <input type="password" id="oldpassword" name="oldpassword" class="form-control" " autocomplete="off" readonly onfocus="this.removeAttribute(\'readonly\');"><span class="glyphicon glyphicon-eye-close form-control-feedback eye-pass-change oldpassword"></span>'+
                        //     '    </div>'+
                        //     '</div>'+
                        //     '<div class="form-group row">'+
                        //     '    <label class="col-sm-4 col-form-label">New Password</label>'+
                        //     '    <div class="col-sm-8">'+
                        //     '    <input type="password" id="newpassword" name="newpassword" class="form-control"  autocomplete="off" readonly onfocus="this.removeAttribute(\'readonly\');"><span class="glyphicon glyphicon-eye-close form-control-feedback eye-pass-change newpassword"></span>'+
                        //     '    </div>'+
                        //     '</div>'+
                        //     '<div class="form-group row">'+
                        //     '    <label class="col-sm-4 col-form-label">Confirm Password</label>'+
                        //     '    <div class="col-sm-8">'+
                        //     '    <input type="password" id="confirmpassword" name="confirmpassword" class="form-control"  autocomplete="off" readonly onfocus="this.removeAttribute(\'readonly\');"><span class="glyphicon glyphicon-eye-close form-control-feedback eye-pass-change confirmpassword"></span>'+
                        //     '    </div>'+
                        //     '</div>'+
                        //     '<div class="form-group row">'+
                        //     '    <div class="col-sm-8 col-">'+
                        //     '    <input type="hidden" name="tokenizer" id="tokenizer" value=""/>'+
                        //     '    <button type="submit" class="btn btn-success" ><span class="glyphicon glyphicon-floppy-disk"></span> Save </button>'+
                        //     '    <button type="reset" class="btn btn-reset" ><span class="glyphicon glyphicon-refresh"></span> Reset </button>'+
                        //     '    </div>'+
                        //     '</div>'+
                        //     '</form>'
                        // );
                    //     template = template.replaceAll("{{form2}}" , '');
                    // }else{
                    //     template = template.replaceAll("{{form2}}" , 
                    //         '<form id="changepass" name="changepass" method="POST" autocomplete="off">'+
                    //         '<div class="form-group">'+
                    //         '    <label>New Password</label>'+
                    //         '    <input type="password" id="newpassword" name="newpassword" class="form-control" placeholder="New Password ..." autocomplete="off" readonly onfocus="this.removeAttribute(\'readonly\');">'+
                    //         '</div>'+
                    //         '<div class="form-group">'+
                    //         '    <label>Confirm Password</label>'+
                    //         '    <input type="password" id="confirmpassword" name="confirmpassword" class="form-control" placeholder="Confirm Password ..." autocomplete="off" readonly onfocus="this.removeAttribute(\'readonly\');">'+
                    //         '</div>'+
                    //         '<div class="box-footer">'+
                    //         '    <input type="hidden" name="tokenizer" id="tokenizer" value="<?php echo $sessionx->getAttribute("token");?>"/>'+
                    //         '    <button type="reset" class="btn btn-reset" >Reset <span class="glyphicon glyphicon-refresh"></span></button>'+
                    //         '    <button type="submit" class="btn btn-warning" >Change <span class="glyphicon glyphicon-ok"></span></button>'+
                    //         '</div>'+
                    //         '</form>'+
                        
                    //         '<form id="redir" method="post"></form>'
                    //     );
                    //     template = template.replaceAll("{{form1}}" , '');
                    // }
                    //show hide password 
                    

                    $( "#mainContent" ).html( template );

                    $('.oldpassword').on('click',function(){
                        var input_pass = document.getElementById("oldpassword");
                        if(input_pass.type ==='password'){
                            input_pass.type ='text';
                            $('.oldpassword').removeClass('glyphicon-eye-close');
                            $('.oldpassword').addClass('glyphicon-eye-open');
                        }else{
                            input_pass.type ='password';
                            $('.oldpassword').removeClass('glyphicon-eye-open');
                            $('.oldpassword').addClass('glyphicon-eye-close');
                        }
                    });

                    $('.newpassword').on('click',function(){
                        var input_pass = document.getElementById("newpassword");
                        if(input_pass.type ==='password'){
                            input_pass.type ='text';
                            $('.newpassword').removeClass('glyphicon-eye-close');
                            $('.newpassword').addClass('glyphicon-eye-open');
                        }else{
                            input_pass.type ='password';
                            $('.newpassword').removeClass('glyphicon-eye-open');
                            $('.newpassword').addClass('glyphicon-eye-close');
                        }
                    });

                    $('.confirmpassword').on('click',function(){
                        var input_pass = document.getElementById("confirmpassword");
                        if(input_pass.type ==='password'){
                            input_pass.type ='text';
                            $('.confirmpassword').removeClass('glyphicon-eye-close');
                            $('.confirmpassword').addClass('glyphicon-eye-open');
                        }else{
                            input_pass.type ='password';
                            $('.confirmpassword').removeClass('glyphicon-eye-open');
                            $('.confirmpassword').addClass('glyphicon-eye-close');
                        }
                    });

                });
                
            }else{
                
                alert(msg.info);
            }
        },error : function(msg){
            console.log(msg);
        }
    })
}


