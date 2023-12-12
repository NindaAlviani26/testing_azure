function getForm(urlServer){
	$("#loading").removeClass('hide');
	$.ajax({
		beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', "Bearer " + sessionStorage.token); },
		url : urlServer,
		dataType : "JSON",
		method : "GET",
		success : function(msg){
			$("#loading").addClass('hide');
			var formid = 'ADMTX002';
			var idmodule = 99;
			var tablename = 'CORE_VW_USERLIST';
			var tablenamesrc = 'CORE_USER_LIST_STG';
			var tablenamesave='CORE_USER_LIST';

			// console.log(msg);

			if(msg.status == 'success'){
				$.get("./templates/base/userapp.template?v=1", function(data){
					var template = data.replaceAll("{{formtitle}}" , msg.structure.formtitle);
					$("#mainContent").html(template);

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

					var colNamesVar = msg.structure.colNames;
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
					  multiselect: true,
							viewsortcols: [false,'vertical',true]
					}).jqGrid('navGrid','#pager'+msg.structure.idTable,
					{view:true,edit:false,add:false,del:false,cloneToTop: true,
										help: true }, 
					{width:600, dataheight:400, recreateForm:true, reloadAfterSubmit:true, closeAfterSubmit:true, jqModal:true, closeOnEscape:true, bottominfo:"Fields marked with (*) are required",
					 onInitializeForm:function(formid){
					  	$("#tr_userpass",formid).show();
					  	$("#tr_username",formid).hide();
					  	$("#tr_firstname",formid).show();
					   	$("#tr_lastname",formid).show(); 
					   	$("#tr_idrolegroup",formid).show();
					   	$("#tr_groupname",formid).hide();
					   	$("#tr_branchcode",formid).show();
					   	$("#tr_branch",formid).hide();
					   	$("#tr_bankcode",formid).show();
					   	$("#tr_bankname",formid).hide();   	
					  } ,
					  /*afterSubmit: function(serverResponse,xhr,postdata){  
					  	  if ($.trim(serverResponse.responseText)!=''){
					  			//alert (serverResponse.responseText);
					        //$("#VWUSERLIST").trigger('reloadGrid'); 
					  			return false ;
					  		}
					  	else { 
								alert ("Edit Data Successfully...!"); 
					      $("#VWUSERLIST").trigger('reloadGrid');
								return true ;
							}
					  } */

					  onclickSubmit  : function(response, postdata) 
					  { 
					    $.ajax({
					          method: "POST",
					          dataType: "json",
					          url: "./addons/base/execprocappv.php?count=<?php echo $tablename;?>",
					          data: { 
					            parPassword: "'" + $("#userpass").val() + "'",
					            parParam : "userid",
					            parCount : "'" + $("#userid").val() + "'",
					            parMsg : "Edit"
					          }
					        }).done(function( msg ) { 
					          //alert("Error code" + msg.err_code);
					          if (msg.err_code==1) {
					            alert( "Data FAILED: " + msg.err_msg );      
					            //alert( "Data FAILED: User Already Exists!" );      
					            return false;
					          }
					          else {
					            alert( "Data Saved: " + msg.err_msg );
					            $("#"+msg.structure.idTable).trigger('reloadGrid');
					            return true;
					          }
					        });
					  }
					},//edit
					{width:600, dataheight:400, recreateForm:false, reloadAfterSubmit:false, closeAfterSubmit:true, jqModal:true, closeOnEscape:true, bottominfo:"Fields marked with (*) are required",
						onInitializeForm:function(formid){
					  	$("#tr_userpass",formid).show();
					  	$("#tr_username",formid).hide();
					  	$("#tr_firstname",formid).show();
					   	$("#tr_lastname",formid).show(); 
					   	$("#tr_idrolegroup",formid).show();
					   	$("#tr_groupname",formid).hide();
					   	$("#tr_branchcode",formid).show();
					   	$("#tr_branch",formid).hide();
					   	$("#tr_bankcode",formid).show();
					   	$("#tr_bankname",formid).hide();   	
					  },
					  afterSubmit : function(response, postdata) 
					  { 
					    if($.trim(response.responseText)=='') {
					      alert ("Add Data Successfully...!");  
					      $("#"+msg.structure.idTable).clearGridData(true).trigger('reloadGrid');  
					      return true;
					    }
					    else {  
					      alert ("Add Data FAILED...! Check your password or user alredy exists!"); 
						  $("#"+msg.structure.idTable).clearGridData(true).trigger('reloadGrid');  
					      return true;
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
					{width:250, dataheight:50, recreateForm:false, reloadAfterSubmit:false, closeAfterSubmit:true, jqModal:true, closeOnEscape:true,  
						onclickSubmit : function(eparams) 
						{  
					     var retarr = {}; // we can use all the grid methods here //to obtain some data 
					     var sr = jQuery("#"+msg.structure.idTable).jqGrid('getGridParam','selrow');  
					     primarykey=jQuery("#"+msg.structure.idTable).jqGrid('getCell',jQuery("#"+msg.structure.idTable).jqGrid('getGridParam','selrow'), 'userid');
					     retarr = {userid:primarykey}; 
					     $("#"+msg.structure.idTable).trigger('reloadGrid');
					     return retarr; 

							 /*
					     var retarr = {}; // we can use all the grid methods here //to obtain some data 
							 var sr = jQuery("#VWUSERLIST").jqGrid('getGridParam','selrow');  
							 primarykey=jQuery("#VWUSERLIST").jqGrid('getCell',jQuery("#VWUSERLIST").jqGrid('getGridParam','selrow'), 'userid');
					     alert("are you sure to delete: " + primarykey );
							 retarr = {userid:primarykey}; 
							 return retarr; 
					     */
							}
					});//del
					
					if (msg.structure.approvedpermission == true){
						$.jqGrid('navButtonAdd','#pager'+msg.structure.idTable,{caption:"",title:"Approval",buttonicon :'ui-icon-circle-check', 
						  onClickButton:function(){  
						    if ($("#"+msg.structure.idTable).jqGrid('getGridParam','selarrrow') !=''){
						      Stat = '1';
						      WfID = $("#"+msg.structure.idTable).jqGrid ('getCell', $("#"+msg.structure.idTable).jqGrid('getGridParam','selrow'), 'userid');
						      StID = $("#"+msg.structure.idTable).jqGrid ('getCell', $("#"+msg.structure.idTable).jqGrid('getGridParam','selrow'), 'approved');
						      dialogXVWUSERLIST.dialog('open');
						    }
						    else {
						      alert("Please Checked Grid Before");
						    }
						  } 
						})
					}
					if (msg.structure.rejectedpermission == true){
						$.jqGrid('navButtonAdd','#pager'+msg.structure.idTable,{caption:"",title:"Rejected",buttonicon :'ui-icon-circle-close', 
						  onClickButton:function(){  
						    if ($("#"+msg.structure.idTable).jqGrid('getGridParam','selarrrow') !=''){
						      Stat= '2';
						      WfID= $("#"+msg.structure.idTable).jqGrid ('getCell', $("#"+msg.structure.idTable).jqGrid('getGridParam','selrow'), 'userid');
						      StID = $("#"+msg.structure.idTable).jqGrid ('getCell', $("#"+msg.structure.idTable).jqGrid('getGridParam','selrow'), 'approved');
						      dialogXVWUSERLIST.dialog('open');
						    }
						    else{
						      alert("Please Checked Grid Before");
						    }
						  } 
						})
					}
					// $.jqGrid('navButtonAdd','#pagerVWUSERLIST',
					// {caption:"", title:"Help menu", buttonicon :'ui-icon-help',
					// 	onClickButton:function()
					// 	{
					// 		<?
					// 			$db=new database($dbtype, $dbhost, $database, $dbuser, $dbpassword, $port, $dsn);
					// 			$que = "select pdffile, page from CORE_PDF where idmenu = ".$idmenu;
					// 			$db->query($que);
					// 			$brs = $db->get_row();
					// 			$db->disconnect();
					// 		?>
					// 		window.open('pdfjs/web/viewer.php?pdf=<? echo $brs[pdffile]; ?>#<? echo $brs[page]; ?>');
					// 	} 
					// });
		
									
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
						onClickButton: exportToCSV
					});
					/*
					$('#VWUSERLIST').jqGrid('navButtonAdd',"#pg_VWUSERLIST_toppager",{
		                    caption:"Export to Excel", 
		                    onClickButton : function () { 
		                        jQuery("#VWUSERLIST").excelExport();
		                    } 
		                });
					*/			
									
					$('#'+msg.structure.idTable).jqGrid("navButtonAdd","#pg_"+msg.structure.idTable+"_toppager",{
					    buttonicon: "glyphicon glyphicon-remove",
						title: "Reject Data",
						caption: "",
						position: "first", 
						onClickButton:function(){ 
						
								var s; 
								s = jQuery("#"+msg.structure.idTable).jqGrid('getGridParam','selarrrow');   
									  strprop='';
									  for (var i = 0; i < s.length; i++) {
										 colmod =jQuery("#"+msg.structure.idTable).jqGrid('getGridParam',"colModel");
										 data = jQuery("#"+msg.structure.idTable).jqGrid('getRowData',s[i]); 
										 for (var x in colmod){
											 
											 if(colmod[x].index=='iduserlist')
											 {
												 strprop=strprop + data[colmod[x].index]+',';
												 
											 } 
										 }
										  
									  }
									   
									  strpropX = '';
									  if (strprop==''){
										alert("Please Check Data Before Approved...!");
										return false;
									  }
									  else {
										$("#loading").removeClass('hide');
										//return to rejected
										strpropX='id='+strprop;
										 
											$.ajax({
													type: "POST",
													dataType: "JSON",
													url: msg.structure.urlReject,
													data: strpropX,
													success: function(message){ 
														// alert(message.info);
														// $("#"+msg.structure.idTable).clearGridData(true).trigger('reloadGrid');   
														// $("#"+msg.structure.idTable).trigger('reloadGrid'); 

														// replace session
														if (message.status == "success") {
															$("#"+msg.structure.idTable).clearGridData(true).trigger('reloadGrid');   
															$("#"+msg.structure.idTable).trigger('reloadGrid'); 

															sessionStorage.setItem("token", message.token.refresh);
															alert(message.info);
															$("#loading").addClass('hide');
														} else {
															alert(message.info);
															$("#loading").addClass('hide');
														}
														return [true, "", ""];
														// end replace session
													},
													error: function(message){
														console.log(message);
													}
											});	 
									  }
									  
								} 
						});
					$('#'+msg.structure.idTable).jqGrid("navButtonAdd","#pg_"+msg.structure.idTable+"_toppager",{
					    buttonicon: "glyphicon glyphicon-ok",
						title: "Auth Data",
						caption: "",
						position: "first", 
						onClickButton:function(){ 
						
								var s; 
								s = jQuery("#"+msg.structure.idTable).jqGrid('getGridParam','selarrrow');   
									  strprop='';
									  for (var i = 0; i < s.length; i++) {
										 colmod =jQuery("#"+msg.structure.idTable).jqGrid('getGridParam',"colModel");
										 data = jQuery("#"+msg.structure.idTable).jqGrid('getRowData',s[i]); 
										 for (var x in colmod){
											 
											 if(colmod[x].index=='iduserlist')
											 {
												 strprop=strprop + data[colmod[x].index]+',';
												 
											 } 
										 }
										  
									  }
									  
									  strpropX = '';
									  if (strprop==''){
										alert("Please Check Data Before Approved...!");
										return false;
									  }
									  else {
										$("#loading").removeClass('hide');
										//return to approval
										strpropX='id='+strprop;
										 
											$.ajax({
													type: "POST",
													dataType : "JSON",
													url: msg.structure.urlApprovel,
													data: strpropX,
													success: function(message){ 
														// alert(message.info);
														// $("#"+msg.structure.idTable).clearGridData(true).trigger('reloadGrid');   
														// $("#"+msg.structure.idTable).trigger('reloadGrid'); 
														// replace session
														if (message.status == "success") {
															$("#"+msg.structure.idTable).clearGridData(true).trigger('reloadGrid');   
															$("#"+msg.structure.idTable).trigger('reloadGrid'); 

															sessionStorage.setItem("token", message.token.refresh);
															alert(message.info);
															$("#loading").addClass('hide');
														} else {
															alert(message.info);
															$("#loading").addClass('hide');
														}
														return [true, "", ""];
														// end replace session
													},
													error: function(message){
														console.log(message);
													}
											});
		 									
									  }
									 //alert(strpropX);
									  
								} 
						});							
		  
					function exportToCSV(){
						var xx = $('#'+msg.structure.idTable).getGridParam('colModel').length;
						var strField = '';
						var strDesc = '';
						for(i=0;i<=xx;i++){
							try {
								if ((!($('#'+msg.structure.idTable).getGridParam('colModel')[i].hidden)) &
								($('#'+msg.structure.idTable).getGridParam('colModel')[i].index!=undefined))
								//if ($('#VWUSERLIST').getGridParam('colModel')[i].hidden!=true)
								//if ($('#VWUSERLIST').getGridParam('colModel')[i].attr('hidden')!='undefined') 
								{
									strField = strField + $('#'+msg.structure.idTable).getGridParam('colModel')[i].index  + ',';
									strDesc = strDesc + '"' + $('#'+msg.structure.idTable).getGridParam('colNames')[i]   + '",';
								}
							}	
							catch(e){
								console.log(e);
							}
						} 
						var filtered = '';
						try{
							if($('#'+msg.structure.idTable).getGridParam("postData").filters!=undefined){
								//alert($('#VWUSERLIST').getGridParam("postData").filters);
								filtered = $('#'+msg.structure.idTable).getGridParam("postData").filters;
							}
						}
						catch(e){
							console.log(e);
						}				
						 
						var f= msg.structure.formid;
						var m= msg.structure.module;
						var p= msg.structure.prefixtbl;
						var param="'"+$( "#ProcessDate"+msg.structure.tableName+""+msg.structure.idmenu).val()+"'"; 
						
						$("#loading").removeClass('hide'); 
						$.ajax({
							 url: msg.structure.urlExportCsv,
							 type: 'post', 
							 data: {
								f: msg.structure.formid,
								m: msg.structure.module,
								p: msg.structure.prefixtbl,
								param:$( "#ProcessDate"+msg.structure.tableName+""+msg.structure.idmenu).val(),
								filtered:filtered,
								fieldname:strField,
								fielddesc:strDesc
							 },
							 success: function(response){
							    //alert(response); 
								var currentdate = new Date(); 
								var datetime = "_" + currentdate.getFullYear().toString() + currentdate.getMonth().toString() + currentdate.getDate().toString() +  "_" + currentdate.getHours().toString() + currentdate.getMinutes().toString() + currentdate.getSeconds();
								filename=msg.structure.fileName+""+datetime;
								var blob=new Blob([response]);
								var link=document.createElement('a');
								link.href=window.URL.createObjectURL(blob);
								link.download=filename+".csv";
								link.click();
								$("#loading").addClass('hide');
							   return true; 
							 }
						   });
						/*
						$('#VWUSERLIST').tableExport(
						  {
							fileName: "VWUSERLIST",
							type:'csv', 
							csvEnclosure: '"',
							csvSeparator: ',',
							csvUseBOM: false,
							jsonScope: 'all',
							consoleLog:true
						  }
						);
						*/
					};
					
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
		},
		error: function(msg){
			console.log(msg);
		}
	})
}