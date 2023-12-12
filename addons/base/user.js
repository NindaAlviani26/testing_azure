function getForm(urlServer){
	$("#loading").removeClass('hide');
	$.ajax({
		beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', "Bearer " + sessionStorage.token); },
		url : urlServer,
		dataType : "JSON",
		method : "GET",
		success : function(msg){
			// var formid = 'ADMTX002';
			// var idmodule = 99;
			$("#loading").addClass('hide');
			if(msg.status == 'success'){
				$.get("./templates/base/user.template?v=1", function(data){
					var template = data.replaceAll("{{formtitle}}" , msg.structure.formtitle);
					$("#mainContent").html(template);

					function returnCallback(datapost){
						var responseObj;
						$.ajax({
							type: "POST",
							url: msg.structure.urlValidate, 
							data: JSON.parse(datapost),
							dataType: "json" 
						}).done(function( msg ) {
							responseObj=msg; 
							console.log(responseObj);

							return responseObj; 
						});    
						return responseObj;
					}
					var gridimgpath = 'themes/basic/images';

					$.ajaxSetup({
                        headers : {
                            'Authorization' : "Bearer " + sessionStorage.token
                        }
                    });

					var dialogXVWUSERLIST = $( "#"+msg.structure.idTable+"dialog2" ).dialog({
						autoOpen: false, 
						modal: true,
						buttons: {
							OK: function() {   
								if (!($("#"+msg.structure.idTable).jqGrid('getCell',$("#"+msg.structure.idTable).jqGrid('getGridParam','selrow'), 0))){
									alert('Please select one or more data first.'); 
								}

								var myGrid = $("#"+msg.structure.idTable), selIds = myGrid.jqGrid("getGridParam", "selarrrow"), i, n,
								cellValues = [],
								cellID = [];
								var sumValues = 0;
								for (i = 0, n = selIds.length; i < n; i++) {
									cellID.push(myGrid.jqGrid("getCell", selIds[i], 'userid'));
								}

								$(function() {
									$.ajax({ 
										method: "POST",
										dataType: "json",
										url: "./addons/base/execprocappv.php",
										data: { 
											table : "CORE_USER_LIST",
											parWfID : cellID.join(","),
											parUsrID : "'<?php echo $userid;?>'",
											parApp: 'core_app',
	                                		//parParam : "<?php echo end(explode('VW_', current(explode('_APPROVAL', $tablename))));?>",
			                                parParam : "userid",
			                                parStat : "'"+Stat+"'",
			                                parStID : "'"+StID+"'"
                            			}
                        			}).done(function( msg ) { 
			                        	if (msg.err_code=='0') {
			                        		alert( "Data Saved: " + msg.err_msg );
			                        		jQuery("#"+msg.structure.idTable).trigger('reloadGrid'); 
			                        		return true;
			                        	}
			                        	else {
			                        		alert( "Data Saved: " + msg.err_msg );
			                        		return false;
			                        	}
                        			});
			                        dialogXVWUSERLIST.dialog("close");  
			                        jQuery("#"+msg.structure.idTable).trigger('reloadGrid'); 
			                    });
							},
							Cancel: function() {
								dialogXVWUSERLIST.dialog("close");
							}
						},
						open: function( event, ui ) {},
						close: function( event, ui ) {
							return true;
						} 
					});

					var colNamesVar =msg.structure.colNames; 
					var thisColNames = colNamesVar.replace(/'/g,"");
					thisColNames = thisColNames.split(",");

					var colModelVar = JSON.parse(msg.structure.colModel);

					jQuery("#"+msg.structure.idTable).jqGrid({
						url:msg.structure.urlLoadData,
						datatype: "json", 
						mtype: "POST",
						cmTemplate: {
							editable: true,
							autoResizable: true
						},
						iconSet: "fontAwesome", 
						styleUI : 'Bootstrap', 
						colNames:thisColNames,
						colModel:colModelVar, 
						rowNum:10,
						rowList:[10,25,50],
						imgpath: gridimgpath,
						autowidth: true, 
						pager: '#pager'+msg.structure.idTable,
						sortname: 'userid',
						viewrecords: true,
						altRows: true,
						responsive:true,
						toppager: true,
						rownumbers: true, 
						colMenu : true, 
						sortorder: "asc", 
						editurl:msg.structure.editurl,
						height: "100%",
						forceFit : true,
						multiselect: false,
						viewsortcols: [false,'vertical',true]
					}).jqGrid('navGrid','#pager'+msg.structure.idTable,
					{
						excel:true,
						search: true,
						view: msg.structure.viewpermission,
						edit: msg.structure.editpermission,
						add: msg.structure.addpermission,
						del: msg.structure.delpermission,
						cloneToTop: true,
						help: true 
					}, 
					{
						width:600, 
						dataheight:400, 
						recreateForm:true, 
						reloadAfterSubmit:true, 
						closeAfterSubmit:true, 
						jqModal:true, 
						closeAfterEdit: true,
						closeOnEscape:true, bottominfo:"Fields marked with (*) are required",
						onInitializeForm:function(formid){

							$("#tr_userpass",formid).show();
							$("#tr_username",formid).hide();
							$("#tr_firstname",formid).show();
							$("#tr_lastname",formid).show(); 
							$("#tr_idrolegroup",formid).show();
							$("#tr_rolename",formid).hide();
							$("#tr_groupname",formid).hide();
							$("#tr_branchcode",formid).show();
							$("#tr_branch",formid).hide();
							$("#tr_bankcode",formid).show();
							$("#tr_bankname",formid).hide();   	
						} , 
						beforeShowForm:function(formid){ 
							$("#userid",formid).attr('readonly','readonly');
						},
						

						beforeSubmit : function(postdata, formid, oper){
							if(msg.structure.userLdap != true){
								var datapost=JSON.stringify(postdata);
								var result;
								datapost=datapost.substr(0,datapost.length-1)+',"oper":"'+oper+'", "form":"user"}';
								result = $.ajax({
									type: "POST",
									async: false, 
									url: msg.structure.urlValidate, 
									data: JSON.parse(datapost),
									dataType: "json",
									timeout: 2000
								}).done(function( msg ) { 
									return msg; 
								}).responseJSON;


								if (result.error=="0"){
									return [true,"",""];
								}
								else {
									alert(result.message);
									return [false,result.message,""];
								} 
							}else{
								return [true,"",""];
							}
						},
	
						afterSubmit: function(serverResponse,xhr,postdata){  
							if($.trim(serverResponse.responseText)==''){
								alert($.trim(serverResponse.responseText));
								return [false,"",""];
							}
							else {
								// replace session
								var result = JSON.parse(serverResponse.responseText);
                                if(result.status == "success"){
                                    sessionStorage.setItem("token",result.token.refresh);
                                    alert(result.info); 
                                }else{
                                    alert(result.info); 
                                }
								return [true,"",""];
								// and replace session
							}
						}  
					},//edit
					{
						width:600, 
						dataheight:400, 
						recreateForm:false, 
						reloadAfterSubmit:true, 
						closeAfterSubmit:true, 
						closeAfterAdd:true, 
						jqModal:true, 
						closeOnEscape:true, 
						bottominfo:"Fields marked with (*) are required",
						onInitializeForm:function(formid){ 
							$("#tr_userpass",formid).show();
							$("#tr_username",formid).hide();
							$("#tr_firstname",formid).show();
							$("#tr_lastname",formid).show(); 
							$("#tr_idrolegroup",formid).show();
							$("#tr_groupname",formid).hide();
							$("#tr_rolename",formid).hide();
							$("#tr_branchcode",formid).show();
							$("#tr_branch",formid).hide();
							$("#tr_bankcode",formid).show();
							$("#tr_bankname",formid).hide();   	
						},
						errorTextFormat: function (data) {
							return 'Error: ' + data.responseText
						}, 
						beforeShowForm:function(formid){ 
							$("#userid",formid).removeAttr('readonly'); 
						},
						
						beforeSubmit : function(postdata, formid, oper){
							if(msg.structure.userLdap != true){
								var datapost=JSON.stringify(postdata);
								var result;
								datapost=datapost.substr(0,datapost.length-1)+',"oper":"'+oper+'", "form":"user"}';
								result = $.ajax({
									type: "POST",
									async: false, 
									url: msg.structure.urlValidate, 
									data: JSON.parse(datapost),
									dataType: "json",
									timeout: 2000
								}).done(function( msg ) { 
									return msg; 
								}).responseJSON;


								if (result.error=="0"){
									return [true,"",""];
								}
								else {
									alert(result.message);
									return [false,result.message,""];
								} 
							}else{
								return [true,"",""];
							}
						},
							
						afterSubmit : function(response, postdata) 
						{ 
							if($.trim(response.responseText)==''){
								alert($.trim(response.responseText));
								return [false,"",""];
							}
							else {
								// replace session
								var result = JSON.parse(response.responseText);
                                if(result.status == "success"){
                                    sessionStorage.setItem("token",result.token.refresh);
                                    alert(result.info); 
                                }else{
                                    alert(result.info); 
                                }
								return [true,"",""];
								// endreplace session
							}
						
						}
					  /*,

					  onclickSubmit  : function(response, postdata) 
					  { 
					    $.ajax({
					          method: "POST",
					          dataType: "json",
					          url: "execprocappv.php?count=CORE_VW_USERLIST",
					          data: { 
					            parPassword: "'" + $("#userpass").val() + "'",
					            parParam : "userid",
					            parCount : "'" + $("#userid").val() + "'",
					            parMsg : "Add"
					          }
					        }).done(function( msg ) { 
					          //alert("Error code" + msg.err_code);
					          if (msg.err_code==1) {
					            //alert( "Data FAILED: " + msg.err_msg );      
					            alert( "Data FAILED: User Already Exists!" );
					            $("#VWUSERLIST").trigger('reloadGrid');    
					            return false;
					          }
					          else {
					            alert( "Data Saved: " + msg.err_msg );
					            $("#VWUSERLIST").trigger('reloadGrid');
					            return true;
					          }
					        });
					  }
					  */
					},//add
					{
						width:250, 
						dataheight:50, 
						recreateForm:false,
						reloadAfterSubmit:true, 
						closeAfterSubmit:true, 
						jqModal:true, 
						closeOnEscape:true,  
						onclickSubmit : function(eparams) 
						{  
					     	var retarr = {}; // we can use all the grid methods here //to obtain some data 
					     	var sr = jQuery("#"+msg.structure.idTable).jqGrid('getGridParam','selrow');  
					     	primarykey=jQuery("#"+msg.structure.idTable).jqGrid('getCell',jQuery("#"+msg.structure.idTable).jqGrid('getGridParam','selrow'), 'userid');
					     	retarr = {userid:primarykey}; 
					     	// $("#"+msg.structure.idTable).trigger('reloadGrid');
					     	return retarr; 

							/*
							var retarr = {}; // we can use all the grid methods here //to obtain some data 
							var sr = jQuery("#VWUSERLIST").jqGrid('getGridParam','selrow');  
							primarykey=jQuery("#VWUSERLIST").jqGrid('getCell',jQuery("#VWUSERLIST").jqGrid('getGridParam','selrow'), 'userid');
							alert("are you sure to delete: " + primarykey );
							retarr = {userid:primarykey}; 
							return retarr; 
							*/
						},
						afterSubmit : function(response, postdata) 
						{ 
							if($.trim(response.responseText)==''){
								alert($.trim(response.responseText));
								return [false,"",""];
							}
							else {
								// replace session
								var result = JSON.parse(response.responseText);
                                if(result.status == "success"){
                                    sessionStorage.setItem("token",result.token.refresh);
                                    alert(result.info); 
                                }else{
                                    alert(result.info); 
                                }
								return [true,"",""];
								// endreplace session
							}
						
						}
					});//del
					
					jQuery('#'+msg.structure.idTable+'_toppager_center').remove();
					jQuery('#'+msg.structure.idTable+'_toppager_right').remove();
					jQuery('#pager'+msg.structure.idTable+'_left').remove();

					$('#'+msg.structure.idTable).jqGrid("navSeparatorAdd","#pg_"+msg.structure.idTable+"_toppager",{
						sepclass : 'ui-separator',sepcontent: ''
					});

					$('#'+msg.structure.idTable).jqGrid("navButtonAdd","#pg_"+msg.structure.idTable+"_toppager",{
						buttonicon: "glyphicon icon-libreoffice",
						title: "Export to CSV",
						caption: "",
						position: "last",
						onClickButton: exportToCSV2
					});
								/*
								$('#VWUSERLIST').jqGrid('navButtonAdd',"#pg_VWUSERLIST_toppager",{
					                    caption:"Export to Excel", 
					                    onClickButton : function () { 
					                        jQuery("#VWUSERLIST").excelExport();
					                    } 
					                });
					                */							

					                function exportToCSV2(){
										/*
									exportToCSVTable($('#VWUSERLIST'),
											'',
											'',
											'',
											'ADM_FORMADMTX002');
											*/
										// exportToCSVX($('#VWUSERLIST'),
										// 	'', 
										// 	'',
										// 	'ADM_FORMADMTX002');
										exportToCSVTable($('#'+msg.structure.idTable),
		                                    msg.structure.formidx0,
		                                    msg.structure.module,
		                                    msg.structure.prefixtbl,
		                                    msg.structure.prefixtbl + "form" + msg.structure.formidx0,
		                                    msg.structure.urlExportCsv);

										// console.log(msg.structure.formidx0 +' ,'+msg.structure.module+' ,'+msg.structure.prefixtbl+', '+msg.structure.tablename1+', '+msg.structure.urlExportCsv);
									}
								//function export 

								// 		function exportToCSVX(ElemetID,idmodule, prefixtbl, tablename){
								// 			var xx = ElemetID.getGridParam('colModel').length;
								// 			var strField = '';
								// 			var strDesc = '';
								// 			for(i=1;i<xx;i++){
								// 				try { 
								// 					if (!(ElemetID.getGridParam('colModel')[i].hidden) 
								// 						)
								// 					{
								// 						if(ElemetID.getGridParam('colModel')[i].index != null){
								// 							strField = strField + ElemetID.getGridParam('colModel')[i].index  + ',';
								// 							strDesc = strDesc + '"' + ElemetID.getGridParam('colNames')[i]   + '",'; 
								// 						}
								// 					}

								// 				}	
								// 				catch(e){
								// 					console.log(e);
								// 				}
								// 			}  
								// 			var filtered = '';
								// 			try{

								// 				console.log(ElemetID.getGridParam("postData"));
								// 				if(ElemetID.getGridParam("postData").filters!=undefined){ 
								// 					filtered = ElemetID.getGridParam("postData").filters;
								// 					if ((filtered=="")&&(ElemetID.getGridParam("postData").searchString!="")){
								// 						filtered = '{"groupOp":"AND", "rules":[{"field":"'+ElemetID.getGridParam("postData").searchField+'","op":"'+ElemetID.getGridParam("postData").searchOper+'","data":"'+ElemetID.getGridParam("postData").searchString+'"}]}';
								// 				searchField: "userid"
								// 				searchOper: "cn"
								// 				searchString: "1018809"
												
								// 			} 
								// 		}  
								// 	}
								// 	catch(e){
								// 		console.log(e);
								// 	}				

								// 	var m=idmodule;
								// 	var p=prefixtbl;
								// 	var t=tablename;
								// 	var param="'"+$( "#ProcessDate"+ElemetID[0].id ).val()+"'"; 
									
								// 	$("#loading").removeClass('hide'); 
								// 	$.ajax({
								// 		url: msg.structure.urlExportCsv,
								// 		type: 'post', 
								// 		data: { 
								// 			m:idmodule,
								// 			p:prefixtbl,
								// 			t:tablename,
								// 			param:$( "#ProcessDate"+ElemetID[0].id  ).val(),
								// 			filtered:filtered,
								// 			fieldname:strField,
								// 			fielddesc:strDesc
								// 		},
								// 		success: function(response){ 
								// 			var currentdate = new Date(); 
								// 			var datetime = "_" + currentdate.getFullYear().toString() + currentdate.getMonth().toString() + currentdate.getDate().toString() +  "_" + currentdate.getHours().toString() + currentdate.getMinutes().toString() + currentdate.getSeconds();
								// 			filename=ElemetID[0].id+datetime;
								// 			var blob=new Blob([response]);
								// 			var link=document.createElement('a');
								// 			link.href=window.URL.createObjectURL(blob);
								// 			link.download=filename+".csv";
								// 			link.click();
								// 			$("#loading").addClass('hide');
								// 			return true; 
								// 		}
								// 	}); 
								// };
								
								$(window).bind('resize', function() {
									var width = $('.table-responsive').width();
									$('#'+msg.structure.idTable).jqGrid("setGridWidth", width);
								}).trigger('resize');

								$('.sidebar-toggle').on('click', function() { 
									//var width = $('.table-responsive').width(); 
									if ($('.main-sidebar').width() > 60) { 
										$('#'+msg.structure.idTable).jqGrid("setGridWidth", $(window).innerWidth() - 115);
										//$('#VWUSERLIST').jqGrid("setGridWidth", width - 20);
									} else {
										$('#'+msg.structure.idTable).jqGrid("setGridWidth", $(window).innerWidth() - 295); 
										//$('#VWUSERLIST').jqGrid("setGridWidth", width -20);
									}
								});
							});
					}
					else{
						alert(msg.info);
					}
		}
	})
}
