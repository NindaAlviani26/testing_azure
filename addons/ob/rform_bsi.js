function getForm(urlServer){
    $("#loading").removeClass('hide');
    $.ajax({
        beforeSend : function(xhr){xhr.setRequestHeader('Authorization', "Bearer " + sessionStorage.token);},
        url : urlServer,
        dataType : "json",
        method : "GET",
        success : function(msg){
            $("#loading").addClass('hide');
            if(msg.status == 'success'){
                $.get( "./templates/base/rform.template?v=3", function( data ) {
                    var template = data.replaceAll("{{form_title}}", msg.structure.form_title);
                    template = template.replaceAll("{{id_table}}", msg.structure.id_table);
                    $( "#mainContent" ).html( template );

                    function checklength(value, minlength) {
                        if (value.length == minlength) {
                            return [true, "", ""];
                        } else {
                            return [false, "Minimum Length Jam Transaksi 4", ""];
                        }
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


                    $.ajaxSetup({
                        headers : {
                            'Authorization' : "Bearer " + sessionStorage.token
                        }
                    });

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
                        //multiselect: true, 
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
                                //     alert(serverResponse.responseText);
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
                                //     alert(serverResponse.responseText);
                                //     return false;
                                // } else {
                                //     return true;
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
                                var sr = jQuery("#"+msg.structure.id_table).jqGrid('getGridParam', 'selrow');
                                primarykey = jQuery("#"+msg.structure.id_table).jqGrid('getCell', jQuery("#"+msg.structure.id_table).jqGrid('getGridParam', 'selrow'), msg.structure.sortname);
                                retarr = eval('{'+msg.structure.sortname+ ' : ' +primarykey+'}');
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
                            helppage : msg.structure.help_page,
                            helptext: msg.structure.help_text
                        } //Help,
                    );
                    
                    
                    //jQuery("#<?php echo "form".$formid.$idmenu; ?>").jqGrid('setFrozenColumns'); 
                    //jQuery("#<?php echo "form".$formid.$idmenu; ?>").jqGrid('gridResize',{minWidth:350,maxWidth:jQuery('#mainContent').innerWidth(),minHeight:80, maxHeight:550});

                    //jQuery('#<?php echo "form".$formid.$idmenu; ?>').jqGrid('setFrozenColumns'); 
                    jQuery('#'+msg.structure.id_table+'_toppager_center').remove();
                    jQuery('#'+msg.structure.id_table+'_toppager_right').remove();
                    jQuery('#pager'+msg.structure.id_table+'_left').remove();
          
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
                                                
          
                    function exportToCSV(){
                        $('#'+msg.structure.id_table).tableExport(
                          {
                            fileName: msg.structure.id_table,
                            type:'csv', 
                            csvEnclosure: '"',
                            csvSeparator: ',',
                            csvUseBOM: false,
                            jsonScope: 'all',
                            consoleLog:true
                          }
                        );
                    };
                    
                    function exportToCSV2(){
                        exportToCSVTable($(
                            '#'+msg.structure.id_table),
                            msg.structure.form_id,
                            msg.structure.id_module,
                            msg.structure.prefix_table,
                            msg.structure.prefix_table+"form"+msg.structure.form_id,
                            msg.structure.url_export_csv
                            );
                    }



                    // get data filter hardcode
                    $.ajax({
                        url: serverHost + "addons/base/combodata.api?t=ob_cabang",
                        type: "GET",
                        dataType: "JSON",
                        success: function (result) {
                            var opt = "";
                            $.each(result.data, function(k, v) {
                                opt += "<option value='"+v.kode+"'>"+v.nama_cabang+"</option>";
                            });
                            $(".cabangData").append(opt);
                        }, error: function (e) {
                            console.log(e.info);
                        }
                    });

                    $.ajax({
                        url: serverHost + "addons/base/combodata.api?t=ob_area",
                        type: "GET",
                        dataType: "JSON",
                        success: function (result) {
                            var opt = "";
                            $.each(result.data, function(k, v) {
                                opt += "<option value='"+v.kode+"'>"+v.nama_area+"</option>";
                            });
                            $(".areaData").append(opt);
                        }, error: function (e) {
                            console.log(e.info);
                        }
                    });

                    $.ajax({
                        url: serverHost + "addons/base/combodata.api?t=ob_regional",
                        type: "GET",
                        dataType: "JSON",
                        success: function (result) {
                            var opt = "";
                            $.each(result.data, function(k, v) {
                                opt += "<option value='"+v.kode+"'>"+v.nama_regional+"</option>";
                            });
                            $(".regionalData").append(opt);
                        }, error: function (e) {
                            console.log(e.info);
                        }
                    });

                    $(".filterData").on("click", function(){
                        var cabang = $(".cabangData").val() == '' ? null : "kode_cabang='"+$(".cabangData").val()+"'";
                        var area = $(".areaData").val() == '' ? null : "kode_area='"+$(".areaData").val()+"'";
                        var regional = $(".regionalData").val() == '' ? null : "regional='"+$(".regionalData").val()+"'";
                        var where1= [cabang, area, regional];
                        var whereFix = [];
                        $.each(where1, function(key, value) { 
                            if(value != null){
                                whereFix.push(value);
                            }
                        });

                        if(whereFix.length == 0){
                            whereFix = "1=1";
                        }else{
                            whereFix = whereFix.join(" and ");
                        }

                        url1 = encodeURI(msg.structure.url_load_data + '&w='+whereFix);  
                        console.log(url1);
                        $("#"+msg.structure.id_table).jqGrid('clearGridData', true);
                        $("#"+msg.structure.id_table).jqGrid('setGridParam', { url: url1 });
                        $("#"+msg.structure.id_table).trigger("reloadGrid"); 
                    })
                    
                    
                    
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

                });

            }else{
                
                alert(msg.info);
            }
        },
        error : function(msg){
            console.log(msg);
        }
    })
}
