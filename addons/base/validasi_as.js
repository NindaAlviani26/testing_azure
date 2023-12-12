
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
                $.get("./templates/base/validasi_as.template?v=4", function (data) {
                    var template = data.replaceAll("{{formtitle}}", msg.structure.formtitle);
                    template = template.replaceAll("{{idTable}}", msg.structure.idTable);

                    $.ajaxSetup({
                        headers: {
                            'Authorization': "Bearer " + sessionStorage.token
                        }
                    });
                    

                    $("#mainContent").html(template);

                    $.get(serverHost + "addons/base/view_validasi_as.api?t=FIELDS&f="+msg.structure.formidx0, function(dataMsg){
						$(".form_generate").html(dataMsg);

						// select2
                        $('select.select-special').select2({
                            width: "100%",
                            placeholder: "__Please Select__",
                            allowClear :true,
                            
                        });
                        // end select2

                        // handle filter after on change periode laporan and reload grid
                        var value_periode_laporan = '';
                        var set_class ='';
                        var idsOfSelectedRows = []; 
                        $('#periodeLaporan').on('change',function(){
                            value_periode_laporan = $('#periodeLaporan').val();
                            set_class = $('#periodeLaporan').addClass('changed');
                            $.ajax({
                                url: urlServer,
                                type: "GET",
                                dataType: "JSON",
                                success: function (result) {
                                    
                                    jQuery("#" + result.structure.idTable).jqGrid('setGridParam',{url:result.structure.urlLoadData + "&periodeLaporan="+value_periode_laporan,page:1}).trigger("reloadGrid");
                                    $("#" + result.structure.idTable).trigger('reloadGrid');
                                    $('.gridTableGenerate').children()[0];
                                    
                                    // call function after on change periode laporan
                                    // loadGrid(result);

                                    // ketika di change maka checkbok clear
                                    idsOfSelectedRows = [];

                                }, error: function (e) {
                                    console.log(e);
                                }
                            });

                            
                        });
                        // end handle filter after on change periode laporan and reload grid
                       
                        // call function jqgrid
                        loadGrid(msg);

                        // data jqgrid in function
                        function loadGrid(param_msg){
                            $.get(serverHost + "addons/base/combopub.api?t=BRANCH", function(dataMsg){
                                $(".comboBranch").html(dataMsg);
                                $(".comboBranch select").attr("id", "idPelapor");
                                $(".comboBranch select").attr("name", "idPelapor");
                            });
                        
                            function checklength(value, minlength) {
                                if (value.length == minlength) {
                                    return [true, "", ""];
                                } else {
                                    return [false, "Minimum Length Jam Transaksi 4", ""];
                                }
                            }
                            
                            $("#" + param_msg.structure.idTable),
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
                            var $grid = $("#"+param_msg.structure.idTable); 
                            
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
                                url: param_msg.structure.urlLoadData+"&periodeLaporan="+value_periode_laporan,
                                datatype: "json",
                                mtype: "POST",
                                // property multiselect
                                multiselect: true,
                                
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
                                colNames: eval('[' + param_msg.structure.colNames + ']'),
                                colModel: eval('[' + param_msg.structure.colModel + ']'),
                                rowNum: 10,
                                autoResizing: {
                                    compact: true
                                },
                                rowList: [10, 20, 30, "10000:All"],
                                imgpath: gridimgpath,
                                autowidth: true,
                                pager: '#pager' + param_msg.structure.idTable,
                                toppager: true,
                                sortname: param_msg.structure.sortname,
                                sortorder: "asc",
                                viewrecords: true,
                                editurl: param_msg.structure.editurl,
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
                                multiselect: true,
                                ondblClickRow: function (rowid) {
                                    $("#" + param_msg.structure.idTable).jqGrid('viewGridRow', rowid, {
                                        width: 600,
                                        recreateForm: true,
                                        reloadAfterSubmit: true,
                                        jqModal: true,
                                        closeOnEscape: true,
                                        bottominfo: "Fields marked with (*) are required",
                                        processData: "Processing ...",
                                        beforeShowForm: function (formid) {
                                            eval(param_msg.structure.viewDetailGrid);
                                        }
                                    });
                                }
                            }).jqGrid('navGrid', '#pager' + param_msg.structure.idTable, {
                                excel: true,
                                search: true,
                                view: eval(param_msg.structure.viewpermission),
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
                                        eval(param_msg.structure.viewDetailGrid);
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
                                    helppdffile: param_msg.structure.urlhelpfile,
                                    helppage: param_msg.structure.helppage,
                                    helptext: param_msg.structure.helpheadertitle
                                } //Help,
                            );
                            
                            jQuery('#' + param_msg.structure.idTable + '_toppager_center').remove();
                            jQuery('#' + param_msg.structure.idTable + '_toppager_right').remove();
                            jQuery('#pager' + param_msg.structure.idTable + '_left').remove();
                        
                            
                            $("#btnSubmit").click(function () {
                                
                                // validate form
                                try{
                                    // ambil name yg ada di form
                                    var data_form_1 = document.forms["formGenerate"];
                                    var data_array = [].map.call(data_form_1, function(item) {
                                        return {name : item.name, value : item.value};
                                    });
                                    // end ambil name yg ada di form
                        
                                    $(".error").hide();
                        
                                    var data_value = [];
                                    var data_value_push = [];
                        
                                    for(var n=0; n < data_array.length-1 ; n++){
                                        data_value[n] = data_array[n].value;
                                        
                                        if(data_array[n].value==""){

                                            var label_name = $('[for='+data_array[n].name+']').text();
                                            label_name = label_name.split(' ');
                                            
                                            // hapus karakter * pada array
                                            label_name = $.grep(label_name, function(value){
                                                return value != '*';
                                            });

                                            label_name = label_name.join(' ');

                                            $("#"+data_array[n].name).after(`<small class='text-danger error'> Please enter your <b>`+label_name+`</b></small>`);
                                        
                                        }
                                        
                                        // check data value tidak kosong
                                        if(data_value[n] !==""){
                                            data_value_push.push(data_value[n]);
                                        }
                                        
                                    }
                                    // mengetahui length array default and push array
                                    var row_data_value = data_value.length;
                                    var row_data_value_push = data_value_push.length;
                        
                                }catch(e){
                                    console.log(e);
                                }
                                // end validate form
                        
                                var s;
                                s = jQuery("#" + param_msg.structure.idTable).jqGrid('getGridParam', 'selarrrow');
                                
                                strprop = '';
                                for (var i = 0; i < s.length; i++) {
                                    colmod = jQuery("#" + param_msg.structure.idTable).jqGrid('getGridParam', "colModel");
                                    data = jQuery("#" + param_msg.structure.idTable).jqGrid('getRowData', s[i]);
                        
                                    for (var x in colmod) {
                        
                                        if (colmod[x].index == param_msg.structure.keyfield) {
                                            strprop = strprop + data[colmod[x].index] + ',';
                        
                                        }
                                    }
                        
                                }
                        
                                strpropX = '';
                                if (strprop == '' ) {
                                    alert("Please Check Data Before Generate...!");
                                    return false;
                                }
                                // kondisi jika form filter tidak di isi
                                else if(row_data_value_push < row_data_value){
                                    alert("Please Check Data Before Generate...!");
                                    return false;
                                }
                                // end kondisi jika form filter tidak di isi
                                else {
                                    
                                    //return to generate
                                    var newDate = new Date();
                                    var file_name_zip = "generate_"+newDate.getTime();
                        
                                    strpropX = 'idForm=' + strprop;
                                    $("#loading").removeClass('hide');
                        
                                    // ambil name yg ada di form
                                    var data_form = $("#formGenerate").serialize();
                                    console.log(data_form);
                                    // end ambil name yg ada di form
                                    
                                    $.ajax({
                                        type: "POST",
                                        dataType: "JSON",
                                        // url: param_msg.structure.urlValidasi + "&idForm=" + strprop + "&id_operasional=" + id_operasional + "&id_pelapor=" + id_pelapor + "&periode_data=" + periode_data + "&periode_laporan=" + periode_laporan + "&file_name_text="+file_name_text,
                                        url: param_msg.structure.urlValidasi + "&idForm=" + updateIdsOfSelectedRows() + "&file_name_zip="+file_name_zip+"&"+data_form,
                                        
                                        success: function (message) {
                                            console.log(message.info);
                        
                                            // var file_location = serverHost + "generate/"+file_name_zip+".zip";
                                            // var link = document.createElement('a');
                                            // link.href = file_location;
                                            // link.download = true;
                        
                                            // link.click();
                                            // console.log(link);
                        
                                            alert(message.info);
                                            $("#loading").addClass('hide');
                                            return true;
                        
                        
                                        }, error:function(e){
                                            console.log(e);
                                        }
                                    });
                                }
                                
                            });
                        
                            $(window).bind('resize', function () {
                                var width = $('.table-responsive').width();
                                $('#' + param_msg.structure.idTable).jqGrid("setGridWidth", width);
                            }).trigger('resize');
                        
                            $('.sidebar-toggle').on('click', function () {
                                if ($('.main-sidebar').width() > 60) {
                                    $('#' + param_msg.structure.idTable).jqGrid("setGridWidth", $(window).innerWidth() - 95);
                                } else {
                                    $('#' + param_msg.structure.idTable).jqGrid("setGridWidth", $(window).innerWidth() - 275);
                                }
                            });
                        }

                        // 2 column page jqgrid
                        $('table.ui-pager-table tbody tr').children('td:nth-child(1)').css({"width":"auto","text-align":"left"});
                        $('table.ui-pager-table tbody tr').children('td:nth-child(2)').css({"color":"#6f6f6f",'font-size':'11px'});
                        // end 2 column page jqgrid
					});

                    
                });

            } else {

                alert(msg.info);

            }
        }
    })
}
