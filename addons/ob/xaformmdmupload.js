function getForm(urlServer){
    $.ajax({
        beforeSend: function(xhr){
            xhr.setRequestHeader('Authorization', "Bearer "+sessionStorage.token);
        },
        url : urlServer,
        dataType : "json",
        method : "GET",
        success : function(msg){
        	if(msg.status == "success"){
                $.get("./templates/ob/xaformmdmupload.template", function(data){
                    var template = data.replaceAll("{{form_title}}", msg.structure.form_title);
                    template = template.replaceAll("{{table_name}}", msg.structure.table_name);
                    $("#mainContent").html(template);

                    $.ajaxSetup({
                        headers : {
                            'Authorization' : "Bearer " +sessionStorage.token
                        }
                    });

                    function checklength(value, minlength) {
		                if (value.length == minlength) {
		                    return [true, "", ""];
		                } else {
		                    return [false, "Minimum Length Jam Transaksi 4", ""];
		                }
		            }

		            $("#"+msg.structure.table_name),
		                initDateEdit = function(elem) {
		                    $(elem).datepicker({
		                        //dateFormat: 'yy-mm-dd',
		                        format: msg.structure.format_date2, 
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
		                            //dateFormat: 'yy-mm-dd',
		                            format: msg.structure.format_date2, 
									autoSize: true,
		                            changeYear: true,
		                            changeMonth: true,
		                            showWeek: true,
		                            showButtonPanel: true
		                        });
		                    }, 100);
		                };

		            var gridimgpath = 'themes/basic/images';

		            jQuery("#"+msg.structure.table_name).jqGrid({
		                url: msg.structure.url_load_data, 
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
		                colNames: eval('['+msg.structure.col_names+']'),
                        colModel: eval('['+msg.structure.col_model+']'),
		                rowNum: 10,
		                autoResizing: {
		                    compact: true
		                },
		                rowList: [10, 20, 30, "10000:All"],
		                imgpath: gridimgpath,
		                autowidth: true,
		                pager: '#pager'+msg.structure.table_name,
		                toppager:true, 
						sortname: msg.structure.sortname,
		                sortorder: "asc", 
		                viewrecords: true,
		                //editurl: "./addons/base/saveformdata.php?f=<?php echo $formid; ?>&m=<?php echo $idmodule; ?>&p=<?php echo $prefixtbl; ?>",
		                editurl:msg.structure.edit_url,
						height: "auto",
		                altRows: true,
						rownumbers: true, 
						forceFit : false,
						shrinkToFit: false, 
		                toppager: true,
		                rownumbers: true, 
						colMenu : true,
						responsive:true,
		                autowidth: true,
		                hidegrid: true,
						multiselect: true, 
		                ondblClickRow: function(rowid) {
		                    $("#"+msg.structure.table_name).jqGrid('viewGridRow', rowid, {
		                        width: 600,
		                        recreateForm: true,
		                        reloadAfterSubmit: true,
		                        jqModal: true,
		                        closeOnEscape: true,
		                        bottominfo: "Fields marked with (*) are required",
		                        processData: "Processing ..."
		                    });
		                }
		            }).jqGrid('navGrid', '#pager'+msg.structure.table_name , {
		                    excel:true,
							search: true,
							view: msg.structure.view_permission,
		                    edit: msg.structure.edit_permission,
		                    add: msg.structure.add_permission,
		                    del: msg.structure.del_permission,
							refresh: true,
							cloneToTop: true,
							help: true 
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
		                        eval(msg.structure.hidden_form);
		                    },
		                    beforeShowForm: function(formid) {
		                        eval(msg.structure.hidden_form);
		                        //$("#tr_FRNPEMINJAM",id).hide(); 
		                    },
		                    afterSubmit: function(serverResponse, xhr, postdata) {
		                        if ($.trim(serverResponse.responseText) == '0') {
		                            alert('Update Data Successfully');
		                            return [true, "", ""];
		                        }
		                        if ($.trim(serverResponse.responseText) != '0') {
		                            alert('#' + serverResponse.responseText);
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
							closeAfterEdit: true,
		                    jqModal: true,
		                    modal: true,
		                    closeOnEscape: true,
		                    bottominfo: "Fields marked with (*) are required",
		                    onInitializeForm: function(formid) {
		                        eval(msg.structure.hidden_form);
		                    },
		                    onclickSubmit: function(params, postdata) {
		                        return true;
		                    },
		                    afterSubmit: function(serverResponse, xhr, postdata) {
		                        if ($.trim(serverResponse.responseText) == '0') {
		                            alert('Insert Data Successfully');
		                            return [true, "", ""];
		                        }
		                        if ($.trim(serverResponse.responseText) != '0') {
		                            alert('#' + serverResponse.responseText);
		                            return false; 
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
		                        var sr = jQuery("#"+msg.structure.table_name).jqGrid('getGridParam', 'selrow');
		                        primarykey = jQuery("#"+msg.structure.table_name).jqGrid('getCell', jQuery("#"+msg.structure.table_name).jqGrid('getGridParam', 'selrow'), msg.structure.sortname);
		                        retarr = eval('{'+msg.structure.sortname+' : '+primarykey+'}');
		                        return retarr;
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
							//helppdffile: './addons/doc/<?php echo $helpfile;?>',
							//helppage : <?php echo $helppage;?>,
		                    //helptext: "<?php echo $headertitle; ?>"
		                } //Help,
		            );
					
					
		            //jQuery("#<?php echo $tablename; ?>").jqGrid('setFrozenColumns'); 
		            //jQuery("#<?php echo $tablename; ?>").jqGrid('gridResize',{minWidth:350,maxWidth:jQuery('#mainContent').innerWidth(),minHeight:80, maxHeight:550});

					//jQuery('#<?php echo $tablename; ?>').jqGrid('setFrozenColumns'); 
					jQuery('#'+msg.structure.table_name+'_toppager_center').remove();
					jQuery('#'+msg.structure.table_name+'_toppager_right').remove();
					jQuery('#pager'+msg.structure.table_name+'_left').remove();
					
					$('#'+msg.structure.table_name).jqGrid("navButtonAdd","#pg_"+msg.structure.table_name+"_toppager",{
					    buttonicon: "glyphicon glyphicon-remove",
						title: "Reject Data",
						caption: "",
						position: "first", 
						onClickButton:function(){ 
						
							var s; 
							s = jQuery("#"+msg.structure.table_name).jqGrid('getGridParam','selarrrow');   
							strprop='';
							for (var i = 0; i < s.length; i++) {
							 	colmod =jQuery("#"+msg.structure.table_name).jqGrid('getGridParam',"colModel");
							 	data = jQuery("#"+msg.structure.table_name).jqGrid('getRowData',s[i]); 
								for (var x in colmod){
								 
								 	if(colmod[x].index==msg.structure.sortname)
								 	{
									 	strprop=strprop + data[colmod[x].index]+',';
									 
								 	} 
							 	}
							  
							}

							//alert(strprop);
							strpropX = '';
							if (strprop==''){
								alert("Please Check Data Before Approved...!");
								return false;
							}
							else {
								//return to rejected
								strpropX='id='+strprop;
							 
								$.ajax({
									type: "POST",
									url: msg.structure.url_rejected,
									data: strpropX,
									success: function(message){ 
										alert(message.info);
										// alert("Rejected Data Successfully... !");
										$("#"+msg.structure.table_name).clearGridData(true).trigger("reloadGrid");
										//if ($.trim(msg)!='0'){
										$("#"+msg.structure.id_table).trigger('reloadGrid'); 
											  //}
									}
								});	 
							}
							//alert(strpropX);
								  
						} 
					});
					
					$('#'+msg.structure.table_name).jqGrid("navButtonAdd","#pg_"+msg.structure.table_name+"_toppager",{
				    buttonicon: "glyphicon glyphicon-ok",
					title: "Auth Data",
					caption: "",
					position: "first", 
					onClickButton:function(){ 
					
						var s; 
						s = jQuery("#"+msg.structure.table_name).jqGrid('getGridParam','selarrrow');   
						strprop='';
						for (var i = 0; i < s.length; i++) {
						 	colmod =jQuery("#"+msg.structure.table_name).jqGrid('getGridParam',"colModel");
						 	data = jQuery("#"+msg.structure.table_name).jqGrid('getRowData',s[i]); 
							for (var x in colmod){
							 
							 	if(colmod[x].index==msg.structure.sortname)
							 	{
									strprop=strprop + data[colmod[x].index]+',';
								 
								} 
						 	}
						  
						}

						//alert(strprop);
						strpropX = '';
						if (strprop==''){
							alert("Please Check Data Before Approved...!");
							return false;
						}
						else {
							//return to approval
							strpropX='id='+strprop;
						 
							$.ajax({
								type: "POST",
								url: msg.structure.url_approval,
								data: strpropX,
								success: function(message){ 
									alert(message.info);
									// alert("Approved Data Successfully... !");
									//$("#<?php echo $tablename; ?>").trigger('reloadGrid');
									//if ($.trim(msg)!='0'){
									$("#"+msg.structure.table_name).clearGridData(true).trigger("reloadGrid");
									$("#"+msg.structure.table_name).trigger('reloadGrid'); 
										  //}
								}
							});
								
						}
						//alert(strpropX);
							  
						} 
					});
		  
					$('#'+msg.structure.table_name).jqGrid("navSeparatorAdd","#pg_"+msg.structure.table_name+"_toppager",{
						sepclass : 'ui-separator',sepcontent: ''
					});
			
					$('#'+msg.structure.table_name).jqGrid("navButtonAdd","#pg_"+msg.structure.table_name+"_toppager",{
						buttonicon: "glyphicon icon-libreoffice",
						title: "Export to CSV",
						caption: "",
						position: "last",
						onClickButton: exportToCSV
					});
					/*
					$('#<?php echo $tablename; ?>').jqGrid('navButtonAdd',"#pg_<?php echo $tablename; ?>_toppager",{
		                    caption:"Export to Excel", 
		                    onClickButton : function () { 
		                        jQuery("#<?php echo $tablename; ?>").excelExport();
		                    } 
		                });
					*/							
												
		  
					function exportToCSV2(){
						$('#'+msg.structure.table_name).tableExport(
						  {
							fileName: msg.structure.table_name,
							type:'csv', 
							csvEnclosure: '"',
							csvSeparator: ',',
							csvUseBOM: false,
							jsonScope: 'all',
							consoleLog:true
						  }
						);
					};
					
		            $(window).bind('resize', function() {
		                var width = $('.table-responsive').width();
		                $('#'+msg.structure.table_name).jqGrid("setGridWidth", width);
		            }).trigger('resize');

		            $('.sidebar-toggle').on('click', function() { 
		                if ($('.main-sidebar').width() > 60) { 
		                    $('#'+msg.structure.table_name).jqGrid("setGridWidth", $(window).innerWidth() - 95);
		                } else {
		                    $('#'+msg.structure.table_name).jqGrid("setGridWidth", $(window).innerWidth() - 275);
		                }
		            });
                });
            }
            else{
                alert(msg.info);
            }
        },
        error : function(msg){
            console.log(msg);
        }
    });
}