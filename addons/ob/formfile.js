
function getForm(urlServer) {
    
    let idIndex=0;
    let remove=0;
    $("#loading").removeClass('hide');
    $.ajax({
        beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', "Bearer " + sessionStorage.token); },
        url: urlServer,
        dataType: "json",
        method: "GET",
        success: function (msg) {
            $("#loading").addClass('hide');
            if (msg.status == 'success') {

                $.get("./templates/ob/formbr.template?v=2", function (data) {
                    var template = data.replaceAll("{{formtitle}}", msg.structure.formtitle);
                    template = template.replaceAll("{{idTable}}", msg.structure.idTable);
                    $("#mainContent").html(template);

                    //data jqgrid js
                    function checklength(value, minlength) {
                        if (value.length == minlength) {
                            return [true, "", ""];
                        } else {
                            return [false, "Minimum Length Jam Transaksi 4", ""];
                        }
                    }

                    $("#" + msg.structure.idTable),
                        initDateEdit = function (elem) {
                            $(elem).datepicker({
                                format: 'yyyy-mm-dd',
                                // format: '<?php echo $format_date2;?>', 
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
                                    format: 'yyyy-mm-dd',
                                    // format: '<?php echo $format_date2;?>', 
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
                        headers: {
                            'Authorization': "Bearer " + sessionStorage.token
                        }
                    });

                    jQuery("#" + msg.structure.idTable).jqGrid({
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
                        styleUI: 'Bootstrap',
                        colNames: eval('[' + msg.structure.colNames + ']'),
                        colModel: eval('[' + msg.structure.colModel + ']'),
                        rowNum: 10,
                        autoResizing: {
                            compact: true
                        },
                        rowList: [10, 20, 30, "10000:All"],
                        imgpath: gridimgpath,
                        autowidth: true,
                        pager: '#pager' + msg.structure.idTable,
                        toppager: true,
                        sortname: msg.structure.sortname,
                        sortorder: "asc",
                        viewrecords: true,
                        editurl: msg.structure.editurl,
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
                        //multiselect: true, 
                        ondblClickRow: function (rowid) {
                            $("#" + msg.structure.idTable).jqGrid('viewGridRow', rowid, {
                                width: 600,
                                recreateForm: true,
                                reloadAfterSubmit: true,
                                jqModal: true,
                                closeOnEscape: true,
                                bottominfo: "Fields marked with (*) are required",
                                processData: "Processing ...",
                                beforeShowForm: function (formid) {
                                    eval(msg.structure.viewDetailGrid);
                                }
                            });

                        }
                    }).jqGrid('navGrid', '#pager' + msg.structure.idTable, {
                        excel: true,
                        search: true,
                        view: eval(msg.structure.viewpermission),
                        edit: eval(msg.structure.editpermission),
                        add: eval(msg.structure.addpermission),
                        del: eval(msg.structure.delpermission),
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
                            eval(msg.structure.hiddenForm);
                            $("#filepath").attr("readonly", true);
                            $(".modal-content").append(filemanager());
                            $("#filepath").on("click", function () {
                                $('#modals').modal('show');
                            });
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
                            r.assignBrowse(document.getElementById('file'));
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
                                  $("#loading").removeClass('hide');
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
                                //   alert('complete upload '+r.resumableFilePath);
                                  $('.resumable-progress').hide();
                                });
                              r.on('fileSuccess', function(file){
                                  
                                  // Reflect that the file upload has completed
                                  $('.resumable-file-'+file.uniqueIdentifier+' .resumable-file-progress').html('(completed)');
                                    // alert('complete file success upload ['+file.fileName+"]" + file.relativePath);
                                    document.getElementById("hide").value =  file.fileName;
                                    document.getElementById("fileLabel").innerHTML = file.fileName;
                                    var idform =$("#data_"+msg.structure.table_name).val();
                                    $("#Grid"+msg.structure.id_table).trigger('reloadGrid');
                                    $('.resumable-progress').hide();
                                    $("#loading").addClass('hide');
                                    
                                console.log("selesai file sukses");
                                    
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
                            $("#btnConfrim").on("click", function () {
                                document.getElementById("filepath").value = serverHost +'upload/'+document.getElementById("hide").value;
                                $('#modals').modal('hide');
                             });

                        },
                        beforeShowForm: function (formid) {
                            eval(msg.structure.hiddenForm);
                            eval(msg.structure.canotedited);
                            //$("#tr_FRNPEMINJAM",id).hide(); 
                        },
                        beforeSubmit: function (postdata, formid, oper) {

                            var datapost = JSON.stringify(postdata);
                            var result;
                            datapost = datapost.substr(0, datapost.length - 1) + ',"oper":"' + oper + '", "form":"' + msg.structure.formidx0 + '", "m":"' + msg.structure.module + '","p":"' + msg.structure.prefixtbl + '"}';
                            result = $.ajax({
                                type: "POST",
                                async: false,
                                url: msg.structure.urlValidate,
                                data: JSON.parse(datapost),
                                dataType: "json",
                                timeout: 2000
                            }).done(function (msg) {
                                return msg;
                            }).responseJSON;


                            if (result.error == "0") {
                                return [true, "", ""];
                            }
                            else {
                                alert(result.message);
                                return [false, result.message, ""];
                            }
                        },
                        afterSubmit: function (serverResponse, postdata) {
                            if ($.trim(serverResponse.responseText) == '0') {
                                return [true, "", ""];
                            }
                            if ($.trim(serverResponse.responseText) != '0') {
                                var result = JSON.parse(serverResponse.responseText);
                                if (result.success == "success") {
                                    sessionStorage.setItem("token", result.token.refresh);
                                    alert(result.info);
                                } else {
                                    alert(result.info);
                                }
                                return false;
                            }
                        }
                    }, //edit
                        {
                            width: '600',
                            dataheight: '360px',
                            recreateForm: true,
                            reloadAfterSubmit: true,
                            closeAfterAdd: true,
                            checkOnSubmit: true,
                            jqModal: true,
                            modal: true,
                            closeOnEscape: true,
                            bottominfo: "Fields marked with (*) are required",
                            onInitializeForm: function (formid) {
                                eval(msg.structure.hiddenForm);
                                
                                $("#filepath").attr("readonly", true);
                                $(".modal-content").append(filemanager());
                                $("#filepath").on("click", function () {
                                    $('#modals').modal('show');
                                });
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
                                r.assignBrowse(document.getElementById('file'));
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
                                      $("#loading").removeClass('hide');
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
                                    //   alert('complete upload '+r.resumableFilePath);
                                      $('.resumable-progress').hide();
                                    });
                                  r.on('fileSuccess', function(file){
                                      
                                      // Reflect that the file upload has completed
                                      $('.resumable-file-'+file.uniqueIdentifier+' .resumable-file-progress').html('(completed)');
                                        // alert('complete file success upload ['+file.fileName+"]" + file.relativePath);
                                        document.getElementById("hide").value =  file.fileName;
                                        document.getElementById("fileLabel").innerHTML = file.fileName;
                                        var idform =$("#data_"+msg.structure.table_name).val();
                                        $("#Grid"+msg.structure.id_table).trigger('reloadGrid');
                                        $('.resumable-progress').hide();
                                        $("#loading").addClass('hide');
                                        
                                    console.log("selesai file sukses");
                                        
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
                                $("#btnConfrim").on("click", function () {
                                    document.getElementById("filepath").value = serverHost +'upload/'+document.getElementById("hide").value;
                                    $('#modals').modal('hide');
                                 });

 
                            },
                            onclickSubmit: function (params, postdata) {
                                return true;
                            },
                            beforeSubmit: function (postdata, formid, oper) {
                                var datapost = JSON.stringify(postdata);
                                var result;
                                datapost = datapost.substr(0, datapost.length - 1) + ',"oper":"' + oper + '", "form":"' + msg.structure.formidx0 + '", "m":"' + msg.structure.module + '","p":"' + msg.structure.prefixtbl + '"}';
                                result = $.ajax({
                                    type: "POST",
                                    async: false,
                                    url: msg.structure.urlValidate,
                                    data: JSON.parse(datapost),
                                    dataType: "json",
                                    timeout: 2000
                                }).done(function (msg) {
                                    return msg;
                                }).responseJSON;


                                if (result.error == "0") {
                                    return [true, "", ""];
                                }
                                else {
                                    alert(result.message);
                                    return [false, result.message, ""];
                                }
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
                                var sr = jQuery("#" + msg.structure.idTable).jqGrid('getGridParam', 'selrow');
                                primarykey = jQuery("#" + msg.structure.idTable).jqGrid('getCell', jQuery("#" + msg.structure.idTable).jqGrid('getGridParam', 'selrow'), msg.structure.keyfield);
                                retarr = "{\"" + msg.structure.keyfield + "\" : \"" + primarykey + "\"}";
                                retarr = JSON.parse(retarr);
                                console.log(retarr);
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
                            showQuery: false
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
                            processData: "Processing ..."
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
                            helppdffile: msg.structure.urlhelpfile,
                            helppage: msg.structure.helppage,
                            helptext: msg.structure.helpheadertitle
                        } //Help,
                    );

                    jQuery('#' + msg.structure.idTable + '_toppager_center').remove();
                    jQuery('#' + msg.structure.idTable + '_toppager_right').remove();
                    jQuery('#pager' + msg.structure.idTable + '_left').remove();

                    $('#' + msg.structure.idTable + '').jqGrid("navSeparatorAdd", "#pg_" + msg.structure.idTable + "_toppager", {
                        sepclass: 'ui-separator', sepcontent: ''
                    });

                    $('#' + msg.structure.idTable + '').jqGrid("navButtonAdd", "#pg_" + msg.structure.idTable + "_toppager", {
                        buttonicon: "glyphicon icon-libreoffice",
                        title: "Export to CSV",
                        caption: "",
                        position: "last",
                        onClickButton: exportToCSV2
                    });
                    function exportToCSV2() {
                        exportToCSVTable($('#' + msg.structure.idTable),
                            msg.structure.formidx0,
                            msg.structure.module,
                            msg.structure.prefixtbl,
                            msg.structure.prefixtbl + "form" + msg.structure.formidx0,
                            msg.structure.urlExportCsv);
                    }
                   		 

                    $(window).bind('resize', function () {
                        var width = $('.table-responsive').width();
                        $('#' + msg.structure.idTable).jqGrid("setGridWidth", width);
                    }).trigger('resize');

                    $('.sidebar-toggle').on('click', function () {
                        if ($('.main-sidebar').width() > 60) {
                            $('#' + msg.structure.idTable).jqGrid("setGridWidth", $(window).innerWidth() - 95);
                        } else {
                            $('#' + msg.structure.idTable).jqGrid("setGridWidth", $(window).innerWidth() - 275);
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
