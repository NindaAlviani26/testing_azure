
function getForm(urlServer) {
    $("#loading").removeClass('hide');
    $.ajax({
        beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', "Bearer " + sessionStorage.token); },
        url: urlServer,
        dataType: "json",
        method: "GET",
        success: function (msg) {
            $("#loading").addClass('hide');

            if (msg.status == 'success') {

                $.get("./templates/ob/formsuspectdedup.template?v=4", function (data) {
                    var template = data.replaceAll("{{formtitle}}", msg.structure[0].formtitle);
                    template = template.replaceAll("{{idTable0}}", msg.structure[0].idTable);
                    template = template.replaceAll("{{idTable1}}", msg.structure[1].idTable);
                    template = template.replaceAll("{{idTable2}}", msg.structure[2].idTable);
                    template = template.replaceAll("{{idTable3}}", msg.structure[3].idTable);
                    $("#mainContent").html(template);

                    function checklength(value, minlength) {
                        if (value.length == minlength) {
                            return [true, "", ""];
                        } else {
                            return [false, "Minimum Length Jam Transaksi 4", ""];
                        }
                    }
					
					function showDetailScoreMatching(matchGroup, colModels, parentRowID) {
						// prepare data show detail suspect
							var columnSystem = ['crn','cif','cif_orig','match_system_time','source_system','insert_date','customer_type','maker_user','maker_time','checker_user','checker_time','match_group','match_status','match_score','cr_group'];
							
							$.each(colModels, function(key, val){
								if(!columnSystem.includes(val.name)){
									$('#' + parentRowID + "_table_" + val.name).attr("data-toggle", "tooltip");
									$('#' + parentRowID + "_table_" + val.name).attr("data-placement", "left");
									$('#' + parentRowID + "_table_" + val.name).attr("title", "Please Wait . . . .");	
								}
							})
							
							$('[data-toggle="tooltip"]').tooltip();
							
							
							$.ajax({
								type: "POST",
								dataType: "JSON",
								url: msg.structure[4].urlLoadDetailScoreSuspect,
								data: {"matchGroup" : matchGroup},
								success: function (message) {
									console.log(message);

									// replace session
									if (message.status == "success") {
										
										$.each(colModels, function(key, val){
											if(!columnSystem.includes(val.name)){
												var matchscore = message.data[0][val.name] * 1;
												$('#' + parentRowID + "_table_" + val.name).attr("data-original-title", "match score : " + matchscore.toFixed(2) + "%");	
											}
										})
									} else {
										
										$.each(colModels, function(key, val){
											if(!columnSystem.includes(val.name)){
												$('#' + parentRowID + "_table_" + val.name).attr("data-original-title", "Error load data");	
											}
										})
									
									}
									// end replace session
								},
								error: function (message) {
									console.log(message);
									$.each(colModels, function(key, val){
										if(!columnSystem.includes(val.name)){
											$('#' + parentRowID + "_table_" + val.name).attr("data-original-title", message.responseText);	
										}
									})
								}

							});
					}

                    $.ajaxSetup({
                        headers: {
                            'Authorization': "Bearer " + sessionStorage.token
                        }
                    });


                    var gridimgpath = 'themes/basic/images';


                    $("#" + msg.structure[0].idTable),
                        initDateEdit = function (elem) {
                            $(elem).datepicker({
                                //dateFormat: 'Y-m-d',
                                format: 'yyyy-mm-dd',
                                autoSize: true,
                                changeYear: true,
                                changeMonth: true,
                                showButtonPanel: true,
                                showWeek: true
                            });
                        },
                        initDateSearch = function (elem) {
                            setTimeout(function () {
                                $(elem).datepicker({
                                    //dateFormat: 'Y-m-d',
                                    format: 'yyyy-mm-dd',
                                    autoSize: true,
                                    changeYear: true,
                                    changeMonth: true,
                                    showWeek: true,
                                    showButtonPanel: true
                                });
                            }, 100);
                        };



                    jQuery("#" + msg.structure[0].idTable).jqGrid({
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
                        styleUI: 'Bootstrap',
                        colNames: eval('[' + msg.structure[0].colNames + ']'),
                        colModel: eval('[' + msg.structure[0].colModel + ']'),
                        rowNum: 10,
                        autoResizing: {
                            compact: true
                        },
                        rowList: [10, 20, 30, "10000:All"],
                        imgpath: gridimgpath,
                        autowidth: true,
                        pager: '#pager' + msg.structure[0].idTable,
                        toppager: true,
                        sortname: msg.structure[0].sortname,
                        sortorder: "asc",
                        viewrecords: true,
                        editurl: msg.structure[0].editurl,
                        height: "auto",
                        altRows: true,
                        rownumbers: true,
                        forceFit: false,
                        shrinkToFit: false,
                        toppager: true,
                        rownumbers: true,
                        colMenu: true,
                        responsive: true,
                        autowidth: true,
                        hidegrid: true,
                        multiselect: true,
                        loadComplete: function () {
                            //var colw=$('#<?php echo "form".$formidx[3].$idmenu; ?>').parent().width();
                            var colw = $('.table-responsive').width();
                            $("#" + msg.structure[0].idTable).resizeColumn('sla', (colw - 100), true);

                        },
                        ondblClickRow: function (rowid) {
                            $("#" + msg.structure[0].idTable).jqGrid('viewGridRow', rowid, {
                                width: 600,
                                recreateForm: true,
                                reloadAfterSubmit: true,
                                jqModal: true,
                                closeOnEscape: true,
                                bottominfo: "Fields marked with (*) are required",
                                processData: "Processing ...",
                                beforeShowForm: function (formid) {
                                    eval(msg.structure[0].viewDetailGrid);
                                }
                            });
                        },
                        subGrid: true,
                        subGridRowExpanded: function (parentRowID, parentRowKey) {
                            var childGridID = parentRowID + "_table";
                            var childGridPagerID = parentRowID + "_pager";

                            var where1 = "&w=match_group='" + $("#" + msg.structure[0].idTable).getRowData(parentRowKey)['match_group'] + "'";
                            // var childGridURL = encodeURI('./addons/base/loadstaticwhere.php?q=2&t=<?php echo $formx[4]->tablename; ?>&w=' + where1);
                            var childGridURL = encodeURI(msg.structure[4].urlLoadData + where1);
                            console.log(childGridURL);
                            var colw = $("#" + msg.structure[0].idTable).parent().width();
                            var $grid = jQuery("#" + childGridID),
                                editingRowId,
                                myEditParam = {
                                    keys: true,
                                    url: msg.structure[4].editurl,
                                    oneditfunc: function (id) {
                                        editingRowId = id;
                                        alert("on Edit Function");
                                    },
                                    afterrestorefunc: function (id) {
                                        editingRowId = undefined;
                                        alert("afterrestore " + id);
                                    }
                                };

                            $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');
                            lastSel = -1;
                            $("#" + childGridID).jqGrid({
                                url: childGridURL,
                                mtype: "GET",
                                datatype: "json",
                                styleUI: 'Bootstrap',
                                pager: childGridPagerID,
                                colNames: eval('[' + msg.structure[4].colNames + ']'),
                                colModel: eval('[' + msg.structure[4].colModel + ']'),
                                //width:colw,
                                editurl: msg.structure[4].editurl,
                                autowidth: true,
                                height: 'auto',
                                pager: childGridPagerID,
                                cellEdit: true,
                                cellurl: msg.structure[4].cellurl,
                                onSelectRow: function (id) {
                                    var $this = $(this);
                                    if (editingRowId !== id) {
                                        if (editingRowId) {
                                            // save or restore currently editing row
                                            $this.jqGrid("saveRow", editingRowId, myEditParam);
                                            // or $this.jqGrid("restoreRow", editingRowId, myEditParam);
                                        }
                                        $this.jqGrid("editRow", editingRowId, myEditParam);
                                    }
                                },
                                afterSubmitCell: function (serverresponse, rowid, cellname, value, iRow, iCol) {
                                    //alert (serverresponse.responseText);
                                    $("#" + childGridID).trigger("reloadGrid");
                                },
                                beforeSubmitCell: function (rowid, name, value, iRow, iCol) {
                                    var keyvalue = "'" + $("#" + childGridID).getRowData(rowid)['match_group'] + "'";
                                    return {
                                        match_group: keyvalue,
                                        key: 'cif'
                                    }
                                }
                            });
                            $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
                                view: true,
                                edit: false,
                                add: false,
                                del: false,
                                search: false
                            });
							
							showDetailScoreMatching($("#" + msg.structure[0].idTable).getRowData(parentRowKey)['match_group'], eval('[' + msg.structure[4].colModel + ']'), parentRowID);
							
                        }
                    }).jqGrid('navGrid', '#pager' + msg.structure[0].idTable, {
                        excel: true,
                        search: true,
                        view: eval(msg.structure[0].viewpermission),
                        edit: false,
                        add: false,
                        del: false,
                        refresh: true,
                        cloneToTop: true,
                        help: true
                    }, {
                        width: '600',
                        dataheight: '360px',
                        recreateForm: false,
                        reloadAfterSubmit: true,
                        closeAfterEdit: true,
                        jqModal: true,
                        modal: true,
                        closeOnEscape: true,
                        bottominfo: "Fields marked with (*) are required",
                        processData: "Processing ...",
                        onInitializeForm: function (formid) {
                            eval(msg.structure[0].hiddenForm);
                        },
                        beforeShowForm: function (formid) {
                            eval(msg.structure[0].hiddenForm);
                            //$("#tr_FRNPEMINJAM",id).hide(); 
                        },
                        afterSubmit: function (serverResponse, xhr, postdata) {
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
                            dataheight: '360px',
                            recreateForm: true,
                            reloadAfterSubmit: true,
                            checkOnSubmit: true,
                            closeAfterAdd: true,
                            jqModal: true,
                            modal: true,
                            closeOnEscape: true,
                            bottominfo: "Fields marked with (*) are required",
                            onInitializeForm: function (formid) {
                                eval(msg.structure[0].hiddenForm);
                            },
                            onclickSubmit: function (params, postdata) {
                                return true;
                            },
                            afterSubmit: function (serverResponse, xhr, postdata) {
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
                            dataheight: '150px',
                            recreateForm: false,
                            reloadAfterSubmit: true,
                            jqModal: true,
                            closeOnEscape: true,
                            onclickSubmit: function (eparams) {
                                var retarr = {}; // we can use all the grid methods here //to obtain some data 
                                var sr = jQuery("#" + msg.structure[0].idTable).jqGrid('getGridParam', 'selrow');
                                primarykey = jQuery("#" + msg.structure[0].idTable).jqGrid('getCell', jQuery("#" + msg.structure[0].idTable).jqGrid('getGridParam', 'selrow'), msg.structure[0].keyfield);
                                retarr = eval("{" + msg.structure[0].keyfield + " : " + primarykey + "}");
                                return retarr;
                            },
                            afterSubmit: function (serverResponse, xhr, postdata) {

                                var result = JSON.parse(serverResponse.responseText);

                                if (result.success == "success") {
                                    sessionStorage.setItem("token", result.token.refresh);
                                    alert(result.info);
                                } else {
                                    alert(result.info);
                                }
                                return [true, "", ""];
                            }
                        } //del
                        , {
                            multipleSearch: true,
                            multipleGroup: true,
                            showQuery: false,
                            // afterShowSearch : function(){
                            //     console.log("cek searhc");
                            //     $(".ui-search-table .columns select").append(`
                            //         <option value="cif">CIF</option>
                            //         <option value="crn">CRN</option>

                            //     `);
                            // }
                        } //Search
                        , {
                            width: '600',
                            dataheight: '360px',
                            recreateForm: false,
                            reloadAfterSubmit: true,
                            jqModal: true,
                            modal: true,
                            closeOnEscape: true,
                            bottominfo: "Fields marked with (*) are required",
                            processData: "Processing ...",
                            beforeShowForm: function (formid) {
                                eval(msg.structure[0].viewDetailGrid);
                            }
                        }, //View, 
                        {
                            width: '600',
                            dataheight: '360px',
                            recreateForm: false,
                            reloadAfterSubmit: true,
                            jqModal: true,
                            modal: true,
                            closeOnEscape: true,
                            bottominfo: "Fields marked with (*) are required",
                            processData: "Processing ...",
                            helppdffile: msg.structure[0].urlhelpfile,
                            helppage: msg.structure[0].helppage,
                            helptext: msg.structure[0].helpheadertitle
                        } //Help,
                    );

                    jQuery('#' + msg.structure[0].idTable + '_toppager_center').remove();
                    jQuery('#' + msg.structure[0].idTable + '_toppager_right').remove();
                    jQuery('#pager' + msg.structure[0].idTable + '_left').remove();
                    jQuery('#pager' + msg.structure[0].idTable + '_right').remove();

                    $('.glyphicon-cloud-download').click(function () {
                        exportToxls();
                    });
                    
                    function exportToxls() {
                        exportToXLSTable(jQuery('#' + msg.structure[0].idTable),
                            msg.structure[0].formidx0,
                            msg.structure[0].module,
                            msg.structure[0].prefixtbl,
                            msg.structure[4].prefixtbl + "form" + msg.structure[4].formidx0,
                            msg.structure[4].urlExportCsv);
                    }
                    
                    // upload
                    $('.glyphicon-cloud-upload').click(function () {
                        $("#upload" + msg.structure[0].idTable);
                    });

                    var r = new Resumable({
                        // target:'./upload',
                        target: serverHost + 'upload',
                        chunkSize: 1 * 1024 * 1024,
                        simultaneousUploads: 4,
                        testChunks: false,
                        throttleProgressCallbacks: 1,
                        method: "octet",
                        headers: { 'Authorization': "Bearer " + sessionStorage.token }
                    });

                    // Resumable.js isn't supported, fall back on a different method 
                    r.assignBrowse(document.getElementById('upload'+msg.structure[0].idTable));
                    // r.assignBrowse(document.getElementsByClassName('upload' + msg.structure[1].idTable));

                    if (!r.support) {
                        $('.resumable-error').show();
                    } else {
                        r.on('fileAdded', function (file) {
                            // Show progress pabr
                            $('.resumable-progress, .resumable-list').show();
                            // Show pause, hide resume
                            $('.resumable-progress .progress-resume-link').hide();
                            $('.resumable-progress .progress-pause-link').show();
                            // Add the file to the list
                            $('.resumable-list').append('<li class="resumable-file-' + file.uniqueIdentifier + '">Uploading <span class="resumable-file-name"></span> <span class="resumable-file-progress"></span>');
                            $('.resumable-file-' + file.uniqueIdentifier + ' .resumable-file-name').html(file.fileName);
                            // Actually start the upload
                            r.upload();
                        });
                        r.on('pause', function () {
                            // Show resume, hide pause
                            $('.resumable-progress .progress-resume-link').show();
                            $('.resumable-progress .progress-pause-link').hide();
                        });
                        r.on('complete', function () {
                            // Hide pause/resume when the upload has completed
                            $('.resumable-progress .progress-resume-link, .resumable-progress .progress-pause-link').hide();
                            //alert('complete upload '+r.resumableFilePath);
                            $('.resumable-progress').hide();
                        });
                        r.on('fileSuccess', function (file, message) {
                            // Reflect that the file upload has completed
                            $('.resumable-file-' + file.uniqueIdentifier + ' .resumable-file-progress').html('(completed)');
                            $("#loading").removeClass('hide');
                            $.ajax({
                                url: msg.structure[4].urlUploadXls + "&file_name=" + file.fileName,
                                type: "POST",
                                dataType: "JSON",
                                success: function (result) {
                                    if (result.status == 'success') {
                                        alert(result.info);
                                        // console.log(result.info)
                                        $('.resumable-progress').hide();
                                        $("#" + msg.structure[0].idTable).trigger('reloadGrid');
                                        // $("#"+msg.structure[0].idTable).trigger('reloadGrid');
                                        $("#loading").addClass('hide');
                                    } else {
                                        alert(result.info);
                                        $('.resumable-progress').hide();
                                        $("#loading").addClass('hide');
                                    }

                                }, error: function (e) {
                                    console.log(e.info);
                                }
                            });
                        });
                        r.on('fileError', function (file, message) {
                            // Reflect that the file upload has resulted in error
                            $('.resumable-file-' + file.uniqueIdentifier + ' .resumable-file-progress').html('(file could not be uploaded: ' + message + ')');
                        });
                        r.on('fileProgress', function (file) {
                            // Handle progress for both the file and the overall upload
                            $('.resumable-file-' + file.uniqueIdentifier + ' .resumable-file-progress').html(Math.floor(file.progress() * 100) + '%');
                            $('.progress-bar').css({ width: Math.floor(r.progress() * 100) + '%' });

                            // loading add
                            $("#loading").removeClass('hide');
                        });
                    }
                    // end upload
                    
                    $('#' + msg.structure[0].idTable).jqGrid("navSeparatorAdd", "#pg_" + msg.structure[0].idTable + "_toppager", {
                        sepclass: 'ui-separator', sepcontent: ''
                    });

                    $('#' + msg.structure[0].idTable).jqGrid("navButtonAdd", "#pg_" + msg.structure[0].idTable + "_toppager", {
                        buttonicon: "glyphicon glyphicon-th-list",
                        title: "Take Action",
                        caption: "",
                        position: "first",
                        onClickButton: function () {

                            var s;
                            s = jQuery("#" + msg.structure[0].idTable).jqGrid('getGridParam', 'selarrrow');

                            strprop = '';
                            for (var i = 0; i < s.length; i++) {
                                colmod = jQuery("#" + msg.structure[0].idTable).jqGrid('getGridParam', "colModel");
                                data = jQuery("#" + msg.structure[0].idTable).jqGrid('getRowData', s[i]);

                                for (var x in colmod) {

                                    if (colmod[x].index == msg.structure[0].keyfield) {
                                        strprop = strprop + data[colmod[x].index] + ',';

                                    }
                                }

                            }

                            strpropX = '';
                            if (strprop == '') {
                                alert("Please Check Data Before Merge...!");
                                return false;
                            }
                            else {
                                $("#loading").removeClass('hide');
                                //return to approval

                                strpropX = 'id=' + strprop;

                                $.ajax({
                                    type: "POST",
                                    dataType: "JSON",
                                    url: msg.structure[0].urlMerge,
                                    data: strpropX,
                                    success: function (message) {

                                        // replace session
                                        if (message.status == "success") {
                                            $("#" + msg.structure[0].idTable).trigger('reloadGrid');
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
                                    error: function (message) {
                                        console.log(message);
                                    }

                                });
                            }

                        }
                    });
                    $('#'+msg.structure[0].idTable).jqGrid("navButtonAdd","#pg_"+msg.structure[0].idTable+"_toppager",{
                        buttonicon: "glyphicon glyphicon-erase",
                        title: "Release Case",
                        caption: "",
                        position: "first",
                        onClickButton:function(){ 
                    
                            var s; 
                            s = jQuery("#"+msg.structure[0].idTable).jqGrid('getGridParam','selarrrow');  
                    
                            strprop='';
                            for (var i = 0; i < s.length; i++) {
                               colmod =jQuery("#"+msg.structure[0].idTable).jqGrid('getGridParam',"colModel");
                               data = jQuery("#"+msg.structure[0].idTable).jqGrid('getRowData',s[i]); 
                    
                               for (var x in colmod){
                    
                                   if(colmod[x].index==msg.structure[0].keyfield)
                                   {   
                                       strprop=strprop + data[colmod[x].index]+',';
                    
                                   } 
                               }
                    
                           }
                    
                            strpropX = '';
                            if (strprop==''){
                                alert("Please Check Data Before Release Case...!");
                                return false;
                            }
                            else {
                                $("#loading").removeClass('hide');
                                //return to approval
                                
                                strpropX='id='+strprop;
                    
                                $.ajax({
                                    type: "POST",
                                    dataType: "JSON",
                                    url: msg.structure[0].urlNotAnomaly,
                                    data: strpropX,
                                    success: function(message){ 
                                        
                                        // replace session
                                        if (message.status == "success") {
                                            $("#"+msg.structure[0].idTable).trigger('reloadGrid');
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
                                    error : function(message){
                                        console.log(message);
                                    }
                                        
                                });  
                            }
                    
                         } 
                     });




                    // =======================================================================
                    // jqgrid pair 3
                    // =======================================================================

                    $("#" + msg.structure[1].idTable),
                        initDateEdit = function (elem) {
                            $(elem).datepicker({
                                //dateFormat: 'Y-m-d',
                                format: 'yyyy-mm-dd',
                                autoSize: true,
                                changeYear: true,
                                changeMonth: true,
                                showButtonPanel: true,
                                showWeek: true
                            });
                        },
                        initDateSearch = function (elem) {
                            setTimeout(function () {
                                $(elem).datepicker({
                                    //dateFormat: 'Y-m-d',
                                    format: 'yyyy-mm-dd',
                                    autoSize: true,
                                    changeYear: true,
                                    changeMonth: true,
                                    showWeek: true,
                                    showButtonPanel: true
                                });
                            }, 100);
                        };

                    jQuery("#" + msg.structure[1].idTable).jqGrid({
                        url: msg.structure[1].urlLoadData,
                        datatype: "json",
                        mtype: "POST",
                        cmTemplate: {
                            editable: true,
                            autoResizable: true
                        },
                        iconSet: "fontAwesome",
                        guiStyle: "jquery",
                        //styleUI : 'jQueryUI',
                        styleUI: 'Bootstrap',
                        colNames: eval('[' + msg.structure[1].colNames + ']'),
                        colModel: eval('[' + msg.structure[1].colModel + ']'),
                        rowNum: 10,
                        autoResizing: {
                            compact: true
                        },
                        rowList: [10, 20, 30, "10000:All"],
                        imgpath: gridimgpath,
                        autowidth: true,
                        pager: '#pager' + msg.structure[1].idTable,
                        toppager: true,
                        sortname: msg.structure[1].sortname,
                        sortorder: "asc",
                        viewrecords: true,
                        editurl: msg.structure[1].editurl,
                        height: "auto",
                        altRows: true,
                        rownumbers: true,
                        forceFit: false,
                        shrinkToFit: false,
                        toppager: true,
                        rownumbers: true,
                        colMenu: true,
                        responsive: true,
                        autowidth: true,
                        hidegrid: true,
                        multiselect: true,
                        loadComplete: function () {
                            //var colw=$('#<?php echo "form".$formidx[3].$idmenu; ?>').parent().width();
                            var colw = $('.table-responsive').width();
                            $("#" + msg.structure[1].idTable).resizeColumn('sla', (colw - 100), true);

                        },
                        ondblClickRow: function (rowid) {
                            $("#" + msg.structure[1].idTable).jqGrid('viewGridRow', rowid, {
                                width: 600,
                                recreateForm: true,
                                reloadAfterSubmit: true,
                                jqModal: true,
                                closeOnEscape: true,
                                bottominfo: "Fields marked with (*) are required",
                                processData: "Processing ...",
                                beforeShowForm: function (formid) {
                                    eval(msg.structure[1].viewDetailGrid);
                                }
                            });
                        },
                        subGrid: true,
                        subGridRowExpanded: function (parentRowID, parentRowKey) {
                            var childGridID = parentRowID + "_table";
                            var childGridPagerID = parentRowID + "_pager";

                            var where1 = "&w=match_group='" + $("#" + msg.structure[1].idTable).getRowData(parentRowKey)['match_group'] + "'";
                            // var childGridURL = encodeURI('./addons/base/loadstaticwhere.php?q=2&t=<?php echo $formx[4]->tablename; ?>&w=' + where1);
                            var childGridURL = encodeURI(msg.structure[4].urlLoadData + where1);
                            console.log(childGridURL);
                            var colw = $("#" + msg.structure[1].idTable).parent().width();
                            var $grid = jQuery("#" + childGridID),
                                editingRowId,
                                myEditParam = {
                                    keys: true,
                                    url: msg.structure[4].editurl,
                                    oneditfunc: function (id) {
                                        editingRowId = id;
                                        alert("on Edit Function");
                                    },
                                    afterrestorefunc: function (id) {
                                        editingRowId = undefined;
                                        alert("afterrestore " + id);
                                    }
                                };

                            $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');
                            lastSel = -1;
                            $("#" + childGridID).jqGrid({
                                url: childGridURL,
                                mtype: "GET",
                                datatype: "json",
                                styleUI: 'Bootstrap',
                                pager: childGridPagerID,
                                colNames: eval('[' + msg.structure[4].colNames + ']'),
                                colModel: eval('[' + msg.structure[4].colModel + ']'),
                                //width:colw,
                                editurl: msg.structure[4].editurl,
                                autowidth: true,
                                height: 'auto',
                                pager: childGridPagerID,
                                cellEdit: true,
                                cellurl: msg.structure[4].cellurl,
                                onSelectRow: function (id) {
                                    var $this = $(this);
                                    if (editingRowId !== id) {
                                        if (editingRowId) {
                                            // save or restore currently editing row
                                            $this.jqGrid("saveRow", editingRowId, myEditParam);
                                            // or $this.jqGrid("restoreRow", editingRowId, myEditParam);
                                        }
                                        $this.jqGrid("editRow", editingRowId, myEditParam);
                                    }
                                },
                                afterSubmitCell: function (serverresponse, rowid, cellname, value, iRow, iCol) {
                                    //alert (serverresponse.responseText);
                                    $("#" + childGridID).trigger("reloadGrid");
                                },
                                beforeSubmitCell: function (rowid, name, value, iRow, iCol) {
                                    var keyvalue = "'" + $("#" + childGridID).getRowData(rowid)['match_group'] + "'";
                                    return {
                                        match_group: keyvalue,
                                        key: 'cif'
                                    }
                                }
                            });
                            $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
                                view: true,
                                edit: false,
                                add: false,
                                del: false,
                                search: false
                            });
							
							
							showDetailScoreMatching($("#" + msg.structure[1].idTable).getRowData(parentRowKey)['match_group'], eval('[' + msg.structure[4].colModel + ']'), parentRowID);
							
                        }
                    }).jqGrid('navGrid', '#pager' + msg.structure[1].idTable, {
                        excel: true,
                        search: true,
                        view: eval(msg.structure[1].viewpermission),
                        edit: false,
                        add: false,
                        del: false,
                        refresh: true,
                        cloneToTop: true,
                        help: true
                    }, {
                        width: '600',
                        dataheight: '360px',
                        recreateForm: false,
                        reloadAfterSubmit: true,
                        closeAfterEdit: true,
                        jqModal: true,
                        modal: true,
                        closeOnEscape: true,
                        bottominfo: "Fields marked with (*) are required",
                        processData: "Processing ...",
                        onInitializeForm: function (formid) {
                            eval(msg.structure[1].hiddenForm);
                        },
                        beforeShowForm: function (formid) {
                            eval(msg.structure[1].hiddenForm);
                            //$("#tr_FRNPEMINJAM",id).hide(); 
                        },
                        afterSubmit: function (serverResponse, xhr, postdata) {
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
                            dataheight: '360px',
                            recreateForm: true,
                            reloadAfterSubmit: true,
                            checkOnSubmit: true,
                            closeAfterAdd: true,
                            jqModal: true,
                            modal: true,
                            closeOnEscape: true,
                            bottominfo: "Fields marked with (*) are required",
                            onInitializeForm: function (formid) {
                                eval(msg.structure[1].hiddenForm);
                            },
                            onclickSubmit: function (params, postdata) {
                                return true;
                            },
                            afterSubmit: function (serverResponse, xhr, postdata) {
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
                            dataheight: '150px',
                            recreateForm: false,
                            reloadAfterSubmit: true,
                            jqModal: true,
                            closeOnEscape: true,
                            onclickSubmit: function (eparams) {
                                var retarr = {}; // we can use all the grid methods here //to obtain some data 
                                var sr = jQuery("#" + msg.structure[1].idTable).jqGrid('getGridParam', 'selrow');
                                primarykey = jQuery("#" + msg.structure[1].idTable).jqGrid('getCell', jQuery("#" + msg.structure[1].idTable).jqGrid('getGridParam', 'selrow'), msg.structure[1].keyfield);
                                retarr = eval("{" + msg.structure[1].keyfield + " : " + primarykey + "}");
                                return retarr;
                            },
                            afterSubmit: function (serverResponse, xhr, postdata) {

                                var result = JSON.parse(serverResponse.responseText);

                                if (result.success == "success") {
                                    sessionStorage.setItem("token", result.token.refresh);
                                    alert(result.info);
                                } else {
                                    alert(result.info);
                                }
                                return [true, "", ""];
                            }
                        } //del
                        , {
                            multipleSearch: true,
                            multipleGroup: true,
                            showQuery: false,
                            // afterShowSearch : function(){
                            //     console.log("cek searhc");
                            //     $(".ui-search-table .columns select").append(`
                            //         <option value="cif">CIF</option>
                            //         <option value="crn">CRN</option>

                            //     `);
                            // }
                        } //Search
                        , {
                            width: '600',
                            dataheight: '360px',
                            recreateForm: false,
                            reloadAfterSubmit: true,
                            jqModal: true,
                            modal: true,
                            closeOnEscape: true,
                            bottominfo: "Fields marked with (*) are required",
                            processData: "Processing ...",
                            beforeShowForm: function (formid) {
                                eval(msg.structure[1].viewDetailGrid);
                            }
                        }, //View, 
                        {
                            width: '600',
                            dataheight: '360px',
                            recreateForm: false,
                            reloadAfterSubmit: true,
                            jqModal: true,
                            modal: true,
                            closeOnEscape: true,
                            bottominfo: "Fields marked with (*) are required",
                            processData: "Processing ...",
                            helppdffile: msg.structure[1].urlhelpfile,
                            helppage: msg.structure[1].helppage,
                            helptext: msg.structure[1].helpheadertitle
                        } //Help,
                    );

                    jQuery('#' + msg.structure[1].idTable + '_toppager_center').remove();
                    jQuery('#' + msg.structure[1].idTable + '_toppager_right').remove();
                    jQuery('#pager' + msg.structure[1].idTable + '_left').remove();
                    jQuery('#pager' + msg.structure[1].idTable + '_right').remove();

                    $('#' + msg.structure[1].idTable).jqGrid("navSeparatorAdd", "#pg_" + msg.structure[1].idTable + "_toppager", {
                        sepclass: 'ui-separator', sepcontent: ''
                    });

                    $('#' + msg.structure[1].idTable).jqGrid("navButtonAdd", "#pg_" + msg.structure[1].idTable + "_toppager", {
                        buttonicon: "glyphicon glyphicon-th-list",
                        title: "Take Action",
                        caption: "",
                        position: "first",
                        onClickButton: function () {

                            var s;
                            s = jQuery("#" + msg.structure[1].idTable).jqGrid('getGridParam', 'selarrrow');

                            strprop = '';
                            for (var i = 0; i < s.length; i++) {
                                colmod = jQuery("#" + msg.structure[1].idTable).jqGrid('getGridParam', "colModel");
                                data = jQuery("#" + msg.structure[1].idTable).jqGrid('getRowData', s[i]);

                                for (var x in colmod) {

                                    if (colmod[x].index == msg.structure[1].keyfield) {
                                        strprop = strprop + data[colmod[x].index] + ',';

                                    }
                                }

                            }

                            strpropX = '';
                            if (strprop == '') {
                                alert("Please Check Data Before Merge...!");
                                return false;
                            }
                            else {
                                $("#loading").removeClass('hide');
                                //return to approval

                                strpropX = 'id=' + strprop;

                                $.ajax({
                                    type: "POST",
                                    dataType: "JSON",
                                    url: msg.structure[1].urlMerge,
                                    data: strpropX,
                                    success: function (message) {

                                        // replace session
                                        if (message.status == "success") {
                                            $("#" + msg.structure[1].idTable).trigger('reloadGrid');
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
                                    error: function (message) {
                                        console.log(message);
                                    }

                                });
                            }

                        }
                    });

                    $('#'+msg.structure[1].idTable).jqGrid("navButtonAdd","#pg_"+msg.structure[1].idTable+"_toppager",{
                        buttonicon: "glyphicon glyphicon-erase",
                        title: "Release Case",
                        caption: "",
                        position: "first",
                        onClickButton:function(){ 
                    
                            var s; 
                            s = jQuery("#"+msg.structure[1].idTable).jqGrid('getGridParam','selarrrow');  
                    
                            strprop='';
                            for (var i = 0; i < s.length; i++) {
                               colmod =jQuery("#"+msg.structure[1].idTable).jqGrid('getGridParam',"colModel");
                               data = jQuery("#"+msg.structure[1].idTable).jqGrid('getRowData',s[i]); 
                    
                               for (var x in colmod){
                    
                                   if(colmod[x].index==msg.structure[1].keyfield)
                                   {   
                                       strprop=strprop + data[colmod[x].index]+',';
                    
                                   } 
                               }
                    
                           }
                    
                            strpropX = '';
                            if (strprop==''){
                                alert("Please Check Data Before Release Case...!");
                                return false;
                            }
                            else {
                                $("#loading").removeClass('hide');
                                //return to approval
                                
                                strpropX='id='+strprop;
                    
                                $.ajax({
                                    type: "POST",
                                    dataType: "JSON",
                                    url: msg.structure[1].urlNotAnomaly,
                                    data: strpropX,
                                    success: function(message){ 
                                        
                                        // replace session
                                        if (message.status == "success") {
                                            $("#"+msg.structure[1].idTable).trigger('reloadGrid');
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
                                    error : function(message){
                                        console.log(message);
                                    }
                                        
                                });  
                            }
                    
                         } 
                     });
                    


                    //===============================================================
                    // pair 4
                    //=============================================================
                    $("#" + msg.structure[2].idTable),
                        initDateEdit = function (elem) {
                            $(elem).datepicker({
                                //dateFormat: 'Y-m-d',
                                format: 'yyyy-mm-dd',
                                autoSize: true,
                                changeYear: true,
                                changeMonth: true,
                                showButtonPanel: true,
                                showWeek: true
                            });
                        },
                        initDateSearch = function (elem) {
                            setTimeout(function () {
                                $(elem).datepicker({
                                    //dateFormat: 'Y-m-d',
                                    format: 'yyyy-mm-dd',
                                    autoSize: true,
                                    changeYear: true,
                                    changeMonth: true,
                                    showWeek: true,
                                    showButtonPanel: true
                                });
                            }, 100);
                        };



                    jQuery("#" + msg.structure[2].idTable).jqGrid({
                        url: msg.structure[2].urlLoadData,
                        datatype: "json",
                        mtype: "POST",
                        cmTemplate: {
                            editable: true,
                            autoResizable: true
                        },
                        iconSet: "fontAwesome",
                        guiStyle: "jquery",
                        //styleUI : 'jQueryUI',
                        styleUI: 'Bootstrap',
                        colNames: eval('[' + msg.structure[2].colNames + ']'),
                        colModel: eval('[' + msg.structure[2].colModel + ']'),
                        rowNum: 10,
                        autoResizing: {
                            compact: true
                        },
                        rowList: [10, 20, 30, "10000:All"],
                        imgpath: gridimgpath,
                        autowidth: true,
                        pager: '#pager' + msg.structure[2].idTable,
                        toppager: true,
                        sortname: msg.structure[2].sortname,
                        sortorder: "asc",
                        viewrecords: true,
                        editurl: msg.structure[2].editurl,
                        height: "auto",
                        altRows: true,
                        rownumbers: true,
                        forceFit: false,
                        shrinkToFit: false,
                        toppager: true,
                        rownumbers: true,
                        colMenu: true,
                        responsive: true,
                        autowidth: true,
                        hidegrid: true,
                        multiselect: true,
                        loadComplete: function () {
                            //var colw=$('#<?php echo "form".$formidx[3].$idmenu; ?>').parent().width();
                            var colw = $('.table-responsive').width();
                            $("#" + msg.structure[2].idTable).resizeColumn('sla', (colw - 100), true);

                        },
                        ondblClickRow: function (rowid) {
                            $("#" + msg.structure[2].idTable).jqGrid('viewGridRow', rowid, {
                                width: 600,
                                recreateForm: true,
                                reloadAfterSubmit: true,
                                jqModal: true,
                                closeOnEscape: true,
                                bottominfo: "Fields marked with (*) are required",
                                processData: "Processing ...",
                                beforeShowForm: function (formid) {
                                    eval(msg.structure[2].viewDetailGrid);
                                }
                            });
                        },
                        subGrid: true,
                        subGridRowExpanded: function (parentRowID, parentRowKey) {
                            var childGridID = parentRowID + "_table";
                            var childGridPagerID = parentRowID + "_pager";

                            var where1 = "&w=match_group='" + $("#" + msg.structure[2].idTable).getRowData(parentRowKey)['match_group'] + "'";
                            // var childGridURL = encodeURI('./addons/base/loadstaticwhere.php?q=2&t=<?php echo $formx[4]->tablename; ?>&w=' + where1);
                            var childGridURL = encodeURI(msg.structure[4].urlLoadData + where1);
                            console.log(childGridURL);
                            var colw = $("#" + msg.structure[2].idTable).parent().width();
                            var $grid = jQuery("#" + childGridID),
                                editingRowId,
                                myEditParam = {
                                    keys: true,
                                    url: msg.structure[4].editurl,
                                    oneditfunc: function (id) {
                                        editingRowId = id;
                                        alert("on Edit Function");
                                    },
                                    afterrestorefunc: function (id) {
                                        editingRowId = undefined;
                                        alert("afterrestore " + id);
                                    }
                                };

                            $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');
                            lastSel = -1;
                            $("#" + childGridID).jqGrid({
                                url: childGridURL,
                                mtype: "GET",
                                datatype: "json",
                                styleUI: 'Bootstrap',
                                pager: childGridPagerID,
                                colNames: eval('[' + msg.structure[4].colNames + ']'),
                                colModel: eval('[' + msg.structure[4].colModel + ']'),
                                //width:colw,
                                editurl: msg.structure[4].editurl,
                                autowidth: true,
                                height: 'auto',
                                pager: childGridPagerID,
                                cellEdit: true,
                                cellurl: msg.structure[4].cellurl,
                                onSelectRow: function (id) {
                                    var $this = $(this);
                                    if (editingRowId !== id) {
                                        if (editingRowId) {
                                            // save or restore currently editing row
                                            $this.jqGrid("saveRow", editingRowId, myEditParam);
                                            // or $this.jqGrid("restoreRow", editingRowId, myEditParam);
                                        }
                                        $this.jqGrid("editRow", editingRowId, myEditParam);
                                    }
                                },
                                afterSubmitCell: function (serverresponse, rowid, cellname, value, iRow, iCol) {
                                    //alert (serverresponse.responseText);
                                    $("#" + childGridID).trigger("reloadGrid");
                                },
                                beforeSubmitCell: function (rowid, name, value, iRow, iCol) {
                                    var keyvalue = "'" + $("#" + childGridID).getRowData(rowid)['match_group'] + "'";
                                    return {
                                        match_group: keyvalue,
                                        key: 'cif'
                                    }
                                }
                            });
                            $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
                                view: true,
                                edit: false,
                                add: false,
                                del: false,
                                search: false
                            });
							
							showDetailScoreMatching($("#" + msg.structure[2].idTable).getRowData(parentRowKey)['match_group'], eval('[' + msg.structure[4].colModel + ']'), parentRowID);
                        }
                    }).jqGrid('navGrid', '#pager' + msg.structure[2].idTable, {
                        excel: true,
                        search: true,
                        view: eval(msg.structure[2].viewpermission),
                        edit: false,
                        add: false,
                        del: false,
                        refresh: true,
                        cloneToTop: true,
                        help: true
                    }, {
                        width: '600',
                        dataheight: '360px',
                        recreateForm: false,
                        reloadAfterSubmit: true,
                        closeAfterEdit: true,
                        jqModal: true,
                        modal: true,
                        closeOnEscape: true,
                        bottominfo: "Fields marked with (*) are required",
                        processData: "Processing ...",
                        onInitializeForm: function (formid) {
                            eval(msg.structure[2].hiddenForm);
                        },
                        beforeShowForm: function (formid) {
                            eval(msg.structure[2].hiddenForm);
                            //$("#tr_FRNPEMINJAM",id).hide(); 
                        },
                        afterSubmit: function (serverResponse, xhr, postdata) {
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
                            dataheight: '360px',
                            recreateForm: true,
                            reloadAfterSubmit: true,
                            checkOnSubmit: true,
                            closeAfterAdd: true,
                            jqModal: true,
                            modal: true,
                            closeOnEscape: true,
                            bottominfo: "Fields marked with (*) are required",
                            onInitializeForm: function (formid) {
                                eval(msg.structure[2].hiddenForm);
                            },
                            onclickSubmit: function (params, postdata) {
                                return true;
                            },
                            afterSubmit: function (serverResponse, xhr, postdata) {
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
                            dataheight: '150px',
                            recreateForm: false,
                            reloadAfterSubmit: true,
                            jqModal: true,
                            closeOnEscape: true,
                            onclickSubmit: function (eparams) {
                                var retarr = {}; // we can use all the grid methods here //to obtain some data 
                                var sr = jQuery("#" + msg.structure[2].idTable).jqGrid('getGridParam', 'selrow');
                                primarykey = jQuery("#" + msg.structure[2].idTable).jqGrid('getCell', jQuery("#" + msg.structure[2].idTable).jqGrid('getGridParam', 'selrow'), msg.structure[2].keyfield);
                                retarr = eval("{" + msg.structure[2].keyfield + " : " + primarykey + "}");
                                return retarr;
                            },
                            afterSubmit: function (serverResponse, xhr, postdata) {

                                var result = JSON.parse(serverResponse.responseText);

                                if (result.success == "success") {
                                    sessionStorage.setItem("token", result.token.refresh);
                                    alert(result.info);
                                } else {
                                    alert(result.info);
                                }
                                return [true, "", ""];
                            }
                        } //del
                        , {
                            multipleSearch: true,
                            multipleGroup: true,
                            showQuery: false,
                            // afterShowSearch : function(){
                            //     console.log("cek searhc");
                            //     $(".ui-search-table .columns select").append(`
                            //         <option value="cif">CIF</option>
                            //         <option value="crn">CRN</option>

                            //     `);
                            // }
                        } //Search
                        , {
                            width: '600',
                            dataheight: '360px',
                            recreateForm: false,
                            reloadAfterSubmit: true,
                            jqModal: true,
                            modal: true,
                            closeOnEscape: true,
                            bottominfo: "Fields marked with (*) are required",
                            processData: "Processing ...",
                            beforeShowForm: function (formid) {
                                eval(msg.structure[2].viewDetailGrid);
                            }
                        }, //View, 
                        {
                            width: '600',
                            dataheight: '360px',
                            recreateForm: false,
                            reloadAfterSubmit: true,
                            jqModal: true,
                            modal: true,
                            closeOnEscape: true,
                            bottominfo: "Fields marked with (*) are required",
                            processData: "Processing ...",
                            helppdffile: msg.structure[2].urlhelpfile,
                            helppage: msg.structure[2].helppage,
                            helptext: msg.structure[2].helpheadertitle
                        } //Help,
                    );

                    jQuery('#' + msg.structure[2].idTable + '_toppager_center').remove();
                    jQuery('#' + msg.structure[2].idTable + '_toppager_right').remove();
                    jQuery('#pager' + msg.structure[2].idTable + '_left').remove();
                    jQuery('#pager' + msg.structure[2].idTable + '_right').remove();


                    $('#' + msg.structure[2].idTable).jqGrid("navSeparatorAdd", "#pg_" + msg.structure[2].idTable + "_toppager", {
                        sepclass: 'ui-separator', sepcontent: ''
                    });

                    $('#' + msg.structure[2].idTable).jqGrid("navButtonAdd", "#pg_" + msg.structure[2].idTable + "_toppager", {
                        buttonicon: "glyphicon glyphicon-th-list",
                        title: "Merge Data",
                        caption: "",
                        position: "first",
                        onClickButton: function () {

                            var s;
                            s = jQuery("#" + msg.structure[2].idTable).jqGrid('getGridParam', 'selarrrow');

                            strprop = '';
                            for (var i = 0; i < s.length; i++) {
                                colmod = jQuery("#" + msg.structure[2].idTable).jqGrid('getGridParam', "colModel");
                                data = jQuery("#" + msg.structure[2].idTable).jqGrid('getRowData', s[i]);

                                for (var x in colmod) {

                                    if (colmod[x].index == msg.structure[2].keyfield) {
                                        strprop = strprop + data[colmod[x].index] + ',';

                                    }
                                }

                            }

                            strpropX = '';
                            if (strprop == '') {
                                alert("Please Check Data Before Merge...!");
                                return false;
                            }
                            else {
                                $("#loading").removeClass('hide');
                                //return to approval

                                strpropX = 'id=' + strprop;

                                $.ajax({
                                    type: "POST",
                                    dataType: "JSON",
                                    url: msg.structure[2].urlMerge,
                                    data: strpropX,
                                    success: function (message) {

                                        // replace session
                                        if (message.status == "success") {
                                            $("#" + msg.structure[2].idTable).trigger('reloadGrid');
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
                                    error: function (message) {
                                        console.log(message);
                                    }

                                });
                            }

                        }
                    });

                    $('#'+msg.structure[2].idTable).jqGrid("navButtonAdd","#pg_"+msg.structure[2].idTable+"_toppager",{
                        buttonicon: "glyphicon glyphicon-erase",
                        title: "Release Case",
                        caption: "",
                        position: "first",
                        onClickButton:function(){ 

                            var s; 
                            s = jQuery("#"+msg.structure[2].idTable).jqGrid('getGridParam','selarrrow');  

                            strprop='';
                            for (var i = 0; i < s.length; i++) {
                            colmod =jQuery("#"+msg.structure[2].idTable).jqGrid('getGridParam',"colModel");
                            data = jQuery("#"+msg.structure[2].idTable).jqGrid('getRowData',s[i]); 

                            for (var x in colmod){

                                if(colmod[x].index==msg.structure[2].keyfield)
                                {   
                                    strprop=strprop + data[colmod[x].index]+',';

                                } 
                            }

                        }

                            strpropX = '';
                            if (strprop==''){
                                alert("Please Check Data Before Release Case...!");
                                return false;
                            }
                            else {
                                $("#loading").removeClass('hide');
                                //return to approval
                                
                                strpropX='id='+strprop;

                                $.ajax({
                                    type: "POST",
                                    dataType: "JSON",
                                    url: msg.structure[2].urlNotAnomaly,
                                    data: strpropX,
                                    success: function(message){ 
                                        
                                        // replace session
                                        if (message.status == "success") {
                                            $("#"+msg.structure[2].idTable).trigger('reloadGrid');
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
                                    error : function(message){
                                        console.log(message);
                                    }
                                        
                                });  
                            }

                        } 
                    });




                    //===============================================================
                    // pair 5
                    //=============================================================
                    $("#" + msg.structure[3].idTable),
                        initDateEdit = function (elem) {
                            $(elem).datepicker({
                                //dateFormat: 'Y-m-d',
                                format: 'yyyy-mm-dd',
                                autoSize: true,
                                changeYear: true,
                                changeMonth: true,
                                showButtonPanel: true,
                                showWeek: true
                            });
                        },
                        initDateSearch = function (elem) {
                            setTimeout(function () {
                                $(elem).datepicker({
                                    //dateFormat: 'Y-m-d',
                                    format: 'yyyy-mm-dd',
                                    autoSize: true,
                                    changeYear: true,
                                    changeMonth: true,
                                    showWeek: true,
                                    showButtonPanel: true
                                });
                            }, 100);
                        };



                    jQuery("#" + msg.structure[3].idTable).jqGrid({
                        url: msg.structure[3].urlLoadData,
                        datatype: "json",
                        mtype: "POST",
                        cmTemplate: {
                            editable: true,
                            autoResizable: true
                        },
                        iconSet: "fontAwesome",
                        guiStyle: "jquery",
                        //styleUI : 'jQueryUI',
                        styleUI: 'Bootstrap',
                        colNames: eval('[' + msg.structure[3].colNames + ']'),
                        colModel: eval('[' + msg.structure[3].colModel + ']'),
                        rowNum: 10,
                        autoResizing: {
                            compact: true
                        },
                        rowList: [10, 20, 30, "10000:All"],
                        imgpath: gridimgpath,
                        autowidth: true,
                        pager: '#pager' + msg.structure[3].idTable,
                        toppager: true,
                        sortname: msg.structure[3].sortname,
                        sortorder: "asc",
                        viewrecords: true,
                        editurl: msg.structure[3].editurl,
                        height: "auto",
                        altRows: true,
                        rownumbers: true,
                        forceFit: false,
                        shrinkToFit: false,
                        toppager: true,
                        rownumbers: true,
                        colMenu: true,
                        responsive: true,
                        autowidth: true,
                        hidegrid: true,
                        multiselect: true,
                        loadComplete: function () {
                            //var colw=$('#<?php echo "form".$formidx[3].$idmenu; ?>').parent().width();
                            var colw = $('.table-responsive').width();
                            $("#" + msg.structure[3].idTable).resizeColumn('sla', (colw - 100), true);

                        },
                        ondblClickRow: function (rowid) {
                            $("#" + msg.structure[3].idTable).jqGrid('viewGridRow', rowid, {
                                width: 600,
                                recreateForm: true,
                                reloadAfterSubmit: true,
                                jqModal: true,
                                closeOnEscape: true,
                                bottominfo: "Fields marked with (*) are required",
                                processData: "Processing ...",
                                beforeShowForm: function (formid) {
                                    eval(msg.structure[3].viewDetailGrid);
                                }
                            });
                        },
                        subGrid: true,
                        subGridRowExpanded: function (parentRowID, parentRowKey) {
                            var childGridID = parentRowID + "_table";
                            var childGridPagerID = parentRowID + "_pager";

                            var where1 = "&w=match_group='" + $("#" + msg.structure[3].idTable).getRowData(parentRowKey)['match_group'] + "'";
                            // var childGridURL = encodeURI('./addons/base/loadstaticwhere.php?q=2&t=<?php echo $formx[4]->tablename; ?>&w=' + where1);
                            var childGridURL = encodeURI(msg.structure[4].urlLoadData + where1);
                            console.log(childGridURL);
                            var colw = $("#" + msg.structure[3].idTable).parent().width();
                            var $grid = jQuery("#" + childGridID),
                                editingRowId,
                                myEditParam = {
                                    keys: true,
                                    url: msg.structure[4].editurl,
                                    oneditfunc: function (id) {
                                        editingRowId = id;
                                        alert("on Edit Function");
                                    },
                                    afterrestorefunc: function (id) {
                                        editingRowId = undefined;
                                        alert("afterrestore " + id);
                                    }
                                };

                            $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');
                            lastSel = -1;
                            $("#" + childGridID).jqGrid({
                                url: childGridURL,
                                mtype: "GET",
                                datatype: "json",
                                styleUI: 'Bootstrap',
                                pager: childGridPagerID,
                                colNames: eval('[' + msg.structure[4].colNames + ']'),
                                colModel: eval('[' + msg.structure[4].colModel + ']'),
                                //width:colw,
                                editurl: msg.structure[4].editurl,
                                autowidth: true,
                                height: 'auto',
                                pager: childGridPagerID,
                                cellEdit: true,
                                cellurl: msg.structure[4].cellurl,
                                onSelectRow: function (id) {
                                    var $this = $(this);
                                    if (editingRowId !== id) {
                                        if (editingRowId) {
                                            // save or restore currently editing row
                                            $this.jqGrid("saveRow", editingRowId, myEditParam);
                                            // or $this.jqGrid("restoreRow", editingRowId, myEditParam);
                                        }
                                        $this.jqGrid("editRow", editingRowId, myEditParam);
                                    }
                                },
                                afterSubmitCell: function (serverresponse, rowid, cellname, value, iRow, iCol) {
                                    //alert (serverresponse.responseText);
                                    $("#" + childGridID).trigger("reloadGrid");
                                },
                                beforeSubmitCell: function (rowid, name, value, iRow, iCol) {
                                    var keyvalue = "'" + $("#" + childGridID).getRowData(rowid)['match_group'] + "'";
                                    return {
                                        match_group: keyvalue,
                                        key: 'cif'
                                    }
                                }
                            });
                            $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
                                view: true,
                                edit: false,
                                add: false,
                                del: false,
                                search: false
                            });
							
							showDetailScoreMatching($("#" + msg.structure[3].idTable).getRowData(parentRowKey)['match_group'], eval('[' + msg.structure[4].colModel + ']'), parentRowID);
                        }
                    }).jqGrid('navGrid', '#pager' + msg.structure[3].idTable, {
                        excel: true,
                        search: true,
                        view: eval(msg.structure[3].viewpermission),
                        edit: false,
                        add: false,
                        del: false,
                        refresh: true,
                        cloneToTop: true,
                        help: true
                    }, {
                        width: '600',
                        dataheight: '360px',
                        recreateForm: false,
                        reloadAfterSubmit: true,
                        closeAfterEdit: true,
                        jqModal: true,
                        modal: true,
                        closeOnEscape: true,
                        bottominfo: "Fields marked with (*) are required",
                        processData: "Processing ...",
                        onInitializeForm: function (formid) {
                            eval(msg.structure[3].hiddenForm);
                        },
                        beforeShowForm: function (formid) {
                            eval(msg.structure[3].hiddenForm);
                            //$("#tr_FRNPEMINJAM",id).hide(); 
                        },
                        afterSubmit: function (serverResponse, xhr, postdata) {
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
                            dataheight: '360px',
                            recreateForm: true,
                            reloadAfterSubmit: true,
                            checkOnSubmit: true,
                            closeAfterAdd: true,
                            jqModal: true,
                            modal: true,
                            closeOnEscape: true,
                            bottominfo: "Fields marked with (*) are required",
                            onInitializeForm: function (formid) {
                                eval(msg.structure[3].hiddenForm);
                            },
                            onclickSubmit: function (params, postdata) {
                                return true;
                            },
                            afterSubmit: function (serverResponse, xhr, postdata) {
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
                            dataheight: '150px',
                            recreateForm: false,
                            reloadAfterSubmit: true,
                            jqModal: true,
                            closeOnEscape: true,
                            onclickSubmit: function (eparams) {
                                var retarr = {}; // we can use all the grid methods here //to obtain some data 
                                var sr = jQuery("#" + msg.structure[3].idTable).jqGrid('getGridParam', 'selrow');
                                primarykey = jQuery("#" + msg.structure[3].idTable).jqGrid('getCell', jQuery("#" + msg.structure[3].idTable).jqGrid('getGridParam', 'selrow'), msg.structure[3].keyfield);
                                retarr = eval("{" + msg.structure[3].keyfield + " : " + primarykey + "}");
                                return retarr;
                            },
                            afterSubmit: function (serverResponse, xhr, postdata) {

                                var result = JSON.parse(serverResponse.responseText);

                                if (result.success == "success") {
                                    sessionStorage.setItem("token", result.token.refresh);
                                    alert(result.info);
                                } else {
                                    alert(result.info);
                                }
                                return [true, "", ""];
                            }
                        } //del
                        , {
                            multipleSearch: true,
                            multipleGroup: true,
                            showQuery: false,
                            // afterShowSearch : function(){
                            //     console.log("cek searhc");
                            //     $(".ui-search-table .columns select").append(`
                            //         <option value="cif">CIF</option>
                            //         <option value="crn">CRN</option>

                            //     `);
                            // }
                        } //Search
                        , {
                            width: '600',
                            dataheight: '360px',
                            recreateForm: false,
                            reloadAfterSubmit: true,
                            jqModal: true,
                            modal: true,
                            closeOnEscape: true,
                            bottominfo: "Fields marked with (*) are required",
                            processData: "Processing ...",
                            beforeShowForm: function (formid) {
                                eval(msg.structure[3].viewDetailGrid);
                            }
                        }, //View, 
                        {
                            width: '600',
                            dataheight: '360px',
                            recreateForm: false,
                            reloadAfterSubmit: true,
                            jqModal: true,
                            modal: true,
                            closeOnEscape: true,
                            bottominfo: "Fields marked with (*) are required",
                            processData: "Processing ...",
                            helppdffile: msg.structure[3].urlhelpfile,
                            helppage: msg.structure[3].helppage,
                            helptext: msg.structure[3].helpheadertitle
                        } //Help,
                    );

                    jQuery('#' + msg.structure[3].idTable + '_toppager_center').remove();
                    jQuery('#' + msg.structure[3].idTable + '_toppager_right').remove();
                    jQuery('#pager' + msg.structure[3].idTable + '_left').remove();
                    jQuery('#pager' + msg.structure[3].idTable + '_right').remove();


                    $('#' + msg.structure[3].idTable).jqGrid("navSeparatorAdd", "#pg_" + msg.structure[3].idTable + "_toppager", {
                        sepclass: 'ui-separator', sepcontent: ''
                    });

                    $('#' + msg.structure[3].idTable).jqGrid("navButtonAdd", "#pg_" + msg.structure[3].idTable + "_toppager", {
                        buttonicon: "glyphicon glyphicon-th-list",
                        title: "Merge Data",
                        caption: "",
                        position: "first",
                        onClickButton: function () {

                            var s;
                            s = jQuery("#" + msg.structure[3].idTable).jqGrid('getGridParam', 'selarrrow');

                            strprop = '';
                            for (var i = 0; i < s.length; i++) {
                                colmod = jQuery("#" + msg.structure[3].idTable).jqGrid('getGridParam', "colModel");
                                data = jQuery("#" + msg.structure[3].idTable).jqGrid('getRowData', s[i]);

                                for (var x in colmod) {

                                    if (colmod[x].index == msg.structure[3].keyfield) {
                                        strprop = strprop + data[colmod[x].index] + ',';

                                    }
                                }

                            }

                            strpropX = '';
                            if (strprop == '') {
                                alert("Please Check Data Before Merge...!");
                                return false;
                            }
                            else {
                                $("#loading").removeClass('hide');
                                //return to approval

                                strpropX = 'id=' + strprop;

                                $.ajax({
                                    type: "POST",
                                    dataType: "JSON",
                                    url: msg.structure[3].urlMerge,
                                    data: strpropX,
                                    success: function (message) {

                                        // replace session
                                        if (message.status == "success") {
                                            $("#" + msg.structure[3].idTable).trigger('reloadGrid');
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
                                    error: function (message) {
                                        console.log(message);
                                    }

                                });
                            }

                        }
                    });
                    
                    $('#'+msg.structure[3].idTable).jqGrid("navButtonAdd","#pg_"+msg.structure[3].idTable+"_toppager",{
                        buttonicon: "glyphicon glyphicon-erase",
                        title: "Release Case",
                        caption: "",
                        position: "first",
                        onClickButton:function(){ 

                            var s; 
                            s = jQuery("#"+msg.structure[3].idTable).jqGrid('getGridParam','selarrrow');  

                            strprop='';
                            for (var i = 0; i < s.length; i++) {
                            colmod =jQuery("#"+msg.structure[3].idTable).jqGrid('getGridParam',"colModel");
                            data = jQuery("#"+msg.structure[3].idTable).jqGrid('getRowData',s[i]); 

                            for (var x in colmod){

                                if(colmod[x].index==msg.structure[3].keyfield)
                                {   
                                    strprop=strprop + data[colmod[x].index]+',';

                                } 
                            }

                        }

                            strpropX = '';
                            if (strprop==''){
                                alert("Please Check Data Before Release Case...!");
                                return false;
                            }
                            else {
                                $("#loading").removeClass('hide');
                                //return to approval
                                
                                strpropX='id='+strprop;

                                $.ajax({
                                    type: "POST",
                                    dataType: "JSON",
                                    url: msg.structure[3].urlNotAnomaly,
                                    data: strpropX,
                                    success: function(message){ 
                                        
                                        // replace session
                                        if (message.status == "success") {
                                            $("#"+msg.structure[3].idTable).trigger('reloadGrid');
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
                                    error : function(message){
                                        console.log(message);
                                    }
                                        
                                });  
                            }

                        } 
                    });

                    $(document).on('click', function (event) {
                        if ($("[name=cr_group]").length) {
                            alert("Please commit first CR Group Editing !!");
                        }
                    });

                    $("body").delegate("table", "click", function(e) {
                        event.stopPropagation();
                    });
                    // $("[name=cr_group]").on('click', function (event) {
                    //     event.stopPropagation();
                    // });


                    $(window).bind('resize', function () {
                        var width = $('.table-responsive').width();
                        $('#' + msg.structure[0].idTable).jqGrid("setGridWidth", width);
                    }).trigger('resize');

                    $('.sidebar-toggle').on('click', function () {
                        if ($('.main-sidebar').width() > 60) {
                            $('#' + msg.structure[0].idTable).jqGrid("setGridWidth", $(window).innerWidth() - 95);
                        } else {
                            $('#' + msg.structure[0].idTable).jqGrid("setGridWidth", $(window).innerWidth() - 275);
                        }
                    });
                });

            } else {

                alert(msg.info);

            }
        },
        error: function (msg) {
            console.log(msg);
        }
    })
}
