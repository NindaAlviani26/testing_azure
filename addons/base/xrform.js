function getForm(urlServer){
    $("#loading").removeClass('hide');
    $.ajax({
        beforeSend: function(xhr){xhr.setRequestHeader('Authorization', "Bearer " + sessionStorage.token);},
        url : urlServer,
        dataType : "json",
        method : "GET",
        success : function(msg){
            $("#loading").addClass('hide');
            if (msg.status == "success") {
                $.get("./templates/base/xrform.template?v=2", function(data){
                    var template = data.replaceAll("{{form_title}}", msg.structure.form_title);
                    template = template.replaceAll("{{table_name}}", msg.structure.table_name);
                    $("#mainContent").html(template);

                    function checklength(value, minlength) {
                        if (value.length == minlength) {
                            return [true, "", ""];
                        } else {
                            return [false, "Minimum Length Jam Transaksi 4", ""];
                        }
                    }

                    $("#"+ msg.structure.table_name),
                        initDateEdit = function(elem) {
                            $(elem).datepicker({
                                //dateFormat: 'yy-mm-dd',
                                format: msg.structure.format_date2, 
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
                                    //dateFormat: 'yy-mm-dd',
                                    format: msg.structure.format_date2, 
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
                    jQuery("#"+ msg.structure.table_name).jqGrid({
                        url: msg.structure.url_load_data, 
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
                        colNames: eval('['+msg.structure.col_names+']'),
                        colModel: eval('['+msg.structure.col_model+']'),
                        rowNum: 10,
                        autoResizing: {
                            compact: true
                        },
                        rowList: [10, 20, 30, "10000:All"],
                        imgpath: gridimgpath,
                        autowidth: true,
                        pager: '#pager'+ msg.structure.table_name,
                        toppager:true, 
                        sortname: msg.structure.sortname,
                        sortorder: "asc", 
                        viewrecords: true,
                        //editurl: "./addons/base/saveformdata.php?f=<?php echo $formid; ?>&m=<?php echo $idmodule; ?>&p=<?php echo $prefixtbl; ?>",
                        editurl:msg.structure.edit_url,
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
                            $("#"+ msg.structure.table_name).jqGrid('viewGridRow', rowid, {
                                width: 600,
                                recreateForm: true,
                                reloadAfterSubmit: true,
                                jqModal: true,
                                closeOnEscape: true,
                                bottominfo: "Fields marked with (*) are required",
                                processData: "Processing ..."
                            });
                        }
                    }).jqGrid('navGrid', '#pager'+msg.structure.table_name , {
                            excel:true,
                            search: true,
                            view: eval(msg.structure.view_permission),
                            edit: eval(msg.structure.edit_permission),
                            add: eval(msg.structure.add_permission),
                            del: eval(msg.structure.del_permission),
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
                                eval(msg.structure.hidden_form);
                            },
                            beforeShowForm: function(formid) {
                                eval(msg.structure.hidden_form);
                                //$("#tr_FRNPEMINJAM",id).hide(); 
                            },
                            afterSubmit: function(serverResponse, xhr, postdata) {
                                if ($.trim(serverResponse.responseText) == '0') {
                                    return [true, "", ""];
                                }
                                if ($.trim(serverResponse.responseText) != '0') {
                                    var result = JSON.parse(serverResponse.responseText);
                                    if(result.success == "success"){
                                        sessionStorage.setItem("token",result.token.refresh);
                                        alert(result.info); 
                                    }else{
                                        alert(result.info); 
                                    }
                                    return false;
                                }
                                // if ($.trim(serverResponse.responseText) == '0') {
                                //     alert('Update Data Successfully');
                                //     return [true, "", ""];
                                // }
                                // if ($.trim(serverResponse.responseText) != '0') {
                                //     alert('#' + serverResponse.responseText);
                                //     return false;
                                // }
                            }
                        }, //edit
                        {
                            width: '600',
                            dataheight:'360px',
                            recreateForm: true,
                            reloadAfterSubmit: true,
                            checkOnSubmit: true,
                            closeAfterAdd: true, 
                            closeAfterEdit: true,
                            jqModal: true,
                            modal: true,
                            closeOnEscape: true,
                            bottominfo: "Fields marked with (*) are required",
                            onInitializeForm: function(formid) {
                                eval(msg.structure.hidden_form);
                            },
                            onclickSubmit: function(params, postdata) {
                                return true;
                            },
                            afterSubmit: function(serverResponse, xhr, postdata) {
                                if ($.trim(serverResponse.responseText) == '0') {
                                    return [true, "", ""];
                                }
                                if ($.trim(serverResponse.responseText) != '0') {
                                    var result = JSON.parse(serverResponse.responseText);
                                    if(result.success == "success"){
                                        sessionStorage.setItem("token",result.token.refresh);
                                        alert(result.info); 
                                    }else{
                                        alert(result.info); 
                                    }
                                    return false;
                                }
                                // if ($.trim(serverResponse.responseText) == '0') {
                                //     alert('Insert Data Successfully');
                                //     return [true, "", ""];
                                // }
                                // if ($.trim(serverResponse.responseText) != '0') {
                                //     alert('#' + serverResponse.responseText);
                                //     return [true, "", ""];
                                // }   
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
                                var sr = jQuery("#"+msg.structure.table_name).jqGrid('getGridParam', 'selrow');
                                primarykey = jQuery("#"+msg.structure.table_name).jqGrid('getCell', jQuery("#"+msg.structure.table_name).jqGrid('getGridParam', 'selrow'), msg.structure.sortname);
                                retarr = eval('{' +msg.structure.sortname+ ':'+primarykey+'}'); 
                                return retarr;
                            },
                            afterSubmit: function(serverResponse) {
                                if ($.trim(serverResponse.responseText) == '0') {
                                    return [true, "", ""];
                                }
                                if ($.trim(serverResponse.responseText) != '0') {
                                    var result = JSON.parse(serverResponse.responseText);
                                    if(result.success == "success"){
                                        sessionStorage.setItem("token",result.token.refresh);
                                        alert(result.info); 
                                    }else{
                                        alert(result.info); 
                                    }
                                    return false;
                                }
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
                            helppdffile: msg.structure.url_help_file,
                            helppage : msg.structure.help_page,
                            //helptext: "<?php echo $headertitle; ?>"
                        } //Help,
                    );
                     
                    jQuery('#'+msg.structure.table_name+'_toppager_center').remove(); 
                    jQuery('#pager'+msg.structure.table_name+'_left').remove();
          
                    $('#'+msg.structure.table_name).jqGrid("navSeparatorAdd","#pg_"+msg.structure.table_name+"_toppager",{
                        sepclass : 'ui-separator',sepcontent: ''
                    });
            
                    $('#'+msg.structure.table_name).jqGrid("navButtonAdd","#pg_"+msg.structure.table_name+"_toppager",{
                        buttonicon: "glyphicon icon-libreoffice",
                        title: "Export to CSV",
                        caption: "",
                        position: "last",
                        onClickButton: exportToCSV2
                    });     
          
                    function exportToCSV2(){
                        exportToCSVTable(
                                $('#'+msg.structure.table_name),
                                // msg.structure.url_export_csv,
                                msg.structure.id_module,
                                msg.structure.prefix_table,
                                msg.structure.table_name,
                                msg.structure.url_export_csv
                                );
                    }
                    
                 
                    $(window).bind('resize', function() {
                        var width = $('.table-responsive').width();
                        $('#'+ msg.structure.table_name).jqGrid("setGridWidth", width);
                    }).trigger('resize');

                    $('.sidebar-toggle').on('click', function() { 
                        if ($('.main-sidebar').width() > 60) { 
                            $('#'+msg.structure.table_name).jqGrid("setGridWidth", $(window).innerWidth() - 95);
                        } else {
                            $('#'+msg.structure.table_name).jqGrid("setGridWidth", $(window).innerWidth() - 275);
                        }
                    });

                });
            }else{
                alert(msg.info);
            }
        },
        error : function(msg){
            console.log(msg);
        }
    });
}