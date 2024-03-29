function getForm(urlServer){
    $("#loading").removeClass('hide');
    $.ajax({
        beforeSend : function(xhr){xhr.setRequestHeader('Authorization', "Bearer " + sessionStorage.token);},
        url : urlServer,
        dataType : "json",
        method : "GET",
        success : function(msg){
            $("#loading").addClass('hide');
            if (msg.status == "success") {
                $.get("./templates/ob/aformlifecycle.template?v=4", function(data){
                    var template = data.replaceAll("{{form_title}}", msg.structure[0].form_title);
                    template = template.replaceAll("{{id_table}}", msg.structure[0].id_table);
                    template = template.replaceAll("{{id_table1}}", msg.structure[2].id_table);
                    $("#mainContent").html(template);

                    $.ajaxSetup({
                        headers : {
                            'Authorization' : "Bearer " + sessionStorage.token
                        }
                    });

                    function checklength(value, minlength) {
                        if (value.length == minlength) {
                            return [true, "", ""];
                        } else {
                            return [false, "Minimum Length Jam Transaksi 4", ""];
                        }
                    }
                    
                    $("#"+msg.structure[0].id_table),
                        initDateEdit = function(elem) {
                            $(elem).datepicker({
                                //dateFormat: 'yy-mm-dd',
                                format: msg.structure[0].format_date2, 
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
                                    format: msg.structure[0].format_date2, 
                                    autoSize: true,
                                    changeYear: true,
                                    changeMonth: true,
                                    showWeek: true,
                                    showButtonPanel: true
                                });
                            }, 100);
                        };

                    var gridimgpath = 'themes/basic/images';

                    jQuery("#"+msg.structure[0].id_table).jqGrid({
                        url: msg.structure[0].url_load_data, 
                        datatype: "json",
                        mtype: "POST",
                        cmTemplate: {
                            editable: true,
                            autoResizable: true
                        },
                        iconSet: "fontAwesome", 
                        styleUI : 'Bootstrap',
                        colNames: eval('['+msg.structure[0].col_names+']'),
                        colModel: eval('['+msg.structure[0].col_model+']'),
                        rowNum: 10, 
                        rowList: [10, 20, 30, "10000:All"],
                        imgpath: gridimgpath,
                        autowidth: true,
                        pager: '#pager'+msg.structure[0].id_table,
                        toppager:true, 
                        sortname: msg.structure[0].sortname,
                        sortorder: "asc",  
                        editurl: msg.structure[0].edit_url,
                        height: "auto",
                        altRows: true,
                        rownumbers: true, 
                        forceFit : false,
                        shrinkToFit: false,  
                        colMenu : true,
                        responsive:true, 
                        viewrecords: true,
                        subGrid: true,
                        multiselect: true, 
                        subGridRowExpanded: showChildGrid,
                        subGridOptions : {
                            reloadOnExpand :false,
                            selectOnExpand : true 
                        },
                        ondblClickRow: function(rowid) {
                            $("#"+msg.structure[0].id_table).jqGrid('viewGridRow', rowid, {
                                width: 600,
                                recreateForm: true,
                                reloadAfterSubmit: true,
                                jqModal: true,
                                closeOnEscape: true,
                                bottominfo: "Fields marked with (*) are required",
                                processData: "Processing ..."
                            });
                        }
                    }).jqGrid('navGrid', '#pager'+msg.structure[0].id_table , {
                            excel:true,
                            search: true,
                            view: eval(msg.structure[0].view_permission),
                            edit: eval(msg.structure[0].edit_permission),
                            add: eval(msg.structure[0].add_permission),
                            del: eval(msg.structure[0].del_permission),
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
                                eval(msg.structure[0].hidden_form);
                            },
                            beforeShowForm: function(formid) {
                                eval(msg.structure[0].hidden_form);
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
                                eval(msg.structure[0].hidden_form);
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
                                var sr = jQuery("#"+msg.structure[0].id_table).jqGrid('getGridParam', 'selrow');
                                primarykey = jQuery("#"+msg.structure[0].id_table).jqGrid('getCell', jQuery("#"+msg.structure[0].id_table).jqGrid('getGridParam', 'selrow'), msg.structure[0].head_x);
                                retarr =eval('{'+msg.structure[0].sortname+':' +primarykey+'}');
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
                            showQuery: true
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
                            helppdffile: msg.structure[0].url_help_file,
                            helppage : msg.structure[0].help_page,
                            helptext: msg.structure[0].help_text
                        } //Help,
                    );
                    
                    
                    //jQuery("#<?php echo "form".$formidx[0].$idmenu; ?>").jqGrid('setFrozenColumns'); 
                    //jQuery("#<?php echo "form".$formidx[0].$idmenu; ?>").jqGrid('gridResize',{minWidth:350,maxWidth:jQuery('#mainContent').innerWidth(),minHeight:80, maxHeight:550});

                    //jQuery('#<?php echo "form".$formidx[0].$idmenu; ?>').jqGrid('setFrozenColumns'); 
                    jQuery('#'+msg.structure[0].id_table+'_toppager_center').remove();
                    jQuery('#'+msg.structure[0].id_table+'_toppager_right').remove();
                    jQuery('#pager'+msg.structure[0].id_table+'_left').remove();
          
                    $('#'+msg.structure[0].id_table).jqGrid("navSeparatorAdd","#pg_"+msg.structure[0].id_table+"_toppager",{
                        sepclass : 'ui-separator',sepcontent: ''
                    });
            
                    $('#'+msg.structure[0].id_table).jqGrid("navButtonAdd","#pg_"+msg.structure[0].id_table+"_toppager",{
                        buttonicon: "glyphicon icon-libreoffice",
                        title: "Export to CSV",
                        caption: "",
                        position: "last",
                        onClickButton: exportToCSV
                    });
                    $('#'+msg.structure[0].id_table).jqGrid("navButtonAdd","#pg_"+msg.structure[0].id_table+"_toppager",{
                        buttonicon: "glyphicon glyphicon-remove",
                        title: "Reject Data",
                        caption: "",
                        position: "first", 
                        onClickButton:function(){ 
                            var s; 
                            s = jQuery("#"+msg.structure[0].id_table).jqGrid('getGridParam','selarrrow');   
                            strprop='';
                            for (var i = 0; i < s.length; i++) {
                                colmod =jQuery("#"+msg.structure[0].id_table).jqGrid('getGridParam',"colModel");
                                data = jQuery("#"+msg.structure[0].id_table).jqGrid('getRowData',s[i]); 
                                
                                for (var x in colmod){
                    
                                    if(colmod[x].index==msg.structure[0].keyfield)
                                    {
                                        strprop=strprop + data[colmod[x].index]+',';
                    
                                        console.log(strprop);
                                    } 
                                }
                    
                            }
                    
                                strpropX = '';
                                if (strprop==''){
                                alert("Please Check Data Before Rejected...!");
                                return false;
                            }
                            else {
                                $("#loading").removeClass('hide');
                                //return to rejected
                                strpropX='id='+strprop;
                                $.ajax({
                                    type: "POST",
                                    dataType: "JSON",
                                    url: msg.structure[0].urlReject,
                                    data: strpropX,
                                    success: function(message){ 
                                        // replace session
                                        if (message.status == "success") {
                                            $("#"+msg.structure[0].id_table).trigger('reloadGrid');
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
                    $('#'+msg.structure[0].id_table).jqGrid("navButtonAdd","#pg_"+msg.structure[0].id_table+"_toppager",{
                        buttonicon: "glyphicon glyphicon-ok",
                        title: "Approvel Data",
                        caption: "",
                        position: "first", 
                        onClickButton:function(){ 
                            var s; 
                            s = jQuery("#"+msg.structure[0].id_table).jqGrid('getGridParam','selarrrow');   
                            strprop='';
                            for (var i = 0; i < s.length; i++) {
                                colmod =jQuery("#"+msg.structure[0].id_table).jqGrid('getGridParam',"colModel");
                                data = jQuery("#"+msg.structure[0].id_table).jqGrid('getRowData',s[i]); 
                                
                                for (var x in colmod){
                    
                                    if(colmod[x].index==msg.structure[0].keyfield)
                                    {
                                        strprop=strprop + data[colmod[x].index]+',';
                    
                                        console.log(strprop);
                                    } 
                                }
                    
                            }
                    
                                strpropX = '';
                                if (strprop==''){
                                alert("Please Check Data Before Approved...!");
                                return false;
                            }
                            else {
                                $("#loading").removeClass('hide');
                                //return to rejected
                                strpropX='id='+strprop;
                                $.ajax({
                                    type: "POST",
                                    dataType: "JSON",
                                    url: msg.structure[0].urlApprovel,
                                    data: strpropX,
                                    success: function(message){ 
                                        // replace session
                                        if (message.status == "success") {
                                            $("#"+msg.structure[0].id_table).trigger('reloadGrid');
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
                    /*
                    $('#<?php echo "form".$formidx[0].$idmenu; ?>').jqGrid('navButtonAdd',"#pg_<?php echo "form".$formidx[0].$idmenu; ?>_toppager",{
                            caption:"Export to Excel", 
                            onClickButton : function () { 
                                jQuery("#<?php echo "form".$formidx[0].$idmenu; ?>").excelExport();
                            } 
                        });
                    */                          
                                                
          
                    function exportToCSV(){
                        /*
                        $('#<?php echo "form".$formidx[0].$idmenu; ?>').tableExport(
                          {
                            fileName: "<?php echo "form".$formidx[0].$idmenu; ?>",
                            type:'csv', 
                            csvEnclosure: '"',
                            csvSeparator: ',',
                            csvUseBOM: false,
                            jsonScope: 'all',
                            consoleLog:true
                          }
                        );
                        */
                        exportToCSVTable($('#'+msg.structure[0].id_table),"","","","MDM_VW_GC_ORIG");
                    };
                    
                    function showChildGrid(parentRowID, parentRowKey) {
                        var childGridID = parentRowID + "_table";
                        var childGridPagerID = parentRowID + "_pager";

                        // send the parent row primary key to the server so that we know which grid to show
                        var keys=msg.structure[1].keys+"='"+parentRowKey+"'";
                       
                        var childGridURL = msg.structure[1].url_child_grid+'&w='+keys;

                
                        //childGridURL = childGridURL + "&parentRowID=" + encodeURIComponent(parentRowKey)
                        //alert(parentRowKey);
                        // add a table and pager HTML elements to the parent grid row - we will render the child grid here
                        $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

                        desired_width = $("#"+msg.structure[0].id_table).width();
                        desired_width -= 25;  // adjust this value as needed
                    
                        $("#" + childGridID).jqGrid({
                            url: childGridURL,
                            mtype: "GET",
                            datatype: "json",
                            colNames: eval('['+msg.structure[1].col_names+']'),
                            colModel: eval('['+msg.structure[1].col_model+']'),
                            autowidth: false,
                            // sortable: true,
                            width: desired_width, 
                            pager: "#" + childGridPagerID
                        });

                    }
                    $("#"+msg.structure[2].id_table),
                        initDateEdit = function(elem) {
                            $(elem).datepicker({
                                //dateFormat: 'yy-mm-dd',
                                format: msg.structure[2].format_date2, 
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
                                    format: msg.structure[2].format_date2, 
                                    autoSize: true,
                                    changeYear: true,
                                    changeMonth: true,
                                    showWeek: true,
                                    showButtonPanel: true
                                });
                            }, 100);
                        };

                    var gridimgpath = 'themes/basic/images';

                    jQuery("#"+msg.structure[2].id_table).jqGrid({
                        url: msg.structure[2].url_load_data, 
                        datatype: "json",
                        mtype: "POST",
                        cmTemplate: {
                            editable: true,
                            autoResizable: true
                        },
                        iconSet: "fontAwesome", 
                        styleUI : 'Bootstrap',
                        colNames: eval('['+msg.structure[2].col_names+']'),
                        colModel: eval('['+msg.structure[2].col_model+']'),
                        rowNum: 10, 
                        rowList: [10, 20, 30, "10000:All"],
                        imgpath: gridimgpath,
                        autowidth: true,
                        pager: '#pager'+msg.structure[2].id_table,
                        toppager:true, 
                        sortname: msg.structure[2].sortname,
                        sortorder: "asc",  
                        editurl: msg.structure[2].edit_url,
                        height: "auto",
                        altRows: true,
                        rownumbers: true, 
                        forceFit : false,
                        shrinkToFit: false,  
                        colMenu : true,
                        responsive:true, 
                        viewrecords: true,
                        subGrid: true,
                        multiselect: true, 
                        subGridRowExpanded: showChildGrid1,
                        subGridOptions : {
                            // load the subgrid data only once
                            // and the just show/hide
                            reloadOnExpand :false,
                            // select the row when the expand column is clicked
                            selectOnExpand : true 
                        },
                        ondblClickRow: function(rowid) {
                            $("#"+msg.structure[2].id_table).jqGrid('viewGridRow', rowid, {
                                width: 600,
                                recreateForm: true,
                                reloadAfterSubmit: true,
                                jqModal: true,
                                closeOnEscape: true,
                                bottominfo: "Fields marked with (*) are required",
                                processData: "Processing ..."
                            });
                        }
                    }).jqGrid('navGrid', '#pager'+msg.structure[2].id_table , {
                            excel:true,
                            search: true,
                            view: eval(msg.structure[2].view_permission),
                            edit: eval(msg.structure[2].edit_permission),
                            add: eval(msg.structure[2].add_permission),
                            del: eval(msg.structure[2].del_permission),
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
                                eval(msg.structure[2].hidden_form);
                            },
                            beforeShowForm: function(formid) {
                                eval(msg.structure[2].hidden_form);
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
                                eval(msg.structure[2].hidden_form);
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
                                var sr = jQuery("#"+msg.structure[2].id_table).jqGrid('getGridParam', 'selrow');
                                primarykey = jQuery("#"+msg.structure[2].id_table).jqGrid('getCell', jQuery("#"+msg.structure[2].id_table).jqGrid('getGridParam', 'selrow'), msg.structure[2].head_x);
                                retarr =eval('{'+msg.structure[2].sortname+':' +primarykey+'}');
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
                            showQuery: true
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
                            helppdffile: msg.structure[2].url_help_file,
                            helppage : msg.structure[2].help_page,
                            helptext: msg.structure[2].help_text
                        } //Help,
                    );
                    jQuery('#'+msg.structure[2].id_table+'_toppager_center').remove();
                    jQuery('#'+msg.structure[2].id_table+'_toppager_right').remove();
                    jQuery('#pager'+msg.structure[2].id_table+'_left').remove();
          
                    $('#'+msg.structure[2].id_table).jqGrid("navSeparatorAdd","#pg_"+msg.structure[2].id_table+"_toppager",{
                        sepclass : 'ui-separator',sepcontent: ''
                    });
            
                    $('#'+msg.structure[0].id_table).jqGrid("navButtonAdd","#pg_"+msg.structure[2].id_table+"_toppager",{
                        buttonicon: "glyphicon glyphicon-remove",
                        title: "Reject Data",
                        caption: "",
                        position: "first", 
                        onClickButton:function(){ 
                            var s; 
                            s = jQuery("#"+msg.structure[2].id_table).jqGrid('getGridParam','selarrrow');   
                            strprop='';
                            for (var i = 0; i < s.length; i++) {
                                colmod =jQuery("#"+msg.structure[2].id_table).jqGrid('getGridParam',"colModel");
                                data = jQuery("#"+msg.structure[2].id_table).jqGrid('getRowData',s[i]); 
                                
                                for (var x in colmod){
                    
                                    if(colmod[x].index==msg.structure[2].keyfield)
                                    {
                                        strprop=strprop + data[colmod[x].index]+',';
                    
                                        console.log(strprop);
                                    } 
                                }
                    
                            }
                    
                                strpropX = '';
                                if (strprop==''){
                                alert("Please Check Data Before Rejected...!");
                                return false;
                            }
                            else {
                                $("#loading").removeClass('hide');
                                //return to rejected
                                strpropX='id='+strprop;
                                $.ajax({
                                    type: "POST",
                                    dataType: "JSON",
                                    url: msg.structure[2].urlReject,
                                    data: strpropX,
                                    success: function(message){ 
                                        // replace session
                                        if (message.status == "success") {
                                            $("#"+msg.structure[2].id_table).trigger('reloadGrid');
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
                    $('#'+msg.structure[2].id_table).jqGrid("navButtonAdd","#pg_"+msg.structure[2].id_table+"_toppager",{
                        buttonicon: "glyphicon glyphicon-ok",
                        title: "Approvel Data",
                        caption: "",
                        position: "first", 
                        onClickButton:function(){ 
                            var s; 
                            s = jQuery("#"+msg.structure[2].id_table).jqGrid('getGridParam','selarrrow');   
                            strprop='';
                            for (var i = 0; i < s.length; i++) {
                                colmod =jQuery("#"+msg.structure[2].id_table).jqGrid('getGridParam',"colModel");
                                data = jQuery("#"+msg.structure[2].id_table).jqGrid('getRowData',s[i]); 
                                
                                for (var x in colmod){
                    
                                    if(colmod[x].index==msg.structure[2].keyfield)
                                    {
                                        strprop=strprop + data[colmod[x].index]+',';
                    
                                        console.log(strprop);
                                    } 
                                }
                    
                            }
                    
                                strpropX = '';
                                if (strprop==''){
                                alert("Please Check Data Before Approved...!");
                                return false;
                            }
                            else {
                                $("#loading").removeClass('hide');
                                //return to rejected
                                strpropX='id='+strprop;
                                $.ajax({
                                    type: "POST",
                                    dataType: "JSON",
                                    url: msg.structure[2].urlApprovel,
                                    data: strpropX,
                                    success: function(message){ 
                                        // replace session
                                        if (message.status == "success") {
                                            $("#"+msg.structure[2].id_table).trigger('reloadGrid');
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
                    
                    function showChildGrid1(parentRowID, parentRowKey) {
                        var childGridID = parentRowID + "_table";
                        var childGridPagerID = parentRowID + "_pager";

                        // send the parent row primary key to the server so that we know which grid to show
                        var keys=msg.structure[3].keys+"='"+parentRowKey+"'";
                       console.log(keys)
                        var childGridURL = msg.structure[3].url_child_grid+'&w='+keys;

                
                        //childGridURL = childGridURL + "&parentRowID=" + encodeURIComponent(parentRowKey)
                        //alert(parentRowKey);
                        // add a table and pager HTML elements to the parent grid row - we will render the child grid here
                        $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

                        desired_width = $("#"+msg.structure[2].id_table).width();
                        desired_width -= 25;  // adjust this value as needed
                    
                        $("#" + childGridID).jqGrid({
                            url: childGridURL,
                            mtype: "GET",
                            datatype: "json",
                            colNames: eval('['+msg.structure[3].col_names+']'),
                            colModel: eval('['+msg.structure[3].col_model+']'),
                            autowidth: false,
                            // sortable: true,
                            width: desired_width, 
                            pager: "#" + childGridPagerID
                        });

                    }

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

