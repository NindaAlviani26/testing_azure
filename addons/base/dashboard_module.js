function getForm(urlServer){
  // $("#loading").removeClass('hide');
  $.ajax({
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', "Bearer " + sessionStorage.token);},
      url : urlServer,
      dataType : "json",
      method : "GET",
      success : function(msg){
        if(msg.status == 'success'){
          dashboardFirstLoad(msg);

          // let get_url = urlServer.split('?');
          // get_url = get_url[1];

          if(msg.data.length !=0){
            var time_load =120000;
            setInterval(function(){
              $("#loading-main-content").removeClass('hide');
              $.ajax({
                beforeSend: function(xhr){xhr.setRequestHeader('Authorization', "Bearer " + sessionStorage.token);},
                url : urlServer,
                dataType : "json",
                method : "GET",
                success : function(data_response){
                  dashboardAutoLoad(data_response);
                  
                }
                
              });
              setTimeout(function(){
                $("#loading-main-content").addClass('hide');
                
              },1000);
                  
            },time_load);
          }
        }

        function dashboardFirstLoad(response){
            var leng = response.data.length;
            var index =[];
            
            var message =`<div class="row animated wow fadeIn" data-wow-delay=".5s"></di><div class="col-md-12">
                <div class="alert alert-success alert-dismissible">
                  <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                  <p><i class="fa fa-user"></i> <span class="welcome-message"></span></p>
                </div>
            </div></div>`;
  
            // var loading_image=`
            //   <div id="loading-main-content" class="hide">
            //     <img id="loading-image-main-content" src="./img/loading2.gif" alt="Loading..." />
            //   </div>
            // `;
    
            var data_notif =[];
    
            for (var i=0; i<leng; i++) {
              var namemodul = response.data[i].module;
    
              // if(i%2==1){
              //   index[i]= `<div class="col-md-6 ">`;
              // }
              // else{
              //   index[i]=`<div class="col-md-6 ">`;
              // }
              index[i]= `
                      <div class="row load-table animated wow fadeIn" data-wow-delay=".5s">
                        <div class="col-sm-12">
                          <div class="box" >
                          <div id="loading-main-content" class="hide">
                            <img id="loading-image-main-content" src="./img/loading2.gif" alt="Loading..." />
                          </div>
                          <div class="box-header with-border">
                              <h3 class="box-title">`+namemodul+`</h3>
                              <div class="box-tools">
                                <button type="button" class="btn btn-tool" data-widget="collapse">
                                  <i class="fa fa-minus"></i>
                                </button>
                              </div>
                          </div>
                          <div class="box-body">
                            <div class="row">
                              <div class="col-md-12">
                              <table id="tbl`+[i]+`" class="table table-bordered table-hover table-striped" >
                              <thead>
                                <tr>
                                  <th class="ini">No.</th>
                                  <th>Form Name</th>
                                  <th>Buss Date</th>
                                  <th>Status</th>
                                </tr>
                              </thead>
                              <tbody>`;

                   var ind='';
                   var dataDetail =response.data[i].detail;
                  
                   var nomor = 1;
                   var label_status ='';
                   var id_label ='';
    
                  for (var a=0; a< dataDetail.length ; a++) {
    
                    if(response.data[i].detail[a].status == "RUNNING"){
                      label=`<span class="label label-warning click-label cursor-pointer" title="Show Log `+response.data[i].detail[a].formName+`"  id="`+i+`_`+a+`">`+response.data[i].detail[a].status.toUpperCase()+`</span>`;
                    }else if(response.data[i].detail[a].status == "SUCCESS"){
                      label=`<span class="label label-success click-label cursor-pointer" title="Show Log `+response.data[i].detail[a].formName+`"  id="`+i+`_`+a+`">`+response.data[i].detail[a].status.toUpperCase()+`</span>`;
                    }else if(response.data[i].detail[a].status == "N/A"){
                      label=`<span  id="`+i+`_`+a+`">`+response.data[i].detail[a].status.toUpperCase()+`</span>`;
                    }else if(response.data[i].detail[a].status =="FAILED"){
                      label=`<span class="label label-danger click-label cursor-pointer" title="Show Log `+response.data[i].detail[a].formName+`"  id="`+i+`_`+a+`">`+response.data[i].detail[a].status.toUpperCase()+`</span>`;
                    }
                   
                     ind += `<tr><td>`+ nomor++ +`</td>
                                <td>`+response.data[i].detail[a].formName+`</td>
                                <td>`+response.data[i].detail[a].buss_date+`</td>
                                <td class="text-center">`+label+`</td></tr>`;
                    
                    // template modal
                    var modal =`
                      <div class="modal fade" id="modalLog" tabindex="-1" role="dialog" aria-labelledby="emodalLogLabel" aria-hidden="true">
                        <div class="modal-dialog" role="document">
                          <div class="modal-content">
                            <div class="modal-header">
                              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                              </button>
                              <h5 class="modal-title" id="modalLogLabel">Log Job Process</h5>
                            </div>
                            <div class="modal-body">
                              <pre class="show_data"></pre>
                            </div>
                            <div class="modal-footer">
                              <button type="button" class="btn btn-secondary" data-dismiss="modal"><i class="fa fa-close"></i> Close</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    
                    `;
                                
                  }
                  index[i] += ind +`</tbody> </table> </div></div></div></div></div></div>`;
                  // if(i%2==1){
                  //   index[i] += `</div><div class="row"></div>`;
                  // }
                  // else{
                  //   index[i]+=`</div>`;
                  // }
                  
                }
    
                // console.log(response.data_module[0].module_running);
                var length_module_running = response.data_module[0].module_running.length;
                var length_module_failed = response.data_module[0].module_failed.length;
                var length_module_success = response.data_module[0].module_success.length;
                var module_running='';
                var module_failed ='';
                var module_success ='';
                var comma =',';
  
  
                if(length_module_running ==0){
                  module_running +=' <a href="#" class="info-box" style="padding: 0.5rem;position: relative;display: flex;min-height: 80px;width: 100%;">';
                }
                for(var rn=0; rn<length_module_running; rn++){
    
                  if(rn==0){
                    comma ='';
                  }else{
                    comma =',';
                  }
                  var status_x='running';
                  for (var i=0; i<leng; i++) {
                    var namemodul = response.data[i].module;
    
                    if(response.data[i].module == response.data_module[0].module_running[rn]){
                      module_running +=' <a href="#" class="modal-detail info-box" style="padding: 0.5rem;position: relative;display: flex;min-height: 80px;width: 100%;" id="'+namemodul+'_'+status_x+'">';
                      // module_running +=comma +' <a href="#" class="modal-detail " id="'+namemodul+'_'+status_x+'">'+ response.data_module[0].module_running[rn]+'</a>';
                      // console.log(namemodul);
                      
                     
                    }
                  }
                  
         
                }
  
                if(length_module_failed ==0){
                  module_failed +=' <a href="#" class="info-box" style="padding: 0.5rem;position: relative;display: flex;min-height: 80px;width: 100%;">';
                }
                for(var fl=0; fl<length_module_failed; fl++){
    
                  if(fl==0){
                    comma='';
                  }else{
                    comma =',';
                  }
    
                  var status_x='failed';
                  
                  for (var i=0; i<leng; i++) {
                    var namemodul = response.data[i].module;
    
                    if(response.data[i].module == response.data_module[0].module_failed[fl]){
                      module_failed +=' <a href="#" class="modal-detail info-box" style="padding: 0.5rem;position: relative;display: flex;min-height: 80px;width: 100%;" id="'+namemodul+'_'+status_x+'">';
                      // module_failed +=comma +' <a href="#" class="modal-detail " id="'+namemodul+'_'+status_x+'">'+ response.data_module[0].module_failed[fl]+'</a>';
                    }
                  }
                  
                  
                  
                }
    
                for(var sc=0; sc<length_module_success; sc++){
                  if(sc==0){
                    comma='';
                  }else{
                    comma =',';
                  }
                  module_success +=comma +' '+ response.data_module[0].module_success[sc];
         
                }
                
                // count tiap2 modul
                data_notif[i] =`
                <div class="row load-box-status animated wow fadeIn" data-wow-delay=".5s">
                  <div class="col-12 col-sm-6 col-md-4">
                    <div class="info-box" style="padding: 0.5rem;position: relative;display: flex;min-height: 80px;width: 100%;">
                      <span class="info-box-icon elevation-1" style="width: 80px;border-radius: 0.25rem;display: flex;justify-content: center;align-items: center;height:auto;font-size: 35px;opacity: .5;"><i class="fa fa-check"></i></span>
                      <div class="info-box-content" style="margin-left: 0;">
                        <span class="info-box-text" style="line-height:1.8">Success</span>
                        <span class="info-box-number" style="line-height:1.8">
                          <b>`+response.total_status[0].total_success+`</b>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    `+module_running+`
                      <span class="info-box-icon elevation-1" style="width: 80px;border-radius: 0.25rem;display: flex;justify-content: center;align-items: center;height:auto;font-size: 35px;opacity: .5;"><i class="fa fa-refresh" style="color:#333;"></i></span>
                      <div class="info-box-content" style="margin-left: 0;color:#333">
                        <span class="info-box-text" style="line-height:1.8">Running</span>
                        <span class="info-box-number" style="line-height:1.8">
                          <b>`+response.total_status[0].total_running+`</b>
                        </span>
                      </div>
                    </a>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    `+module_failed+`
                      <span class="info-box-icon elevation-1" style="width: 80px;border-radius: 0.25rem;display: flex;justify-content: center;align-items: center;height:auto;font-size: 35px;opacity: .5;"><i class="fa fa-close" style="color:#333;"></i></span>
                      <div class="info-box-content" style="margin-left: 0;color:#333">
                        <span class="info-box-text" style="line-height:1.8">Failed</span>
                        <span class="info-box-number" style="line-height:1.8">
                          <b>`+response.total_status[0].total_failed+`</b>
                        </span>
                      </div>
                    </a>
                  </div>
                  <div class="col-md-12"></div>
                </div>
                `;
              
    
              // template modal detail
              var modal_detail =`
              <div class="modal fade" id="modalDetail" tabindex="-1" role="dialog" aria-labelledby="modalDetailLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                      <h5 class="modal-title" id="modalDetailLabel">Detail</h5>
                    </div>
                    <div class="modal-body" id="detailData">
                    
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-dismiss="modal"><i class="fa fa-close"></i> Close</button>
                    </div>
                  </div>
                </div>
              </div>
            
            `;

              var modal_auto =`
              <div class="modal fade" id="modalAuto" tabindex="-1" role="dialog" aria-labelledby="modalAutoLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                      <h5 class="modal-title" id="modalAutoLabel">Detail</h5>
                    </div>
                    <div class="modal-body" id="dataModalAuto">
                    
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-dismiss="modal"><i class="fa fa-close"></i> Close</button>
                    </div>
                  </div>
                </div>
              </div>
              `
                
              // untuk halaman utama
                $( "#mainContent" ).html( index);
    
                
                // untuk modal
                $(document.body).append(modal);
    
                
                $("#mainContent td span.label.click-label").on('click',function(){
                  var attribut = $(this).attr('id');
                  var get_value =attribut.split('_');
    
                  $('#modalLog').modal();
                  var data_modal = response.data[get_value[0]].detail[get_value[1]].log;
                  var header_title = 'Log Process '+response.data[get_value[0]].detail[get_value[1]].formName;
                  
                  if(data_modal ==null){
                    data_modal='No process log ';
                  }
                  $('.show_data').html(data_modal);
                  $('#modalLogLabel').html(header_title);
                });
                // end untuk modal
    
                // untuk notif
                if(length_module_running !=0 || length_module_success !=0 || length_module_failed !=0){
                  $("#mainContent").prepend(data_notif);
                }
                
                /////////////// notif awal module
                if(response.total_status[0].total_success !=0 || response.total_status[0].total_failed !=0){
                  $(document.body).append(modal_auto);
                } 
                
                $('#modalAuto').modal();
                $('#modalAutoLabel').html('Highlight '+namemodul);
                for (var i=0; i<leng; i++) {
                  if(response.data[i].module == namemodul){
                    var tableDetailBodyAuto='';
                    var tableDetailAuto =`
                        <table id="tableDetailModalAuto" class="table table-bordered table-hover" >
                          <thead>
                            <tr>
                              <th class="ini">No.</th>
                              <th>Form Name</th>
                              <th>Timestamp</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                    `;
                    var no=1;
                    var dataDetailTable =response.data[i].detail;
                    for (var b=0; b< dataDetailTable.length ; b++) {
                      if(response.data[i].detail[b].status.toLowerCase() == 'success'){ 
                        label=`<span class="label label-success click-label "  >`+response.data[i].detail[b].status.toUpperCase()+`</span>`;
                        
                      }
                      if(response.data[i].detail[b].status.toLowerCase() == 'failed'){ 
                        label=`<span class="label label-danger click-label "  >`+response.data[i].detail[b].status.toUpperCase()+`</span>`;
                        
                      }
                      
                      if(!(response.data[i].detail[b].status.toLowerCase() == 'running' || response.data[i].detail[b].status.toLowerCase() == 'n/a')){ 
                        tableDetailBodyAuto +=`
                          <tr>
                            <td>`+ no++ +`</td>
                            <td>`+ response.data[i].detail[b].formName +`</td>
                            <td>`+ response.data[i].detail[b].buss_date +`</td>
                            <td class="text-center">`+label+`</td>
                          </tr>
                        `;
                        
                      }
                      
                    }
                    tableDetailAuto += tableDetailBodyAuto+`
                          </tbody>
                        </table>
                    `; 
                  }                    
                }
                $('#dataModalAuto').html(tableDetailAuto);
                // data table modal auto
                $('#tableDetailModalAuto').DataTable({
                  "paging": true,
                  "lengthChange": false,
                  "searching": false,
                  "ordering": true,
                  "info": true,
                  "autoWidth": false,
                  "responsive": true
                });
                ///////////////
    
                // $("#mainContent li a.modal-detail").on('click',function(){
                $("#mainContent a.modal-detail").on('click',function(){
                  // untuk modal detail 
                  $(document.body).append(modal_detail);
                  $('#modalDetail').modal();
                  var attr_id = $(this).attr('id');
                  var get_value2 =attr_id.split('_');
                  $('#modalDetailLabel').html('Detail '+get_value2[1]+' '+get_value2[0]);
    
                  for (var i=0; i<leng; i++) {
                      
                    if(response.data[i].module == get_value2[0]){
    
                      var tableDetailBody='';
                      var tableDetail =`
                          <table id="tableDetailModal" class="table table-bordered table-hover" >
                            <thead>
                              <tr>
                                <th class="ini">No.</th>
                                <th>Form Name</th>
                                <th>Buss Date</th>
                                <th>Log</th>
                              </tr>
                            </thead>
                            <tbody>
                      `;
    
                     
                      var no=1;
                      var dataDetailTable =response.data[i].detail;
                      for (var b=0; b< dataDetailTable.length ; b++) {
    
                        if(response.data[i].detail[b].status.toLowerCase() == get_value2[1]){
                          
                          var status_log='';
                          if(response.data[i].detail[b].log == null){
                            status_log = 'No Status Log';
                          }else{
                            status_log = response.data[i].detail[b].log;
                          }
                          tableDetailBody +=`
                            <tr>
                              <td>`+ no++ +`</td>
                              <td>`+ response.data[i].detail[b].formName +`</td>
                              <td>`+ response.data[i].detail[b].buss_date +`</td>
                              <td><pre>`+ status_log +`</pre></td>
                            </tr>
                          `;
                        }
                        
                      }
                      tableDetail += tableDetailBody+`
                            </tbody>
                          </table>
                      `;
    
                      
                    }
                    
                  }
                  $('#detailData').html(tableDetail);
                  // data table modal detail
                  $('#tableDetailModal').DataTable({
                    "paging": true,
                    "lengthChange": false,
                    "searching": false,
                    "ordering": true,
                    "info": true,
                    "autoWidth": false,
                    "responsive": true
                  });
                });
                
    
                // untuk welcome
                
                $("#mainContent").prepend(message);
                var text_message='Welcome <b>'+response.user+',</b> login at <b>'+response.today+'</b>';
                $(".welcome-message").html(text_message);
                
                // umtuk loading
                // $("#mainContent").prepend(loading_image);
  
    
            for (var i=0; i<leng; i++) {
              // $('#tbl'+[i]).DataTable({
              //   searching: false,
              //   lengthMenu: [5, 10],
              // });
              
              $('#tbl'+[i]).DataTable({
                "paging": true,
                "lengthChange": false,
                "searching": false,
                "ordering": true,
                "info": true,
                "autoWidth": false,
                "responsive": true
              });
              // ganti text Next dengan icon right dan berikan title
              $("li.paginate_button.previous > a").html(`<i class="fa fa-angle-left"></i>`);
              $("li.paginate_button.previous > a").attr('title','Previous');
    
              $(document).ready(function(){
                $(this).click(function(){
                  $("li.paginate_button.previous > a").html(`<i class="fa fa-angle-left"></i>`);
                  $("li.paginate_button.previous > a").attr('title','Previous');
                });
              });
    
              // ganti text Previous dengan icon left dan berikan title
              $("li.paginate_button.next > a").html(`<i class="fa fa-angle-right"></i>`);
              $("li.paginate_button.next > a").attr('title','Next');
    
              $(document).ready(function(){
                $(this).click(function(){
                  $("li.paginate_button.next > a").html(`<i class="fa fa-angle-right"></i>`);
                  $("li.paginate_button.next > a").attr('title','Next');
                });
              });
  
            }
          
        }

        function dashboardAutoLoad(response){
          var leng = response.data.length;
          var index =[];

          var data_notif =[];
    
            for (var i=0; i<leng; i++) {
              var namemodul = response.data[i].module;
              
              index[i]= `
                  <div class="col-sm-12">
                    <div class="box" >
                    <div id="loading-main-content" class="hide">
                      <img id="loading-image-main-content" src="./img/loading2.gif" alt="Loading..." />
                    </div>
                    <div class="box-header with-border">
                        <h3 class="box-title">`+namemodul+`</h3>
                        <div class="box-tools">
                          <button type="button" class="btn btn-tool" data-widget="collapse">
                            <i class="fa fa-minus"></i>
                          </button>
                        </div>
                    </div>
                    <div class="box-body">
                      <div class="row">
                        <div class="col-md-12">
                        <table id="tbl`+[i]+`" class="table table-bordered table-hover" >
                        <thead>
                          <tr>
                            <th class="ini">No.</th>
                            <th>Form Name</th>
                            <th>Buss Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>`;

              var dataDetail =response.data[i].detail;
            
              var ind='';
              var nomor = 1;
              var label_status ='';
              var id_label ='';

              for (var a=0; a< dataDetail.length ; a++) {

                if(response.data[i].detail[a].status == "RUNNING"){
                  label=`<span class="label label-warning click-label cursor-pointer" title="Show Log `+response.data[i].detail[a].formName+`"  id="`+i+`_`+a+`">`+response.data[i].detail[a].status.toUpperCase()+`</span>`;
                }else if(response.data[i].detail[a].status == "SUCCESS"){
                  label=`<span class="label label-success click-label cursor-pointer" title="Show Log `+response.data[i].detail[a].formName+`"  id="`+i+`_`+a+`">`+response.data[i].detail[a].status.toUpperCase()+`</span>`;
                }else if(response.data[i].detail[a].status == "N/A"){
                  label=`<span  id="`+i+`_`+a+`">`+response.data[i].detail[a].status.toUpperCase()+`</span>`;
                }else if(response.data[i].detail[a].status =="FAILED"){
                  label=`<span class="label label-danger click-label cursor-pointer" title="Show Log `+response.data[i].detail[a].formName+`"  id="`+i+`_`+a+`">`+response.data[i].detail[a].status.toUpperCase()+`</span>`;
                }
                
                ind += `<tr>
                          <td>`+ nomor++ +`</td>
                          <td>`+response.data[i].detail[a].formName+`</td>
                          <td>`+response.data[i].detail[a].buss_date+`</td>
                          <td class="text-center check-label-`+a+`">`+label+`</td>
                        </tr>`;
                
                // template modal
                var modal =`
                  <div class="modal fade" id="modalLog" tabindex="-1" role="dialog" aria-labelledby="emodalLogLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                      <div class="modal-content">
                        <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                          <h5 class="modal-title" id="modalLogLabel">Log Job Process</h5>
                        </div>
                        <div class="modal-body">
                          <pre class="show_data"></pre>
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-dismiss="modal"><i class="fa fa-close"></i> Close</button>
                        </div>
                      </div>
                    </div>
                  </div>
                `;
                            
              }
              index[i] += ind +`</tbody> </table> </div></div></div></div></div>`;
            }
    
            var length_module_running = response.data_module[0].module_running.length;
            var length_module_failed = response.data_module[0].module_failed.length;
            var length_module_success = response.data_module[0].module_success.length;
            var module_running='';
            var module_failed ='';
            var module_success ='';
            var comma =',';
  
  
            if(length_module_running ==0){
              module_running +=' <a href="#" class="info-box" style="padding: 0.5rem;position: relative;display: flex;min-height: 80px;width: 100%;">';
            }
            for(var rn=0; rn<length_module_running; rn++){

              if(rn==0){
                comma ='';
              }else{
                comma =',';
              }

              var status_x='running';
              for (var i=0; i<leng; i++) {
                var namemodul = response.data[i].module;

                if(response.data[i].module == response.data_module[0].module_running[rn]){
                  module_running +=' <a href="#" class="modal-detail info-box" style="padding: 0.5rem;position: relative;display: flex;min-height: 80px;width: 100%;" id="'+namemodul+'_'+status_x+'">';

                }
              }
                        
            }

            if(length_module_failed ==0){
              module_failed +=' <a href="#" class="info-box" style="padding: 0.5rem;position: relative;display: flex;min-height: 80px;width: 100%;">';
            }
            for(var fl=0; fl<length_module_failed; fl++){

              if(fl==0){
                comma='';
              }else{
                comma =',';
              }

              var status_x='failed';
              for (var i=0; i<leng; i++) {
                var namemodul = response.data[i].module;

                if(response.data[i].module == response.data_module[0].module_failed[fl]){
                  module_failed +=' <a href="#" class="modal-detail info-box" style="padding: 0.5rem;position: relative;display: flex;min-height: 80px;width: 100%;" id="'+namemodul+'_'+status_x+'">';
                }
              }

            }

            // for(var sc=0; sc<length_module_success; sc++){
            //   if(sc==0){
            //     comma='';
            //   }else{
            //     comma =',';
            //   }
            //   module_success +=comma +' '+ response.data_module[0].module_success[sc];
      
            // }
                
            // count tiap2 modul
            data_notif[i] =`
                <div class="col-12 col-sm-6 col-md-4">
                  <div class="info-box" style="padding: 0.5rem;position: relative;display: flex;min-height: 80px;width: 100%;">
                    <span class="info-box-icon elevation-1" style="width: 80px;border-radius: 0.25rem;display: flex;justify-content: center;align-items: center;height:auto;font-size: 35px;opacity: .5;"><i class="fa fa-check"></i></span>
                    <div class="info-box-content" style="margin-left: 0;">
                      <span class="info-box-text" style="line-height:1.8">Success</span>
                      <span class="info-box-number" style="line-height:1.8">
                        <b>`+response.total_status[0].total_success+`</b>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="col-12 col-sm-6 col-md-4">
                  `+module_running+`
                    <span class="info-box-icon elevation-1" style="width: 80px;border-radius: 0.25rem;display: flex;justify-content: center;align-items: center;height:auto;font-size: 35px;opacity: .5;"><i class="fa fa-refresh" style="color:#333;"></i></span>
                    <div class="info-box-content" style="margin-left: 0;color:#333">
                      <span class="info-box-text" style="line-height:1.8">Running</span>
                      <span class="info-box-number" style="line-height:1.8">
                        <b>`+response.total_status[0].total_running+`</b>
                      </span>
                    </div>
                  </a>
                </div>
                <div class="col-12 col-sm-6 col-md-4">
                  `+module_failed+`
                    <span class="info-box-icon elevation-1" style="width: 80px;border-radius: 0.25rem;display: flex;justify-content: center;align-items: center;height:auto;font-size: 35px;opacity: .5;"><i class="fa fa-close" style="color:#333;"></i></span>
                    <div class="info-box-content" style="margin-left: 0;color:#333">
                      <span class="info-box-text" style="line-height:1.8">Failed</span>
                      <span class="info-box-number" style="line-height:1.8">
                        <b>`+response.total_status[0].total_failed+`</b>
                      </span>
                    </div>
                  </a>
                </div>
                <div class="col-md-12"></div>`;
              
    
              // template modal detail
              var modal_detail =`
                <div class="modal fade" id="modalDetail" tabindex="-1" role="dialog" aria-labelledby="modalDetailLabel" aria-hidden="true">
                  <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                        <h5 class="modal-title" id="modalDetailLabel">Detail</h5>
                      </div>
                      <div class="modal-body" id="detailData"></div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal"><i class="fa fa-close"></i> Close</button>
                      </div>
                    </div>
                  </div>
                </div>
              
              `;
              
              // untuk halaman utama
              $( ".load-table" ).html( index);

              // untuk modal
              $(document.body).append(modal);
    
                
              $("#mainContent td span.label.click-label").on('click',function(){
                var attribut = $(this).attr('id');
                var get_value =attribut.split('_');
  
                $('#modalLog').modal();
                var data_modal = response.data[get_value[0]].detail[get_value[1]].log;
                var header_title = 'Log Process '+response.data[get_value[0]].detail[get_value[1]].formName;
                
                if(data_modal ==null){
                  data_modal='No process log ';
                }
                $('.show_data').html(data_modal);
                $('#modalLogLabel').html(header_title);
              });
              // end untuk modal
    
              // untuk notif
              if(length_module_running !=0 || length_module_success !=0 || length_module_failed !=0){
                $(".load-box-status").html(data_notif);
              }
                
  
              $("#mainContent a.modal-detail").on('click',function(){
                // untuk modal detail 
                $(document.body).append(modal_detail);
                $('#modalDetail').modal();
                var attr_id = $(this).attr('id');
                var get_value2 =attr_id.split('_');
                $('#modalDetailLabel').html('Detail '+get_value2[1]+' '+get_value2[0]);
  
                for (var i=0; i<leng; i++) {
                    
                  if(response.data[i].module == get_value2[0]){
  
                    var tableDetailBody='';
                    var tableDetail =`
                        <table id="tableDetailModal" class="table table-bordered table-hover" >
                          <thead>
                            <tr>
                              <th class="ini">No.</th>
                              <th>Form Name</th>
                              <th>Buss Date</th>
                              <th>Log</th>
                            </tr>
                          </thead>
                          <tbody>
                    `;
  
                    
                    var no=1;
                    var dataDetailTable =response.data[i].detail;
                    for (var b=0; b< dataDetailTable.length ; b++) {
  
                      if(response.data[i].detail[b].status.toLowerCase() == get_value2[1]){
                        
                        var status_log='';
                        if(response.data[i].detail[b].log == null){
                          status_log = 'No Status Log';
                        }else{
                          status_log = response.data[i].detail[b].log;
                        }
                        tableDetailBody +=`
                          <tr>
                            <td>`+ no++ +`</td>
                            <td>`+ response.data[i].detail[b].formName +`</td>
                            <td>`+ response.data[i].detail[b].buss_date +`</td>
                            <td><pre>`+ status_log +`</pre></td>
                          </tr>
                        `;
                      }
                      
                    }
                    tableDetail += tableDetailBody+`
                          </tbody>
                        </table>
                    `;

                  }
                  
                }
                $('#detailData').html(tableDetail);

                // data table modal detail
                $('#tableDetailModal').DataTable({
                  "paging": true,
                  "lengthChange": false,
                  "searching": false,
                  "ordering": true,
                  "info": true,
                  "autoWidth": false,
                  "responsive": true
                });
              });

              for (var i=0; i<leng; i++) {
                // $('#tbl'+[i]).DataTable({
                //   searching: false,
                //   lengthMenu: [5, 10],
                // });
                
                $('#tbl'+[i]).DataTable({
                  "paging": true,
                  "lengthChange": false,
                  "searching": false,
                  "ordering": true,
                  "info": true,
                  "autoWidth": false,
                  "responsive": true
                });
                // ganti text Next dengan icon right dan berikan title
                $("li.paginate_button.previous > a").html(`<i class="fa fa-angle-left"></i>`);
                $("li.paginate_button.previous > a").attr('title','Previous');
      
                $(document).ready(function(){
                  $(this).click(function(){
                    $("li.paginate_button.previous > a").html(`<i class="fa fa-angle-left"></i>`);
                    $("li.paginate_button.previous > a").attr('title','Previous');
                  });
                });
      
                // ganti text Previous dengan icon left dan berikan title
                $("li.paginate_button.next > a").html(`<i class="fa fa-angle-right"></i>`);
                $("li.paginate_button.next > a").attr('title','Next');
      
                $(document).ready(function(){
                  $(this).click(function(){
                    $("li.paginate_button.next > a").html(`<i class="fa fa-angle-right"></i>`);
                    $("li.paginate_button.next > a").attr('title','Next');
                  });
                });
    
              }
        }
        $("#loading").addClass('hide');
      }
  });

}


