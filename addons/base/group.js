function getForm(urlServer){
	$("#loading").removeClass('hide');
	$.ajax({
		beforeSend: function(xhr){xhr.setRequestHeader('Authorization', "Bearer " + sessionStorage.token);},
        url : urlServer,
        dataType : "json",
        method : "GET",
        success : function(msg){
			$("#loading").addClass('hide');
			if(msg.status == 'success'){
				$.get("./templates/base/group.template?v=1", function(data){

					$.ajaxSetup({
                        headers : {
                            'Authorization' : "Bearer " + sessionStorage.token
                        }
					});
					

					var template = data.replaceAll("{{formtitle}}" , msg.structure[0].formtitle);

					if(msg.structure[1].addpermission === "true"){
						template = template.replaceAll("{{btnAdd}}" , 
							'<button type="button" class="btn btn-default" id="kanan" title="Save">'+
							'<span class="glyphicon glyphicon-arrow-right"></span></button>'
						);
					}else{
						template = template.replaceAll("{{btnAdd}}" , '');
					}

					if(msg.structure[1].delpermission === "true"){
						template = template.replaceAll("{{btnDel}}" , 
							'<button type="button" class="btn btn-default" id="kiri" title="Delete">'+
							' <span class="glyphicon glyphicon-arrow-left"></span></button>'
						);
					}else{
						template = template.replaceAll("{{btnDel}}" , '');
					}

					$("#mainContent").html(template);

					$.get(serverHost + "addons/base/combopub.api?t=MODULE", function(dataMsg){
						$(".comboModule").html(dataMsg);
						$(".comboModule select").attr("id", "idmodule");
						$("#idmodule").on("change", function(){
							changecombo(this);
						})
					});

					$( "#kanan" ).button({
						text: false,
						icons: {
							primary: "ui-icon-seek-next"
						}
					}).click(function() { 
						$("#loading").removeClass('hide');
						//get Group
						var idrole=jQuery("#"+msg.structure[0].idTable).jqGrid('getCell',jQuery("#"+msg.structure[0].idTable).jqGrid('getGridParam','selrow'), 'idrole'); 
						//get Menus
						var idmenus=jQuery("#"+msg.structure[1].idTable).jqGrid('getCell',jQuery("#"+msg.structure[1].idTable).jqGrid('getGridParam','selrow'), 'id');
						//alert(idmenus);
						var s; 
						s = jQuery("#"+msg.structure[1].idTable).jqGrid('getGridParam','selarrrow');   
						var datas="";
						for (var i = 0; i < s.length; i++) { 
							data = jQuery("#"+msg.structure[1].idTable).jqGrid('getRowData',(s[i])); 
							datas = datas + data['id']+ ",";  
						} 
						datas = datas.substring(0, datas.length-1);  
						var idmodule=jQuery("#idmodule").val(); 

						//alert("./addons/base/savemenudata.php?t=CORE_ROLE_MENUS&oper=add&idrole="+idrole+"&idmenus="+idmenus+"&idmodule="+jQuery("#idmodule").val()+"&addpermission=1&editpermission=1&delpermission=1&viewpermission=1&authpermission=1&reppermission=1");
						//alert("<?php echo $formx[1]->srcinsert; ?>");
						var scripts="";
						$.ajax({
							type: "POST",
							dataType: "JSON",
							url: msg.structure[2].urlSaveRole+"&idrole="+idrole+"&idmenus="+idmenus+"&idmodule="+jQuery("#idmodule").val(),
							data : scripts,  
							success: function( message ){ 
								$("#loading").addClass('hide');
								// alert(message.info);
								// $("#"+msg.structure[2].idTable).trigger('reloadGrid');
								// return false;

								// replace session
								if (message.status == "success") {
									sessionStorage.setItem("token", message.token.refresh);
									alert(message.info);
									$("#"+msg.structure[2].idTable).trigger('reloadGrid');
								} else {
									alert(message.info);
								}
								return [true, "", ""];
								// end replace session 
							}, error: function(message){
								console.log(message.info);
							} 
						});	

					});
					$( "#kiri" ).button({
						text: false,
						icons: {
							primary: "ui-icon-seek-prev"
						}
					}).click(function() {  
						$("#loading").removeClass('hide');
						//get Group
						var idrole=jQuery("#"+msg.structure[0].idTable).jqGrid('getCell',jQuery("#"+msg.structure[0].idTable).jqGrid('getGridParam','selrow'), 'idrole'); 
						//get Menus
						var idmenus=jQuery("#"+msg.structure[1].idTable).jqGrid('getCell',jQuery("#"+msg.structure[1].idTable).jqGrid('getGridParam','selrow'), 'id');
						//alert(idmenus);
						//get Submenus
						var idrolemenus=jQuery("#"+msg.structure[2].idTable).jqGrid('getCell',jQuery("#"+msg.structure[2].idTable).jqGrid('getGridParam','selrow'), 'idrolemenus'); 
						var idmenus = jQuery("#"+msg.structure[2].idTable).jqGrid('getCell',jQuery("#"+msg.structure[2].idTable).jqGrid('getGridParam','selrow'), 'idmenus'); 
						var scripts="";
						$.ajax({
							type: "POST",
							dataType: "JSON",
							url: msg.structure[2].urlDeleteRole+"&idrolemenus="+idrolemenus+"&idrole="+idrole+"&idmenus="+idmenus+"&idmodule="+jQuery("#idmodule").val(),
							data : scripts,  
							success: function( message ){ 
								$("#loading").addClass('hide');
								// replace session
								if (message.status == "success") {
									$("#"+msg.structure[2].idTable).trigger('reloadGrid');
									sessionStorage.setItem("token", message.token.refresh);
									alert(message.info);
								} else {
									alert(message.info);
								}
								return [true, "", ""];
								// end replace session
							}, error: function(message){
								console.log(message.info);
							} 
						});	 
					});
					jQuery("#"+msg.structure[1].idTable).jqGrid({
						url:msg.structure[1].urlLoadData,
						treedatatype: "json",
						mtype: "POST",
						cmTemplate: {
							editable: true,
							autoResizable: true
						},
						iconSet: "fontAwesome", 
						styleUI : 'Bootstrap',

						colNames: ["id","Menus","url","topdesc","withframe"],
						colModel: [
						{name: "id",width:1,hidden:true, key:true},
						{name: "menu", width:150, resizable: false, sortable:false},
						{name: "url",width:1,hidden:true},
						{name: "topdesc",width:1,hidden:true},
						{name: "withframe",width:1,hidden:true}
						],
						"hoverrows":false,
						"viewrecords":false,
						"height":"auto",
						"gridview":true, 
						"sortname":"id",
						"loadonce":false,
						"rowNum":100,
						autowidth: true,
						"scrollrows":true,
						// enable tree grid
						"treeGrid":true,
						// which column is expandable
						"ExpandColumn":"menu",
						// expand a node when click on the node name 
						"ExpandColClick" : true, 
						// datatype
						"treedatatype":"json",
						// the model used
						"treeGridModel":"nested",
						multiselect: false,
					}).jqGrid('navGrid','#pager'+msg.structure[1].idTable,
					{view:false,edit:false,add:false,del:false}, 
					{},//edit
					{},//add
					{}//del
					).jqGrid('navButtonAdd','#pager'+msg.structure[0].idTable,
					{caption:"", title:"Help menu", buttonicon :'ui-icon-help',
					onClickButton:function()
					{
						// <?
						// $db=new database($dbtype, $dbhost, $database, $dbuser, $dbpassword, $port, $dsn);
						// $que = "select pdffile, page from CORE_PDF where idmenu = ".$idmenu;
						// $db->query($que);
						// $brs = $db->get_row();
						// $db->disconnect();
						// ?>
						// window.open('pdfjs/web/viewer.php?pdf=<? echo $brs[pdffile]; ?>#<? echo $brs[page]; ?>');
					} 
					})
					.jqGrid('navButtonAdd','#pager'+msg.structure[0].idTable,
					{
						caption:"",title:"Export to Excel",buttonicon :'ui-icon-arrowreturnthick-1-s', 
						onClickButton:function(){  
							var filters='{"groupOp":"AND","rules":{"field":"IDROLE","op":"eq","data":"'+$("#ROLE_GROUP").jqGrid('getCell',$("#ROLE_GROUP").jqGrid('getGridParam','selrow'), 0)+'"}}';
							window.open('./addons/base/excel.php?t=CORE_ROLE_GROUP&n=<?php echo $formtitle; ?>&filters='+$("#ROLE_GROUP").jqGrid("getGridParam", "postData").filters, 'Excel Cash Flow',''); 
						}
					});
					$("#"+msg.structure[2].idattrGrid),
					initDateEdit = function(elem) {
						$(elem).datepicker({
	                        //dateFormat: 'Y-m-d',
	                        format: msg.structure[2].formatdate2, 
	                        autoSize: true,
	                        changeYear: true,
	                        changeMonth: true,
	                        showButtonPanel: true,
	                        showWeek: true 
	                    });
					},
					initDateSearch = function(elem) {
						setTimeout(function() {
							$(elem).datepicker({
	                            //dateFormat: 'Y-m-d',
	                            format: msg.structure[2].formatdate2, 
	                            autoSize: true,
	                            changeYear: true,
	                            changeMonth: true,
	                            showWeek: true,
	                            showButtonPanel: true 
	                        });
						}, 100);
					};	
					var gridimgpath = 'themes/basic/images';  
					//alert($("jqContextMenu"));
					jQuery("#"+msg.structure[0].idTable).jqGrid({
					   	//url:'./addons/base/loadstatic.php?q=2&t=<?php echo $formx[0]->srcview;?>',
					   	url: msg.structure[0].urlLoadData,
					   	datatype: "json", 
					   	mtype: "POST",
					   	cmTemplate: {
					   		editable: true,
					   		autoResizable: true
					   	},
					   	iconSet: "fontAwesome",
					   	guiStyle: "jquery",
						//styleUI : 'jQueryUI',
						styleUI : 'Bootstrap',                
						colNames: eval('['+msg.structure[0].colNames+']'),
						colModel: eval('['+msg.structure[0].colModel+']'),
						rowNum:10,
						rowList:[10,25,50],
						imgpath: gridimgpath,
						responsive:true,
						autowidth: true, 
						altRows: true, 
						pager: '#pager'+msg.structure[0].idTable,
						sortname: 'idrole',
						viewrecords: true,
						sortorder: "desc",
						caption: msg.structure[0].formtitle, 
						editurl: msg.structure[0].editurl,
					                //editurl:"./addons/base/savestaticdata.php?t=CORE_ROLE_GROUP",
					    //editurl:"savestaticdata.php?t=CORE_VW_ROLEGROUP",
					    height: "100%",
					    forceFit : true,
					    rownumbers:true,
					    multiselect: true,
					    multiboxonly:true,
					    viewsortcols: [false,'vertical',true],
					    onSelectRow: function(ids) {  		   
					    	if(ids == null) { 
					    		ids=0;  
					    		if(jQuery("#"+msg.structure[2].idTable).jqGrid('getGridParam','records') >0 ) { 
									
								} 
							}
							else { 

								var idrolex=jQuery("#"+msg.structure[0].idTable).jqGrid('getCell',jQuery("#"+msg.structure[0].idTable).jqGrid('getGridParam','selrow'), 'idrole');

								where='idmodule='+ $("#idmodule").val() +" and idrole="+idrolex;
								jQuery("#"+msg.structure[2].idTable).jqGrid('setGridParam',{
									url:msg.structure[2].urlLoadData+'&w='+where 
								}).jqGrid('setCaption',"Access Menu: " +
								jQuery("#"+msg.structure[0].idTable).jqGrid('getCell',jQuery("#"+msg.structure[0].idTable).jqGrid('getGridParam','selrow'), 'rolename'));

								jQuery("#"+msg.structure[2].idTable).jqGrid('clearGridData', true);
								$("#"+msg.structure[2].idTable).trigger('reloadGrid');

							}

						}
						}).jqGrid('navGrid','#pager'+msg.structure[0].idTable,
						{
							//view:true,edit:true,add:true,del:true,
							view: msg.structure[0].viewpermission,
							edit: msg.structure[0].editpermission,
							add: msg.structure[0].addpermission,
							del: msg.structure[0].delpermission,			
						}, 
						{
							recreateForm:true, 
							reloadAfterSubmit:true, 
							jqModal:true, 
							closeAfterEdit: true,
							closeAfterAdd: true,
							closeOnEscape:true, 
							bottominfo:"Fields marked with (*) are required", 
							onInitializeForm: function(formid) {	 
								eval(msg.structure[0].hiddenForm);
							},
							beforeSubmit : function(postdata, formid, oper){
								var datapost=JSON.stringify(postdata);
								var result;
								datapost=datapost.substr(0,datapost.length-1)+',"oper":"'+oper+'", "form":"group"}';
								result = $.ajax({
									type: "POST",
									async: false, 
									url: msg.structure[0].urlValidate, 
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
							},
							afterSubmit: function(serverResponse, xhr, postdata) {   
								// var result = JSON.parse(serverResponse.responseText);
								// alert(result.info);
								// return [true, "", ""];

								// replace session
                                var result = JSON.parse(serverResponse.responseText);
                                if (result.success == "success") {
                                    sessionStorage.setItem("token", result.token.refresh);
                                    alert(result.info);
                                } else {
                                    alert(result.info);
                                }
                                return [true, "", ""];
								// end replace session
							} 
						},//edit
						{
							recreateForm:true, 
							reloadAfterSubmit:true, 
							jqModal:true, 
							closeAfterEdit: true,
							closeAfterAdd: true,
							closeOnEscape:true, 
							bottominfo:"Fields marked with (*) are required",
							
							onInitializeForm: function(formid) {	 
								eval(msg.structure[0].hiddenForm);
							},
							beforeSubmit : function(postdata, formid, oper){
								var datapost=JSON.stringify(postdata);
								var result;
								datapost=datapost.substr(0,datapost.length-1)+',"oper":"'+oper+'", "form":"group"}';
								result = $.ajax({
									type: "POST",
									async: false, 
									url: msg.structure[0].urlValidate, 
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
							},
							afterSubmit : function(response, postdata) 
							{ 
								
								var result = JSON.parse(response.responseText);

								if($.trim(response.responseText)=='0') {
									alert(result.info);
									$("#"+msg.structure[0].idTable).trigger('reloadGrid');
									return [true, "", ""];
						  		}
								else {  
								  	alert(result.info);
									// replace session
									sessionStorage.setItem("token", result.token.refresh);
									// end replace session
								  	$("#"+msg.structure[0].idTable).trigger('reloadGrid');
								    return [true, "", ""];
								}

							}
						  /*
						  afterSubmit : function(response, postdata) 
						  { 
						  	if($.trim(response.responseText)!='0') {
								alert ("Add Data FAILED...!");  
						        $("#ROLE_GROUP").trigger('reloadGrid');
						    	return false;
							}
							else {	
								alert ("Add Data Successfully...!");  
						        $("#ROLE_GROUP").trigger('reloadGrid');
						    	return true;
							}
						}*/
						  /*onclickSubmit  : function(response, postdata) 
						  { 
						    $.ajax({
						          method: "POST",
						          dataType: "json",
						          url: "execprocappv.php?count=CORE_ROLE_GROUP",
						          data: { 
						            parParam : "ROLENAME",
						            parCount : "'" + $("#ROLENAME").val() + "'",
						            parMsg : "Add"
						          }
						        }).done(function( msg ) { 
						          //alert("Error code" + msg.err_code);
						          if (msg.err_code==1) {
						            alert( "Data FAILED: " + msg.err_msg );            
						            return false;
						          }
						          else {
						            alert( "Data Saved: " + msg.err_msg );
						            $("#<?php echo $tablename; ?>").trigger('reloadGrid');
						            return true;
						          }
						        });
						    }*/
						},//add	
						{
							recreateForm:true, 
							reloadAfterSubmit:true, 
							jqModal:true, 
							closeOnEscape:true,  
	
							beforeSubmit : function(postdata, formid, oper){
								var datapost=JSON.stringify(postdata);
								var result;
								var sr = jQuery("#"+msg.structure[0].idTable).jqGrid('getGridParam','selrow');  
								primarykey=jQuery("#"+msg.structure[0].idTable).jqGrid('getCell',jQuery("#"+msg.structure[0].idTable).jqGrid('getGridParam','selrow'), 'idrole');
								 
								datapost='{"IDROLE":"'+primarykey+'","oper":"del", "form":"'+msg.structure[0].formidx+'"}';
								//alert(datapost);
								result = $.ajax({
											type: "POST",
											async: false, 
											url: msg.structure[0].urlValidate, 
											data: JSON.parse(datapost),
											dataType: "json",
											timeout: 2000
										}).done(function( msg ) { 
											return msg; 
											}).responseJSON;
													 
								// console.log(result);

								if (result.error=="0"){

									return [true,"",""];
								}
								else {
									alert(result.message);
									return [false,result.message,""];
								} 
							},
							onclickSubmit : function(eparams) 
							{ 
							 var retarr = {}; // we can use all the grid methods here //to obtain some data 
							 var sr = jQuery("#"+msg.structure[0].idTable).jqGrid('getGridParam','selrow');  
							 primarykey=jQuery("#"+msg.structure[0].idTable).jqGrid('getCell',jQuery("#"+msg.structure[0].idTable).jqGrid('getGridParam','selrow'), 'idrole');
							 retarr = {idrole:primarykey}; 
							 // console.log(retarr);
							 // alert(message?: DOMString)
							 return retarr; 
							},
							afterSubmit: function(serverResponse, xhr, postdata) {  
								// replace session
                                var result = JSON.parse(serverResponse.responseText);
                                if(result.success == "success"){
                                    sessionStorage.setItem("token",result.token.refresh);
                                    alert(result.info); 
                                }else{
                                    alert(result.info); 
                                }
                                return [true, "", ""];
								// end replace session
                            }
						})//del
						
						.jqGrid('navButtonAdd','#pager'+msg.structure[0].idTable,{caption:"",title:"Approval",buttonicon :'ui-icon-circle-check', 
						  onClickButton:function(){  
						  	if (msg.structure[0].approvedpermission == 'true')
							{
							    if ($("#"+msg.structure[0].idTable).jqGrid('getGridParam','selarrrow') !=''){
							      Stat = '1';
							      WfID = $("#"+msg.structure[0].idTable).jqGrid ('getCell', $("#"+msg.structure[0].idTable).jqGrid('getGridParam','selrow'), 'idrole');
							      StID = $("#"+msg.structure[0].idTable).jqGrid ('getCell', $("#"+msg.structure[0].idTable).jqGrid('getGridParam','selrow'), 'APPROVED_STATUS');
							      dialogXROLE_GROUP.dialog('open');
							      //alert('Approved');
							    }
							    else {
							      alert("Please Checked Grid Before");
							    }
							}
						  } 
						})
						
						
						.jqGrid('navButtonAdd','#pager'+msg.structure[0].idTable,{caption:"",title:"Rejected",buttonicon :'ui-icon-circle-close', 
						  onClickButton:function(){  
						  	if (msg.structure[0].rejectedpermission == 'true'){
							    if ($("#"+msg.structure[0].idTable).jqGrid('getGridParam','selarrrow') !=''){
							      Stat= '2';
							      WfID= $("#"+msg.structure[0].idTable).jqGrid ('getCell', $("#"+msg.structure[0].idTable).jqGrid('getGridParam','selrow'), 'idrole');
							      StID = $("#"+msg.structure[0].idTable).jqGrid ('getCell', $("#"+msg.structure[0].idTable).jqGrid('getGridParam','selrow'), 'APPROVED_STATUS');
							      dialogXROLE_GROUP.dialog('open');
							      //alert('Reject');
							    }
							    else{
							      alert("Please Checked Grid Before");
							    }
							}
						  } 
						})
						
						$("#"+msg.structure[2].idTable),
		                initDateEdit = function(elem) {
		                    $(elem).datepicker({
		                        //dateFormat: 'Y-m-d',
								format: msg.structure[2].formatdate2, 
		                        autoSize: true,
		                        changeYear: true,
		                        changeMonth: true,
		                        showButtonPanel: true,
		                        showWeek: true 
		                    });
		                },
		                initDateSearch = function(elem) {
		                    setTimeout(function() {
		                        $(elem).datepicker({
		                            //dateFormat: 'Y-m-d',
									format: msg.structure[2].formatdate2, 
		                            autoSize: true,
		                            changeYear: true,
		                            changeMonth: true,
		                            showWeek: true,
		                            showButtonPanel: true 
		                        });
		                    }, 100);
		                };
						
						function radio(value, options, rowObject){
							var radioHtml = '<input type="radio" value=' + value + ' name="radio_'+options.pos+'_'+rowObject[0]+'" />&nbsp;'+value;
							 
							return radioHtml;
						};
						
						function checkbox(value, options, rowObject){
							var radioHtml = '<input type="checkbox" value=' + value + ' name="checkbox_'+options.pos+'_'+rowObject[0]+'" />&nbsp;'+value;
							 
							return radioHtml;
						};
						jQuery("#"+msg.structure[2].idTable).jqGrid({
							//jQuery("#<?php echo "form".$formidx[1].$idmenu; ?>").jqGrid({
							//url: './addons/base/loadformdata.php?q=2&f=<?php echo $formidx[1]; ?>&m=<?php echo $idmodule; ?>&p=<?php echo $prefixtbl; ?>',
							datatype: "json",
							mtype: "POST",
							cmTemplate: {
							    editable: true,
							    autoResizable: true
							},
							iconSet: "fontAwesome", 
							styleUI : 'Bootstrap',
							colNames: eval('['+msg.structure[2].colNames+']'),
							colModel: eval('['+msg.structure[2].colModel+']'),
							rowNum: 10,
							autoResizing: {
							    compact: true
							},
							rowList: [10, 20, 30, "10000:All"],
							imgpath: gridimgpath, 
							pager: '#pager'+msg.structure[2].idTable,
							sortname: msg.structure[2].sortname,
							sortorder: "asc",  
							editurl: msg.structure[2].editurl,
							 height: "auto",
							altRows: true,
							rownumbers: true, 
							forceFit : false,
							shrinkToFit: false, 
							toppager: true, 
							colMenu : true,
							responsive:true,
							autowidth: true,
							hidegrid: true,
							viewrecords: true, 
							loadComplete : function(rowid){
								
							    jQuery("#"+msg.structure[2].idTable)
								
									.jqGrid('setColProp', 'addpermission', {formatter: 'checkbox', editoptions: { value: "1:0" }})
									.jqGrid('setColProp', 'editpermission', {formatter: 'checkbox', editoptions: { value: "1:0" }})
									.jqGrid('setColProp', 'delpermission', {formatter: 'checkbox', editoptions: { value: "1:0" }})
									.jqGrid('setColProp', 'viewpermission', {formatter: 'checkbox', editoptions: { value: "1:0" }})
									.jqGrid('setColProp', 'authpermission', {formatter: 'checkbox', editoptions: { value: "1:0" }})
									.jqGrid('setColProp', 'reppermission', {formatter: 'checkbox', editoptions: { value: "1:0" }})
									.jqGrid('setColProp', 'approved', {formatter: 'checkbox', editoptions: { value: "1:0" }})
									.jqGrid('setColProp', 'rejected', {formatter: 'checkbox', editoptions: { value: "1:0" }})
									;	  
									 
									
							    $.each(rowid.rows, function(idx, val){
									
							        if(val.cell[125] != ''){
										// console.log(rowid);
							            $('#'+msg.structure[2].idattrGrid+' #' + val.cell[125]).css("background", "#dff0d8");
							            $('#'+msg.structure[2].idattrGrid+' #' + val.cell[125]).addClass("success");
							        }
									
									if(val.cell[113] != ''){
										// console.log(rowid);
							            $('#'+msg.structure[2].idattrGrid+' #' + val.cell[113]).css("background", "#dff0d8");
							            $('#'+msg.structure[2].idattrGrid+' #' + val.cell[113]).addClass("success");
							        }
							    });
							},
							ondblClickRow: function(rowid) {
							    $("#"+msg.structure[2].idattrGrid).jqGrid('viewGridRow', rowid, {
							        width: 600,
							        recreateForm: true,
							        reloadAfterSubmit: true,
							        jqModal: true,
							        closeOnEscape: true,
							        bottominfo: "Fields marked with (*) are required",
							        processData: "Processing ..."
							    });
							}
							}).jqGrid('navGrid', '#pager'+msg.structure[2].idattrGrid , {
							    excel:true,
								search: false,
								view: msg.structure[2].viewpermission,
							    //edit: true,
							    edit: msg.structure[2].editpermission, 
								add: msg.structure[2].addpermission,
							    del: msg.structure[2].delpermission,
								refresh: true,
								cloneToTop: true,
								help: false ,
								excel:true
							}, {
							    width: '600',
							    dataheight:'360px',
							    recreateForm: false,
							    reloadAfterSubmit: true,
							    closeAfterEdit: true,
							    jqModal: true,
							    modal: true,
							    closeOnEscape: true,
							    bottominfo: "Fields marked with (*) are required",
							    processData: "Processing ...",
							    onInitializeForm: function(formid) {	 
							        eval(msg.structure[2].hiddenForm);
							    },
							    beforeShowForm: function(formid) {
							        eval(msg.structure[2].hiddenForm);
							        //$("#tr_FRNPEMINJAM",id).hide(); 
							    },
							    afterSubmit: function(serverResponse, xhr, postdata) {
							    	var result = JSON.parse(serverResponse.responseText);
							        if ($.trim(serverResponse.responseText) == '0') {
							            alert(result.info);
							            return [true, "", ""];
							        }
							        if ($.trim(serverResponse.responseText) != '0') {
										sessionStorage.setItem("token", result.token.refresh);
							            alert(result.info);
							            return false;
							        }
							    }
							}, //edit
							{
							    width: '600',
							    dataheight:'360px',
							    recreateForm: true,
							    reloadAfterSubmit: true,
							    checkOnSubmit: true,
							    closeAfterAdd: true,
							    jqModal: true,
							    modal: true,
							    closeOnEscape: true,
							    bottominfo: "Fields marked with (*) are required",
							    onInitializeForm: function(formid) {
							        eval(msg.structure[2].hiddenForm);
							    },
							    onclickSubmit: function(params, postdata) {
							        return true;
							    },
							    afterSubmit: function(serverResponse, xhr, postdata) {
							    	var result = JSON.parse(serverResponse.responseText);

							        if ($.trim(serverResponse.responseText) == '0') {
							            alert(result.info);
							            return [true, "", ""];
							        }
							        if ($.trim(serverResponse.responseText) != '0') {
										sessionStorage.setItem("token", result.token.refresh);
							            alert(result.info);
							            return false;
							        } else {
							            return true;
							        }
							    }
							}, //add
							{
							    width: '300',
							    dataheight:'150px',
							    recreateForm: false,
							    reloadAfterSubmit: true,
							    jqModal: true,
							    closeOnEscape: true,
							    onclickSubmit: function(eparams) {
							        var retarr = {}; // we can use all the grid methods here //to obtain some data 
							        var sr = jQuery("#"+msg.structure[2].idattrGrid).jqGrid('getGridParam', 'selrow');
							        primarykey = jQuery("#"+msg.structure[2].idattrGrid).jqGrid('getCell', jQuery("#"+msg.structure[2].idattrGrid).jqGrid('getGridParam', 'selrow'), msg.structure[2].keyfield);
							        retarr = eval("{"+msg.structure[2].keyfield+" : "+primarykey+"}");
							       
							        return retarr;
							    },
								afterSubmit: function(serverResponse, xhr, postdata) {  

	                                var result = JSON.parse(serverResponse.responseText);

	                                if(result.success == "success"){
	                                    sessionStorage.setItem("token",result.token.refresh);
	                                    alert(result.info); 
	                                }else{
	                                    alert(result.info); 
	                                }
	                                return [true, "", ""];
	                            }

							} //del
							, {
							    multipleSearch: true,
							    multipleGroup: true,
							    showQuery: false
							} //Search
							, {
							    width: '600',
							    dataheight:'360px',
							    recreateForm: false,
							    reloadAfterSubmit: true,
							    jqModal: true,
							    modal: true,
							    closeOnEscape: true,
								bottominfo: "Fields marked with (*) are required",
							    processData: "Processing ..."
							}, //View, 
							{
							    width: '600',
							    dataheight:'360px',
							    recreateForm: false,
							    reloadAfterSubmit: true,
							    jqModal: true,
							    modal: true,
							    closeOnEscape: true,
							    bottominfo: "Fields marked with (*) are required",
							    processData: "Processing ...",
								helppdffile: msg.structure[2].urlhelpfile,
								helppage : msg.structure[2].helppage,
							    helptext: msg.structure[2].helptext
							} //Help,
							);
							/*
							jQuery("#ROLE_GROUP_sub")
									.jqGrid('setColProp', 'addpermission', {edittype: 'checkbox', editoptions: { value: "1:0" }})
									.jqGrid('setColProp', 'editpermission', {edittype: 'checkbox', editoptions: { value: "1:0" }})
									.jqGrid('setColProp', 'delpermission', {edittype: 'checkbox', editoptions: { value: "1:0" }})
									.jqGrid('setColProp', 'viewpermission', {edittype: 'checkbox', editoptions: { value: "1:0" }})
									.jqGrid('setColProp', 'authpermission', {edittype: 'checkbox', editoptions: { value: "1:0" }})
									.jqGrid('setColProp', 'reppermission', {edittype: 'checkbox', editoptions: { value: "1:0" }})
									.jqGrid('setColProp', 'approved', {edittype: 'checkbox', editoptions: { value: "1:0" }})
									.jqGrid('setColProp', 'rejected', {edittype: 'checkbox', editoptions: { value: "1:0" }})
									;
							*/
							//jQuery("#<?php echo "form".$formidx[1].$idmenu; ?>").jqGrid('setFrozenColumns'); 
							//jQuery("#<?php echo "form".$formidx[1].$idmenu; ?>").jqGrid('gridResize',{minWidth:350,maxWidth:jQuery('#mainContent').innerWidth(),minHeight:80, maxHeight:550});

							//jQuery('#<?php echo "form".$formidx[1].$idmenu; ?>').jqGrid('setFrozenColumns'); 
							jQuery('#'+msg.structure[2].idTable+'_toppager_center').remove();
							jQuery('#'+msg.structure[2].idTable+'_toppager_right').remove();
							jQuery('#pager'+msg.structure[2].idTable+'_left').remove();
							//'#pager<?php echo "form".$formidx[1].$idmenu; ?>'
							/*
							$('#ROLE_GROUP_sub').jqGrid("navSeparatorAdd",'#pagerROLE_GROUP_sub',{
							sepclass : 'ui-separator',sepcontent: ''
							});

							$('#ROLE_GROUP_sub').jqGrid("navButtonAdd",'#pagerROLE_GROUP_sub',{
							buttonicon: "glyphicon icon-libreoffice",
							title: "Export to CSV",
							caption: "",
							position: "last",
							onClickButton: exportToCSV2
							});
							*/
							$('#'+msg.structure[2].idTable).jqGrid("navSeparatorAdd","#pg_"+msg.structure[2].idTable+"_toppager",{
								sepclass : 'ui-separator',sepcontent: ''
							});

							// sementara nonactive
							$('#'+msg.structure[2].idTable).jqGrid("navButtonAdd","#pg_"+msg.structure[2].idTable+"_toppager",{
								buttonicon: "glyphicon icon-libreoffice",
								title: "Export to CSV",
								caption: "",
								position: "last",
								onClickButton: exportToCSV2
							});

							function exportToCSV2(){ 
	                            exportToCSVTable($('#'+msg.structure[2].idTable),
	                                    msg.structure[2].formidx0,
	                                    msg.structure[2].module,
	                                    msg.structure[2].prefixtbl,
	                                    msg.structure[2].prefixtbl + "form" + msg.structure[2].formidx0,
	                                    msg.structure[2].urlExportCsv);

	                           
	                        }
	                        
	                        $( "#idmodule" ).autocomplete({
							   change: function(event, ui) { 
								alert(event);
								alert(ui);
							   }
							});

							function changecombo(combos){
								// alert("xxxx"); 
								var idrolex=jQuery("#"+msg.structure[0].idTable).jqGrid('getCell',jQuery("#"+msg.structure[0].idTable).jqGrid('getGridParam','selrow'), 'idrole');
								/*
								alert("./addons/base/group_tree.php?idmodule="+combos.value);
								alert("./addons/base/loadsubmenu.php?q=1&t=CORE_VW_ROLEMENUS&f=*&idmodule="+combos.value+"&idrole=");
								alert(jQuery("#ROLE_GROUP").jqGrid('getCell',jQuery("#ROLE_GROUP").jqGrid('getGridParam','selrow'), 'idrole'));
								*/
								jQuery("#"+msg.structure[1].idTable).jqGrid('clearGridData', true);
								jQuery("#"+msg.structure[1].idTable).jqGrid('setGridParam',{url:msg.structure[1].urlLoadData+"?idmodule="+combos.value,page:1});
								$("#"+msg.structure[1].idTable).trigger('reloadGrid'); 
								
								
								//url:"./addons/base/loadsubmenu.php?q=2&t=<?php echo $formx[1]->srcview;?>&f=*&idmodule="+combos.value+"&idrole="+idrolex
								where='idmodule='+combos.value+" and idrole="+idrolex;
								jQuery("#"+msg.structure[2].idTable).jqGrid('setGridParam',{
									url:msg.structure[2].urlLoadData+'&w='+where 
								}).jqGrid('setCaption',"Access Menu: " +
								jQuery("#"+msg.structure[0].idTable).jqGrid('getCell',jQuery("#"+msg.structure[0].idTable).jqGrid('getGridParam','selrow'), 'ROLENAME'));
								jQuery("#"+msg.structure[2].idTable).jqGrid('clearGridData', true);
								$("#"+msg.structure[2].idTable).trigger('reloadGrid');
							};

							// function exportToCSV2(){ 
							// 	ElemetID=$("#"+msg.structure[2].idTable);
							// 	var xx = ElemetID.getGridParam('colModel').length;
							// 	var strField = '';
							// 	var strDesc = '';
							// 	for(i=1;i<=xx;i++){
							// 		try { 
							// 			if (!(ElemetID.getGridParam('colModel')[i].hidden) 
							// 				)
							// 			{
							// 				strField = strField + ElemetID.getGridParam('colModel')[i].index  + ',';
							// 				strDesc = strDesc + '"' + ElemetID.getGridParam('colNames')[i]   + '",'; 
							// 			}
										
							// 		}	
							// 		catch(e){
							// 			console.log(e);
							// 		}
							// 	}  
							// 	var filtered = '';
								
							// 	try{
							// 		if(ElemetID.getGridParam("postData").filters!=undefined){ 
							// 			filtered = ElemetID.getGridParam("postData").filters;
							// 		} 
							// 	}
							// 	catch(e){
							// 		console.log(e);
							// 	}				
							// 	// alert(strField+"\n"+strDesc);
							// 	var fv=msg.structure[2].formidx1;
							// 	var mv=msg.structure[2].module;
							// 	var pv=msg.structure[2].prefixtbl;
							// 	var param="'"+$( "#ProcessDate"+ElemetID[0].id ).val()+"'"; 
								
							// 	$("#loading").removeClass('hide'); 
							// 	$.ajax({
							// 		 url: msg.structure[2].urlExportCsv,
							// 		 type: 'post', 
							// 		 data: {
							// 			f:fv,
							// 			m:mv,
							// 			p:pv,
							// 			t:msg.structure[2].tableName,
							// 			param:$( "#ProcessDate"+ElemetID[0].id  ).val(),
							// 			filtered:filtered,
							// 			fieldname:strField,
							// 			fielddesc:strDesc
							// 		 },
							// 		 success: function(response){ 
							// 			var currentdate = new Date(); 
							// 			var datetime = "_" + currentdate.getFullYear().toString() + currentdate.getMonth().toString() + currentdate.getDate().toString() +  "_" + currentdate.getHours().toString() + currentdate.getMinutes().toString() + currentdate.getSeconds();
							// 			filename=ElemetID[0].id+datetime;
							// 			var blob=new Blob([response]);
							// 			var link=document.createElement('a');
							// 			link.href=window.URL.createObjectURL(blob);
							// 			link.download=filename+".csv";
							// 			link.click();
							// 			$("#loading").addClass('hide');
							// 		   return true; 
							// 		 }
							// 	   }); 
							// };
				});
			}else{
				alert(msg.info);
			}

		}
	})
}