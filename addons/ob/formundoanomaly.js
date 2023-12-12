
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

                $.get("./templates/ob/formundoanomaly.template?v=2", function (data) {
                    var template = data.replaceAll("{{formtitle}}", msg.structure[0].formtitle);
                    template = template.replaceAll("{{idTable1}}", msg.structure[0].idTable);
                    template = template.replaceAll("{{idTable2}}", msg.structure[1].idTable);
                    $("#mainContent").html(template);

                    function checklength(value, minlength) {
                        if (value.length == minlength) {
                            return [true, "", ""];
                        } else {
                            return [false, "Minimum Length Jam Transaksi 4", ""];
                        }
                    }

                    function exportToCSV2(){
                        exportToCSVTable(jQuery('#'+msg.structure[0].idTable),
                            msg.structure[0].formidx0,
                            msg.structure[0].module,
                            msg.structure[0].prefixtbl,
                            msg.structure[0].prefixtbl + "form" + msg.structure[0].formidx0,
                            msg.structure[0].urlExportCsv);        
                    }

                    $("#"+msg.structure[0].idTable),
                    initDateEdit = function(elem) {
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
                    initDateSearch = function(elem) {
                        setTimeout(function() {
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

                    var gridimgpath = 'themes/basic/images';

                    $.ajaxSetup({
                        headers : {
                            'Authorization' : "Bearer " + sessionStorage.token
                        }
                    });

                    jQuery("#"+msg.structure[0].idTable).jqGrid({
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
                        rowNum: 10,
                        autoResizing: {
                            compact: true
                        },
                        rowList: [10, 20, 30, "10000:All"],
                        imgpath: gridimgpath,
                        autowidth: true,
                        pager: '#pager'+msg.structure[0].idTable,
                        toppager:true, 
                        sortname: msg.structure[0].sortname,
                        sortorder: "asc", 
                        viewrecords: true,
                        editurl: msg.structure[0].editurl,
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
                            $("#"+ msg.structure[0].idTable).jqGrid('viewGridRow', rowid, {
                                width: 600,
                                recreateForm: true,
                                reloadAfterSubmit: true,
                                jqModal: true,
                                closeOnEscape: true,
                                bottominfo: "Fields marked with (*) are required",
                                processData: "Processing ...",
                                beforeShowForm: function(formid) {
                                    eval(msg.structure[0].viewDetailGrid);
                                }
                            });
                        },
                        onSelectRow: function(ids) {   
                            var where1= msg.structure[0].keyfield + " = '" + jQuery("#"+msg.structure[0].idTable).jqGrid('getCell', jQuery("#"+msg.structure[0].idTable).jqGrid('getGridParam', 'selrow'), msg.structure[0].keyfield)+"'";
                            url1 = encodeURI(msg.structure[1].urlLoadData + '&w='+where1);  
                            console.log(url1);
                            $("#"+msg.structure[1].idTable).jqGrid('clearGridData', true);
                            $("#"+msg.structure[1].idTable).jqGrid('setGridParam', { url: url1 });
                            $("#"+msg.structure[1].idTable).trigger("reloadGrid");  
                         }
                    }).jqGrid('navGrid', '#pager'+ msg.structure[0].idTable , {
                        excel:true,
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
                            eval(msg.structure[0].hiddenForm);
                        },
                        beforeShowForm: function(formid) {
                            eval(msg.structure[0].hiddenForm);
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
                                eval(msg.structure[0].hiddenForm);
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
                                var sr = jQuery("#"+ msg.structure[0].idTable).jqGrid('getGridParam', 'selrow');
                                primarykey = jQuery("#"+msg.structure[0].idTable ).jqGrid('getCell', jQuery("#"+msg.structure[0].idTable).jqGrid('getGridParam', 'selrow'), msg.structure[0].keyfield);
                                retarr = eval("{"+msg.structure[0].keyfield+" : "+primarykey+"}");
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
                            processData: "Processing ...",
                            beforeShowForm: function(formid) {
                                eval(msg.structure[0].viewDetailGrid);
                            }
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
                            helppdffile: msg.structure[0].urlhelpfile,
                            helppage :msg.structure[0].helppage,
                            helptext: msg.structure[0].helpheadertitle
                        } //Help,
                        );

                        jQuery('#'+msg.structure[0].idTable+'_toppager_center').remove();
                        jQuery('#'+msg.structure[0].idTable+'_toppager_right').remove();
                        jQuery('#pager'+msg.structure[0].idTable+'_left').remove();

                    $('#'+msg.structure[0].idTable).jqGrid("navSeparatorAdd","#pg_"+msg.structure[0].idTable+"_toppager",{
                        sepclass : 'ui-separator',sepcontent: ''
                    });

                    $('#'+msg.structure[0].idTable).jqGrid("navButtonAdd","#pg_"+msg.structure[0].idTable+"_toppager",{
                        buttonicon: "glyphicon icon-libreoffice",
                        title: "Export to CSV",
                        caption: "",
                        position: "last",
                        onClickButton: exportToCSV2
                    });



                    $('#'+msg.structure[0].idTable).jqGrid("navButtonAdd","#pg_"+msg.structure[0].idTable+"_toppager",{
                        buttonicon: "glyphicon glyphicon-arrow-left",
                        title: "Release Data",
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
                                    url: msg.structure[0].urlReleaseCase,
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

                     $('.glyphicon-cloud-download').click(function () {
                        exportToxls();
                    });
                    
                    function exportToxls() {
                        exportToXLSTable(jQuery('#' + msg.structure[0].idTable),
                            msg.structure[0].formidx0,
                            msg.structure[0].module,
                            msg.structure[0].prefixtbl,
                            msg.structure[1].prefixtbl + "form" + msg.structure[1].formidx0,
                            msg.structure[1].urlExportXls);
                    }

                     $('#'+msg.structure[0].idTable).jqGrid("navButtonAdd","#pg_"+msg.structure[0].idTable+"_toppager",{
                        buttonicon: "glyphicon glyphicon-erase",
                        title: "Set Not Anomaly Data",
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
                                alert("Please Check Data Before Set Not Anomaly...!");
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

                    console.log(msg.structure[0].idTable);
                    // Resumable.js isn't supported, fall back on a different method 
                    r.assignBrowse(document.getElementById('upload'+msg.structure[0].idTable));

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
                                url: msg.structure[1].urlUploadXls + "&file_name=" + file.fileName,
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
                    // datagrid for view 2

                    function exportToCSV3(){
                        exportToCSVTable(jQuery('#'+msg.structure[1].idTable),
                            msg.structure[1].formidx0,
                            msg.structure[1].module,
                            msg.structure[1].prefixtbl,
                            msg.structure[1].prefixtbl + "form" + msg.structure[1].formidx0,
                            msg.structure[1].urlExportCsv);        
                    }
                    
                    $("#"+msg.structure[1].idTable),
                    initDateEdit = function(elem) {
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
                    initDateSearch = function(elem) {
                        setTimeout(function() {
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
                    
                    var gridimgpath = 'themes/basic/images';
                    
                    $.ajaxSetup({
                        headers : {
                            'Authorization' : "Bearer " + sessionStorage.token
                        }
                    });
                    
                    jQuery("#"+msg.structure[1].idTable).jqGrid({
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
                        styleUI : 'Bootstrap',
                        colNames: eval('['+msg.structure[1].colNames+']'),
                        colModel: eval('['+msg.structure[1].colModel+']'),
                        rowNum: 10,
                        autoResizing: {
                            compact: true
                        },
                        rowList: [10, 20, 30, "10000:All"],
                        imgpath: gridimgpath,
                        autowidth: true,
                        pager: '#pager'+msg.structure[1].idTable,
                        toppager:true, 
                        sortname: msg.structure[1].sortname,
                        sortorder: "asc", 
                        viewrecords: true,
                        editurl: msg.structure[1].editurl,
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
                            $("#"+ msg.structure[1].idTable).jqGrid('viewGridRow', rowid, {
                                width: 600,
                                recreateForm: true,
                                reloadAfterSubmit: true,
                                jqModal: true,
                                closeOnEscape: true,
                                bottominfo: "Fields marked with (*) are required",
                                processData: "Processing ...",
                                beforeShowForm: function(formid) {
                                    eval(msg.structure[1].viewDetailGrid);
                                }
                            });
                        }
                    }).jqGrid('navGrid', '#pager'+ msg.structure[1].idTable , {
                        excel:true,
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
                            eval(msg.structure[1].hiddenForm);
                        },
                        beforeShowForm: function(formid) {
                            eval(msg.structure[1].hiddenForm);
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
                                eval(msg.structure[1].hiddenForm);
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
                                var sr = jQuery("#"+ msg.structure[1].idTable).jqGrid('getGridParam', 'selrow');
                                primarykey = jQuery("#"+msg.structure[1].idTable ).jqGrid('getCell', jQuery("#"+msg.structure[1].idTable).jqGrid('getGridParam', 'selrow'), msg.structure[1].keyfield);
                                retarr = eval("{"+msg.structure[1].keyfield+" : "+primarykey+"}");
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
                            processData: "Processing ...",
                            beforeShowForm: function(formid) {
                                eval(msg.structure[1].viewDetailGrid);
                            }
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
                            helppdffile: msg.structure[1].urlhelpfile,
                            helppage :msg.structure[1].helppage,
                            helptext: msg.structure[1].helpheadertitle
                        } //Help,
                        );
                    
                        jQuery('#'+msg.structure[1].idTable+'_toppager_center').remove();
                        jQuery('#'+msg.structure[1].idTable+'_toppager_right').remove();
                        jQuery('#pager'+msg.structure[1].idTable+'_left').remove();
                    
                    $('#'+msg.structure[1].idTable).jqGrid("navButtonAdd","#pg_"+msg.structure[1].idTable+"_toppager",{
                        buttonicon: "glyphicon glyphicon-share-alt",
                        title: "Undo Data",
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
                                alert("Please Check Data Before Undo...!");
                                return false;
                            }
                            else {
                                $("#loading").removeClass('hide');
                                //return to approval
                                
                                strpropX='id='+strprop;
                                console.log(strpropX);
                                $.ajax({
                                    type: "POST",
                                    dataType: "JSON",
                                    url: msg.structure[1].urlUndo,
                                    data: strpropX,
                                    success: function(message){ 
                                        
                                        // replace session
                                        if (message.status == "success") {
                                            $("#"+msg.structure[1].idTable).trigger('reloadGrid');
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
                    
                    $('#'+msg.structure[1].idTable).jqGrid("navSeparatorAdd","#pg_"+msg.structure[1].idTable+"_toppager",{
                        sepclass : 'ui-separator',sepcontent: ''
                    });
                    
                    $('#'+msg.structure[1].idTable).jqGrid("navButtonAdd","#pg_"+msg.structure[1].idTable+"_toppager",{
                        buttonicon: "glyphicon icon-libreoffice",
                        title: "Export to CSV",
                        caption: "",
                        position: "last",
                        onClickButton: exportToCSV3
                    });                   

                $(window).bind('resize', function() {
                    var width = $('.table-responsive').width();
                    $('#'+msg.structure[0].idTable).jqGrid("setGridWidth", width);
                }).trigger('resize');

                $('.sidebar-toggle').on('click', function() { 
                    if ($('.main-sidebar').width() > 60) { 
                        $('#'+msg.structure[0].idTable).jqGrid("setGridWidth", $(window).innerWidth() - 95);
                    } else {
                        $('#'+msg.structure[0].idTable).jqGrid("setGridWidth", $(window).innerWidth() - 275);
                    }
                });
            });

            }else {

                alert(msg.info);

            }
        },
        error : function(msg){
            console.log(msg);
        }
    })
}
