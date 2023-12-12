function getForm(urlServer){
	$("#loading").removeClass('hide');
    $.ajax({
		beforeSend: function(xhr){xhr.setRequestHeader('Authorization', "Bearer " + sessionStorage.token);},
        url : urlServer,
        dataType : "json",
        method : "GET",
        success : function(msg){
			$("#loading").addClass('hide');
        	if (msg.status == "success") {
                $.get("./templates/base/form_upload.template?v=1", function(data){

                    var template = data.replaceAll("{{form_title}}", msg.structure.form_title);
                    template = template.replaceAll("{{table_name}}", msg.structure.table_name);
                    template = template.replaceAll("{{id_table}}", msg.structure.id_table);
                    
                    // template = template.replaceAll("{{js_script}}",`
                    // 	<script src="../../js/resumable.js"></script>
                    // `);
                    // var combobox = msg.structure.get_combobox;
                    // var split_array = combobox.split('/');
                    // var row_result =  split_array.slice(0,1);
                    // var row_combo =  split_array.slice(2,4);
                    var get_combobox = msg.structure.get_combobox;
                    var rows = get_combobox.length;
                   
                	for (var i = 0; i < rows; i++) {
                		template = template.replaceAll("{{get_combobox}}", `
                			<option value="`+get_combobox[i].idform+`">`+get_combobox[i].forms+`</option>
                		`);
                	}
 					
 					$("#mainContent").html(template);

                    $.ajaxSetup({
                        headers : {
                            'Authorization' : "Bearer " + sessionStorage.token
                        }
                    });

 					var gridimgpath = 'themes/basic/images';  


					$("#"+msg.structure.id_table),
		                initDateEdit = function(elem) {
		                    $(elem).datepicker({
		                        dateFormat: 'yy-mm-dd',
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
		                            dateFormat: 'yy-mm-dd',
		                            autoSize: true,
		                            changeYear: true,
		                            changeMonth: true,
		                            showWeek: true,
		                            showButtonPanel: true
		                        });
		                    }, 100);
		                };
			 
					$("#data_"+msg.structure.table_name).change(function(){
						$("#loading").removeClass('hide'); 
						var idform =$("#data_"+msg.structure.table_name).val();
						if(idform!=''){
							$.ajax({
								url: msg.structure.url_get_metadata+'?idform='+idform,  
								success: function(result){     
									var obj = JSON.parse(result); 
									ColNames = [];
									ColModel = [];
									var i=1;
									var strModel='';
									var urlLoad='';
									urlLoad = msg.structure.url_load_data+'&t='+obj.srcview; 
									for(var x in obj.rows){
										//alert(obj.rows[x].fieldname);
										ColNames.push(obj.rows[x].fieldname);	
										strModel='';
										editable='false';
										required='false';
										if (obj.rows[x].editable=='1') { editable='true'; }
										if (obj.rows[x].isnullval=='0') {required='true';}
										//strModel = strModel +obj.rows[x].fieldname;
										strModel = strModel +'{name:"'+obj.rows[x].fieldname+'", ';
										strModel = strModel +'index:"'+obj.rows[x].fieldname+'", width:"100%", ';							
										strModel = strModel +'editable:'+editable+', edittype:"'+obj.rows[x].fieldedittype+'", editrules:{required:'+required+' }, ';
										//Nambah Auto Complete
										//autocomplete:true, dataInit: autocompleteInit, dataUrl:"./testautodata.html"},
										//Nambah Combo
										//Nambah DatePicker
										//dataInit: function (element) {
			                            //   $(element).datepicker({
										//		autoclose: true,
										//		format: 'yyyy-mm-dd',
										//		orientation : 'bottom'
												
										//additional = ',dataInit:initDateEdit';
										additional = '';
										formater='';
										formatoption='';
										if ((obj.rows[x].datatype=='NUMERIC') && (obj.rows[x].decimalpoint=='0')){
											formater = 'formatter:"integer",';
											formatoption='formatoptions:{thousandsSeparator: "", defaultValue: "0"},';
										}
										if ((obj.rows[x].datatype=='NUMERIC') && (obj.rows[x].decimalpoint>'0')){
											formater = 'formatter:"number",';
											formatoption='formatoptions:{decimalSeparator:".", thousandsSeparator: ",", decimalPlaces: "'+obj.rows[x].decimalpoint+'"},';
										}
										if (obj.rows[x].datatype=='DATE'){
											formater = 'formatter:"date",';
											formatoption='formatoptions:{srcformat: "Y-m-d H:i:s"},';
											additional = ',dataInit:initDateEdit';
										}
										if(obj.rows[x].fieldedittype=='CHECKBOX'){
											formater = 'formatter:"checkbox",';
											if(obj.rows[x].datatype=='NUMERIC') {
												additional = ',value:"1:0"';
											}
											else {
												additional = ',value:"Yes:No"';
											}
										}
										if(obj.rows[x].fieldedittype=='select'){
											//formater = 'formatter:"select",';
											obj.rows[x].maxlength=0;
											additional = ',placeholder: "'+obj.rows[x].formdescription+'"';
											additional = additional + ',dataUrl:"./addons/base/combo.api?t='+obj.rows[x].source+'"';
										}
										
										key='';
										if(obj.rows[x].keyfield==obj.rows[x].fieldname){
											key='key: true,';
										}
										strModel = strModel + key;
										strModel = strModel + 'editoptions:{maxlength:'+obj.rows[x].maxlength+',size:'+obj.rows[x].maxlength+additional+'},  ';
										strModel = strModel + formater+formatoption;
										strModel = strModel + 'formoptions:{ rowpos:"'+i+'",elmprefix:" * "}		, hidden:false}';
										/*
										if (obj.rows[x].fieldedittype=='select'){
											alert(strModel);
										}
										*/
										eval('var objX='+strModel); 
										ColModel.push(objX);
									 
										i++;
									}
									$("#Gridbox").empty();
									$("#Gridbox").append('<b><div>'+obj.formcode+'-'+obj.formdescription+'</div></b>');
									$("#Gridbox").append('<table valign="top" id="Grid'+msg.structure.id_table+'" class="scroll" cellpadding="0" cellspacing="0" width="100%"></table>');
									$("#Gridbox").append('<div id="pagerGrid'+msg.structure.id_table+'" class="scroll" style="text-align:center;"></div>'); 
									
									createGrid(ColNames, ColModel, urlLoad);
									$("#Grid"+msg.structure.id_table).jqGrid('clearGridData');
									$("#Grid"+msg.structure.id_table).trigger('reloadGrid');
									$("#refresh_Grid"+msg.structure.id_table+"_top").click();
								}
							}); 
							 
						}
						else {
							$("#Gridbox").empty(); 
						} 
						
						$("#loading").addClass('hide');
									
					});
					
					$("#Download"+msg.structure.table_name).click(function() {
						var idform =$("#data_"+msg.structure.table_name).val();
						$.ajax({
							url: msg.structure.url_download+"?idform="+idform, 
							contentType: 'application/vnd.ms-excel; charset=utf-8',
							xhrFields: {
					            responseType: 'blob'
					        },
							success: function(result){    
								
								// window.location = msg.structure.url_download+"?idform="+idform;
								var a = document.createElement('a');
					            var url = window.URL.createObjectURL(result);
					            a.href = url;
					            a.download = idform+"_template.csv";
					            document.body.append(a);
					            a.click();
					            a.remove();
					            window.URL.revokeObjectURL(url);
							}
						}); 

					});
					
					$("#Generate"+msg.structure.table_name).click(function() {
						 
					}); 

					function autocomplete(element){ 
						$(element).autocomplete({
							id: element.id,
							source: function(request, response){
								this.xhr = $.ajax({
									url: '../../addons/test/testautodata.html',
									data: request,
									dataType: "jsonp",
									success: function( data ) {
										alert( data );
									},
									error: function(model, response, options) {
										alert(response);
									}
								});
							},
							autoFocus: true
						});
					}

					function createGrid(ColNames, ColModel, urlLoad){
					
						function checklength(value, minlength) {
							if (value.length == minlength) {
								return [true, "", ""];
							} else {
								return [false, "Minimum Length Jam Transaksi 4", ""];
							}
						}

						$("#Grid"+msg.structure.id_table),
							initDateEdit = function(elem) {
								$(elem).datepicker({
									dateFormat: 'yy-mm-dd',
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
										dateFormat: 'yy-mm-dd',
										autoSize: true,
										changeYear: true,
										changeMonth: true,
										showWeek: true,
										showButtonPanel: true
									});
								}, 100);
							};

						var gridimgpath = 'themes/basic/images';
					
						jQuery("#Grid"+msg.structure.id_table).jqGrid({ 
							datatype: "json", 
							mtype: "POST",
							cmTemplate: {
								editable: true,
								autoResizable: true
							},
							colNames:ColNames,
							colModel:ColModel,
							iconSet: "fontAwesome", 
							styleUI : 'Bootstrap',  
							rowNum:10,
							rowList:[10,25,50],
							imgpath: gridimgpath,
							autowidth: true, 
							pager: '#pagerGridbox',
							sortname: 'userid',
							viewrecords: true,
							altRows: true,
							responsive:true,
							toppager: true,
							rownumbers: true, 
							colMenu : true, 
							sortorder: "asc", 
							editurl:msg.structure.edit_url,
							height: "100%",
							forceFit : true,
							multiselect: false,
							viewsortcols: [false,'vertical',true],
							async: true,
							pager: '#pagerGrid'+msg.structure.id_table, 
							loadComplete: function (data) { 
								//alert("Loading Complete");
							}	
						}).jqGrid('navGrid','#pagerGrid'+msg.structure.id_table,
						{
							excel:true,
							search: true,
							view: msg.structure.view_permission,
		                    edit: false,
		                    add: false,
		                    del: false,
							refresh: true,
							cloneToTop: true,
							help: true 
						}, 
						{width:600, dataheight:400, recreateForm:true, reloadAfterSubmit:true, closeAfterSubmit:true, jqModal:true, modal:true, closeOnEscape:true, bottominfo:"Fields marked with (*) are required"},
						//edit
						{width:600, dataheight:400, recreateForm:false, reloadAfterSubmit:false, closeAfterSubmit:true, jqModal:true, modal:true, closeOnEscape:true, bottominfo:"Fields marked with (*) are required"},
						//add
						{width:250, dataheight:50, recreateForm:false, reloadAfterSubmit:false, closeAfterSubmit:true, jqModal:true, modal:true, closeOnEscape:true,  
							onclickSubmit : function(eparams) 
							{  
								 var retarr = {}; // we can use all the grid methods here //to obtain some data 
								 var sr = jQuery("#Grid"+msg.structure.id_table).jqGrid('getGridParam','selrow');  
								 primarykey=jQuery("#Grid"+msg.structure.id_table).jqGrid('getCell',jQuery("#Grid"+msg.structure.id_table).jqGrid('getGridParam','selrow'), 'userid');
								 retarr = {userid:primarykey}; 
								 $("#Grid"+msg.structure.id_table).trigger('reloadGrid');
								 return retarr;  
							}
						}//del
						) 
						.jqGrid('navButtonAdd','#pagerGridbox',
						{caption:"", title:"Help menu", buttonicon :'ui-icon-help',
							onClickButton:function()
							{
								window.open('pdfjs/web/viewer.php?pdf=<? echo $brs[pdffile]; ?>#<? echo $brs[page]; ?>');
							} 
						});
						
						jQuery('#Grid'+msg.structure.id_table+'_toppager_center').remove();
						jQuery('#Grid'+msg.structure.id_table+'_toppager_right').remove();
						jQuery('#pagerGrid'+msg.structure.id_table+'_left').remove();
					  
						$('#Grid'+msg.structure.id_table).jqGrid("navSeparatorAdd","#pg_Grid"+msg.structure.id_table+"_toppager",{
							sepclass : 'ui-separator',sepcontent: ''
						});
						
						$('#Grid'+msg.structure.id_table).jqGrid("navButtonAdd","#pg_Grid"+msg.structure.id_table+"_toppager",{
							buttonicon: "glyphicon icon-libreoffice",
							title: "Export to CSV",
							caption: "",
							position: "last",
							onClickButton: exportToCSV
						});
								 			
					  
						function exportToCSV(){
							$('#Grid'+msg.structure.id_table).tableExport(
							  {
								fileName: "Grid"+msg.structure.id_table,
								type:'csv', 
								csvEnclosure: '"',
								csvSeparator: ',',
								csvUseBOM: true,
								jsonScope: 'all',
								consoleLog:false
							  }
							);
						};
								
						$("#Grid"+msg.structure.id_table).jqGrid('setGridParam', { url: urlLoad });
						$("#Grid"+msg.structure.id_table).trigger("reloadGrid"); 
								
						$(window).bind('resize', function() {
							var width = $('.table-responsive').width();
							$('#Grid'+msg.structure.id_table).jqGrid("setGridWidth", width);
						}).trigger('resize');

								$('.sidebar-toggle').on('click', function() { 
									//var width = $('.table-responsive').width(); 
									if ($('.main-sidebar').width() > 60) { 
										$('#Grid'+msg.structure.id_table).jqGrid("setGridWidth", $(window).innerWidth() - 115);
										//$('#Gridbox').jqGrid("setGridWidth", width - 20);
									} else {
										$('#Grid'+msg.structure.id_table).jqGrid("setGridWidth", $(window).innerWidth() - 295); 
										//$('#Gridbox').jqGrid("setGridWidth", width -20);
									}
								});
					}
					
					
					function myAutocomplete(elem, urlx) { 
						//console.log(elm);
						alert(elem.editoptions + ' ' + urlx); 
						setTimeout(function () {
							$(elem).typeahead({ 
								appendTo : "body",
								autoSelect: true,
								source: function (query, result) {
									$.ajax({
										url: urlx,
										data: "query=" + query ,            
										dataType: "json",
										type: "POST",
										success: function (data) { 
											result($.map(data, function (item) {
												return item;
											}));
										}
									});
								},
								displayText: function(item) {
									return item.label
								},
								afterSelect: function(item) {
									this.$element[0].value = item.id
								} 
							});
						}, 50);
					}			

					function autocompleteInit(elem, oper, value){
						alert(elem + ' ' + oper + ' ' + value);
					}

					var r = new Resumable({
			            // target:'./upload',
			            target :serverHost +'upload',
			            chunkSize:1*1024*1024,
			            simultaneousUploads:4,
			            testChunks: false,
			            throttleProgressCallbacks:1,
			            method: "octet",
			            headers: {'Authorization' : "Bearer "+sessionStorage.token}
			        });

			        // Resumable.js isn't supported, fall back on a different method 
					r.assignBrowse(document.getElementById('Generate'+msg.structure.table_name));

			        if(!r.support) {
			          $('.resumable-error').show();
			        } else { 
			          r.on('fileAdded', function(file){
			              // Show progress pabr
			              $('.resumable-progress, .resumable-list').show();
			              // Show pause, hide resume
			              $('.resumable-progress .progress-resume-link').hide();
			              $('.resumable-progress .progress-pause-link').show();
			              // Add the file to the list
			              $('.resumable-list').append('<li class="resumable-file-'+file.uniqueIdentifier+'">Uploading <span class="resumable-file-name"></span> <span class="resumable-file-progress"></span>');
			              $('.resumable-file-'+file.uniqueIdentifier+' .resumable-file-name').html(file.fileName);
			              // Actually start the upload
			              r.upload();
			            });
			          r.on('pause', function(){
			              // Show resume, hide pause
			              $('.resumable-progress .progress-resume-link').show();
			              $('.resumable-progress .progress-pause-link').hide();
			            });
			          r.on('complete', function(){
			              // Hide pause/resume when the upload has completed
			              $('.resumable-progress .progress-resume-link, .resumable-progress .progress-pause-link').hide();
						  //alert('complete upload '+r.resumableFilePath);
						  $('.resumable-progress').hide();
			            });
			          r.on('fileSuccess', function(file,message){
			              // Reflect that the file upload has completed
			              $('.resumable-file-'+file.uniqueIdentifier+' .resumable-file-progress').html('(completed)');
						    //alert('complete file success upload ['+file.fileName+"]" + file.relativePath);
							//var keys=[];
						    //for (var i in file ) { keys.push(i); }
							
							var idform =$("#data_"+msg.structure.table_name).val();
							$("#loading").removeClass('hide');
							$.ajax({
								url: msg.structure.url_proses_upload+"?fileName="+file.fileName+"&idform="+idform+"&formcode="+msg.structure.form_id+"&m="+msg.structure.id_module+"&p="+msg.structure.prefix_table,  
								success: function(result){      
									alert("Upload data to table Done ... !\n\n" + result);
									$("#Grid"+msg.structure.id_table).trigger('reloadGrid');
									$('.resumable-progress').hide();
									$("#loading").addClass('hide');
								}
							}); 
						    
			            });
			          r.on('fileError', function(file, message){
			              // Reflect that the file upload has resulted in error
			              $('.resumable-file-'+file.uniqueIdentifier+' .resumable-file-progress').html('(file could not be uploaded: '+message+')');
			            });
			          r.on('fileProgress', function(file){
			              // Handle progress for both the file and the overall upload
			              $('.resumable-file-'+file.uniqueIdentifier+' .resumable-file-progress').html(Math.floor(file.progress()*100) + '%');
			              $('.progress-bar').css({width:Math.floor(r.progress()*100) + '%'});
			            });
			        }
					 
					$("#Generate"+msg.structure.table_name).click(function() { 
						if(($("#data_"+msg.structure.table_name).prop('selectedIndex'))==0){
							alert('Please Select Type Data Upload...');
							$('#data_'+msg.structure.table_name).focus();
							return false;
						}
						else {
							return true;
						}
					});

                });
            }else{
                alert(msg.info);
            }
        },
        error : function(msg){
            console.log(msg);
        }
    });
}