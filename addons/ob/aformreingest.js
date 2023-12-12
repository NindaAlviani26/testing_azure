
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

                $.get("./templates/ob/aformreingest.template?v=1", function (data) {
                    var template = data.replaceAll("{{formtitle}}", msg.structure.formtitle);
                    template = template.replaceAll("{{idTable}}", msg.structure.idTable);
                    $("#mainContent").html(template);

                    function checklength(value, minlength) {
                        if (value.length == minlength) {
                            return [true, "", ""];
                        } else {
                            return [false, "Minimum Length Jam Transaksi 4", ""];
                        }
                    }

                    function exportToCSV2(){
                        exportToCSVTable(jQuery('#'+msg.structure.idTable),
                            msg.structure.formidx0,
                            msg.structure.module,
                            msg.structure.prefixtbl,
                            msg.structure.prefixtbl + "form" + msg.structure.formidx0,
                            msg.structure.urlExportCsv);        
                    }

                    $("#"+msg.structure.idTable),
                    initDateEdit = function(elem) {
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
                    initDateSearch = function(elem) {
                        setTimeout(function() {
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

                    $.ajaxSetup({
                        headers : {
                            'Authorization' : "Bearer " + sessionStorage.token
                        }
                    });

                    jQuery("#"+msg.structure.idTable).jqGrid({
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
                        styleUI : 'Bootstrap',
                        colNames: eval('['+msg.structure.colNames+']'),
                        colModel: eval('['+msg.structure.colModel+']'),
                        rowNum: 10,
                        autoResizing: {
                            compact: true
                        },
                        rowList:[10, 20, 30, 50, 100],
                        imgpath: gridimgpath,
                        autowidth: true,
                        pager: '#pager'+msg.structure.idTable,
                        toppager:true, 
                        sortname: msg.structure.sortname,
                        sortorder: "asc", 
                        viewrecords: true,
                        editurl: msg.structure.editurl,
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
                            $("#"+ msg.structure.idTable).jqGrid('viewGridRow', rowid, {
                                width: 600,
                                recreateForm: true,
                                reloadAfterSubmit: true,
                                jqModal: true,
                                closeOnEscape: true,
                                bottominfo: "Fields marked with (*) are required",
                                processData: "Processing ...",
                                beforeShowForm: function(formid) {
                                    eval(msg.structure.viewDetailGrid);
                                }
                            });
                        }
                    }).jqGrid('navGrid', '#pager'+ msg.structure.idTable , {
                        excel:true,
                        search: true,
                        view: eval(msg.structure.viewpermission),
                        edit: false,
                        add: false,
                        del: false,
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
                            eval(msg.structure.hiddenForm);
                        },
                        beforeShowForm: function(formid) {
                            eval(msg.structure.hiddenForm);
                                //$("#tr_FRNPEMINJAM",id).hide(); 
                            },
                            afterSubmit: function(serverResponse, xhr, postdata) {
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
                                eval(msg.structure.hiddenForm);
                            },
                            onclickSubmit: function(params, postdata) {
                                return true;
                            },
                            afterSubmit: function(serverResponse, xhr, postdata) {
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
                            dataheight:'150px',
                            recreateForm: false,
                            reloadAfterSubmit: true,
                            jqModal: true,
                            closeOnEscape: true,
                            onclickSubmit: function(eparams) {
                                var retarr = {}; // we can use all the grid methods here //to obtain some data 
                                var sr = jQuery("#"+ msg.structure.idTable).jqGrid('getGridParam', 'selrow');
                                primarykey = jQuery("#"+msg.structure.idTable ).jqGrid('getCell', jQuery("#"+msg.structure.idTable).jqGrid('getGridParam', 'selrow'), msg.structure.keyfield);
                                retarr = eval("{"+msg.structure.keyfield+" : "+primarykey+"}");
                                return retarr;
                            },
                            afterSubmit: function(serverResponse, xhr, postdata) {  

                                var result = JSON.parse(serverResponse.responseText);
                                
                                if(result.success == "success"){
                                    sessionStorage.setItem("token",result.token.refresh);
                                    alert(result.info); 
                                }else{
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
                            dataheight:'360px',
                            recreateForm: false,
                            reloadAfterSubmit: true,
                            jqModal: true,
                            modal: true,
                            closeOnEscape: true,
                            bottominfo: "Fields marked with (*) are required",
                            processData: "Processing ...",
                            beforeShowForm: function(formid) {
                                eval(msg.structure.viewDetailGrid);
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
                            helppdffile: msg.structure.urlhelpfile,
                            helppage :msg.structure.helppage,
                            helptext: msg.structure.helpheadertitle
                        } //Help,
                        );

                        jQuery('#'+msg.structure.idTable+'_toppager_center').remove();
                        jQuery('#'+msg.structure.idTable+'_toppager_right').remove();
                        jQuery('#pager'+msg.structure.idTable+'_left').remove();


                    $('#'+msg.structure.idTable).jqGrid("navButtonAdd","#pg_"+msg.structure.idTable+"_toppager",{
                        buttonicon: "glyphicon glyphicon-remove",
                        title: "Reject Data",
                        caption: "",
                        position: "first", 
                        onClickButton:function(){ 

                            var s; 
                            s = jQuery("#"+msg.structure.idTable).jqGrid('getGridParam','selarrrow');   
                            strprop='';
                            for (var i = 0; i < s.length; i++) {
                               colmod =jQuery("#"+msg.structure.idTable).jqGrid('getGridParam',"colModel");
                               data = jQuery("#"+msg.structure.idTable).jqGrid('getRowData',s[i]); 
                               for (var x in colmod){

                                   if(colmod[x].index==msg.structure.keyfield)
                                   {
                                       strprop=strprop + data[colmod[x].index]+',';

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
                                console.log(strpropX);
                                $.ajax({
                                    type: "POST",
                                    dataType: "JSON",
                                    url: msg.structure.urlReject,
                                    data: strpropX,
                                    success: function(message){ 
                                        // replace session
                                        if (message.status == "success") {
                                            $("#"+msg.structure.idTable).trigger('reloadGrid');
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

                    $('#'+msg.structure.idTable).jqGrid("navButtonAdd","#pg_"+msg.structure.idTable+"_toppager",{
                        buttonicon: "glyphicon glyphicon-ok",
                        title: "Approval Data",
                        caption: "",
                        position: "first", 
                        onClickButton:function(){ 

                            var s; 
                            s = jQuery("#"+msg.structure.idTable).jqGrid('getGridParam','selarrrow');  

                            strprop='';
                            for (var i = 0; i < s.length; i++) {
                               colmod =jQuery("#"+msg.structure.idTable).jqGrid('getGridParam',"colModel");
                               data = jQuery("#"+msg.structure.idTable).jqGrid('getRowData',s[i]); 

                               for (var x in colmod){

                                   if(colmod[x].index==msg.structure.keyfield)
                                   {   
                                       strprop=strprop + data[colmod[x].index]+',';

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
                                //return to approval
                                
                                strpropX='id='+strprop;

                                $.ajax({
                                    type: "POST",
                                    dataType: "JSON",
                                    url: msg.structure.urlApprovel,
                                    data: strpropX,
                                    success: function(message){ 
                                        
                                        // replace session
                                        if (message.status == "success") {
                                            $("#"+msg.structure.idTable).trigger('reloadGrid');
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

                    $('#'+msg.structure.idTable).jqGrid("navSeparatorAdd","#pg_"+msg.structure.idTable+"_toppager",{
                        sepclass : 'ui-separator',sepcontent: ''
                    });

                    $('#'+msg.structure.idTable).jqGrid("navButtonAdd","#pg_"+msg.structure.idTable+"_toppager",{
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
                    $('#'+msg.structure.idTable).jqGrid("setGridWidth", width);
                }).trigger('resize');

                $('.sidebar-toggle').on('click', function() { 
                    if ($('.main-sidebar').width() > 60) { 
                        $('#'+msg.structure.idTable).jqGrid("setGridWidth", $(window).innerWidth() - 95);
                    } else {
                        $('#'+msg.structure.idTable).jqGrid("setGridWidth", $(window).innerWidth() - 275);
                    }
                });
            });

            }else {

                alert(msg.info);

            }
        },
        error : function(msg){
            console.log(msg);
        }
    })
}
