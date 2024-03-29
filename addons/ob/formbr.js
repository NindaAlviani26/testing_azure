
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
                            
                            $(".modal-content").append(condition(idIndex));

                            $("#code").attr("readonly", true);
                            $("#condition").attr("readonly", true);
                            $("#condition").on("click", function () {
                                $('#modals').modal('show');
                                $('.trContent').empty();
                                var splitAnd =  document.getElementById("condition").value.toLowerCase().split(" and ");
                                var splitOR =  document.getElementById("condition").value.toLowerCase().split(" or ");
                                if(splitOR.length>=2){
                                    idIndex=splitOR.length;
                                    editValue(splitOR, splitOR.length, 'OR', msg.structure.colConditionName,msg.structure.colConditionIndex);
                                }else{
                                    idIndex=splitAnd.length;
                                    editValue(splitAnd, splitAnd.length, 'AND', msg.structure.colConditionName,msg.structure.colConditionIndex);
                                }
                            });
                            $("#btnConfrim").on("click", function () {
                               document.getElementById("condition").value = appendElement(idIndex,remove);
                               $('#modals').modal('hide');
                            });

                            $("table.groupTbl #buton").on("click", function () {
                                
                                idIndex++;
                                $('.trContent').append(isiCondition(idIndex));
                                appendOption(msg.structure.colConditionName,msg.structure.colConditionIndex,idIndex);
                                   
                            });
                            $(".modal-body").delegate(".delete-rule", "click", function(e) {
                                $(this).parent().parent().remove();
                                remove++;
                                idIndex--; 
                                document.getElementById("demo").innerHTML = appendElement(idIndex,remove);
                            }); 
                            $(".modal-body").delegate(".selected, .selectoption, .input-elment ", "change", function(e) {
                                document.getElementById("demo").innerHTML = appendElement(idIndex,remove);
                            }); 


                            setTimeout(function () {
                                var maxCode = $.ajax({
                                    type: "POST",
                                    async: false,
                                    url: msg.structure.urlLoadCode,
                                    dataType: "json",
                                    timeout: 2000
                                }).done(function (msg) {
                                    return msg;
                                }).responseJSON;

                                maxCode = parseInt(maxCode.data[0].code.substring(4)) + 1;


                                var codeBase = msg.structure.formidx0 == 'BROLPASS' ? 'PBR' : 'HBR';

                                $("#form_type").on("change", function () {
                                    var type = $(this).val();
                                    if (type == 'oboffind') {
                                        $("#code").val('I' + codeBase + maxCode);
                                    } else if (type == 'obofforg') {
                                        $("#code").val('O' + codeBase + maxCode);
                                    }
                                });
                                
                            }, 1000);
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
                                $(".modal-content").append(condition(idIndex));

                                $("#code").attr("readonly", true);
                                $("#condition").attr("readonly", true);
                                $("#condition").on("click", function () {
                                    $('#modals').modal('show');
                                });
                                $("#btnConfrim").on("click", function () {
                                   document.getElementById("condition").value = appendElement(idIndex,remove);
                                   $('#modals').modal('hide');
                                });

                                $("table.groupTbl #buton").on("click", function () {
                                    
                                    idIndex++;
                                    $('.trContent').append(isiCondition(idIndex));
                                    appendOption(msg.structure.colConditionName,msg.structure.colConditionIndex,idIndex);
                                });
                                $(".modal-body").delegate(".delete-rule", "click", function(e) {
                                    $(this).parent().parent().remove();
                                    idIndex--;  
                                    document.getElementById("demo").innerHTML = appendElement(idIndex,remove);
                                }); 
                                $(".modal-body").delegate(".selected, .selectoption, .input-elment", "change", function(e) {
                                    document.getElementById("demo").innerHTML = appendElement(idIndex,remove);
                                }); 

                                setTimeout(function () {
                                    var maxCode = $.ajax({
                                        type: "POST",
                                        async: false,
                                        url: msg.structure.urlLoadCode,
                                        dataType: "json",
                                        timeout: 2000
                                    }).done(function (msg) {
                                        return msg;
                                    }).responseJSON;

                                    
                                    if(maxCode == null){
                                        maxCode = 1;
                                    }else{
                                        maxCode = parseInt(maxCode.data[0].code.substring(4)) + 1;
                                    }

                                    var codeBase = msg.structure.formidx0 == 'BROLPASS' ? 'PBR' : 'HBR';

                                    $("#form_type").on("change", function () {
                                        var type = $(this).val();
                                        if (type == 'oboffind') {
                                            $("#code").val('I' + codeBase + maxCode);
                                        } else if (type == 'obofforg') {
                                            $("#code").val('O' + codeBase + maxCode);
                                        }
                                    });


                                }, 1000);
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
