
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
                $.get("./templates/base/status_laporan.template?v=8", function (data) {
                    var template = data.replaceAll("{{formtitle}}", msg.structure.formtitle);
                    template = template.replaceAll("{{idTable}}", msg.structure.idTable);
                    $.ajaxSetup({
                        headers: {
                            'Authorization': "Bearer " + sessionStorage.token
                        }
                    });

                    $("#mainContent").html(template);

                    $.get(serverHost + "addons/base/combopub.api?t=BRANCH", function(dataMsg){
                        $(".comboBranch").html(dataMsg);
                        $(".comboBranch select").attr("id", "idPelapor");
                        $(".comboBranch select").attr("name", "idPelapor");

                        $(".comboBranch select").addClass('select-special');

                        // select2
                        $('select.select-special').select2({
                            width: "100%",
                            placeholder: "__Please Select__",
                            allowClear :true,
                            
                        });
                        // end select2
                        
                    });

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

                    var gridimgpath = 'themes/basic/images';
                    
                    // tampung data in check pada array
                    var $grid = $("#"+msg.structure.idTable); 
                    var idsOfSelectedRows = []; 
                    updateIdsOfSelectedRows = function (id, isSelected) {
                        var index = $.inArray(id, idsOfSelectedRows);
                        if (!isSelected && index >= 0) {
                            idsOfSelectedRows.splice(index, 1); // remove id from the list
                            
                        } else if (index < 0) {
                            idsOfSelectedRows.push(id);
                        }
                        return idsOfSelectedRows;
                    };

                    $grid.jqGrid({
                        url: msg.structure.urlLoadData,
                        datatype: "json",
                        mtype: "POST",
                        // property multiselect
                        // multiselect: true,
                        
                        onSelectRow: updateIdsOfSelectedRows,
                        onSelectAll: function (aRowids, isSelected) {
                            var i, count, id;
                            for (i = 0, count = aRowids.length; i < count; i++) {
                                id = aRowids[i];
                                updateIdsOfSelectedRows(id, isSelected);
                            }
                        },
                        loadComplete: function () {
                            var $this = $(this), i, count;
                            for (i = 0, count = idsOfSelectedRows.length; i < count; i++) {
                                $this.jqGrid('setSelection', idsOfSelectedRows[i], false);
                            }
                        },
                        // end property multiselect
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
                        rowList: [10, 20, 30,40,50,60,70,80,90,100, "10000:All"],
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
                        multiselect: false,
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
                        edit: false,
                        add: false,
                        del: false,
                        refresh: true,
                        cloneToTop: true,
                        help: true
                    },
                    {},
                    {},
                    {},
                         {
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
                            processData: "Processing ...",
                            beforeShowForm: function (formid) {
                                eval(msg.structure.viewDetailGrid);
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
                            helppdffile: msg.structure.urlhelpfile,
                            helppage: msg.structure.helppage,
                            helptext: msg.structure.helpheadertitle
                        } //Help,
                    );
                    
                    jQuery('#' + msg.structure.idTable + '_toppager_center').remove();
                    jQuery('#' + msg.structure.idTable + '_toppager_right').remove();
                    jQuery('#pager' + msg.structure.idTable + '_left').remove();

                    // hide feature download/geenerate
                    // $('#' + msg.structure.idTable).jqGrid("navButtonAdd", "#pg_" + msg.structure.idTable + "_toppager", {
                    //     // buttonicon: "glyphicon glyphicon-download-alt",
                    //     buttonicon: "glyphicon glyphicon-download-alt",
                    //     title: "Download Data Textfile",
                    //     caption: "",
                    //     position: "last",
                    //     onClickButton: function () {
                    //         var s;
                    //         s = jQuery("#" + msg.structure.idTable).jqGrid('getGridParam', 'selarrrow');

                    //         strprop = '';
                    //         for (var i = 0; i < s.length; i++) {
                    //             colmod = jQuery("#" + msg.structure.idTable).jqGrid('getGridParam', "colModel");
                    //             data = jQuery("#" + msg.structure.idTable).jqGrid('getRowData', s[i]);

                    //             for (var x in colmod) {

                    //                 if (colmod[x].index == msg.structure.keyfield) {
                    //                     strprop = strprop + data[colmod[x].index] + ',';

                    //                 }
                    //             }

                    //         }

                    //             strpropX = '';
                    //         if (strprop == '' ) {
                    //             alert("Please Check Data Before Download...!");
                    //             return false;
                    //         }
                    //         // end kondisi jika form filter tidak di isi
                    //         else {
                                
                    //             // return to generate
                    //              var newDate = new Date();
                    //             var file_name_zip = "generate_"+newDate.getTime();

                    //             strpropX = 'idForm=' + strprop;
                    //             $("#loading").removeClass('hide');

                    //             // ambil name yg ada di form
                    //             var data_form = $("#formGenerate").serialize();
                    //             // console.log(data_form);
                    //             // end ambil name yg ada di form
                                
                    //             $.ajax({
                    //                 type: "POST",
                    //                 dataType: "JSON",
                    //                 // url: msg.structure.urlGenerate + "&idForm=" + strprop + "&id_operasional=" + id_operasional + "&id_pelapor=" + id_pelapor + "&periode_data=" + periode_data + "&periode_laporan=" + periode_laporan + "&file_name_text="+file_name_text,
                    //                 url: msg.structure.urlGenerate + "&idForm=" + updateIdsOfSelectedRows() + "&file_name_zip="+file_name_zip,
                                    
                    //                 success: function (message) {
                    //                     // console.log(message.status);
                                        
                    //                     // generateAntasena();

                    //                     if(message.status == "error" ){
                    //                         alert(message.info);
                    //                     }else{
                                        
                    //                     // var file_location = serverHost + "generate/generate.zip";
                    //                         var file_location = serverHost + "generate/"+file_name_zip+".zip";
                    //                         var link = document.createElement('a');
                    //                         link.href = file_location;
                    //                         // link.download = true;

                    //                         link.click();

                    //                         $.ajax({
                    //                             url : msg.structure.urlGenerate + "&file_name_zip_del="+file_name_zip,
                    //                             type : 'post',
                    //                             dataType : 'json',
                    //                             success : function(d){
                    //                                 console.log('OK');
                    //                             },
                    //                             error: function(e){
                    //                                 console.log(e);
                    //                             }
                    //                         });
                    //                     }

                    //                     $("#loading").addClass('hide');
                    //                     return true;


                    //                 }, error:function(e){
                    //                     console.log(e);
                    //                 }
                    //             });
                    //         }
                        

                    //             // var s;
                    //             // s = jQuery("#" + msg.structure.idTable).jqGrid('getGridParam', 'selarrrow');

                    //             // strprop = '';
                    //             // for (var i = 0; i < s.length; i++) {
                    //             //     colmod = jQuery("#" + msg.structure.idTable).jqGrid('getGridParam', "colModel");
                    //             //     data = jQuery("#" + msg.structure.idTable).jqGrid('getRowData', s[i]);

                    //             //     for (var x in colmod) {

                    //             //         if (colmod[x].index == msg.structure.keyfield) {
                    //             //             strprop = strprop + data[colmod[x].index] + ',';

                    //             //         }
                    //             //     }

                    //             // }

                    //             // strpropX = '';
                    //             // if (strprop == '') {
                    //             //     alert("Please Check Data Before Generate...!");
                    //             //     return false;
                    //             // }
                    //             // else {
                    //             //     //return to generate

                    //             //     strpropX = 'id=' + strprop;

                    //             //     $.ajax({
                    //             //         type: "POST",
                    //             //         dataType: "JSON",
                    //             //         url: msg.structure.urlApprovel,
                    //             //         data: strpropX,
                    //             //         success: function (message) {
                    //             //             alert(message.info);
                    //             //             $("#" + msg.structure.idTable).trigger('reloadGrid');

                    //             //         }
                    //             //     });
                    //             // }

                    //     }
                    // });

                    // generate

                   
                   // triger jika download file error validasi
                    $('#'+msg.structure.idTable).on('click','#triger_status',function(){
                        event.preventDefault();
                        var get_data = $(this).attr('href');

                        $("#loading").removeClass('hide');
                        $.ajax({
                            url : msg.structure.urlDownloadError+"&data_triger="+get_data,
                            dataType : 'json',
                            method:'post',
                            success: function(data_response){
                                if(data_response.status == "error" ){

                                    alert(data_response.info);

                                }else{

                                    var file_location = serverHost + "generate/"+data_response.data_file;
                                    var link = document.createElement('a');
                                    link.download = data_response.data_file;
                                    link.href = file_location;
                                    link.click();
                                }

                                $("#loading").addClass('hide');
                            },
                            error: function(e){
                                console.log(e);
                            }
                        });
                    });

                    

                    $("#btnSubmit").click(function () {
                        
                        
                        var data_form = $("#formGenerate").serialize();

                        $("#loading").removeClass('hide');
                        
                        $.ajax({
                            url: urlServer,
                            type: "GET",
                            dataType: "JSON",
                            success: function (result) {
                                if (result.status == 'success') {
                                    jQuery("#" + result.structure.idTable).jqGrid('setGridParam',{url:result.structure.urlLoadData + "&"+data_form,page:1}).trigger("reloadGrid");
                                    $("#" + result.structure.idTable).trigger('reloadGrid');

                                    // clear form after success
                                    $('#idPelapor').val('');
                                    $('#periodeData').val('');
                                    $('#periodeLaporan').val('');
                                    $('#statusFile').val('');

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
        }
    })
}
