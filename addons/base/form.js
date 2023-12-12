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
				$.get( "./templates/base/form.template", function( data ) {
                    var template = data.replaceAll("{{formtitle}}", msg.structure.formtitle);
                    template = template.replaceAll("{{idTable}}", msg.structure.idTable);
                    $( "#mainContent" ).html( template );


					function checklength(value, minlength) {
		                if (value.length == minlength) {
		                    return [true, "", ""];
		                } else {
		                    return [false, "Minimum Length Jam Transaksi 4", ""];
		                }
		            }

		           $("#"+msg.structure.idTable),
		                initDateEdit = function(elem) {
		                    $(elem).datepicker({
		                        //dateFormat: 'Y-m-d',
								format: msg.structure.formatdate2, 
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
									format: msg.structure.formatdate2, 
		                            autoSize: true,
		                            changeYear: true,
		                            changeMonth: true,
		                            showWeek: true,
		                            showButtonPanel: true 
		                        });
		                    }, 100);
		                };

		            var gridimgpath = 'themes/basic/images';

		            $.ajaxSetup({
                        headers : {
                            'Authorization' : "Bearer " + sessionStorage.token
                        }
                    });

		            jQuery("#"+msg.structure.idTable).jqGrid({
		                url: msg.structure.urlLoadData,
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
		                colNames: eval('['+msg.structure.colNames+']'),
		                colModel: eval('['+msg.structure.colModel+']'),
		                rowNum: 10,
		                autoResizing: {
		                    compact: true
		                },
		                rowList: [10, 20, 30, "10000:All"],
		                imgpath: gridimgpath,
		                autowidth: true,
		                pager: '#pager'+msg.structure.idTable,
		                toppager:true, 
						sortname: msg.structure.sortname,
		                sortorder: "desc", 
		                viewrecords: true,
		                editurl: msg.structure.editurl,
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
						//multiselect: true, 
		                ondblClickRow: function(rowid) {
		                    $("#"+msg.structure.idTable).jqGrid('viewGridRow', rowid, {
		                        width: 600,
		                        recreateForm: true,
		                        reloadAfterSubmit: true,
		                        jqModal: true,
		                        closeOnEscape: true,
		                        bottominfo: "Fields marked with (*) are required",
		                        processData: "Processing ...",
								beforeShowForm: function(formid) {
									eval(msg.structure.viewDetailGrid);
								}
		                    });
		                }
		            }).jqGrid('navGrid', '#pager'+msg.structure.idTable , {
		                    excel:true,
							search: true,
							view: msg.structure.viewpermission,
		                    edit:false,
		                    add: false,
		                    del: false,
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
		                        eval(msg.structure.hiddenForm);
		                    },
		                    beforeShowForm: function(formid) {
		                       eval(msg.structure.hiddenForm);
		                        //$("#tr_FRNPEMINJAM",id).hide(); 
		                    },
		                    afterSubmit: function(serverResponse, xhr, postdata) {

		                    	var result = JSON.parse(serverResponse.responseText);

		                        if ($.trim(serverResponse.responseText) == '0') {
		                            // alert('Update Data Successfully');
		                            alert(result.info);
		                            return [true, "", ""];
		                        }
		                        if ($.trim(serverResponse.responseText) != '0') {
		                            // alert(serverResponse.responseText);
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
		                        eval(msg.structure.hiddenForm);
		                    },
		                    onclickSubmit: function(params, postdata) {
		                        return true;
		                    },
		                    afterSubmit: function(serverResponse, xhr, postdata) {
		                    	var result = JSON.parse(serverResponse.responseText);

		                        if ($.trim(serverResponse.responseText) == '0') {
		                            // alert('Insert Data Successfully');
		                            alert(result.info);
		                            return [true, "", ""];
		                        }
		                        if ($.trim(serverResponse.responseText) != '0') {
		                            // alert(serverResponse.responseText);
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
		                        var sr = jQuery("#"+msg.structure.idTable).jqGrid('getGridParam', 'selrow');
		                        primarykey = jQuery("#"+msg.structure.idTable).jqGrid('getCell', jQuery("#"+msg.structure.idTable).jqGrid('getGridParam', 'selrow'), msg.structure.sortname);
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
							helppdffile: msg.structure.urlhelpfile,
							helppage : msg.structure.helppage,
		                    helptext: msg.structure.helpheadertitle
		                } //Help,
		            );
					
					
		            //jQuery("#<?php echo "form".$formid.$idmenu; ?>").jqGrid('setFrozenColumns'); 
		            //jQuery("#<?php echo "form".$formid.$idmenu; ?>").jqGrid('gridResize',{minWidth:350,maxWidth:jQuery('#mainContent').innerWidth(),minHeight:80, maxHeight:550});

					//jQuery('#<?php echo "form".$formid.$idmenu; ?>').jqGrid('setFrozenColumns'); 
					jQuery('#'+msg.structure.idTable+'_toppager_center').remove();
					jQuery('#'+msg.structure.idTable+'_toppager_right').remove();
					jQuery('#pager'+msg.structure.idTable+'_left').remove();
		  
					$('#'+msg.structure.idTable).jqGrid("navSeparatorAdd","#pg_"+msg.structure.idTable+"_toppager",{
						sepclass : 'ui-separator',sepcontent: ''
					});
			
					// sementara nonactive
					$('#'+msg.structure.idTable).jqGrid("navButtonAdd","#pg_"+msg.structure.idTable+"_toppager",{
						buttonicon: "glyphicon icon-libreoffice",
						title: "Export to CSV",
						caption: "",
						position: "last",
						onClickButton: exportToCSV2
					});
					/*
					$('#<?php echo "form".$formid.$idmenu; ?>').jqGrid('navButtonAdd',"#pg_<?php echo "form".$formid.$idmenu; ?>_toppager",{
		                    caption:"Export to Excel", 
		                    onClickButton : function () { 
		                        jQuery("#<?php echo "form".$formid.$idmenu; ?>").excelExport();
		                    } 
		                });
					*/							
												
		  
					function exportToCSV(){
						$('#'+msg.structure.idTable).tableExport(
						  {
							fileName: msg.structure.idTable,
							type:'csv', 
							csvEnclosure: '"',
							csvSeparator: ',',
							csvUseBOM: false,
							jsonScope: 'all',
							consoleLog:true
						  }
						);
					};
					
					function exportToCSV2(){
						exportToCSVTable($('#'+msg.structure.idTable),
								msg.structure.formidx0,
								msg.structure.module,
								msg.structure.prefixtbl,
								msg.structure.prefixtbl+"form"+msg.structure.formidx0,
								msg.structure.urlExportCsv);
					}
					
		            
					
		            $(window).bind('resize', function() {
		                var width = $('.table-responsive').width();
		                $('#'+msg.structure.idTable).jqGrid("setGridWidth", width);
		            }).trigger('resize');

		            $('.sidebar-toggle').on('click', function() { 
		                if ($('.main-sidebar').width() > 60) { 
		                    $('#'+msg.structure.idTable).jqGrid("setGridWidth", $(window).innerWidth() - 95);
		                } else {
		                    $('#'+msg.structure.idTable).jqGrid("setGridWidth", $(window).innerWidth() - 275);
		                }
		            });
		        });
			}else{
				alert(msg.info);
			}
		}
	})
}
