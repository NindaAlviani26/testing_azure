
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

                $.get("./templates/base/formstg.template?v=2", function (data) {
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

                    // start cascading =======
                    var data_property_null ={};
                    var nullable = '';
                    $.ajax({
                        beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', "Bearer " + sessionStorage.token); },
                        url: serverHost +"addons/base/cascading.api?t="+msg.structure.dataCombo,
                        dataType:'json',
                        method: "GET",
                        success: function(result_value){
                            // data_result.push(result_value.data_response);

                            // idmodule
                            var data_parent = result_value.data_responses[0];
                            // console.log(data_parent);

                            // formcode all
                            var data_child_all = result_value.data_responses[1];
                            // console.log(data_child_all);

                            // make property null {'':value}
                            data_property_null[nullable]=data_child_all;

                            // ambil key data_parent
                            var data_parent = [];
                            $.each(result_value.data_responses[0], function(key, value){
                                data_parent.push(key);
                            });

                        
                            var data_fix_value = {};
                            // request data detail
                            $.ajax({
                                beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', "Bearer " + sessionStorage.token); },
                                url: serverHost +"addons/base/cascading.api?t="+msg.structure.dataCombo[1]+"&dataParent="+data_parent,
                                dataType:'json',
                                method: "GET",
                                success: function(result_value_2){

                                    // loop untuk get data parent:{child}
                                    for(var xx=0; xx<result_value_2.data_responses.length; xx++){
                                        data_fix_value[data_parent[xx]] = result_value_2.data_responses[xx];
                                    }

                                    // add property kosong
                                    data_fix_value['']=data_property_null[''];
                                   
                                    // idmodule dan formcode
                                    // console.log(data_fix_value);

                                    // =========
                                    "use strict";
                                    $.jgrid.no_legacy_api = true;
                                    $.jgrid.useJSON = true;

                                    var data_child = $.extend({}, data_child_all);
                                    var alldata_parent = $.extend({"": "All"}, data_parent);
                                    var alldata_child = $.extend({"": "All"}, data_child),
                                        
                                        lastSel = -1,
                                        grid = $("#" + msg.structure.idTable),
                                        removeTheOptionAll = function (elem) {
                                            
                                            if (typeof elem === "object" && typeof elem.id === "string" && elem.id.substr(0, 3) !== "gs_") {
                                                // we are NOT in the searching bar
                                                $(elem).find("option[value=\"\"]").remove();
                                            }
                                        },
                                        resetDataChildValues = function () {
                                            // reset the "value" property of the editoptions property to the initial value
                                            grid.jqGrid("setColProp", "formcode", { editoptions: { value: data_child} });
                                        },
                                        setChildValues = function (parentId) {
                                            // to have short list of options which corresponds to the country
                                            // from the row we have to change "value" property of the editoptions property
                                            // of the column temporary to new value
                                            grid.jqGrid("setColProp", "formcode", { editoptions: { value: data_fix_value[parentId]} });
                                        },
                                        changeDataChildSelect = function (parentId, parentElem) {
                                            // build "state" options based on the selected "country" value
                                            var childId, dataChildSelect, parentWidth, $row,
                                                $parentElem = $(parentElem),
                                                sc = data_fix_value[parentId],
                                                isInSearchToolbar = $parentElem.parent().parent().parent().hasClass("ui-common-table"),
                                                // newOptions = isInSearchToolbar ? "<option value=\"\">All</option>" : "";

                                                newOptions = "<option value=\"\">__Please Select__</option>";

                                            for (childId in sc) {
                                                if (sc.hasOwnProperty(childId)) {
                                                    
                                                    newOptions += "<option role=\"option\" value=\"" + childId + "\">" +
                                                        data_child[childId] + "</option>";
                                                }
                                            }

                                            setChildValues(parentId);

                                            // populate the subset of contries
                                            if (isInSearchToolbar) {
                                                // searching toolbar
                                                $row = $parentElem.closest("tr.FormData");
                                                dataChildSelect = $row.find(">td.DataTD select#formcode");
                                                parentWidth = dataChildSelect.parent().width();
                                                dataChildSelect.html(newOptions).css({width: parentWidth});
                                            } else if ($parentElem.is(".FormElement")) {
                                                // form editing
                                                $row=$parentElem.closest("form.FormGrid").find("select#formcode.FormElement").html(newOptions);
                                            } 
                                            // else {
                                            //     // inline editing
                                            //     $row = $parentElem.closest("tr.jqgrow");
                                            //     $("select#formcode").html(newOptions);
                                            // }
                                        },
                                            
                                        editGridRowOptions = {
                                            recreateForm: true,
                                            onclickPgButtons: function (whichButton, $form, rowid) {
                                                var $row = $("#" + $.jgrid.jqID(rowid)), parentId;
                                                if (whichButton === "next") {
                                                    $row = $row.next();
                                                } else if (whichButton === "prev") {
                                                    $row = $row.prev();
                                                }
                                                if ($row.length > 0) {
                                                    parentId = grid.jqGrid("getCell", $row.attr("id"), "idmodule");
                                                    changeDataChildSelect(parentId, $("#idmodule")[0]);
                                                }
                                            },
                                            onClose: function () {
                                                resetDataChildValues();
                                            }
                                        },

                                        dataInitParent = function (elem) { setChildValues($(elem).val()); },
                                        
                                        dataEventsParent = [ { type: "change", fn: function (e) { changeDataChildSelect($(e.target).val(), e.target); } }];
                                        // end cascading =========

                                        jQuery("#" + msg.structure.idTable).jqGrid({
                                            url: msg.structure.urlLoadData,
                                            datatype: "json",
                                            mtype: "POST",
                                            // data: mydata,
                                            // datatype: "local",
                    
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
                    
                                            // =========
                                            // colNames: [ "Name", "Country", "State" ],
                                            // colModel: [
                                            //     { name: "name", width: 200, editable: true },
                                            //     { name: "country", width: 100, editable: true, formatter: "select", stype: "select", edittype: "select",
                                            //         searchoptions: {
                                            //             value: alldata_parent,
                                            //             dataInit: removeTheOptionAll,
                                            //             dataEvents: [
                                            //                 { type: "change", fn: function (e) { changeDataChildSelect($(e.target).val(), e.target); } },
                                            //                 { type: "keyup", fn: function (e) { $(e.target).trigger("change"); } }
                                            //             ]
                                            //         },
                                            //         editoptions: {
                                            //             value: data_parent,
                                            //             dataInit: function (elem) { setChildValues($(elem).val()); },
                                            //             dataEvents: [
                                            //                 { type: "change", fn: function (e) { changeDataChildSelect($(e.target).val(), e.target); } },
                                            //                 { type: "keyup", fn: function (e) { $(e.target).trigger("change"); } }
                                            //             ]
                                            //         }},
                                            //     { name: "state", width: 100, formatter: "select", stype: "select",
                                            //         editable: true, edittype: "select", editoptions: { value: data_child },
                                            //         searchoptions: { value: alldata_child, dataInit: removeTheOptionAll } }
                                            // ],

                                            // bagian dari cascading
                                            onSelectRow: function (id) {
                                                if (id && id !== lastSel) {
                                                    if (lastSel !== -1) {
                                                        $(this).jqGrid("restoreRow", lastSel);
                                                        resetDataChildValues();
                                                    }
                                                    lastSel = id;
                                                }
                                            },
                                            // end bagian dari cascading
                                            
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
                                            loadonce: false,
                                            loadComplete: function (response) {
                                                loadData = response.data;
                                                // $('#idmodule').on('change',function(){
                                                //     var option_module = $(this).val();
                                                //     console.log(option_module);
                                                    
                                                // });
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
                    
                    
                                        // export to excel
                                        $('#' + msg.structure.idTable).jqGrid("navButtonAdd", "#pg_" + msg.structure.idTable + "_toppager", {
                                            buttonicon: "glyphicon glyphicon-cloud-download",
                                            title: "Download Excel",
                                            caption: "",
                                            position: "last",
                                            onClickButton: exportToCSV2
                                        });
                    
                                        function exportToCSV2() {
                                            
                                            exportToXLSTable($('#' + msg.structure.idTable),
                                                msg.structure.formidx0,
                                                msg.structure.module,
                                                msg.structure.prefixtbl,
                                                msg.structure.prefixtbl + "form" + msg.structure.formidx0,
                                                msg.structure.urlExportXls);
                                        }
                    
                                        // upload
                                        $('#' + msg.structure.idTable).jqGrid("navButtonAdd", "#pg_" + msg.structure.idTable + "_toppager", {
                                            buttonicon: "glyphicon glyphicon-cloud-upload",
                                            title: "Upload Excel",
                                            caption: "",
                                            position: "last",
                                            onClickButton: null
                                        });
                    
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
                                },
                                error: function(e){
                                    console.log(e);
                                }
                            });
                            
                        },
                        error: function(e){
                            console.log(e);
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
