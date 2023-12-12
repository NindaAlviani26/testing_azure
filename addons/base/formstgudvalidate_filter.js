
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

                $.get("./templates/base/formstg_filter.template?v=8", function (data) {
                    var template = data.replaceAll("{{formtitle}}", msg.structure.formtitle);
                    template = template.replaceAll("{{idTable}}", msg.structure.idTable);
                    $("#mainContent").html(template);


                    // var get_date = new Date();
                    // get_date.setDate(0); //sets d to the last day of the previous month
                    // var day = ("0" + get_date.getDate()).slice(-2);
                    // var month = ("0" + (get_date.getMonth() + 1)).slice(-2);
                    // var periode_data = get_date.getFullYear()+"-"+(month)+"-"+(day);
                    
                    // start set periode data
                    var filter_periode_data = msg.structure.periode_data;
                    var data_periode_data = filter_periode_data.split('=');

                    // set first value
                    var first_date = $('#periode_data').val(data_periode_data[1]);
                    $('#periode_data').attr("value",first_date);
                    // endset first value

                    // set date with datepicker
                    var format_date ='yyyy-mm-dd';
                    $('#periode_data').datepicker({
                        format: format_date,
                        autoSize: true,
                        changeMonth:true,
                        changeYear:true,
                        showWeek: true
                    });
                    // end set date with datepicker

                    if(data_periode_data[1] == 'not_value'){
                        $('#periode_data').val();
                        filter_periode_data = '';
                    }else{
                        $('#periode_data').val(data_periode_data[1]);
                    }
                    
                    // handle ketika inputan diganti
                    $('#periode_data').change(function(){
                        $('#periode_data').val();
                        filter_periode_data = data_periode_data[0]+"="+ $('#periode_data').val();

                        // handle jika inputan form kosong
                        if($('#periode_data').val() == ''){
                            filter_periode_data ='';
                        }
                        
                    });

                    // set value attribute placeholder
                    $(document).ready(function(){ 
                        $('#periode_data').attr("placeholder",format_date);
                    })
                    // end set value attribute placeholder

                    $('#btn-clear').click(function(){
                        $('#periode_data').val('');
                        filter_periode_data = '';
                    });


                    // handle ketika btn search di click
                    $('#btn-search').click(function(){
                        $("#loading").removeClass('hide');
                        
                        $.ajax({
                            url: urlServer,
                            type: "GET",
                            dataType: "JSON",
                            success: function (result) {
                                if (result.status == 'success') {
                                    
                                    jQuery("#" + result.structure.idTable).jqGrid('setGridParam',{url:result.structure.urlLoadData + "&periodeData=" + filter_periode_data,page:1}).trigger("reloadGrid");
                                    $("#" + result.structure.idTable).trigger('reloadGrid');
                                    $("#loading").addClass('hide');

                                } else {
                                    alert(result.info);
                                    $("#loading").addClass('hide');
                                }
    
                            }, error: function (e) {
                                console.log(e);
                            }
                        });
                    });
                    //end set periode data



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

                    var loadData = [];
                    
                    jQuery("#" + msg.structure.idTable).jqGrid({
                        url: msg.structure.urlLoadData +"&periodeData=" + filter_periode_data,
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
                        rowList: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 1000, "10000:All"],
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
                        colMenu: true,
                        responsive: true,
                        autowidth: true,
                        hidegrid: true,
                        loadonce: false,
                        loadComplete: function (response) {
                            loadData = response.data;

                            $("#"+msg.structure.idTable).trigger('reloadGrid');

                        },
                        
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
                           
                            // replace session
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
                            // end replace session
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
                            },
                            onclickSubmit: function (params, postdata) {
                                return true;
                            },
                            beforeSubmit: function (postdata, formid, oper) {
                                $("#loading").removeClass('hide');
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
                                $("#loading").addClass('hide');
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
                                retarr = eval("{" + msg.structure.keyfield + " : " + primarykey + "}");
                                return retarr;
                            },
                            afterSubmit: function (serverResponse, xhr, postdata) {

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
                        } //del
                        , {
                            multipleSearch: true,
                            multipleGroup: true,
                            showQuery: true
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


                    // export to excel
                    if(eval(msg.structure.downloadpermission)){
                        $('#' + msg.structure.idTable).jqGrid("navButtonAdd", "#pg_" + msg.structure.idTable + "_toppager", {
                            buttonicon: "glyphicon glyphicon-cloud-download",
                            title: "Download Excel",
                            caption: "",
                            position: "last",
                            onClickButton: exportToCSV2
                        });
                    }

                    function exportToCSV2() {
                        
                        exportToXLSTable($('#' + msg.structure.idTable),
                            msg.structure.formidx0,
                            msg.structure.module,
                            msg.structure.prefixtbl,
                            msg.structure.prefixtbl + "form" + msg.structure.formidx0,
                            msg.structure.urlExportXls,filter_periode_data);
                    }

                    // upload
                    if(eval(msg.structure.uploadpermission)){
                        $('#' + msg.structure.idTable).jqGrid("navButtonAdd", "#pg_" + msg.structure.idTable + "_toppager", {
                            buttonicon: "glyphicon glyphicon-cloud-upload",
                            title: "Upload Excel",
                            caption: "",
                            position: "last",
                            onClickButton: null
                        });
                    }

                    $('.glyphicon-cloud-upload').click(function () {
                        $("#upload" + msg.structure.idTable).click();
                    })

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

                    r.assignBrowse(document.getElementById('upload' + msg.structure.idTable));
                    // r.assignBrowse(document.getElementsByClassName('glyphicon-cloud-upload'));

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

                            // loading hide
                            // $("#loading").addClass('hide');
                            // alert('Upload Data Success');
                        });
                        r.on('fileSuccess', function (file, message) {
                            // Reflect that the file upload has completed
                            $('.resumable-file-' + file.uniqueIdentifier + ' .resumable-file-progress').html('(completed)');
                            $("#loading").removeClass('hide');
                            $.ajax({
                                url: msg.structure.uploadData + "&file_name=" + file.fileName,
                                type: "POST",
                                dataType: "JSON",
                                success: function (result) {
                                    if (result.status == 'success') {
                                        alert(result.info);
                                        // console.log(result.info)
                                        $('.resumable-progress').hide();
                                        $("#" + msg.structure.idTable).trigger('reloadGrid');
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
                    // }

                    // end upload

                    // delete all data
                    if(eval(msg.structure.delpermission)){
                        $('#' + msg.structure.idTable).jqGrid("navButtonAdd", "#pg_" + msg.structure.idTable + "_toppager", {
                            id:'delAll',
                            buttonicon: "glyphicon glyphicon-floppy-remove",
                            title: "Delete this Periode",
                            caption: "",
                            position: "last",
                            onClickButton: deleteAllData
                        });
    
                        function deleteAllData(){
                            
                            // var idTableGrid = $('#'+msg.structure.idTable);
                            // var dataIDs = idTableGrid.getDataIDs(); 
                            // var rowDataX = [];
                            // for(i = 0; i < dataIDs.length; i++)
                            // {
                            //     var rowData = idTableGrid.jqGrid ('getRowData', dataIDs[i]);
                            //     //rowData is object containing keys & values for row
                            //     rowDataX[i] = rowData.id;
                            // }
                            // rowDataX = rowDataX.toString();
                            $(document.body).append(deleteAllByPeriode());

                            var var_periode_data = $('#periode_data').val();
                            if(var_periode_data == '' || var_periode_data == null){

                                alert('Periode Data is null ...!');
                            
                            }else{
                                $('#modalConfirmDelete').modal(); //show modal

                                // jika id ini di klick maka modal remove
                                $("#close_confirm_delete, #close2_confirm_delete, #modalConfirmDelete").on('click',function(){
                                    $('#modalConfirmDelete').remove();
                                    $('.modal-backdrop.fade.in').remove();
                                    $('body').removeClass('modal-open');
                                })

                                // jika id ini di klick maka jalankan ajax
                                $('#ok_confirm_delete').on('click',function(){
                                    $("#loading").removeClass('hide');
                                    $.ajax({
                                        url : msg.structure.urlDeleteAll+"&varPeriodeData="+var_periode_data,
                                        dataType : "json",
                                        type : 'GET',
                                        success :function(response_data){
                                            if(response_data.status == 'success'){
                                                alert(response_data.info);
                                                $("#" + msg.structure.idTable).trigger('reloadGrid');
                                                $("#loading").addClass('hide');
                                                $('#modalConfirmDelete').remove();
                                                $('.modal-backdrop.fade.in').remove();
                                            }else{
                                                alert(response_data.info);
                                                $("#loading").addClass('hide');
                                                $('#modalConfirmDelete').remove();
                                                $('.modal-backdrop.fade.in').remove();
                                            }
                                        },
                                        error : function(e){
                                            console.log(e);
                                            $("#loading").addClass('hide');
                                            $('#modalConfirmDelete').remove();
                                            $('.modal-backdrop.fade.in').remove();
                                        }
                                    })
                                    $('body').removeClass('modal-open');
                                })

                                
                            }
                        }
                        // sorting position after icon delete
                        $('#delAll').insertAfter('td#del_'+msg.structure.idTable+'_top');
                    }
                    // end delete all data

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
