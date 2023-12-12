
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
                $.get("./templates/base/generate.template?v=2", function (data) {
                    var template = data.replaceAll("{{formtitle}}", msg.structure.formtitle);
                    template = template.replaceAll("{{idTable}}", msg.structure.idTable);
                    $.ajaxSetup({
                        headers: {
                            'Authorization': "Bearer " + sessionStorage.token
                        }
                    });
                    $.get(serverHost + "addons/LLD/view_generate.api?t=FIELDS&f="+msg.structure.formidx0, function(dataMsg){
						$(".form_generate").html(dataMsg);
						
					});

                    $("#mainContent").html(template);

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
                        multiselect: true,
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
                    }
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

                    // generate
                    function validateForm(){

                        try{
                            // ambil name yg ada di form
                            var data_form_1 = document.forms["formGenerate"];
                            var data_array = [].map.call(data_form_1, function(item) {
                                return {name : item.name, value : item.value};
                            });
                            // end ambil name yg ada di form

                            $(".error").hide();

                            for(var n=0; n < data_array.length-1 ; n++){
                                var label_name = ((data_array[n].name).replaceAll('_', ' '));
                                if(data_array[n].value==""){
                                    $("#"+data_array[n].name).after(`<small class='text-danger error'> Please enter your <b>`+label_name+`</b></small>`);
                                   
                                }

                            }
                            

                        }catch(e){
                            console.log(e);
                        }
                    }

                    $("#btnSubmit").click(function () {
                        // validateForm();

                        var data_form = $("#formGenerate").serialize();
                        // spliting array 
                        var data_1 = data_form.split("&");
                        var data_2=[];
                        var data_value=[];

                        for(var aa=0; aa<data_1.length; aa++){
                            data_2[aa] = data_1[aa].split("=");
                            data_value[aa]=data_2[aa][1];

                            var data_3=[];
                            for(var bb=0; bb<data_2.length; bb++){
                                data_3[bb]=data_2[bb][0].split("_");
                                
                                var data_join='';
                                
                                for(var cc=0; cc<data_3.length; cc++){
                                    var maxlength_input = data_3[cc][1];

                                    if(data_3[cc][2] == "NUMERIC"){
                                        var char_numeric="";
                                        for(var ab=0;ab<maxlength_input; ab++){
                                            char_numeric+="0";
                                        }
                                        // ambil value dari isian
                                        var data_input = data_value[cc];

                                        //  hitung length karakter
                                        var length_char = data_input.length;

                                        // jumlah length dari maxlength default dan value isian
                                        var join_length = Number(maxlength_input) + Number(length_char);
                                        
                                        // total jumlah length kurangi dari maxlength default
                                        var difference_length = join_length-maxlength_input;

                                        // tambahkan karakter 0 di depan value karena numeric
                                        data_input = char_numeric+data_input;

                                        // substring value agar panjang length sesuai default
                                        var data_substr = data_input.substring(difference_length,join_length); 

                                        // kembalikan ke string
                                        data_join += data_3[cc][0]+'='+data_substr+'&';
                                    }else{
                                        var char_string="";
                                        for(var ab=0;ab<data_3[cc][1]; ab++){
                                            char_string+=" ";
                                            // char_string+="\xa0";
                                        }

                                        // ambil value dari isian
                                        var data_input = data_value[cc];

                                        //  hitung length karakter
                                        var length_char = data_input.length;

                                        // jumlah length dari maxlength default dan value isian
                                        var join_length = Number(maxlength_input) + Number(length_char);
                                        
                                        // total jumlah length kurangi dari maxlength default
                                        var difference_length = join_length-maxlength_input;

                                        // tambahkan karakter spasi di belakang value karena string
                                        data_input = data_input+char_string;

                                        // substring value agar panjang length sesuai default
                                        var data_substr = data_input.slice(0,join_length-difference_length); 

                                        // kembalikan ke string
                                        data_join += data_3[cc][0]+'='+data_substr+'&';
                                    }
                                }
                            }
                        }

                        var data_full = data_join.slice(0,data_join.length-1); 
                        data_full.toString();
                        console.log("data fix: "+data_full)+"\n";

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
                            var label_name=[];
                            for(var n=0; n < data_array.length-1 ; n++){
                                data_value[n] = data_array[n].value;
                                
                                // var label_name = ((data_array[n].name).replaceAll('_', ' '));
                                var label_name_1 = data_array[n].name;

                                // buat array dengan separator _
                                label_name[n]=label_name_1.split("_");
                                
                                if(data_array[n].value==""){
                                    $("#"+label_name[n][0]).after(`<small class='text-danger error'> Please enter your <b>`+label_name[n][0]+`</b></small>`);
                                    // $("#"+data_array[n].name).after(`<small class='text-danger error'> Please enter your <b>`+label_name+`</b></small>`);
   
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
                        s = jQuery("#" + msg.structure.idTable).jqGrid('getGridParam', 'selarrrow');

                        strprop = '';
                        for (var i = 0; i < s.length; i++) {
                            colmod = jQuery("#" + msg.structure.idTable).jqGrid('getGridParam', "colModel");
                            data = jQuery("#" + msg.structure.idTable).jqGrid('getRowData', s[i]);

                            for (var x in colmod) {

                                if (colmod[x].index == msg.structure.keyfield) {
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
                            // var data_form = $("#formGenerate").serialize();
                            // console.log(data_form)+"\n";

                            

                            $.ajax({
                                type: "POST",
                                dataType: "JSON",
                                // url: msg.structure.urlGenerate + "&idForm=" + strprop + "&id_operasional=" + id_operasional + "&id_pelapor=" + id_pelapor + "&periode_data=" + periode_data + "&periode_laporan=" + periode_laporan + "&file_name_text="+file_name_text,
                                url: msg.structure.urlGenerate + "&idForm=" + updateIdsOfSelectedRows() + "&file_name_zip="+file_name_zip+"&"+data_full,
                                
                                success: function (message) {
                                    console.log(message.info);
                                    
                                    // generateAntasena();
                                    
                                    // var file_location = serverHost + "generate/generate.zip";
                                    var file_location = serverHost + "generate/"+file_name_zip+".zip";
                                    var link = document.createElement('a');
                                    link.href = file_location;
                                    link.download = true;

                                    link.click();
                                    console.log(link);
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
        }
    })
}
