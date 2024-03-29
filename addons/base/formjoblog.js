
function getForm(urlServer){
    $("#loading").removeClass('hide');
    $.ajax({
        beforeSend: function(xhr){xhr.setRequestHeader('Authorization', "Bearer " + sessionStorage.token);},
        url : urlServer,
        dataType : "json",
        method : "GET",
        success : function(msg){
            $("#loading").addClass('hide');
            if(msg.status == 'success'){

                $.get( "./templates/base/formjoblog.template?v=6", function( data ) {
                        var template = data.replaceAll("{{formtitle}}", msg.structure.formtitle);
                        template = template.replaceAll("{{idTable}}", msg.structure.idTable);
                        $( "#mainContent" ).html( template );

                        //data jqgrid js
                        function checklength(value, minlength) {
                            if (value.length == minlength) {
                                return [true, "", ""];
                            } else {
                                return [false, "Minimum Length Jam Transaksi 4", ""];
                            }
                        }

                        $("#" + msg.structure.idTable),
                            initDateEdit = function(elem) {
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
                            initDateSearch = function(elem) {
                                setTimeout(function() {
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
                            headers : {
                                'Authorization' : "Bearer " + sessionStorage.token
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
                            styleUI : 'Bootstrap',
                            colNames:  eval('['+msg.structure.colNames+']'),
                            colModel: eval('['+msg.structure.colModel+']'),
                            rowNum: 10,
                            autoResizing: {
                                compact: true
                            },
                            rowList: [10, 20, 30, 50, 100],
                            imgpath: gridimgpath,
                            autowidth: true,
                            pager: '#pager'+msg.structure.idTable,
                            toppager:true, 
                            sortname: 'date_start',
                            sortorder: "desc", 
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
                            //multiselect: true, 
                            ondblClickRow: function(rowid) {
                                $("#" + msg.structure.idTable).jqGrid('viewGridRow', rowid, {
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
                        }).jqGrid('navGrid', '#pager' + msg.structure.idTable , {
                                excel:true,
                                search: true,
                                view: false,					  
                                edit: false,
                                add: false,
                                del: false,
                                refresh: true,
                                cloneToTop: true,
                                help: true 
                            }, {
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
                                helppdffile: msg.structure.urlhelpfile,
                                helppage : msg.structure.helppage,
                                helptext: msg.structure.helpheadertitle
                            } //Help,
                        );

                        
                        
                        
                        jQuery('#'+msg.structure.idTable+'_toppager_center').remove();
                        jQuery('#'+msg.structure.idTable+'_toppager_right').remove();
                        jQuery('#pager'+msg.structure.idTable+'_left').remove();
            
                        $('#'+msg.structure.idTable+'').jqGrid("navSeparatorAdd","#pg_"+msg.structure.idTable+"_toppager",{
                            sepclass : 'ui-separator',sepcontent: ''
                        });
                
                        $('#'+msg.structure.idTable+'').jqGrid("navButtonAdd","#pg_"+msg.structure.idTable+"_toppager",{
                            buttonicon: "glyphicon icon-libreoffice",
                            title: "Export to CSV",
                            caption: "",
                            position: "last",
                            onClickButton: exportToCSV2
                        });
                        function exportToCSV2(){ 
                            exportToCSVTable($('#'+msg.structure.idTable),
                                    msg.structure.formidx0,
                                    msg.structure.module,
                                    msg.structure.prefixtbl,
                                    msg.structure.prefixtbl + "form" + msg.structure.formidx0,
                                    msg.structure.urlExportCsv);
                        }

                        $('#'+msg.structure.idTable+'').jqGrid("navButtonAdd","#pg_"+msg.structure.idTable+"_toppager",{
                            buttonicon: "glyphicon icon-list",
                            title: "Log Job",
                            caption: "",
                            position: "first",
                            onClickButton: function(){
                                var s = jQuery("#"+msg.structure.idTable).jqGrid('getGridParam','selarrrow');  
                                var myGrid = $('#'+msg.structure.idTable),
                                        selRowId = myGrid.jqGrid ('getGridParam', 'selrow');
                                var jobName = myGrid.jqGrid ('getCell', selRowId, 'job_name'); 
                                var pid = myGrid.jqGrid ('getCell', selRowId, 'pid'); 
                                var date_start = myGrid.jqGrid ('getCell', selRowId, 'date_start'); 
                                var date_finish = myGrid.jqGrid ('getCell', selRowId, 'date_finish'); 
                                var status = myGrid.jqGrid ('getCell', selRowId, 'status'); 
                                var id = myGrid.jqGrid ('getCell', selRowId, 'id'); 

                                if(jobName != null){
                                    $("#ModalLabelLog").html("Log Job : <b>" + jobName + "</b>");
                                    $(".timeJobLogStart").html("Start Job : <b>" + date_start+ "</b>");
                                    $(".statusJob").html("Status Job : " + status);
                                    $(".timeJobLogEnd").html("Finish Job : <b>" + date_finish)+ "</b>";
                                    $(".PIDJob").html("PID Job : <b>" + pid+ "</b>");
                                    $("#loading").removeClass("hide");
                                    loadLog();

                                    const checkingLog = setInterval(loadLog, 10000);  
                                    
                                    function loadLog() {
                                        $(".loading-joblog").removeClass("hide");
                                        console.log("Get Job Logs");
                                        var payload = {
                                            "pid" : pid,
                                            "jobName" : jobName,
                                            "id" : id,
                                        };
                                        $.ajax({
                                            type: "GET",
                                            dataType: "JSON",
                                            url: msg.structure.getLogJob,
                                            data: payload,
                                            success: function(message){
                                                if(message.status == 'success'){
                                                    $(".logJob").html(message.log);
                                                    $('#myModalJobLog').modal('show');
                                                } else{
                                                    alert(message.info);
                                                }
                                                $(".loading-joblog").addClass("hide");
                                                $("#loading").addClass("hide");
                                                
                                            }, 
                                            error : function(message){
                                                $(".loading-joblog").addClass("hide");
                                                $("#loading").addClass("hide");
                                                alert("Log Not Found !!");
                                                console.log(message);
												clearInterval(checkingLog);
                                            }
                                        });  
                                    }
									
									$(".containerDownload").html('<button class="btn btn-default btn-xs" id="downloadLog"><i class="fa fa-download"></i> Download Detail Log</button>');
									
									downloadLog(pid, jobName, id);
                                    
                                    $('#myModalJobLog').on('hidden.bs.modal', function (e) {
                                        clearInterval(checkingLog);
                                    })
                                    
                                }else{
                                    alert("Please select row !!");
                                }

                            }
                        });
						
						
						function downloadLog(pid, jobName, id){
							$("#downloadLog").on("click", function(){
								$.ajax({
									type: "GET",
									dataType: "JSON",
									url: msg.structure.getLogJob,
									data: {
										"pid" : pid,
										"jobName" : jobName,
										"id" : id,
										"oper" : "downloadlog"
									},
									success: function(message){
										console.log(message);
										var logData = "";
										$.get(serverHost+message.logsuccess, function(data) {
										   logData += data;
										   $.get(serverHost+message.logerror, function(data) {
											   logData += data;
												var element = document.createElement('a');
												element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(logData));
												element.setAttribute('download', id+"_log_talend.txt");
												element.style.display = 'none';
												document.body.appendChild(element);
												element.click();
												document.body.removeChild(element);														
											}, 'text');
										}, 'text');												
										
									}, 
									error : function(message){
										alert("Error, log not found !!");
										console.log(message);
									}
								}); 
							});
						}

                        


                        
                        
                        
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
                
                
            }else{
                
                alert(msg.info);
            }
        },
        error : function(msg){
            console.log(msg);
        }
    })
}
