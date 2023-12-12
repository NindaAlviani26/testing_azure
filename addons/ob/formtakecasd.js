
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

                $.get("./templates/ob/formtakecasd.template?v=1", function (data) {
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
                        multiselect: true,loadComplete: function () {
                            var colw = $('.table-responsive').width();
                            var cekCol = eval('[' + msg.structure[0].colNames + ']');
                            if(cekCol.length <= 3){
                                $("#" + msg.structure[0].idTable).resizeColumn(msg.structure[0].keyfield, (colw - 100), true);
                            }

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

                            var where1 = "&w="+msg.structure[0].keyfield+"='" + $("#" + msg.structure[0].idTable).getRowData(parentRowKey)[msg.structure[0].keyfield] + "'";
                            console.log(where1);
                            // var childGridURL = encodeURI('./addons/base/loadstaticwhere.php?q=2&t=<?php echo $formx[1]->tablename; ?>&w=' + where1);
                            var childGridURL = encodeURI(msg.structure[4].urlLoadData + where1);
                            console.log(childGridURL);
                            var colw = $("#" + msg.structure[0].idTable).parent().width();

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
                                cellEdit: false,
                                cellurl: msg.structure[4].cellurl,
                            });
                            $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
                                view: true,
                                edit: false,
                                add: false,
                                del: false,
                                search: false
                            });
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


                    $('#' + msg.structure[0].idTable).jqGrid("navSeparatorAdd", "#pg_" + msg.structure[0].idTable + "_toppager", {
                        sepclass: 'ui-separator', sepcontent: ''
                    });

                    $('#' + msg.structure[0].idTable).jqGrid("navButtonAdd", "#pg_" + msg.structure[0].idTable + "_toppager", {
                        buttonicon: "glyphicon glyphicon-check",
                        title: "Take case action",
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
                                    url: msg.structure[0].urlTakeCase,
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

                    $('#' + msg.structure[0].idTable + '').jqGrid("navButtonAdd", "#pg_" + msg.structure[0].idTable + "_toppager", {
                        buttonicon: "glyphicon icon-libreoffice",
                        title: "Export to CSV",
                        caption: "",
                        position: "last",
                        onClickButton: exportToCSV
                    });

                    function exportToCSV() {
                        exportToCSVTable2(msg.structure[4].formidx0,
                            msg.structure[0].formidx0,
                            msg.structure[0].module,
                            msg.structure[0].prefixtbl,
                            msg.structure[0].prefixtbl + "form" + msg.structure[0].formidx0,
                            msg.structure[0].urlCsv);
                    }

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
                            multiselect: true,loadComplete: function () {
                                var colw = $('.table-responsive').width();
                                var cekCol = eval('[' + msg.structure[1].colNames + ']');
                                if(cekCol.length <= 3){
                                    $("#" + msg.structure[1].idTable).resizeColumn(msg.structure[1].keyfield, (colw - 100), true);
                                }
    
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
    
                                var where1 = "&w="+msg.structure[1].keyfield+"='" + $("#" + msg.structure[1].idTable).getRowData(parentRowKey)[msg.structure[1].keyfield] + "'";
                                // var childGridURL = encodeURI('./addons/base/loadstaticwhere.php?q=2&t=<?php echo $formx[4]->tablename; ?>&w=' + where1);
                                var childGridURL = encodeURI(msg.structure[4].urlLoadData + where1);
                                console.log(childGridURL);
                                var colw = $("#" + msg.structure[1].idTable).parent().width();
    
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
                                    cellEdit: false,
                                    cellurl: msg.structure[4].cellurl,
                                });
                                $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
                                    view: true,
                                    edit: false,
                                    add: false,
                                    del: false,
                                    search: false
                                });
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
                        buttonicon: "glyphicon glyphicon-check",
                        title: "Take case for undo action",
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
                                    url: msg.structure[1].urlTakeCase,
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

                    $('#' + msg.structure[1].idTable + '').jqGrid("navButtonAdd", "#pg_" + msg.structure[1].idTable + "_toppager", {
                        buttonicon: "glyphicon icon-libreoffice",
                        title: "Export to CSV",
                        caption: "",
                        position: "last",
                        onClickButton: exportToCSV1
                    });

                    function exportToCSV1() {
                        exportToCSVTable2(msg.structure[4].formidx0,
                            msg.structure[1].formidx0,
                            msg.structure[1].module,
                            msg.structure[1].prefixtbl,
                            msg.structure[1].prefixtbl + "form" + msg.structure[1].formidx0,
                            msg.structure[1].urlCsv);
                    }

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
                            multiselect: true,loadComplete: function () {
                                var colw = $('.table-responsive').width();
                                var cekCol = eval('[' + msg.structure[2].colNames + ']');
                                if(cekCol.length <= 3){
                                    $("#" + msg.structure[2].idTable).resizeColumn(msg.structure[2].keyfield, (colw - 100), true);
                                }
    
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
    
                                var where1 = "&w="+msg.structure[2].keyfield+"='" + $("#" + msg.structure[2].idTable).getRowData(parentRowKey)[msg.structure[2].keyfield] + "'";
                                // var childGridURL = encodeURI('./addons/base/loadstaticwhere.php?q=2&t=<?php echo $formx[4]->tablename; ?>&w=' + where1);
                                var childGridURL = encodeURI(msg.structure[4].urlLoadData + where1);
                                console.log(childGridURL);
                                var colw = $("#" + msg.structure[2].idTable).parent().width();
    
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
                                    cellEdit: false,
                                    cellurl: msg.structure[4].cellurl,
                                });
                                $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
                                    view: true,
                                    edit: false,
                                    add: false,
                                    del: false,
                                    search: false
                                });
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
                        buttonicon: "glyphicon glyphicon-check",
                        title: "Take case for undo action",
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
                                    url: msg.structure[2].urlTakeCase,
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

                    $('#' + msg.structure[2].idTable + '').jqGrid("navButtonAdd", "#pg_" + msg.structure[2].idTable + "_toppager", {
                        buttonicon: "glyphicon icon-libreoffice",
                        title: "Export to CSV",
                        caption: "",
                        position: "last",
                        onClickButton: exportToCSV2
                    });

                    function exportToCSV2() {
                        exportToCSVTable2(msg.structure[4].formidx0,
                            msg.structure[2].formidx0,
                            msg.structure[2].module,
                            msg.structure[2].prefixtbl,
                            msg.structure[2].prefixtbl + "form" + msg.structure[2].formidx0,
                            msg.structure[2].urlCsv);
                    }

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
                            multiselect: true,loadComplete: function () {
                                var colw = $('.table-responsive').width();
                                var cekCol = eval('[' + msg.structure[3].colNames + ']');
                                if(cekCol.length <= 3){
                                    $("#" + msg.structure[3].idTable).resizeColumn(msg.structure[3].keyfield, (colw - 100), true);
                                }
    
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
    
                                var where1 = "&w="+msg.structure[3].keyfield+"='" + $("#" + msg.structure[3].idTable).getRowData(parentRowKey)[msg.structure[3].keyfield] + "'";
                                // var childGridURL = encodeURI('./addons/base/loadstaticwhere.php?q=2&t=<?php echo $formx[4]->tablename; ?>&w=' + where1);
                                var childGridURL = encodeURI(msg.structure[4].urlLoadData + where1);
                                console.log(childGridURL);
                                var colw = $("#" + msg.structure[3].idTable).parent().width();
    
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
                                    cellEdit: false,
                                    cellurl: msg.structure[4].cellurl,
                                });
                                $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
                                    view: true,
                                    edit: false,
                                    add: false,
                                    del: false,
                                    search: false
                                });
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
                        buttonicon: "glyphicon glyphicon-check",
                        title: "Take case for undo action",
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
                                    url: msg.structure[3].urlTakeCase,
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

                    $('#' + msg.structure[3].idTable + '').jqGrid("navButtonAdd", "#pg_" + msg.structure[3].idTable + "_toppager", {
                        buttonicon: "glyphicon icon-libreoffice",
                        title: "Export to CSV",
                        caption: "",
                        position: "last",
                        onClickButton: exportToCSV3
                    });

                    function exportToCSV3() {
                        exportToCSVTable2(msg.structure[4].formidx0,
                            msg.structure[3].formidx0,
                            msg.structure[3].module,
                            msg.structure[3].prefixtbl,
                            msg.structure[3].prefixtbl + "form" + msg.structure[3].formidx0,
                            msg.structure[3].urlCsv);
                    }

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
