
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

                    // set periode data
                    var get_date_x = new Date(); //ambil all date 
                    var month_y = get_date_x.getUTCMonth(); //ambil bulan sembelumnya dalam numeric

                        // check bulan triwulan
                        if(month_y == 0 || month_y == 1 || month_y == 2){
                            month_y = 12;
                        }else if(month_y == 3 || month_y == 4 || month_y == 5){
                            month_y = 3;
                        }else if(month_y == 6 || month_y == 7 || month_y == 8){
                            month_y = 6;
                        }else if(month_y == 9 || month_y == 10 || month_y == 11){
                            month_y = 9;
                        }

                        month_y = month_y.toString();
                        month_y = month_y.length < 2 ? "0" + month_y : month_y; // ubah fomrat 9 menjadi 09

                    var year_y = get_date_x.getFullYear();

                    // condition ketika ambil data tahun dan bulan sebelunya 
                    if(month_y == 12){
                        year_y = get_date_x.getFullYear()-1;
                    }

                    // month kebutuhan view saja di inputan filter
                    var get_date_y = new Date(year_y+"-"+month_y);
                    var month_x = get_date_y.toLocaleString('id-ID', { month: 'long' }); 
                    // end month kebutuhan view saja di inputan filter

                    var date_x = new Date(year_y,month_y,0);
                    var filter_periode_data = year_y +'-'+ month_y +'-'+ date_x.getDate();
                    console.log('periode data before change '+filter_periode_data);

                    var view_filter_periode = month_x +' '+ year_y;

                    console.log('view periode data '+view_filter_periode);

                    // set first value
                    var first_date = $('#periode_data').val(view_filter_periode);
                    $('#periode_data').attr("value",first_date);
                    // end set first value

                    // set date with datepicker
                    var format_date ='MM yyyy';
                    $.fn.datepicker.dates['id'] = { //custom nama bulan dalam indonesia
                        days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                        daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                        daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
                        months: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
                        monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                    };
                   
                    $('#periode_data').datepicker({
                        minViewMode:'months',
                        format: format_date,
                        defaultViewDate: view_filter_periode,
                        language: "id"
                    });
                    // var format_date ='yyyy-mm';
                    // $('#periode_data').datepicker({
                    //     minViewMode:'months',
                    //     format: format_date,
                    //     defaultViewDate:filter_periode_data
                    // });
                    // end set date with datepicker

                    // handle jika inputan form kosong
                    if($('#periode_data').val() == ''){
                        filter_periode_data ='';
                    }
                    
                    // handle ketika inputan diganti
                    $('#periode_data').change(function(){

                        var periode_change = $('#periode_data').val();
                        var periode_change_x = periode_change.split(" ");

                        if(periode_change_x[0] == 'Januari'){
                            periode_change = 'January';
                        }else if(periode_change_x[0] == 'Februari'){
                            periode_change = 'February';
                        }else if(periode_change_x[0] == 'Maret'){
                            periode_change = 'March';
                        }else if(periode_change_x[0] == 'April'){
                            periode_change = 'April';
                        }else if(periode_change_x[0] == 'Mei'){
                            periode_change = 'May';
                        }else if(periode_change_x[0] == 'Juni'){
                            periode_change = 'June';
                        }else if(periode_change_x[0] == 'Juli'){
                            periode_change = 'July';
                        }else if(periode_change_x[0] == 'Agustus'){
                            periode_change = 'August';
                        }else if(periode_change_x[0] == 'September'){
                            periode_change = 'September';
                        }else if(periode_change_x[0] == 'Oktober'){
                            periode_change = 'October';
                        }else if(periode_change_x[0] == 'November'){
                            periode_change = 'November';
                        }else{
                            periode_change = 'December';
                        }

                        var get_periode = periode_change +"28,"+periode_change_x[1]; //ambil nilai dari change


                        // handle jika inputan form kosong
                        if($('#periode_data').val() == ''){
                            filter_periode_data ='';
                        }else{

                            filter_periode_data = new Date(get_periode); //ambil nilai saat ini
                            month_y = filter_periode_data.getUTCMonth(); //ambil bulan ini dalam numeric
                            year_y = filter_periode_data.getFullYear();

                            date_x = new Date(year_y,month_y+1,0);
                            filter_periode_data = year_y +'-'+ (month_y+1) +'-'+ date_x.getDate();

                            console.log('set periode after change '+filter_periode_data)
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
                            
                            // highlight data invalid
                            var id_table = msg.structure.idTable;
                            messageWarning(id_table);
                            // end highlight data invalid

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
                        // jqModal: true,
                        // modal: true,
                        closeOnEscape: true,
                        bottominfo: "Fields marked with (*) are required",
                        processData: "Processing ...",
                        onInitializeForm: function (formid) {
                            eval(msg.structure.hiddenForm);

                            // set val periode data readonly or not
                            setTimeout(function () {
                                $('.datepicker').addClass('hidden');
                                $('.datepicker').remove();
                                // jika tidak readonly maka tampilkan picker
                                $('.DataTD input#periode_data ').on('click',function(){
                                    $('.datepicker').show();
                                    $('.datepicker').removeClass('hidden');
                                });

                                // // jika readonly maka jangan tampilkan picker
                                $('.DataTD input[readonly="readonly"]#periode_data ').on('click',function(){
                                    $('.datepicker').addClass('hidden');
                                    $('.datepicker').remove();
                                });
                            }, 100);
                            // end set val periode data readonly or not

                            // select2
                            $(document).ready(function () {
                                $('select.FormElement').select2({
                                    width: "85%",
                                    placeholder: "__Please Select__",
                                    allowClear :true,
                                    
                                });
                            });
                            // end select2
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
                            // jqModal: true,
                            // modal: true,
                            closeOnEscape: true,
                            bottominfo: "Fields marked with (*) are required",
                            onInitializeForm: function (formid) {
                                eval(msg.structure.hiddenForm);

                                // set val periode data readonly or not
                                setTimeout(function () {
                                    $('.datepicker').addClass('hidden');
                                    $('.datepicker').remove();
                                    
                                    var var_date = filter_periode_data;

                                    $('.DataTD input#periode_data ').is('[readonly]') ?  $('.DataTD input#periode_data').val(var_date) : '';

                                    // jika tidak readonly maka tampilkan picker
                                    $('.DataTD input#periode_data ').on('click',function(){
                                        $('.datepicker').show();
                                        $('.datepicker').removeClass('hidden');
                                        
                                    });

                                    // // jika readonly maka jangan tampilkan picker
                                    $('.DataTD input[readonly="readonly"]#periode_data ').on('click',function(){
                                        $('.datepicker').addClass('hidden');
                                        $('.datepicker').remove();
                                    });

                                    // $(this).on('click',function(){
                                    //     $('.datepicker').remove();
                                    // });
                                }, 1);
                                // end set val periode data readonly or not

                                // select2
                                $(document).ready(function () {
                                    $('select.FormElement').select2({
                                        width: "85%",
                                        placeholder: "__Please Select__",
                                        allowClear :true,
                                        
                                    });
                                });
                                // end select2

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
                            
                            $(document.body).append(deleteAllByPeriode());

                            var var_periode_data = filter_periode_data;
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

                    // 2 column page jqgrid
                    $('table.ui-pager-table tbody tr').children('td:nth-child(1)').css({"width":"auto","text-align":"left"});
                    $('table.ui-pager-table tbody tr').children('td:nth-child(2)').css({"color":"#6f6f6f",'font-size':'11px'});
                    // end 2 column page jqgrid

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
