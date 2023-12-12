function getForm(urlServer){
    $("#loading").removeClass('hide');
    $.ajax({
        beforeSend: function(xhr){
            xhr.setRequestHeader('Authorization', "Bearer "+sessionStorage.token);
        },
        url : urlServer,
        dataType : "json",
        method : "GET",
        success : function(msg){
            $("#loading").addClass('hide');
            if(msg.status == "success"){
                $.get("./templates/ob/aformstgupload.template?v=1", function(data){
                    var template = data.replaceAll("{{form_title}}", msg.structure.form_title);
                    template = template.replaceAll("{{id_table}}", msg.structure.id_table);
                    $("#mainContent").html(template);

                    function checklength(value, minlength) {
                        if (value.length == minlength) {
                            return [true, "", ""];
                        } else {
                            return [false, "Minimum Length Jam Transaksi 4", ""];
                        }
                    }

                    $.ajaxSetup({
                        headers : {
                            'Authorization' : "Bearer " +sessionStorage.token
                        }
                    });
                    
                    function exportToCSV2(){
                       exportToCSVTable(jQuery('#'+msg.structure.id_table),
                            msg.structure.form_idx,
                            msg.structure.id_module,
                            msg.structure.prefix_table,
                            msg.structure.prefix_table + "form" + msg.structure.form_idx,
                            msg.structure.url_export_csv);       
                    }

                    $("#"+msg.structure.id_table),
                        initDateEdit = function(elem) {
                            $(elem).datepicker({
                                //dateFormat: 'Y-m-d',
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
                                    //dateFormat: 'Y-m-d',
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

                    jQuery("#"+msg.structure.id_table).jqGrid({
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
                        pager: '#pager'+msg.structure.id_table,
                        toppager:true, 
                        sortname: msg.structure.sortname,
                        sortorder: "asc", 
                        viewrecords: true,
                        editurl: msg.structure.edit_url,
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
                            $("#"+msg.structure.id_table).jqGrid('viewGridRow', rowid, {
                                width: 600,
                                recreateForm: true,
                                reloadAfterSubmit: true,
                                jqModal: true,
                                closeOnEscape: true,
                                bottominfo: "Fields marked with (*) are required",
                                processData: "Processing ...",
                                beforeShowForm: function(formid) {
                                    eval(msg.structure.view_detail_grid);
                                }
                            });
                        }
                    }).jqGrid('navGrid', '#pager'+msg.structure.id_table , {
                            excel:true,
                            search: true,
                            view: msg.structure.view_permission,
                            edit: msg.structure.edit_permission,
                            add: msg.structure.add_permission,
                            del: msg.structure.del_permission,
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
                                    alert('Update Data Successfully');
                                    return [true, "", ""];
                                }
                                if ($.trim(serverResponse.responseText) != '0') {
                                    alert(serverResponse.responseText);
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
                                eval(msg.structure.hidden_form);
                            },
                            onclickSubmit: function(params, postdata) {
                                return true;
                            },
                            afterSubmit: function(serverResponse, xhr, postdata) {
                                if ($.trim(serverResponse.responseText) == '0') {
                                    alert('Insert Data Successfully');
                                    return [true, "", ""];
                                }
                                if ($.trim(serverResponse.responseText) != '0') {
                                    alert(serverResponse.responseText);
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
                                var sr = jQuery("#"+msg.structure.id_table).jqGrid('getGridParam', 'selrow');
                                primarykey = jQuery("#"+msg.structure.id_table).jqGrid('getCell', jQuery("#"+msg.structure.id_table).jqGrid('getGridParam', 'selrow'), msg.structure.key_field);
                                retarr = eval('{'+msg.structure.key_field+' : '+primarykey+'}');
                                return retarr;
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
                                eval(msg.structure.view_detail_grid);
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
                            helppdffile: msg.structure.url_help_file,
                            helppage :msg.structure.help_page,
                            helptext: msg.structure.help_text
                        } //Help,
                    );
                     
                    jQuery('#'+msg.structure.id_table+'_toppager_center').remove();
                    jQuery('#'+msg.structure.id_table+'_toppager_right').remove();
                    jQuery('#pager'+msg.structure.id_table+'_left').remove();
                    
                    $('#'+msg.structure.id_table).jqGrid("navButtonAdd","#pg_"+msg.structure.id_table+"_toppager",{
                    buttonicon: "glyphicon glyphicon-remove",
                    title: "Reject Data",
                    caption: "",
                    position: "first", 
                    onClickButton:function(){ 
                    
                        var s; 
                        s = jQuery("#"+msg.structure.id_table).jqGrid('getGridParam','selarrrow');   
                            strprop='';
                              for (var i = 0; i < s.length; i++) {
                                colmod =jQuery("#"+msg.structure.id_table).jqGrid('getGridParam',"colModel");
                                data = jQuery("#"+msg.structure.id_table).jqGrid('getRowData',s[i]); 
                                for (var x in colmod){
                                     
                                    if(colmod[x].index==msg.structure.key_field)
                                    {
                                        strprop=strprop + data[colmod[x].index]+',';
                                         
                                    } 
                                }
                                  
                            }
                              
                            //alert(strprop);
                            strpropX = '';
                            if (strprop==''){
                                alert("Please Check Data Before Approved...!");
                                return false;
                            }
                            else {
                                //return to rejected
                                strpropX='id='+strprop;
                                 
                                $.ajax({
                                    type: "POST",
                                    url: msg.structure.url_rejected,
                                    data: strpropX,
                                    success: function(message){ 
                                        // replace session
                                        if (message.status == "success") {
                                            $("#"+msg.structure.id_table).trigger('reloadGrid');
                                            sessionStorage.setItem("token", message.token.refresh);
                                            alert(message.info);
                                        } else {
                                            alert(message.info);
                                        }
                                        return [true, "", ""];
                                        // end replace session
                                        // alert(message.info);
                                        // // alert("Rejected Data Successfully... !");
                                        // $("#"+msg.structure.id_table).trigger('reloadGrid');
                                        // //if ($.trim(msg)!='0'){
                                        // $("#"+msg.structure.id_table).trigger('reloadGrid'); 
                                        //       //}
                                    }, error: function(message){
                                        console.log(message);
                                    }
                                });  
                            }
                            //alert(strpropX);
                              
                        } 
                    });
                        
                    $('#'+msg.structure.id_table).jqGrid("navButtonAdd","#pg_"+msg.structure.id_table+"_toppager",{
                    buttonicon: "glyphicon glyphicon-ok",
                    title: "Auth Data",
                    caption: "",
                    position: "first", 
                    onClickButton:function(){ 
                    
                        var s; 
                        s = jQuery("#"+msg.structure.id_table).jqGrid('getGridParam','selarrrow');  

                            strprop='';
                            for (var i = 0; i < s.length; i++) {
                                colmod =jQuery("#"+msg.structure.id_table).jqGrid('getGridParam',"colModel");
                                data = jQuery("#"+msg.structure.id_table).jqGrid('getRowData',s[i]); 
                                 
                                for (var x in colmod){
                                     
                                    if(colmod[x].index==msg.structure.key_field)
                                    {   
                                        strprop=strprop + data[colmod[x].index]+',';
                                         
                                    } 
                                }
                                  
                            }
                              
                            //   alert(data[0]);
                            strpropX = '';
                            if (strprop==''){
                                alert("Please Check Data Before Approved...!");
                                return false;
                            }
                            else {
                                //return to approval
                                
                                strpropX='id='+strprop;
                                 
                                $.ajax({
                                    type: "POST",
                                    url: msg.structure.url_approval,
                                    data: strpropX,
                                    success: function(message){ 
                                        // replace session
                                        if (message.status == "success") {
                                            $("#"+msg.structure.id_table).trigger('reloadGrid');
                                            sessionStorage.setItem("token", message.token.refresh);
                                            alert(message.info);
                                        } else {
                                            alert(message.info);
                                        }
                                        return [true, "", ""];
                                        // end replace session

                                        // alert(message.info);
                                        // // alert("Approved Data Successfully... !");
                                        // $("#"+msg.structure.id_table).trigger('reloadGrid');
                                        // //if ($.trim(msg)!='0'){
                                        // $("#"+msg.structure.id_table).trigger('reloadGrid'); 
                                        //       //}
                                        
                                    }, error: function(message){
                                        console.log(message);
                                    }
                                });  
                            }
                            //alert(strpropX);    
                        } 
                    });
          
                    $('#'+msg.structure.id_table).jqGrid("navSeparatorAdd","#pg_"+msg.structure.id_table+"_toppager",{
                        sepclass : 'ui-separator',sepcontent: ''
                    });
            
                    $('#'+msg.structure.id_table).jqGrid("navButtonAdd","#pg_"+msg.structure.id_table+"_toppager",{
                        buttonicon: "glyphicon icon-libreoffice",
                        title: "Export to CSV",
                        caption: "",
                        position: "last",
                        onClickButton: exportToCSV2
                    });
                    /*
                    $('#<?php echo "form".$formid.$idmenu; ?>').jqGrid('navButtonAdd',"#pg_<?php echo "form".$formid.$idmenu; ?>_toppager",{
                            caption:"Export to Excel", 
                            onClickButton : function () { 
                                jQuery("#<?php echo "form".$formid.$idmenu; ?>").excelExport();
                            } 
                        });
                    */                          

                    $(window).bind('resize', function() {
                        var width = $('.table-responsive').width();
                        $('#'+msg.structure.id_table).jqGrid("setGridWidth", width);
                    }).trigger('resize');

                    $('.sidebar-toggle').on('click', function() { 
                        if ($('.main-sidebar').width() > 60) { 
                            $('#'+msg.structure.id_table).jqGrid("setGridWidth", $(window).innerWidth() - 95);
                        } else {
                            $('#'+msg.structure.id_table).jqGrid("setGridWidth", $(window).innerWidth() - 275);
                        }
                    });
                    
                    function autocompleteFunc(elem, urlx, src) {
                        setTimeout(function () {
                            $(elem).typeahead({ 
                                appendTo : "body",
                                autoSelect: true,
                                source: function (query, result) {
                                    $.ajax({
                                        url: urlx,
                                        data: "query=" + query +"&src="+src,
                                        dataType: "json",
                                        type: "POST",
                                        success: function (data) { 
                                            result($.map(data, function (item) {
                                                return item;
                                            }));
                                        }
                                    });
                                },
                                displayText: function(item) {
                                    return item.label
                                },
                                afterSelect: function(item) {
                                    this.$element[0].value = item.id
                                } 
                            });
                        }, 50);
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

